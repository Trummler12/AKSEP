Set-Location $PSScriptRoot
Set-Location ../src/styles-vererbung/from-globals

# HIDE FOLDERS
$foldersToHide = @("node_modules", "dist", ".output", ".env")

# Optional settings
$saveTreeToTxt       = $true
$treeTxtPath         = $PSScriptRoot      # Use "." or $PSScriptRoot for root directory
# "ProgrammierZeugs" = "Tree"; "ListPuzzle" = "LPTree"; etc.
$treeTxtFileName     = "local-tree"
$replaceOldTreeFile  = $true

# --- END OF USER CONFIGURATION ---

# Get raw tree output as an array of lines
if ($IsWindows -eq $true) {
    $content = (tree /F /A).Split("`n")
} else {
    $content = (tree /F /A).Split("`n")
}
# Prepare container for filtered lines
$filteredContent = @("`n")

# Process each line
$i = 0
while ($i -lt $content.Count) {
    $currentLine = $content[$i]
    $folderFound = $false

    foreach ($folder in $foldersToHide) {
        if ($currentLine -match "([\+\\])---$folder$") {
            $folderFound = $true
            $filteredContent += $currentLine.trimEnd()

            # Determine indentation
            $indent = ""
            if ($currentLine -match "(.*?)([\+\\])---") { $indent = $matches[1] }

            # Find end of this hidden folder block
            $nextLineIndex      = -1
            $currentIndentLevel = $indent.Length
            $isLastItem         = $true

            for ($j = $i + 1; $j -lt $content.Count; $j++) {
                $nextLine = $content[$j]
                if ($nextLine -match "^(.*?)([\+\\])---") {
                    $nextIndent = $matches[1].Length
                    if ($nextIndent -le $currentIndentLevel) {
                        $nextLineIndex = $j
                        $isLastItem    = ($nextIndent -lt $currentIndentLevel)
                        break
                    }
                }
                if ($nextLine.Trim() -ne "" -and $nextLine.Length -le $currentIndentLevel) {
                    $nextLineIndex = $j
                    $isLastItem    = $true
                    break
                }
            }

            # Insert exclusion marker
            if ($isLastItem) {
                $filteredContent += "$indent        [Contents excluded]"
                $filteredContent += "$indent"
            } else {
                $filteredContent += "$indent|       [Contents excluded]"
                $filteredContent += "$indent|"
            }

            # Jump to the next relevant line
            if ($nextLineIndex -ne -1) { $i = $nextLineIndex }
            else { $i = $content.Count }
            break
        }
    }

    if (-not $folderFound) {
        $filteredContent += $currentLine.trimEnd()
        $i++
    }
}

# Output filtered tree to console
Write-Host "`n"
$filteredContent

# Save to file if enabled
if ($saveTreeToTxt) {
    $baseFullPath = Join-Path $treeTxtPath "$treeTxtFileName.txt"

    if ( (Test-Path $baseFullPath -PathType Leaf) -and -not $replaceOldTreeFile) {
        $i = 1
        do {
            $candidateName = "{0}({1}).txt" -f $treeTxtFileName, $i
            $fullPath     = Join-Path $treeTxtPath $candidateName
            $i++
        } while (Test-Path $fullPath -PathType Leaf)
    }
    else {
        $fullPath = $baseFullPath
    }

    $filteredContent | Out-File -FilePath $fullPath -Encoding UTF8
        # Avoid Unicode issues on Windows consoles
    Write-Host "`nFiltered tree saved to `"$fullPath`""
}
