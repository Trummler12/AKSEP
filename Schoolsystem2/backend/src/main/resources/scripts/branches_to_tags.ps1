<#
    AKSEP\Schoolsystem2\backend\src\main\resources\scripts\branches_to_tags.ps1

    Phase 1:
      - Build t_tag_PLANNING.txt   (tagID,name,synonyms)
      - Build ct_topic_tags_PLANNING.txt (topicID,tagID,weight)

    This version:
      - ALWAYS resets both planning files at start (fresh headers).
      - Robustly loads Branches.csv even if there are duplicate column names
        such as multiple "& attached to" columns.
      - Only creates new tags if:
          * a Branch row exists for the topic, AND
          * the number of inherited tags (<attachedTagIDs.Count) is < ceil(layer * 2/3).
      - When a new tag is created for a topic:
          * it is inserted at the TOP of that topic's tag list, and
          * it always gets weight 5 for that topic (ignores Get-Weight).
      - Tag names stored in t_tag_PLANNING.txt are always lowercase.
      - Two user-toggles:
          * -RemoveBracketed (default: $true) controls removal of trailing "(...)".
          * -RemoveSuffixes  (default: $true) controls removal of trailing "science|studies|theory".
#>

param(
    # Optional: allow overriding paths if needed in CI/jobs etc.
    [string]$BaseResourcesDir,

    # User-configurable cleanup toggles
    [bool]$RemoveBracketed = $false,
    [bool]$RemoveSuffixes  = $false
)

# expose toggles to functions via script scope
$script:RemoveBracketed = $RemoveBracketed
$script:RemoveSuffixes  = $RemoveSuffixes

# ---------------------------------------------------------------------
#  Helpers: paths
# ---------------------------------------------------------------------
if (-not $BaseResourcesDir) {
    # Script lives in ...\resources\scripts
    $scriptDir        = $PSScriptRoot
    $BaseResourcesDir = Split-Path -Parent $scriptDir
}

$csvDir                = Join-Path $BaseResourcesDir 'csv'
$topicCsvPath          = Join-Path $csvDir 't_topic.csv'
$branchesCsvPath       = Join-Path $csvDir 'Branches.csv'
$tagPlanningPath       = Join-Path $csvDir 't_tag_PLANNING.txt'
$topicTagsPlanningPath = Join-Path $csvDir 'ct_topic_tags_PLANNING.txt'

Write-Host "Using CSV directory: $csvDir" -ForegroundColor Cyan

# Prepare output buffers to avoid repeated file locking during Append operations
$tagLines       = [System.Collections.Generic.List[string]]::new()
$topicTagLines  = [System.Collections.Generic.List[string]]::new()
$tagLines.Add('tagID,name,synonyms')
$topicTagLines.Add('topicID,tagID,weight')

# ---------------------------------------------------------------------
#  Helper: uniformed(string)
# ---------------------------------------------------------------------
function Uniformed {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)]
        [string]$Name
    )

    $result = $Name.Trim()

    # Optionally remove trailing parentheses block, e.g. "Physics (classical)" -> "Physics"
    if ($script:RemoveBracketed) {
        $result = $result -replace '\s*\([^)]*\)\s*$', ''
    }

    # Optionally remove trailing " science", " studies", " theory" (case-insensitive)
    if ($script:RemoveSuffixes) {
        $result = $result -replace '(?i)\s+(science|studies|theory)\s*$', ''
    }

    # Always normalize to lowercase for tag storage
    $result = $result.Trim().ToLowerInvariant()

    return $result
}

# ---------------------------------------------------------------------
#  Helper: Get-Weight(size,index)
# ---------------------------------------------------------------------
function Get-Weight {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)][int]$Size,
        [Parameter(Mandatory)][int]$Index
    )

    $minuend     = 6
    $f_size      = 1
    $f_index     = 9
    $size_shift  = -30
    $index_shift = 7

    if ($Index -ge $Size) {
        return 0
    }

    if ($Size -eq 1) {
        return 5
    }

    $expr = $f_size * ($Size + $size_shift) + $f_index * ($Index + $index_shift)
    if ($expr -lt 0) { $expr = 0 }

    $root  = [math]::Sqrt($expr)
    $value = $minuend - [math]::Floor($root / 2)

    if ($value -lt 1) { $value = 1 }

    return [int]$value
}

# ---------------------------------------------------------------------
#  Load base CSVs
# ---------------------------------------------------------------------
if (-not (Test-Path $topicCsvPath)) {
    throw "Topic CSV not found: $topicCsvPath"
}
if (-not (Test-Path $branchesCsvPath)) {
    throw "Branches CSV not found: $branchesCsvPath"
}

# t_topic.csv is simple, no header issues assumed
$topics = Import-Csv -Path $topicCsvPath

# --- Robust load of Branches.csv with duplicate "attached to" headers ---

$branchLines = Get-Content -Path $branchesCsvPath -Encoding UTF8
if (-not $branchLines -or $branchLines.Count -lt 2) {
    throw "Branches CSV appears to be empty or only has a header: $branchesCsvPath"
}

$branchHeaderLine = $branchLines[0]
$branchDataLines  = $branchLines | Select-Object -Skip 1

# Split on comma – this assumes no commas inside unescaped fields in the header
$rawHeaderCells = $branchHeaderLine -split ','

$headerOverride = @()
$attachIndex    = 1

foreach ($rawHeader in $rawHeaderCells) {
    $hClean = $rawHeader.Trim('"').Trim()

    if ($hClean -eq 'Branch') {
        $safe = 'Branch'
    }
    elseif ($hClean -eq 'Description') {
        $safe = 'Description'
    }
    elseif ($hClean -match '(?i)attached to') {
        # Normalize any "attached to" / "& attached to" variations
        $safe = "attached_to_$attachIndex"
        $attachIndex++
    }
    else {
        # General sanitization: keep alphanumerics + underscore, replace others with '_'
        $safe = ($hClean -replace '[^A-Za-z0-9_]', '_')
        if (-not $safe) {
            $safe = "col$($headerOverride.Count + 1)"
        }
    }

    # Ensure uniqueness in case sanitization created duplicates
    $origSafe   = $safe
    $duplicateN = 1
    while ($headerOverride -contains $safe) {
        $safe = "${origSafe}_$duplicateN"
        $duplicateN++
    }

    $headerOverride += $safe
}

Write-Host "Branches.csv header override: $($headerOverride -join ', ')" -ForegroundColor DarkGray

# Convert the remaining lines with our custom header
$branches = $branchDataLines | ConvertFrom-Csv -Header $headerOverride

if (-not $branches -or $branches.Count -eq 0) {
    throw "Failed to parse Branches.csv rows with overridden headers."
}

# All columns whose names start with "attached_to_"
$attachPropNames = $branches[0].psobject.Properties.Name |
    Where-Object { $_ -like 'attached_to_*' } |
    Sort-Object

Write-Host "Detected attached-to columns: $($attachPropNames -join ', ')" -ForegroundColor DarkGray

# ---------------------------------------------------------------------
#  RESET planning files and init counters
# ---------------------------------------------------------------------
# Always start fresh
$tagLines[0]       | Set-Content -Path $tagPlanningPath       -Encoding utf8
$topicTagLines[0]  | Set-Content -Path $topicTagsPlanningPath -Encoding utf8

# Tag IDs start from 1 each run
$nextTagId = 1

# In-memory registry so later topics can inherit from earlier ones
$topicTags = @()

Write-Host "Planning files reset. Starting tagID from $nextTagId." -ForegroundColor DarkGray

# ---------------------------------------------------------------------
#  MAIN LOOP — per topic
# ---------------------------------------------------------------------
foreach ($topic in $topics) {

    # Step 1: Extract topicID, name, layer
    $topicID = $topic.topicID
    $name    = $topic.name
    $layer   = 0
    [int]::TryParse($topic.layer, [ref]$layer) | Out-Null

    if (-not $topicID) {
        Write-Warning "Skipping row without topicID (name='$name')."
        continue
    }

    if ($layer -le 0) {
        Write-Warning "Topic '$topicID' ('$name') has non-positive layer '$($topic.layer)'; skipping."
        continue
    }

    # Normalized topic name
    $topicNameKey = if ($name) { $name.Trim() } else { '' }

    # Step 2: Try to match Branches row (more robust)
    $branchRow = $branches |
        Where-Object {
            $bName = $_.Branch
            if ($bName) { $bName = $bName.Trim() }
            $bName -eq $topicNameKey
        } |
        Select-Object -First 1

    # Step 3: Build $attachedTo from attached-to columns (or empty if no branchRow)
    $attachedTo = @()
    if (-not $branchRow) {
        Write-Warning "No Branches row found for topic '$name' (topicID=$topicID) - using empty attachedTo and NO auto-tag creation."
        # For topics with no Branch row we will NOT create a new tag in Step 6.
    }
    else {
        foreach ($propName in $attachPropNames) {
            $val = $branchRow.$propName
            if ([string]::IsNullOrWhiteSpace($val)) { continue }
            $valTrim = $val.Trim()
            # Only keep entries that start with letter [A-Za-z]
            if ($valTrim -match '^[A-Za-z]') {
                $attachedTo += $valTrim
            }
        }
    }

    # Step 4: Initialize empty SET-like list of Strings $attachedTagIDs
    $attachedTagIDs   = [System.Collections.Generic.List[string]]::new()
    $newTagIdForTopic = $null

    # Step 5: For each name in $attachedTo, pull its topic's tags
    foreach ($attachedName in $attachedTo) {

        # 5a: Find topic by name (trim both sides)
        $attachedNameKey = $attachedName.Trim()
        $attachedTopicRow = $topics |
            Where-Object {
                $tName = $_.name
                if ($tName) { $tName = $tName.Trim() }
                $tName -eq $attachedNameKey
            } |
            Select-Object -First 1

        if (-not $attachedTopicRow) {
            Write-Warning "For topic '$name' (ID=$topicID): attached-to name '$attachedName' not found in t_topic.csv."
            continue
        }

        $attachedTopicID = $attachedTopicRow.topicID

        # 5b: Collect tagIDs from in-memory topicTags for this attachedTopicID
        $existingAssignments = $topicTags | Where-Object { $_.topicID -eq $attachedTopicID }

        foreach ($assignment in $existingAssignments) {
            $tagIdStr = [string]$assignment.tagID
            if (-not $attachedTagIDs.Contains($tagIdStr)) {
                [void]$attachedTagIDs.Add($tagIdStr)
            }
        }
    }

    # Step 6: If we have fewer tags than ceil(layer * 2/3), create a new tag
    #         BUT ONLY if the topic actually has a Branch row.
    $threshold = [math]::Ceiling((2.0 * $layer) / 3.0)

    if ($branchRow -and ($attachedTagIDs.Count -lt $threshold)) {

        $tagNameBase = Uniformed -Name $name

        $currentTagID = $nextTagId
        $nextTagId++

        # CSV-escape the tag name (already lowercase from Uniformed)
        $escapedName = '"' + ($tagNameBase -replace '"', '""') + '"'

        # Format: tagID,name,synonyms  (synonyms empty for Phase 1)
        $tagLine = "$currentTagID,$escapedName,"""""

        $tagLines.Add($tagLine)

        $newTagIdForTopic = [string]$currentTagID

        Write-Host "Created tag $currentTagID for topic '$topicID' ('$name') => '$tagNameBase'" -ForegroundColor Green

        # Insert NEW tag at the TOP of the tag list
        if (-not $attachedTagIDs.Contains($newTagIdForTopic)) {
            $attachedTagIDs.Insert(0, $newTagIdForTopic)
        }
    }
    elseif (-not $branchRow -and ($attachedTagIDs.Count -lt $threshold)) {
        # Explicitly log that we are *not* filling the "missing" tags
        Write-Host "Topic '$topicID' ('$name') would need more tags (layer=$layer, threshold=$threshold, has=$($attachedTagIDs.Count)) but has no Branch row. Skipping auto-tag creation." -ForegroundColor DarkYellow
    }

    # Step 7: Add topic-tag assignments with weights
    $size = $attachedTagIDs.Count

    for ($i = 0; $i -lt $size; $i++) {
        $tagId = $attachedTagIDs[$i]

        # Avoid duplicate topicID-tagID combinations if script is rerun in same run (defensive)
        $already =
            $topicTags |
            Where-Object { $_.topicID -eq $topicID -and $_.tagID -eq $tagId } |
            Select-Object -First 1

        if ($already) {
            continue
        }

        # If this is the newly created tag for this topic, force weight = 5
        if ($newTagIdForTopic -and ($tagId -eq $newTagIdForTopic)) {
            $weight = 5
        }
        else {
            $weight = Get-Weight -Size $size -Index $i
        }

        $relationLine = "$topicID,$tagId,$weight"
        $topicTagLines.Add($relationLine)

        # Update in-memory structure so later topics can "inherit" these tags
        $topicTags += [pscustomobject]@{
            topicID = $topicID
            tagID   = $tagId
            weight  = $weight
        }

        Write-Host "Assigned tag $tagId to topic '$topicID' ('$name') with weight $weight (i=$i / size=$size)" -ForegroundColor Yellow
    }
}

Write-Host "Done. Fresh t_tag_PLANNING.txt and ct_topic_tags_PLANNING.txt generated." -ForegroundColor Cyan

# Persist buffered lines in one pass to reduce file locking issues
Set-Content -Path $tagPlanningPath       -Value $tagLines      -Encoding utf8
Set-Content -Path $topicTagsPlanningPath -Value $topicTagLines -Encoding utf8
