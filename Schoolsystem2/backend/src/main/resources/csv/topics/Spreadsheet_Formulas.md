# Formulas used on Google Spreadsheet

This File documents the formulas used on Google Spreadsheet to derive the values of certain fields found in AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\Branches.csv & AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\t_topic_PLANNING.csv

## Table of Contents

- [Branches](#branches-branchescsv)
  - [Manual Columns](#manual-columns)
  - [Branches!G:N ("Layer n")](#branchesgn-layer-n)
    - [Branches!G ("Layer 1")](#branchesg-layer-1)
    - [Branches!J ("Layer 4")](#branchesj-layer-4)
  - [Branches!O ("Layer")](#brancheso-layer)
- [t_topic](#t_topic-t_topic_planningcsv)
  - [t_topic!C2 ("name")](#t_topicc2-name)
  - [t_topic!D ("typeID")](#t_topicd-typeid)
  - [t_topic!A ("topicID")](#t_topica-topicid)
    - [t_topic!A42](#t_topica42)
  - [t_topic!B ("lang")](#t_topicb-lang)
  - [t_topic!E ("layer")](#t_topice-layer)
  - [t_topic!F ("description")](#t_topicf-description)
  - [t_topic!G ("version")](#t_topicg-version)
  - [t_topic!H ("url")](#t_topich-url)

## Branches (=>Branches.csv)

**Fields:**
- Branch (A): Branches!A (The name of the Branch, as listed on Wikipedia)
- Description (B): (Short Branch Description, also derived from <https://en.wikipedia.org/wiki/Index_of_branches_of_science>)
- (&) attached to (C:F): Prequel' Science Branch; Example: "Astrobiology" is attached to "Astronomy" & "Biology" because it's reasonable to first build dome understanding of those two before going into Astrobiology itself
- Layer n (G:N): TRUE if this Branch is on layer n (see below)
- Layer (O): Returns the layer of this Branch based on where 'Layer n' is TRUE
- Type (P): Topic Type (see below)
- Status (Q): Legacy field; "1 = approved (marked as finished)", but not used anymore for a while now

### Manual Columns
- Branches!A "Branch" (Branch Name; derived from <https://en.wikipedia.org/wiki/Index_of_branches_of_science>)
- Branches!B "Description" (Short Branch Description; also derived from <https://en.wikipedia.org/wiki/Index_of_branches_of_science>)
- Branches!C:F "attached to" ('Prequel' Science Branch; Example: "Astrobiology" is attached to "Astronomy" & "Biology")
- Branches!P "Type" (B = Branch (as listed on Wikipedia); S = (School) Subject (In case there's no analogous Science Branch Listed or if essential); T = Technical Subject (Subject that falls in neither of the ones above but requires physical Tools to be taught); P = other Practical Subjects (not necessarily requiring Tools but where theory alone isn't sufficient))
- Branches!Q "Status" (Legacy field; "1 = approved (marked as finished)", but not used anymore for a while now)

### Branches!G:N ("Layer n")

Returns TRUE on "layer n" where n = the length of the longest "attached to" chain +1

#### Branches!G ("Layer 1")
TRUE if this branch has no "attached to" entries

```sheets
=LET(
  hasPrev,    COUNTIF(OFFSET($G2, 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) > 0,
  hasERROR,   COUNTIF(OFFSET($G2, 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0,
  isSynonym,  IFERROR(FIND(" = ", $C2)>0, FALSE),
  depC,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($C$1))),$C2),
  depD,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($D$1))),$D2),
  depE,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($E$1))),$E2),
  depF,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($F$1))),$F2),
  txtC,       TRIM(IFERROR(MID(depC, FIND("=", depC) + 1, 255), depC)),
  txtD,       TRIM(IFERROR(MID(depD, FIND("=", depD) + 1, 255), depD)),
  txtE,       TRIM(IFERROR(MID(depE, FIND("=", depE) + 1, 255), depE)),
  txtF,       TRIM(IFERROR(MID(depF, FIND("=", depF) + 1, 255), depF)),

  CIsEmpty,   OR(depC = "-", depC = "–"),
  DIsEmpty,   OR(depD = "-", depD = "–"),
  EIsEmpty,   OR(depE = "-", depE = "–"),
  FIsEmpty,   OR(depF = "-", depF = "–"),
  CRowID,     IFERROR(MATCH(txtC, $A:$A, 0), NA()),
  DRowID,     IFERROR(MATCH(txtD, $A:$A, 0), NA()),
  ERowID,     IFERROR(MATCH(txtE, $A:$A, 0), NA()),
  FRowID,     IFERROR(MATCH(txtF, $A:$A, 0), NA()),
  depExist,   AND(OR(NOT(ISNA(CRowID)),CIsEmpty),OR(NOT(ISNA(DRowID)),DIsEmpty),OR(NOT(ISNA(ERowID)),EIsEmpty),OR(NOT(ISNA(FRowID)),FIsEmpty)),
  CHasERROR,  AND(NOT(CIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(CRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  DHasERROR,  AND(NOT(DIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(DRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  EHasERROR,  AND(NOT(EIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(ERowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  FHasERROR,  AND(NOT(FIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(FRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  ERRORadress,IF(AND(isSynonym,ISNA(CRowID),NOT(CIsEmpty)),ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($G$1),4),IF(
      CHasERROR,ADDRESS(CRowID,COLUMN($G$1),4),IF(
      DHasERROR,ADDRESS(DRowID,COLUMN($G$1),4),IF(
      EHasERROR,ADDRESS(ERowID,COLUMN($G$1),4),IF(
      FHasERROR,ADDRESS(FRowID,COLUMN($G$1),4),IF(
      AND(NOT(CIsEmpty),
      IFERROR(MATCH(txtC, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($C2),COLUMN($C2),4),IF(
      AND(NOT(DIsEmpty),
      IFERROR(MATCH(txtD, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($D2),COLUMN($D2),4),IF(
      AND(NOT(EIsEmpty),
      IFERROR(MATCH(txtE, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($E2),COLUMN($E2),4),IF(
      AND(NOT(FIsEmpty),
      IFERROR(MATCH(txtF, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($F2),COLUMN($F2),4),NA()
    ))))))))),
  preURL,   "https://docs.google.com/spreadsheets/d/1PV9KFEjxUnyKFkKX6RxZMiuW27xaeE1CU18NecM7_Bg/edit?gid=1024575380#gid=1024575380&range=",
  ERRORURL,   preURL&ERRORadress,
  depHavePrev,AND(
      OR(CIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(CRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1),
      OR(DIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(DRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1),
      OR(EIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(ERowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1),
      OR(FIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(FRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1)
    ),

  IF(
    OR(hasPrev,hasERROR),
    "",
    IF(
      depExist,
      IF(
        ISNA(ERRORadress),
        IF(
          depHavePrev,
          TRUE,
          ""
          ),
        HYPERLINK(ERRORURL,"ERROR")
      ),
      HYPERLINK(ERRORURL,"ERROR")
    )
  )
)
```

#### Branches!J ("Layer 4")
Returns TRUE if the highest layer among all Branches "attached to" this Branch is exactly (4-1=)3
```sheets
=LET(
  hasPrev,    COUNTIF(OFFSET($G2, 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) > 0,
  hasERROR,   COUNTIF(OFFSET($G2, 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0,
  isSynonym,  IFERROR(FIND(" = ", $C2)>0, FALSE),
  depC,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($C$1))),$C2),
  depD,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($D$1))),$D2),
  depE,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($E$1))),$E2),
  depF,       IF(isSynonym,INDIRECT(ADDRESS(IFERROR(MATCH(TRIM(IFERROR(MID($C2, FIND("=", $C2) + 1, 255), $C2)), $A:$A, 0), NA()),COLUMN($F$1))),$F2),
  txtC,       TRIM(IFERROR(MID(depC, FIND("=", depC) + 1, 255), depC)),
  txtD,       TRIM(IFERROR(MID(depD, FIND("=", depD) + 1, 255), depD)),
  txtE,       TRIM(IFERROR(MID(depE, FIND("=", depE) + 1, 255), depE)),
  txtF,       TRIM(IFERROR(MID(depF, FIND("=", depF) + 1, 255), depF)),

  CIsEmpty,   OR(depC = "-", depC = "–"),
  DIsEmpty,   OR(depD = "-", depD = "–"),
  EIsEmpty,   OR(depE = "-", depE = "–"),
  FIsEmpty,   OR(depF = "-", depF = "–"),
  CRowID,     IFERROR(MATCH(txtC, $A:$A, 0), NA()),
  DRowID,     IFERROR(MATCH(txtD, $A:$A, 0), NA()),
  ERowID,     IFERROR(MATCH(txtE, $A:$A, 0), NA()),
  FRowID,     IFERROR(MATCH(txtF, $A:$A, 0), NA()),
  depExist,   AND(OR(NOT(ISNA(CRowID)),CIsEmpty),OR(NOT(ISNA(DRowID)),DIsEmpty),OR(NOT(ISNA(ERowID)),EIsEmpty),OR(NOT(ISNA(FRowID)),FIsEmpty)),
  CHasERROR,  AND(NOT(CIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(CRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  DHasERROR,  AND(NOT(DIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(DRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  EHasERROR,  AND(NOT(EIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(ERowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  FHasERROR,  AND(NOT(FIsEmpty),COUNTIF(OFFSET(INDIRECT(ADDRESS(FRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), "ERROR") > 0),
  ERRORadress,IF(
      CHasERROR,ADDRESS(CRowID,COLUMN($G$1),4),IF(
      DHasERROR,ADDRESS(DRowID,COLUMN($G$1),4),IF(
      EHasERROR,ADDRESS(ERowID,COLUMN($G$1),4),IF(
      FHasERROR,ADDRESS(FRowID,COLUMN($G$1),4),IF(
      AND(NOT(CIsEmpty),
      IFERROR(MATCH(txtC, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($C2),COLUMN($C2),4),IF(
      AND(NOT(DIsEmpty),
      IFERROR(MATCH(txtD, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($D2),COLUMN($D2),4),IF(
      AND(NOT(EIsEmpty),
      IFERROR(MATCH(txtE, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($E2),COLUMN($E2),4),IF(
      AND(NOT(FIsEmpty),
      IFERROR(MATCH(txtF, $A:$A, 0)<0, TRUE)),
        ADDRESS(ROW($F2),COLUMN($F2),4),NA()
    )))))))),
  preURL,   "https://docs.google.com/spreadsheets/d/1PV9KFEjxUnyKFkKX6RxZMiuW27xaeE1CU18NecM7_Bg/edit?gid=1024575380#gid=1024575380&range=",
  ERRORURL,   preURL&ERRORadress,
  depHavePrev,AND(
      OR(CIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(CRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1),
      OR(DIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(DRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1),
      OR(EIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(ERowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1),
      OR(FIsEmpty,COUNTIF(OFFSET(INDIRECT(ADDRESS(FRowID,COLUMN($G$1))), 0, 0, 1, COLUMN() - COLUMN($G$1)), TRUE) = 1)
    ),

  IF(
    OR(hasPrev,hasERROR),
    "",
    IF(
      depExist,
      IF(
        ISNA(ERRORadress),
        IF(
          depHavePrev,
          TRUE,
          ""
          ),
        HYPERLINK(ERRORURL,"ERROR")
      ),
      HYPERLINK(ERRORURL,"ERROR")
    )
  )
)
```
~symmetrically equivalent for "Layer 1" to "Layer 8"

### Branches!O ("Layer")
Returns the layer of this Branch
```sheets
=IF(G2="",IF(H2="",IF(I2="",IF(J2="",IF(K2="",IF(L2="",IF(M2="",IF(N2="","??",IF(N2=TRUE,"8","8?")),IF(M2=TRUE,"7","7?")),IF(L2=TRUE,"6","6?")),IF(K2=TRUE,"5","5?")),IF(J2=TRUE,"4","4?")),IF(I2=TRUE,"3","3?")),IF(H2=TRUE,"2","2?")),IF(G2=TRUE,"1","1?"))
```
~Formula could be simpler but it works at least

## t_topic (=>t_topic_PLANNING.csv)

**Fields:**
- topicID (A): Unique TopicID generated from Branch Name & Type
- lang (B): Language Code (always "en" for now)
- name (C): Branch Name (derived from Branches!A, excluding synonym Branches)
- typeID (D): Topic TypeID (derived from Branches!P; 0 = Science Branch, 1 = (School) Subject, 2 = Technical Subject, 6 = other Practical Subject, 7 = unknown/other)
- layer (E): Layer (derived from Branches!O)
- description (F): Branch Description (derived from Branches!B)
- version (G): always "1" for now
- url (H): URL embedded on that Branch

### t_topic!C2 ("name")
Creates a list of all Branch Names that aren't marked as synonyms of another branch
```sheets
=FILTER(
  Branches!A2:A, 
  LEFT(TRIM(Branches!C2:C),1) <> "="
)
```

### t_topic!D ("typeID")
Simple Lookup for Branch!P "Type"
```sheets
=IF(C2="","", 
  SWITCH(
    INDEX(Branches!P:P, MATCH(C2, Branches!A:A, 0)),
    "S", 0,
    "B", 1,
    "T", 2,
    "P", 6,
    7
  )
)
```

### t_topic!A ("topicID")
Generates a unique TopicID based on the Branch Name (and type) with a number of specific substitutions of recurring prefixes to avoid systematic overlaps
```sheets
=IF(C2="","",
  LET(
    name, C2,
    typeID, D2,
    clean, TRIM( REGEXREPLACE( LOWER(name), "\s*\([^)]*\)", "" )),
    words, SPLIT( clean, "- ", TRUE, TRUE ),
    filtered, IF(
      COUNTA(words)>3,
      FILTER( words, NOT(REGEXMATCH(words, "^(of|for|in)$")) ),
      words
    ),
    peeled, MAP(
      filtered,
      LAMBDA(w,
        IF(
          OR( LEFT(w,9)="cognitive" ),
          REPLACE( REPLACE(w, 4, 6, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,9)="geomorpho" ),
          REPLACE( REPLACE(w, 5, 5, ""), 2, 2, ""),
        IF(
          OR( LEFT(w,7)="magneto" ),
          REPLACE( REPLACE(w, 4, 4, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,7)="electro" ),
          REPLACE(w, 3, 5, ""),
        IF(
          OR( LEFT(w,6)="palaeo", LEFT(w,6)="paleo-", LEFT(w,6)="psycho", LEFT(w,6)="thermo", LEFT(w,6)="cardio", LEFT(w,6)="chrono" ),
          REPLACE( REPLACE(w, 4, 3, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,6)="pharma", LEFT(w,6)="immuno" ),
          REPLACE(w, 3, 4, ""),
        IF(
          OR( LEFT(w,5)="neuro", LEFT(w,5)="photo" ),
          REPLACE( REPLACE(w, 5, 1, ""), 2, 2, ""),
        IF(
          OR( LEFT(w,5)="paleo", LEFT(w,5)="histo", LEFT(w,5)="socio", LEFT(w,5)="phylo", LEFT(w,5)="helio", LEFT(w,5)="cosmo", LEFT(w,5)="meteo", LEFT(w,5)="herme", LEFT(w,5)="limno" ),
          REPLACE( REPLACE(w, 4, 2, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,5)="micro", LEFT(w,5)="hydro" ),
          REPLACE(w, 2, 4, ""),
        IF(
          OR( LEFT(w,5)="astro", LEFT(w,5)="ethno" ),
          REPLACE(w, 3, 3, ""),
        IF(
          OR( LEFT(w,4)="peda", LEFT(w,4)="topo", LEFT(w,4)="kine" ),
          REPLACE( REPLACE(w, 4, 1, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,4)="phon" ),
          REPLACE(w, 2, 2, ""),
        IF(
          OR( LEFT(w,4)="para", LEFT(w,4)="meta" ),
          REPLACE(w, 2, 3, ""),
        IF(
          OR( LEFT(w,4)="aero", LEFT(w,4)="agro", LEFT(w,4)="arch", LEFT(w,4)="pyro", LEFT(w,4)="typo" ),
          REPLACE(w, 3, 2, ""),
        IF(
          OR( LEFT(w,3)="zoo" ),
          REPLACE(w, 2, 2, ""),
        IF(
          OR( LEFT(w,3)="gra", LEFT(w,3)="sto", LEFT(w,3)="spe" ),
          REPLACE(w, 3, 1, ""),
        IF(
          OR( LEFT(w,3)="geo", LEFT(w,3)="bio", LEFT(w,3)="phy", LEFT(w,3)="met", LEFT(w,3)="car", LEFT(w,3)="mus" ),
          REPLACE(w, 2, 1, ""),
          w
        )))))))))))))))))
      )
    ),
    n, COUNTA( filtered ),
    firstW, INDEX( peeled, 1 ),
    secondW, IF( n>=2, INDEX( peeled, 2 ), "" ),
    thirdW, IF( n>=3, INDEX( peeled, 3 ), "" ),

    specWords, {"science","studies","theory","chemistry","physics","bology","genetics","mechanics","engineering"},
    isSpec, NOT( ISNA( MATCH( secondW, specWords, 0 ) ) ),

    char3, IF(
      n=1,
      LEFT(firstW,3),
    IF(
      n=2,
      IF(
        isSpec,
        LEFT(firstW,2)&LEFT(secondW,1),
        LEFT(firstW,1)&LEFT(secondW,2)
      ),
      LEFT(firstW,1)&LEFT(secondW,1)&LEFT(thirdW,1)
    )),

    charID, UPPER( char3 ),
    prevCount, COUNTIF( $A$1:A1, charID & "*" ),
    hasZero, COUNTIF( $A$1:A1, charID & "0" )>0,
    suffix, IF(
      typeID=0,
      IF( hasZero, prevCount, 0 ),
      prevCount+1
    ),
    charID & suffix
  )
)
```

#### t_topic!A42
(Example on a cell farther down)
```sheets
=IF(C42="","",
  LET(
    name, C42,
    typeID, D42,
    clean, TRIM( REGEXREPLACE( LOWER(name), "\s*\([^)]*\)", "" )),
    words, SPLIT( clean, "- ", TRUE, TRUE ),
    filtered, IF(
      COUNTA(words)>3,
      FILTER( words, NOT(REGEXMATCH(words, "^(of|for|in)$")) ),
      words
    ),
    peeled, MAP(
      filtered,
      LAMBDA(w,
        IF(
          OR( LEFT(w,9)="cognitive" ),
          REPLACE( REPLACE(w, 4, 6, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,9)="geomorpho" ),
          REPLACE( REPLACE(w, 5, 5, ""), 2, 2, ""),
        IF(
          OR( LEFT(w,7)="magneto" ),
          REPLACE( REPLACE(w, 4, 4, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,7)="electro" ),
          REPLACE(w, 3, 5, ""),
        IF(
          OR( LEFT(w,6)="palaeo", LEFT(w,6)="paleo-", LEFT(w,6)="psycho", LEFT(w,6)="thermo", LEFT(w,6)="cardio", LEFT(w,6)="chrono" ),
          REPLACE( REPLACE(w, 4, 3, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,6)="pharma", LEFT(w,6)="immuno" ),
          REPLACE(w, 3, 4, ""),
        IF(
          OR( LEFT(w,5)="neuro", LEFT(w,5)="photo" ),
          REPLACE( REPLACE(w, 5, 1, ""), 2, 2, ""),
        IF(
          OR( LEFT(w,5)="paleo", LEFT(w,5)="histo", LEFT(w,5)="socio", LEFT(w,5)="phylo", LEFT(w,5)="helio", LEFT(w,5)="cosmo", LEFT(w,5)="meteo", LEFT(w,5)="herme", LEFT(w,5)="limno" ),
          REPLACE( REPLACE(w, 4, 2, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,5)="micro", LEFT(w,5)="hydro" ),
          REPLACE(w, 2, 4, ""),
        IF(
          OR( LEFT(w,5)="astro", LEFT(w,5)="ethno" ),
          REPLACE(w, 3, 3, ""),
        IF(
          OR( LEFT(w,4)="peda", LEFT(w,4)="topo", LEFT(w,4)="kine" ),
          REPLACE( REPLACE(w, 4, 1, ""), 2, 1, ""),
        IF(
          OR( LEFT(w,4)="phon" ),
          REPLACE(w, 2, 2, ""),
        IF(
          OR( LEFT(w,4)="para", LEFT(w,4)="meta" ),
          REPLACE(w, 2, 3, ""),
        IF(
          OR( LEFT(w,4)="aero", LEFT(w,4)="agro", LEFT(w,4)="arch", LEFT(w,4)="pyro", LEFT(w,4)="typo" ),
          REPLACE(w, 3, 2, ""),
        IF(
          OR( LEFT(w,3)="zoo" ),
          REPLACE(w, 2, 2, ""),
        IF(
          OR( LEFT(w,3)="gra", LEFT(w,3)="sto", LEFT(w,3)="spe" ),
          REPLACE(w, 3, 1, ""),
        IF(
          OR( LEFT(w,3)="geo", LEFT(w,3)="bio", LEFT(w,3)="phy", LEFT(w,3)="met", LEFT(w,3)="car", LEFT(w,3)="mus" ),
          REPLACE(w, 2, 1, ""),
          w
        )))))))))))))))))
      )
    ),
    n, COUNTA( filtered ),
    firstW, INDEX( peeled, 1 ),
    secondW, IF( n>=2, INDEX( peeled, 2 ), "" ),
    thirdW, IF( n>=3, INDEX( peeled, 3 ), "" ),

    specWords, {"science","studies","theory","chemistry","physics","bology","genetics","mechanics","engineering"},
    isSpec, NOT( ISNA( MATCH( secondW, specWords, 0 ) ) ),

    char3, IF(
      n=1,
      LEFT(firstW,3),
    IF(
      n=2,
      IF(
        isSpec,
        LEFT(firstW,2)&LEFT(secondW,1),
        LEFT(firstW,1)&LEFT(secondW,2)
      ),
      LEFT(firstW,1)&LEFT(secondW,1)&LEFT(thirdW,1)
    )),

    charID, UPPER( char3 ),
    prevCount, COUNTIF( $A$1:A41, charID & "*" ),
    hasZero, COUNTIF( $A$1:A41, charID & "0" )>0,
    suffix, IF(
      typeID=0,
      IF( hasZero, prevCount, 0 ),
      prevCount+1
    ),
    charID & suffix
  )
)
```

### t_topic!B ("lang")

```sheets
=IF(A2="","","en")
```
(Yes, this is just a placeholder; We may add topic localizations later in a dedicated `t_topic_localizations.csv` when time comes)


### t_topic!E ("layer")
Simple Lookup for Branch!O "Layer"
```sheets
=IF(C2="", "",
  INDEX( Branches!O:O, MATCH( C2, Branches!A:A, 0 ) )
)
```

### t_topic!F ("description")
Simple Lookup for Branch!B "Description", with removal of certain unwanted substrings (like "[citation needed]")
```sheets
=IF(C2="", "", 
  TRIM(
    REGEXREPLACE(
      INDEX( Branches!B:B, MATCH( C2, Branches!A:A, 0 ) ),
      "\[(?:relevant\?|citation needed|\d+)\]",
      ""
    )
  )
)
```

### t_topic!G ("version")
Placeholder field; May be used later to track entry versions
```sheets
=IF(A2="","",1)
```

### t_topic!H ("url")
Derived from <https://en.wikipedia.org/wiki/Index_of_branches_of_science> (URLs behind Branch Names)
