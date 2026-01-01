# Data Flow

This file describes the way Information/Data is (planned) to flow from YouTube Videos until the resulting Resources are being connected with the Topics.
Beware that the current _provisional_ state of the Project may differ from what's planned out here.

## Table of Contents

- [Status Quo](#status-quo)
- [Plan](#plan)
  - [Information Gathering](#information-gathering)
    - [developers.google.com AI Chat](#developersgooglecom-ai-chat)
    - [Resource representation](#resource-representation)
      - [`channels` resource](#channels-resource)
      - [`videos` resource](#videos-resource)
      - [`videoCategories` resource](#videocategories-resource)
      - [`comments` resource](#comments-resource)
      - [`playlists` resource](#playlists-resource)
      - [`playlistItems` resource](#playlistitems-resource)
      - [`search` resource](#search-resource)
  - [Provisional Data Flow Description](#provisional-data-flow-description)
    - [Topic-related](#topic-related)
    - [Resource-related](#resource-related)


## Status Quo




## Plan

### Information Gathering

#### developers.google.com AI Chat

```prompt1
Ich habe k�rzlich ein Bildungssystem konzipiert, welches nicht auf Noten sondern auf Kompetenzlevels basieren soll. W�hrend man im aktuell weit verbreiteten notenbasierten Bildungssystem stets eine begrenzte Anzahl F�cher oder Module zu besuchen hat, welche sich auf h�chstens eine kleine zweistellige Anzahl beschr�nkt, soll man in dem von mir konzipierten Bildungssystem zwar ebenfalls bei einer Hand voll klassischer Grundlagenf�cher wie "(Allgemeine) Mathematik", "(Allgemeine) Chemie" etc. (deren Zahl sich auf etwa 15 bis 25 bel�uft) _beginnen_, jedoch dar�ber hinaus praktisch ohne irgendwelche systemischen H�rden in jede x-beliebige wissenschaftliche oder akademische Disziplin eintauchen k�nnen. Die verschiedenen Disziplinen sind untereinander �hnlich aufgebaut wie ein Skilltree, wie man es aus Videospielen kennt - so ist Biochemie beispielsweise von Biologie und Chemie abh�ngig.
Mittlerweile sind in meiner Datenbank schon �ber 700 wissenschaftliche Disziplinen beschrieben und festgehalten. F�r die verschiedenen wissenschaftlichen Disziplinen, die es gibt, sollen nun Beispielunterrichtsressourcen gesammelt und diese Ressourcen den verschiedenen Themen zugeordnet werden. Hierf�r gibt es keinen einfacheren Startpunkt als die Videos von Wissenschaftskan�len auf YouTube wie etwa die von Veritasium, Vsauce, 3blue1brown & co.. Nun hat man als YouTube-Kanalbetreiber aber nicht nur die M�glichkeit, alleinstehende Videos zu erstellen, sondern diese Videos in Playlists oder Kursen zu organisieren, wo man ein Thema in Form einer Videoserie abhandelt. Und bei Video-Serien dieser Form w�re es wohl eher m�ssig sinnvoll, irgendwo mittendrin einzusteigen. Aus diesem Grund wollen wir unser Datenmodell erweitern um eine Erfassung s�mtlicher Playlists und Kurse der relevanten YouTube-Kan�le, um Ressourcen dann f�r die Topic-Zuweisungen pro Playlist/Kurs gruppieren zu k�nnen.
Momentan als Ausgangsdaten vorliegen haben wir lediglich eine `t_source.csv`:
`sourceID,source_typeID,source_URL,sauthorID,source_title,description,created,updated,sa_resource` (Beispiel-Datensatz: `31146,1,https://youtu.be/FE-hM1kRK4Y,31,Why Laplace transforms are so useful,"The content discusses a lesson on Laplace transforms applied to the forced harmonic oscillator by analyzing its poles. It covers key properties, the transform of a derivative, and how to invert the transform to find solutions, providing intuition about the transformed solution. Animations use the Python library manim, with music by Vincent Rubinetti. The channel 3blue1brown visually animates math concepts and is viewer-supported.",2025-11-05T13:09:45Z,2025-11-05T13:09:45Z,1`
`sourceID` = unique Identifier der Quelle; `source_typeID` = `0,"Web Page"`|`1,"YouTube Video"`|`2,"File"`; `source_URL` = Web-Page- oder YouTube-Video-URL; `sauthorID`= unique Identifier des YouTube-Kanals
und eine (bislang manuell gepflegte) `t_source_author.csv`:
`sauthorID,sauthor_name,sauthor_URL,sauthor_description,impressum_URL`.
Nun ist meine Frage an Dich: Welche Informationen, welche wir �ber die YouTube Data API erhalten k�nnen, k�nnten f�r uns von Relevanz sein? Beispielsweise brauchen wir f�r das erw�hnte wissenschaftliche Abstract zu jedem Video so viele Informationen �ber das Video, wie wir auftreiben k�nnen. So mindestens mal den Titel und die Videobeschreibung. Und falls es eines gibt, ein Transkript des Videos. Und falls es kein Transkript gibt zu einem Video, dann w�rden wir stattdessen einfach die Top 3 bis 5 am h�chsten gevoteten Kommentare uns ziehen, f�r etwas mehr Kontext. _Wie viele_ Kommentare gezogen werden, das soll abh�ngig sein von der L�nge der bereits gezogenen Kommentare. Zudem habe ich gesehen, dass es videoCategories gibt. Und da ist meine Frage: wie filigran werden verschiedene videoCategories voneinander unterschieden? Wie viele videoCategories gibt es? Und ist ein Video jeweils auf nur eine videoCategory beschr�nkt, oder gibt es mehrere, die man einem Video zuordnen kann? Und wie h�ufig hat ein Video �berhaupt videoCategories zugewiesen erhalten? Weil wenn es wirklich durchwegs definiert ist bei jedem Video, oder bei _fast_ jedem Video, dann k�nnten wir mit den videoCategories definitiv arbeiten. Aber wenn es nur sehr l�ckenhaft ist, dann m�ssen wir uns zweimal �berlegen, ob es irgendwo tats�chlich relevant sein k�nnte f�r uns. Dar�ber hinaus w�re es nat�rlich von uns auch von Interesse, ob ein Video eine brauchbare Synchro hat, in Sprachen neben der prim�ren Sprache des Videos. 'Brauchbar' insofern, weil es gibt ja automatisch KI-synchronisierte Videos und die sind richtig unangenehm sich anzuh�ren. Also brauchen wir irgendwo einen Indikator, dass etwas wirklich manuell synchronisiert wurde, mit tats�chlichen echten Synchronsprechern und NICHT mit KI. Und wenn das gegeben ist, dann w�rden wir das Video in unserer Datenbank entsprechend markieren, mit allen Sprachcodes, die in diesem Video als Synchro bereitstehen.
```

<answer1a>
(Result from a less mature prompt)
Gerne helfe ich Ihnen bei Ihrer Anfrage bez�glich der YouTube Data API und der Integration in Ihr kompetenzbasiertes Bildungssystem. Es ist ein sehr interessantes Konzept, wissenschaftliche Disziplinen als "Skilltree" zu strukturieren und YouTube-Ressourcen daf�r zu nutzen.

Um Informationen zu den Videos, Playlists und Kursen eines YouTube-Kanals abzurufen und die Beziehungen zwischen diesen Ressourcen zu verstehen, sind die folgenden Parameter und API-Ressourcen relevant:

**Relevante API-Ressourcen und Parameter**
1. **`channels` Resource**:
   - **Zweck**: Diese Ressource enth�lt Informationen �ber einen YouTube-Kanal selbst. Sie ben�tigen sie, um die `channelId` der Kan�le zu erhalten, von denen Sie Inhalte abrufen m�chten (z.B. Veritasium, Vsauce).
   - **Methode**: `channels.list`
   - **Relevante Parameter**:
     - `part`: Sie sollten `snippet`, `contentDetails`, `brandingSettings` und `statistics` anfordern, um umfassende Informationen zu erhalten. `contentDetails` ist besonders wichtig, da es die `uploads` Playlist-ID des Kanals enth�lt, die eine Liste aller hochgeladenen Videos des Kanals darstellt.
     - `forUsername`: Wenn Sie den Benutzernamen eines Kanals kennen (z.B. "Veritasium"), k�nnen Sie diesen Parameter verwenden, um die `channelId` zu finden.
     - `id`: Wenn Sie bereits die `channelId` kennen, k�nnen Sie diese direkt verwenden.
2. **`playlists` Resource**:
   - **Zweck**: Diese Ressource repr�sentiert eine YouTube-Playlist. Sie ben�tigen sie, um alle Playlists eines Kanals abzurufen.
   - **Methode**: `playlists.list`
   - **Relevante Parameter**:
     - `part`: Fordern Sie `snippet` und `contentDetails` an. `snippet` enth�lt den Titel und die Beschreibung der Playlist, w�hrend `contentDetails` die Anzahl der Videos in der Playlist (`itemCount`) angibt.
     - `channelId`: Verwenden Sie die `channelId`, die Sie von der `channels` Ressource erhalten haben, um alle �ffentlichen Playlists dieses Kanals abzurufen.
     - `mine`: Wenn Sie die Playlists des authentifizierten Benutzers abrufen m�chten (falls Sie Ihr eigenes Konto verwenden), k�nnen Sie diesen Parameter auf `true` setzen.
3. **`playlistItems` Resource**:
   - **Zweck**: Diese Ressource repr�sentiert ein einzelnes Video innerhalb einer Playlist. Sie ist entscheidend, um die Videos zu identifizieren, die zu einer bestimmten Playlist geh�ren, und deren Reihenfolge zu bestimmen.
   - **Methode**: `playlistItems.list`
   - **Relevante Parameter**:
     - `part`: Fordern Sie `snippet` und `contentDetails` an.
       - `snippet` enth�lt Informationen wie den Titel des Videos, die Beschreibung und die `position` des Videos innerhalb der Playlist.
       - `contentDetails` enth�lt die `videoId`, die die eindeutige ID des Videos ist.
     - `playlistId`: Dies ist der wichtigste Parameter. Sie verwenden die `playlistId`, die Sie von der `playlists` Ressource erhalten haben, um alle Videos in dieser spezifischen Playlist abzurufen.
     - `maxResults`: Um die Anzahl der zur�ckgegebenen Elemente pro Anfrage zu steuern (maximal 50). Sie m�ssen m�glicherweise mehrere Anfragen stellen, um alle Videos einer sehr langen Playlist abzurufen, indem Sie den `pageToken` verwenden.
4. **`videos` Resource**:
   - **Zweck**: Diese Ressource enth�lt detaillierte Informationen �ber ein einzelnes YouTube-Video.
   - **Methode**: `videos.list`
   - **Relevante Parameter**:
     - `part`: Fordern Sie `snippet`, `contentDetails`, `statistics` und `topicDetails` an.
       - `snippet` enth�lt den Titel, die Beschreibung, Tags und die Kategorie des Videos.
       - `contentDetails` enth�lt Informationen wie die Dauer des Videos.
       - `topicDetails` kann f�r die Zuordnung zu wissenschaftlichen Disziplinen n�tzlich sein, da es die Themenkategorien des Videos auflistet.
     - `id`: Verwenden Sie die `videoId`, die Sie von der `playlistItems` Ressource erhalten haben, um detaillierte Informationen zu einem spezifischen Video abzurufen.

**Umgang mit Kursen (YouTube Courses)**
Die YouTube Data API v3 hat keine explizite Ressource namens "Courses" im gleichen Sinne wie "Playlists". YouTube hat in der Vergangenheit verschiedene Formate f�r Kurse oder Lernpfade getestet. Oft werden diese jedoch intern als spezielle Arten von Playlists behandelt oder sind �ber die API nicht direkt als separate Ressource zug�nglich.

**Wenn ein "Kurs" auf YouTube als Playlist implementiert ist:** In diesem Fall w�rden Sie ihn �ber die `playlists.list` Methode finden. Die `snippet.title` und `snippet.description` der Playlist w�rden wahrscheinlich darauf hinweisen, dass es sich um einen Kurs handelt. Die Videos innerhalb des Kurses w�rden Sie dann �ber die `playlistItems.list` Methode abrufen, genau wie bei einer normalen Playlist.

**Wenn ein "Kurs" eine andere, nicht-�ffentliche Implementierung hat:** Es ist m�glich, dass bestimmte "Kurs"-Funktionen, die YouTube testet oder anbietet, nicht vollst�ndig �ber die �ffentliche Data API zug�nglich sind. In diesem Fall m�ssten Sie sich auf Playlists verlassen, die von den Kanalbetreibern als Kurse strukturiert wurden.

**Referenzierung von Videos in Kursen/Playlists**
Wenn Sie die Inhalte eines Kurses (der als Playlist implementiert ist) zur�ckgeben m�chten, werden die Videos wie folgt referenziert:
- `playlistItems.list` gibt Ihnen eine Liste von `playlistItem` Ressourcen zur�ck.
- Jede `playlistItem` Ressource enth�lt ein `snippet` und `contentDetails`.
- Innerhalb von `contentDetails` finden Sie das Feld `videoId`. Dies ist die **eindeutige ID des Videos**.
- Innerhalb von `snippet` finden Sie das Feld `position`. Dies gibt Ihnen die **Reihenfolge des Videos innerhalb der Playlist** an (beginnend bei 0).

**Beispielstruktur f�r Ihre Datenbank:**
1. **Tabelle f�r YouTube-Kan�le:**
   - `channel_id` (Prim�rschl�ssel, von YouTube API)
   - `channel_name`
   - `uploads_playlist_id` (von `contentDetails` der `channels` Ressource)
   - ...weitere Kanalinformationen
2. **Tabelle f�r YouTube-Playlists/Kurse:**
   - `playlist_id` (Prim�rschl�ssel, von YouTube API)
   - `channel_id` (Fremdschl�ssel zu Kan�len)
   - `playlist_title`
   - `playlist_description`
   - `is_course` (ein boolesches Feld, das Sie basierend auf Titel/Beschreibung oder manueller �berpr�fung setzen k�nnten)
   - ...weitere Playlist-Informationen
3. **Tabelle f�r YouTube-Videos:**
   - `video_id` (Prim�rschl�ssel, von YouTube API)
   - `video_title`
   - `video_description`
   - `duration`
   - `published_at`
   - `channel_id` (Fremdschl�ssel zu Kan�len)
   - ...weitere Videoinformationen (z.B. `topicDetails` f�r Kategorisierung)
4. **N:M Beziehungstabelle f�r `playlist_videos` (oder `course_videos`):**
   - `playlist_id` (Fremdschl�ssel zu Playlists)
   - `video_id` (Fremdschl�ssel zu Videos)
   - `position_in_playlist` (die position aus playlistItems.list)
   - (Optional) `start_time_offset`, `end_time_offset` falls Sie spezifische Segmente eines Videos referenzieren m�chten.
5. **N:M Beziehungstabelle f�r `discipline_resources`:**
   - `discipline_id` (Fremdschl�ssel zu Ihrer Disziplinen-Tabelle)
   - `resource_type` (z.B. 'video', 'playlist')
   - `resource_id` (k�nnte `video_id` oder `playlist_id` sein)
   - `relevance_score` (optional, f�r die Priorisierung)
   - `competency_level` (optional, um Ressourcen bestimmten Kompetenzlevels innerhalb einer Disziplin zuzuordnen)

**Eindeutige Informationen f�r Kurs- bzw. Playlist-Beziehungen**
- `playlistId`: Dies ist die eindeutige Kennung f�r jede Playlist (und somit auch f�r Kurse, die als Playlists implementiert sind).
- `videoId`: Dies ist die eindeutige Kennung f�r jedes einzelne YouTube-Video.

Durch die Kombination von `playlistId` und `videoId` zusammen mit der `position` k�nnen Sie die genaue Struktur und Reihenfolge der Videos innerhalb eines Kurses oder einer Playlist in Ihrer Datenbank abbilden.

Ich hoffe, diese detaillierte Aufschl�sselung hilft Ihnen bei der Implementierung Ihres Bildungssystems!
</answer1a>

<answer1b>
(Result from ^this matured prompt)
Hallo! Ihr Bildungssystem-Konzept klingt sehr innovativ und vielversprechend. Es ist eine ausgezeichnete Idee, YouTube-Ressourcen zu nutzen, um die verschiedenen wissenschaftlichen Disziplinen zu untermauern. Gerne helfe ich Ihnen dabei, die relevanten Informationen zu identifizieren, die Sie �ber die YouTube Data API erhalten k�nnen.

Die YouTube Data API bietet eine F�lle von Informationen, die f�r Ihr Projekt sehr n�tzlich sein k�nnten. Hier sind die Details zu Ihren spezifischen Fragen und weiteren relevanten Datenpunkten:

**Informationen zu Videos f�r wissenschaftliche Abstracts**
Um ein aussagekr�ftiges wissenschaftliches Abstract zu generieren, ben�tigen Sie so viele Informationen wie m�glich �ber das Video. Die YouTube Data API kann Ihnen hierbei umfassend helfen:
- **Titel und Beschreibung des Videos**: Diese sind direkt �ber den `snippet.title` und `snippet.description` der `videos` resource verf�gbar.
- **Transkript (Untertitel/Captions)**: Die YouTube Data API selbst bietet keinen direkten Endpunkt, um Video-Transkripte oder Untertitel herunterzuladen. Sie k�nnen jedoch �ber die `captions` resource pr�fen, ob Untertitelspuren f�r ein Video verf�gbar sind. Wenn Untertitel vorhanden sind, k�nnen Sie deren Metadaten (Sprache, Art der Untertitel � z.B. automatisch generiert oder manuell) abrufen. Das Herunterladen des eigentlichen Textes erfordert oft eine separate Anfrage an eine URL, die in den Metadaten der Untertitelspuren enthalten sein k�nnte, oder die Nutzung einer Drittanbieterbibliothek, die auf die YouTube-Webseite zugreift, da die API den Inhalt selbst nicht direkt bereitstellt.
- **Kommentare**: Sie k�nnen Kommentare zu einem Video �ber die `commentThreads` resource abrufen. Sie k�nnen die Kommentare nach Relevanz (z.B. Top-Kommentare) oder nach Datum sortieren. Die API gibt Ihnen den Text des Kommentars (`snippet.textDisplay`), den Autor und weitere Metadaten. Sie k�nnen die Anzahl der abgerufenen Kommentare pro Anfrage steuern (bis zu 100 pro Seite). Um die Top 3-5 am h�chsten bewerteten Kommentare zu erhalten, w�rden Sie die order-Parameter auf `relevance` setzen und die `maxResults` entsprechend anpassen.

**Video-Kategorien (videoCategories)**
Ihre Fragen zu den Video-Kategorien sind sehr relevant f�r die Strukturierung Ihrer Inhalte:
- **Granularit�t und Anzahl**: Die YouTube Data API bietet eine Liste von `videoCategories` �ber die `videoCategories.list` Methode. Diese Kategorien sind vordefiniert und umfassen eine Reihe von Themen wie "Science & Technology", "Education", "Gaming", "Music" usw. Die Granularit�t ist eher breit gef�chert und nicht so spezifisch wie Ihre wissenschaftlichen Disziplinen. Es gibt derzeit Dutzende von Kategorien, aber nicht Hunderte oder Tausende.
- **Anzahl der Kategorien pro Video**: Ein Video ist in der Regel **nur einer einzigen** `videoCategory` zugeordnet. Es gibt keine M�glichkeit, einem Video mehrere offizielle Kategorien zuzuweisen.
- **H�ufigkeit der Zuweisung**: Die Zuweisung einer `videoCategory` ist bei den allermeisten, wenn nicht allen, �ffentlichen Videos auf YouTube Standard. Content-Ersteller w�hlen diese Kategorie beim Hochladen des Videos aus. Daher k�nnen Sie davon ausgehen, dass diese Information f�r fast jedes Video verf�gbar ist.
**Fazit zu Video-Kategorien**: W�hrend die `videoCategories` f�r eine grobe Einordnung n�tzlich sein k�nnen (z.B. um Videos, die nicht "Science & Technology" oder "Education" sind, herauszufiltern), sind sie wahrscheinlich nicht detailliert genug, um direkt Ihren spezifischen wissenschaftlichen Disziplinen zugeordnet zu werden. Sie k�nnten als erster Filter dienen, aber die feinere Zuordnung m�sste �ber die Video-Beschreibung, den Titel, Transkripte und Kommentare erfolgen.

**Synchronisation und Sprachversionen**
Ihre Anforderung bez�glich "brauchbarer" Synchronisation ist sehr spezifisch und wichtig, um die Qualit�t der Lernressourcen zu gew�hrleisten.
- **Sprachspuren (Audio Tracks)**: Die YouTube Data API bietet Informationen �ber verf�gbare Audiospuren f�r ein Video. Im `snippet` eines Videos gibt es ein Feld `defaultAudioLanguage`. Wichtiger ist jedoch das Feld `audioLanguage` in der `contentDetails` resource, das die Sprache der prim�ren Audiospur angibt.
- **Manuelle vs. KI-Synchronisation**: Die API selbst bietet **keinen direkten Indikator**, der explizit zwischen manuell erstellten Synchronisationen (mit echten Synchronsprechern) und automatisch generierten (KI-basierten) Synchronisationen unterscheidet. YouTube hat Funktionen f�r mehrsprachige Audiospuren eingef�hrt, die es Erstellern erm�glichen, manuell hochgeladene Audiospuren in verschiedenen Sprachen anzubieten. Wenn ein Video mehrere Audiospuren hat, k�nnen Sie diese �ber die API abrufen. Die Herausforderung besteht darin, die Qualit�t oder die Art der Erstellung dieser Spuren zu beurteilen.
- **Indikatoren f�r manuelle Synchronisation**:
  - **Vorhandensein mehrerer Audiospuren**: Wenn ein Video mehrere Audiospuren in verschiedenen Sprachen anbietet, ist dies ein starker Hinweis darauf, dass der Kanalbetreiber bewusst in die Lokalisierung investiert hat, was oft manuelle Synchronisation bedeutet.
  - **Kanalinformationen**: Manchmal bewerben Kan�le ihre mehrsprachigen Angebote explizit in ihrer Kanalbeschreibung oder in den Videobeschreibungen. Diese Informationen k�nnten Sie �ber die `channels` resource abrufen.
  - **Community-Feedback**: Kommentare k�nnten Hinweise auf die Qualit�t der Synchronisation geben.
  - **Sprachcodes**: Die API liefert die Sprachcodes der verf�gbaren Audiospuren. Sie k�nnten diese Codes in Ihrer Datenbank speichern.
**Fazit zur Synchronisation**: Sie k�nnen feststellen, welche Sprachen als Audiospuren verf�gbar sind. Eine direkte Unterscheidung zwischen manueller und KI-Synchronisation ist �ber die API nicht m�glich. Sie m�ssten indirekte Methoden anwenden oder eine manuelle �berpr�fung in Betracht ziehen, um die "Brauchbarkeit" zu beurteilen.

**Weitere relevante Informationen aus der YouTube Data API**
Neben Ihren spezifischen Fragen gibt es noch weitere Datenpunkte, die f�r Ihr Projekt von gro�em Wert sein k�nnten:
**F�r Videos (`videos` resource):**
- **Ver�ffentlichungsdatum (`snippet.publishedAt`)**: Wichtig f�r `created` und `updated` in Ihrer `t_source.csv`.
- **Dauer (`contentDetails.duration`)**: N�tzlich, um die L�nge einer Ressource zu beurteilen.
- **Sprache des Videos (`snippet.defaultAudioLanguage`)**: Die prim�re Sprache des Videos.
- **Miniaturbilder (`snippet.thumbnails`)**: URLs zu verschiedenen Gr��en von Vorschaubildern.
- **Statistiken (`statistics`)**: Aufrufe, Likes, Dislikes (falls sichtbar), Kommentare � k�nnen die Popularit�t und Relevanz eines Videos anzeigen.
- **Tags (`snippet.tags`)**: Vom Uploader vergebene Schlagw�rter, die zus�tzliche Kontextinformationen liefern k�nnen.
- **Live-Broadcast-Status (`snippet.liveBroadcastContent`)**: Zeigt an, ob es sich um einen Live-Stream, einen bevorstehenden Stream oder ein normales Video handelt.

**F�r Playlists (`playlists` resource):**
- **Titel und Beschreibung (`snippet.title`, `snippet.description`)**: F�r die Benennung und Beschreibung der Playlist in Ihrem System.
- **Kanal-ID und Kanal-Titel (`snippet.channelId`, `snippet.channelTitle`)**: Um die Playlist dem richtigen Kanal zuzuordnen.
- **Ver�ffentlichungsdatum (`snippet.publishedAt`)**: Wann die Playlist erstellt wurde.
- **Anzahl der Videos in der Playlist (`contentDetails.itemCount`)**: Wichtig, um die Gr��e eines "Kurses" zu beurteilen.

**F�r Playlist-Items (`playlistItems` resource):**
- **Video-ID (`snippet.resourceId.videoId`)**: Die ID des Videos innerhalb der Playlist, um die Reihenfolge und die einzelnen Videos abzurufen.
- **Position in der Playlist (`snippet.position`)**: Die Reihenfolge der Videos innerhalb der Playlist.

**F�r Kan�le (`channels` resource):**
- **Kanal-Titel und Beschreibung (`snippet.title`, `snippet.description`)**: F�r Ihre `t_source_author.csv`.
- **Kanal-URL**: Kann aus der `channelId` konstruiert werden.
- **Statistiken (`statistics`)**: Abonnentenzahl, Aufrufe, Videoanzahl � Indikatoren f�r die Gr��e und Aktivit�t des Kanals.
- **Themen-Details (`topicDetails`)**: Manchmal sind hier breitere Themenkategorien hinterlegt, die der Kanal abdeckt.

**Empfohlene Vorgehensweise**
1. **Kan�le identifizieren**: Beginnen Sie mit den `sauthorIDs` aus Ihrer `t_source_author.csv`.
2. **Playlists abrufen**: Nutzen Sie die `channels.list` Methode mit dem Parameter `forUsername` oder `id` (falls Sie die Kanal-ID haben) und dem `part`-Parameter `contentDetails`, um die `uploads` Playlist-ID des Kanals zu erhalten. Dann verwenden Sie `playlists.list` mit der `channelId`, um alle �ffentlichen Playlists des Kanals abzurufen.
3. **Playlist-Inhalte abrufen**: F�r jede Playlist verwenden Sie `playlistItems.list`, um alle Videos in der Playlist in der richtigen Reihenfolge zu erhalten.
   - Hinweis: playlistItems.snippet.position definiert die Reihenfolge des Items in der Playlist (0-basiert). Quelle: https://developers.google.com/youtube/v3/docs/playlistItems
4. **Video-Details abrufen**: F�r jedes einzelne Video (sowohl aus Playlists als auch aus Ihrer `t_source.csv`) verwenden Sie `videos.list`, um alle relevanten `snippet, contentDetails, statistics und topicDetails` zu erhalten.
5. **Untertitel pr�fen**: Nutzen Sie `captions.list` f�r jedes Video, um zu sehen, welche Untertitelspuren verf�gbar sind.
6. **Kommentare abrufen**: F�r Videos, bei denen keine Transkripte verf�gbar sind, verwenden Sie `commentThreads.list` mit `order=relevance` und `maxResults` (z.B. 5), um die Top-Kommentare zu erhalten.

Durch die Nutzung dieser API-Endpunkte k�nnen Sie eine sehr reichhaltige Datenbank an Informationen aufbauen, die Ihnen bei der Zuordnung von Ressourcen zu Ihren Kompetenzlevels und wissenschaftlichen Disziplinen helfen wird. Viel Erfolg bei Ihrem Projekt!
</answer1b>

```prompt2
Alles klar, das ist echt hilfreich f�r die Planung. Aber ich br�uchte noch eine wichtige Info: Wie stark beeinflussen die verschiedenen Parameter das API-Quota? Gibt's da irgendwelche Mengenrabatte, die wir ber�cksichtigen m�ssen? Oder kommen manche Parameter in Gruppen? Wenn zum Beispiel Titel, Videobeschreibung und andere Parameter in Gruppen kommen. Mich w�rde zum Beispiel die Videobeschreibung nur so m��ig interessieren, wenn's um die Erstellung eines Abstracts geht. Wenn die Videobeschreibung alleinstehend in diesem Fall das Quote beeinflusst, w�rde ich sie nicht anfragen. Wenn sie aber automatisch im selben Paket wie der Videotitel kommt und es im Endeffekt keine Auswirkungen auf das Quote h�tte, wenn ich die Videobeschreibung weglassen w�rde, w�rde ich sie nat�rlich ebenfalls mitverwerten wollen. Das ist nat�rlich nur ein hypothetisches Szenario. In der Praxis w�rde ich die Videobeschreibung nat�rlich immer auch mit einbeziehen wollen in die Informationen f�r die Erstellung des Abstracts. Bitte gib mir zu �berlegungen wie diesen so viele potentiell relevante Informationen wie m�glich.
```

<antwort2>
Gerne helfe ich Ihnen dabei, die Auswirkungen der verschiedenen Parameter auf Ihr API-Quota f�r die YouTube Data API zu verstehen. Das ist eine sehr wichtige �berlegung f�r die effiziente Nutzung der API.

Die YouTube Data API verwendet ein **punktbasiertes Quota-System**. Jede Anfrage an die API verbraucht eine bestimmte Anzahl von "Quota-Einheiten". Die Kosten einer Anfrage h�ngen haupts�chlich von der Art der Ressource ab, die Sie anfragen, und den `part`-Parametern, die Sie in Ihrer Anfrage angeben.

**Der `part`-Parameter und seine Auswirkungen auf das Quota**
Der Schl�ssel zum Verst�ndnis der Quota-Kosten liegt im `part`-Parameter. Wenn Sie eine Anfrage an die YouTube Data API stellen (z.B. f�r Videos, Kan�le oder Playlists), m�ssen Sie immer den `part`-Parameter angeben. Dieser Parameter teilt der API mit, welche Teile der Ressource Sie zur�ckgegeben haben m�chten.
- **Gruppierung von Daten**: Die Daten einer Ressource sind in logische Gruppen unterteilt, die als "Parts" bezeichnet werden. Beispiele f�r solche Parts sind `snippet`, `contentDetails`, `statistics`, `topicDetails` und `status`.
- **Quota-Kosten pro Part**: Jedes Mal, wenn Sie einen `part` in Ihrer Anfrage angeben, erh�ht dies die Quota-Kosten der Anfrage. Die Kosten sind in der Regel f�r jeden Part gleich, aber es gibt Ausnahmen.
- **Beispiel Video-Ressource**:
  - Wenn Sie nur den `snippet`-Part anfordern (z.B. `part=snippet`), erhalten Sie Informationen wie Titel, Beschreibung, Ver�ffentlichungsdatum, Kanal-ID und Thumbnails. Dies kostet eine bestimmte Anzahl von Quota-Einheiten (z.B. 2 Einheiten f�r eine `videos.list`-Anfrage mit `snippet`).
  - Wenn Sie zus�tzlich den `contentDetails`-Part anfordern (z.B. `part=snippet,contentDetails`), erhalten Sie zus�tzlich Informationen wie die Videodauer und den L�ndercode. Die Quota-Kosten erh�hen sich entsprechend (z.B. auf 4 Einheiten).
  - Wenn Sie `part=snippet,contentDetails,statistics,topicDetails` anfordern, zahlen Sie f�r jeden dieser Parts.
**Wichtiger Punkt zu Ihrer �berlegung bez�glich Titel und Beschreibung:** Der Videotitel (`snippet.title`) und die Videobeschreibung (`snippet.description`) sind beide Teil des `snippet`-Parts. Das bedeutet:
- Wenn Sie den `snippet`-Part anfordern, erhalten Sie automatisch sowohl den Titel als auch die Beschreibung (und andere `snippet`-Informationen) in einem einzigen Abruf.
- Es gibt **keine M�glichkeit**, nur den Titel anzufordern, ohne die Beschreibung (oder umgekehrt), wenn Sie den `snippet`-Part verwenden.
- Die Quota-Kosten f�r den `snippet`-Part bleiben gleich, egal ob Sie alle darin enthaltenen Felder nutzen oder nur einige davon.

Daher ist es in Ihrem hypothetischen Szenario so, dass das Weglassen der Videobeschreibung, wenn Sie bereits den `snippet`-Part angefordert haben, **keine Auswirkungen auf die Quota-Kosten h�tte**. Sie w�rden die Informationen ohnehin erhalten. Es ist also absolut sinnvoll, alle relevanten Informationen aus dem `snippet`-Part f�r Ihr Abstract zu nutzen.

**Allgemeine Quota-Kosten f�r g�ngige Anfragen (Beispiele)**
Die genauen Quota-Kosten k�nnen sich �ndern, aber hier sind typische Werte, die Ihnen eine Vorstellung geben:
- **`search.list`**: Diese Methode ist oft die teuerste, da sie eine Suche �ber viele Ressourcen durchf�hrt. Eine `search.list`-Anfrage kostet typischerweise **100 Quota-Einheiten**.
- **`videos.list` (mit id)**: Wenn Sie spezifische Videos anhand ihrer IDs abrufen, sind die Kosten pro Part geringer. Eine Anfrage mit `part=snippet` kostet oft **2 Quota-Einheiten**. Jedes weitere Part (z.B. `contentDetails`, `statistics`) erh�ht die Kosten um weitere 2 Einheiten.
- **`channels.list` (mit id)**: �hnlich wie bei Videos, kostet eine Anfrage mit `part=snippet` typischerweise **2 Quota-Einheiten**.
- **`playlists.list` (mit channelId)**: Eine Anfrage mit `part=snippet` kostet typischerweise **2 Quota-Einheiten**.
- **`playlistItems.list` (mit playlistId)**: Eine Anfrage mit `part=snippet` kostet typischerweise **2 Quota-Einheiten**.
- **`commentThreads.list`**: Eine Anfrage kostet typischerweise **2 Quota-Einheiten**.
- **`captions.list`**: Eine Anfrage kostet typischerweise **2 Quota-Einheiten**.

**Mengenrabatte oder "Batching"**
Es gibt keine direkten "Mengenrabatte" im Sinne von geringeren Kosten pro Einheit, wenn Sie mehr anfragen. Allerdings gibt es eine wichtige Optimierungsm�glichkeit:
- **Batch-Anfragen**: Sie k�nnen mehrere API-Anfragen in einer einzigen HTTP-Anfrage b�ndeln (Batching). Dies kann die Netzwerklatenz reduzieren, hat aber **keine Auswirkungen auf die Quota-Kosten**. Jede einzelne Anfrage innerhalb des Batches wird separat f�r das Quota berechnet.
- **Abrufen mehrerer IDs in einer Anfrage**: F�r Methoden wie `videos.list`, `channels.list` oder `playlists.list` k�nnen Sie **mehrere IDs in einem einzigen Aufruf** �ber den `id`-Parameter angeben (bis zu 50 IDs pro Anfrage). Dies ist sehr effizient, da die Quota-Kosten f�r eine solche Anfrage gleich bleiben, als ob Sie nur eine ID angefragt h�tten (z.B. 2 Quota-Einheiten f�r 50 Videos mit `part=snippet`). Dies ist der wichtigste "Mengenrabatt", den Sie nutzen k�nnen.

**Empfehlungen f�r Ihr Projekt zur Quota-Optimierung**
1. **Seien Sie spezifisch mit part-Parametern**: Fordern Sie nur die Parts an, die Sie wirklich ben�tigen. Wenn Sie beispielsweise keine Statistiken (Aufrufe, Likes) ben�tigen, lassen Sie `statistics` weg.
2. **Nutzen Sie den `id`-Parameter f�r Listenanfragen**: Wenn Sie die IDs von Videos, Kan�len oder Playlists haben, b�ndeln Sie so viele wie m�glich (bis zu 50) in einer einzigen `list`-Anfrage. Dies ist der effizienteste Weg, um Daten abzurufen.
3. **Vermeiden Sie `search.list` f�r bekannte IDs**: Die `search.list`-Methode ist teuer. Wenn Sie bereits die IDs der Videos, Kan�le oder Playlists kennen, verwenden Sie stattdessen die spezifischen `videos.list`, `channels.list` oder `playlists.list`-Methoden.
4. **Caching**: Implementieren Sie ein robustes Caching-System. Speichern Sie die abgerufenen Daten in Ihrer eigenen Datenbank, um redundante API-Anfragen zu vermeiden. Aktualisieren Sie die Daten nur, wenn sie sich voraussichtlich ge�ndert haben oder nach einer bestimmten Zeitspanne.
5. **Fehlerbehandlung und Wiederholungsversuche**: Implementieren Sie eine Strategie f�r exponentielles Backoff bei API-Fehlern (insbesondere bei Quota-�berschreitungen), um Ihr Quota nicht unn�tig zu belasten.

Indem Sie diese Punkte ber�cksichtigen, k�nnen Sie Ihre API-Nutzung optimieren und sicherstellen, dass Sie Ihr t�gliches Quota so effizient wie m�glich einsetzen.
</antwort2>

#### Resource representation

##### `channels` resource
The following JSON structure shows the format of a `channels` resource:
```json
{
  "kind": "youtube#channel",
  "etag": etag,
  "id": string,
  "snippet": {
    "title": string,
    "description": string,
    "customUrl": string,
    "publishedAt": datetime,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "defaultLanguage": string,
    "localized": {
      "title": string,
      "description": string
    },
    "country": string
  },
  "contentDetails": {
    "relatedPlaylists": {
      "likes": string,
      "favorites": string,
      "uploads": string
    }
  },
  "statistics": {
    "viewCount": unsigned long,
    "subscriberCount": unsigned long,  // this value is rounded to three significant figures
    "hiddenSubscriberCount": boolean,
    "videoCount": unsigned long
  },
  "topicDetails": {
    "topicIds": [
      string
    ],
    "topicCategories": [
      string
    ]
  },
  "status": {
    "privacyStatus": string,
    "isLinked": boolean,
    "longUploadsStatus": string,
    "madeForKids": boolean,
    "selfDeclaredMadeForKids": boolean
  },
  "brandingSettings": {
    "channel": {
      "title": string,
      "description": string,
      "keywords": string,
      "trackingAnalyticsAccountId": string,
      "unsubscribedTrailer": string,
      "defaultLanguage": string,
      "country": string
    },
    "watch": {
      "textColor": string,
      "backgroundColor": string,
      "featuredPlaylistId": string
    }
  },
  "auditDetails": {
    "overallGoodStanding": boolean,
    "communityGuidelinesGoodStanding": boolean,
    "copyrightStrikesGoodStanding": boolean,
    "contentIdClaimsGoodStanding": boolean
  },
  "contentOwnerDetails": {
    "contentOwner": string,
    "timeLinked": datetime
  },
  "localizations": {
    (key): {
      "title": string,
      "description": string
    }
  }
}
```

Explanations of the Properties: [developers.google.com/youtube/v3/docs/channels](https://developers.google.com/youtube/v3/docs/channels)

Important for us:
###### Atomic parameters (no parts)
- Required: `id`, `snippet.title`, `snippet.description`, `snippet.customUrl`, `snippet.publishedAt`, `snippet.thumbnails`, `contentDetails.relatedPlaylists.uploads`
- Relevant: `snippet.defaultLanguage`, `snippet.localized.title`, `snippet.localized.description`, `snippet.country`, `statistics.videoCount`, `statistics.subscriberCount`, `statistics.viewCount`
- Maybe/indirect: `topicDetails.topicCategories`, `topicDetails.topicIds`, `status.madeForKids`, `status.selfDeclaredMadeForKids`, `brandingSettings.channel.keywords`

###### Parts / quota grouping
- `snippet`: must-have; channel name, description, URL handle, thumbnails (?), and language metadata
- `contentDetails`: must-have; uploads playlist id is required for full video list
- `statistics`: likely; popularity/quality heuristics for ranking
- `topicDetails`: optional; coarse domain hints only
- `status`, `brandingSettings`, `localizations`: optional; use if language coverage or channel keywords matter

###### Fact check / corrections
- `contentDetails.relatedPlaylists.uploads` only points to the uploads playlist, not the full set of channel playlists. To list all playlists for a channel, use `playlists.list` with `channelId`.
- There is no separate "courses" resource in the Data API. Courses are typically regular playlists (or external YouTube UI groupings), so `topicDetails` does not expose "course" IDs.
- `snippet.localized` returns one localized title/description based on the `hl` request parameter. The `localizations` part is a map of translated metadata (if provided by the owner), not audio tracks.
- Channel-level `statistics` are not useful for per-video ranking.

###### Final Parts / quota grouping selection
- Parts to request: `snippet`, `contentDetails`
- Store fields (channels.csv): `channel_id`, `title`, `description`, `custom_url`, `published_at`, `default_language`, `country`, `uploads_playlist_id`
- CSV plan:
  - `youtube/channels.csv`: `channel_id`, `title`, `description`, `custom_url`, `published_at`, `default_language`, `country`, `uploads_playlist_id`
  - `youtube/channels_local.csv` (optional, only if `localizations` is enabled later): `channel_id`, `language_code`, `title`, `description`

###### CSV line breaks (global note)
- CSV supports line breaks inside fields as long as the field is properly quoted (RFC 4180 style). The Python `csv` writer already emits correct quoting, so keep raw line breaks.
- Do not parse CSV with `splitlines()` or a naive line-based parser. Always use a CSV parser that understands quoted multiline fields.
- Only consider line-break substitution if a downstream tool cannot handle quoted multiline fields; otherwise keep the original text to preserve meaning.




##### `videos` resource
The following JSON structure shows the format of a `videos` resource:
```json
{
  "kind": "youtube#video",
  "etag": etag,
  "id": string,
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "tags": [
      string
    ],
    "categoryId": string,
    "liveBroadcastContent": string,
    "defaultLanguage": string,
    "localized": {
      "title": string,
      "description": string
    },
    "defaultAudioLanguage": string
  },
  "contentDetails": {
    "duration": string,
    "dimension": string,
    "definition": string,
    "caption": string,
    "licensedContent": boolean,
    "regionRestriction": {
      "allowed": [
        string
      ],
      "blocked": [
        string
      ]
    },
    "contentRating": {
      "acbRating": string,
      "agcomRating": string,
      "anatelRating": string,
      "bbfcRating": string,
      "bfvcRating": string,
      "bmukkRating": string,
      "catvRating": string,
      "catvfrRating": string,
      "cbfcRating": string,
      "cccRating": string,
      "cceRating": string,
      "chfilmRating": string,
      "chvrsRating": string,
      "cicfRating": string,
      "cnaRating": string,
      "cncRating": string,
      "csaRating": string,
      "cscfRating": string,
      "czfilmRating": string,
      "djctqRating": string,
      "djctqRatingReasons": [,
        string
      ],
      "ecbmctRating": string,
      "eefilmRating": string,
      "egfilmRating": string,
      "eirinRating": string,
      "fcbmRating": string,
      "fcoRating": string,
      "fmocRating": string,
      "fpbRating": string,
      "fpbRatingReasons": [,
        string
      ],
      "fskRating": string,
      "grfilmRating": string,
      "icaaRating": string,
      "ifcoRating": string,
      "ilfilmRating": string,
      "incaaRating": string,
      "kfcbRating": string,
      "kijkwijzerRating": string,
      "kmrbRating": string,
      "lsfRating": string,
      "mccaaRating": string,
      "mccypRating": string,
      "mcstRating": string,
      "mdaRating": string,
      "medietilsynetRating": string,
      "mekuRating": string,
      "mibacRating": string,
      "mocRating": string,
      "moctwRating": string,
      "mpaaRating": string,
      "mpaatRating": string,
      "mtrcbRating": string,
      "nbcRating": string,
      "nbcplRating": string,
      "nfrcRating": string,
      "nfvcbRating": string,
      "nkclvRating": string,
      "oflcRating": string,
      "pefilmRating": string,
      "rcnofRating": string,
      "resorteviolenciaRating": string,
      "rtcRating": string,
      "rteRating": string,
      "russiaRating": string,
      "skfilmRating": string,
      "smaisRating": string,
      "smsaRating": string,
      "tvpgRating": string,
      "ytRating": string
    },
    "projection": string,
    "hasCustomThumbnail": boolean
  },
  "status": {
    "uploadStatus": string,
    "failureReason": string,
    "rejectionReason": string,
    "privacyStatus": string,
    "publishAt": datetime,
    "license": string,
    "embeddable": boolean,
    "publicStatsViewable": boolean,
    "madeForKids": boolean,
    "selfDeclaredMadeForKids": boolean,
    "containsSyntheticMedia": boolean
  },
  "statistics": {
    "viewCount": string,
    "likeCount": string,
    "dislikeCount": string,
    "favoriteCount": string,
    "commentCount": string
  },
  "paidProductPlacementDetails": {
    "hasPaidProductPlacement": boolean
  },
  "player": {
    "embedHtml": string,
    "embedHeight": long,
    "embedWidth": long
  },
  "topicDetails": {
    "topicIds": [
      string
    ],
    "relevantTopicIds": [
      string
    ],
    "topicCategories": [
      string
    ]
  },
  "recordingDetails": {
    "recordingDate": datetime
  },
  "fileDetails": {
    "fileName": string,
    "fileSize": unsigned long,
    "fileType": string,
    "container": string,
    "videoStreams": [
      {
        "widthPixels": unsigned integer,
        "heightPixels": unsigned integer,
        "frameRateFps": double,
        "aspectRatio": double,
        "codec": string,
        "bitrateBps": unsigned long,
        "rotation": string,
        "vendor": string
      }
    ],
    "audioStreams": [
      {
        "channelCount": unsigned integer,
        "codec": string,
        "bitrateBps": unsigned long,
        "vendor": string
      }
    ],
    "durationMs": unsigned long,
    "bitrateBps": unsigned long,
    "creationTime": string
  },
  "processingDetails": {
    "processingStatus": string,
    "processingProgress": {
      "partsTotal": unsigned long,
      "partsProcessed": unsigned long,
      "timeLeftMs": unsigned long
    },
    "processingFailureReason": string,
    "fileDetailsAvailability": string,
    "processingIssuesAvailability": string,
    "tagSuggestionsAvailability": string,
    "editorSuggestionsAvailability": string,
    "thumbnailsAvailability": string
  },
  "suggestions": {
    "processingErrors": [
      string
    ],
    "processingWarnings": [
      string
    ],
    "processingHints": [
      string
    ],
    "tagSuggestions": [
      {
        "tag": string,
        "categoryRestricts": [
          string
        ]
      }
    ],
    "editorSuggestions": [
      string
    ]
  },
  "liveStreamingDetails": {
    "actualStartTime": datetime,
    "actualEndTime": datetime,
    "scheduledStartTime": datetime,
    "scheduledEndTime": datetime,
    "concurrentViewers": unsigned long,
    "activeLiveChatId": string
  },
  "localizations": {
    (key): {
      "title": string,
      "description": string
    }
  }
}
```

Explanations of the Properties: [developers.google.com/youtube/v3/docs/videos](https://developers.google.com/youtube/v3/docs/videos)

Important for us:
- `videos.id`

###### Atomic parameters (no parts)
- Required: `id`, `snippet.channelId`, `snippet.title`, `snippet.description`, `snippet.publishedAt`, `snippet.categoryId`, `contentDetails.duration`, `contentDetails.caption`, `statistics.viewCount`, `statistics.likeCount`, `statistics.commentCount`
- Relevant for abstract: `snippet.tags`, `snippet.localized.title`, `snippet.localized.description`, `topicDetails.topicCategories`, `topicDetails.topicIds`, `snippet.channelTitle`
- Relevant for language defaults (not audio track lists): `snippet.defaultLanguage`, `snippet.defaultAudioLanguage`, `localizations.*.title`, `localizations.*.description`, `contentDetails.caption`
- Maybe/indirect: `status.license`, `status.embeddable`, `status.madeForKids`, `status.selfDeclaredMadeForKids`, `status.containsSyntheticMedia`, `contentDetails.regionRestriction.allowed`, `contentDetails.regionRestriction.blocked`, `contentDetails.definition`, `contentDetails.dimension`, `statistics.favoriteCount`
- Likely skip for now: `fileDetails`, `processingDetails`, `suggestions`, `player`, `paidProductPlacementDetails`, `liveStreamingDetails` (unless live content becomes in-scope)

Note: there is no direct "audio track list" here. Language metadata (`defaultAudioLanguage`, `defaultLanguage`, `localizations`) and `caption` are hints only; detecting manual dubs likely needs `captions.list` + heuristics outside this resource.

###### Parts / quota grouping
- `snippet`: must-have; title/description/tags/category/channel/language are core for abstract + indexing
- `contentDetails`: must-have; duration + caption flag + region restrictions
- `statistics`: likely; ranking/quality weighting (like ratio, popularity)
- `topicDetails`: optional; broad taxonomy hints
- `status`: optional; filter non-embeddable/kids/synthetic media
- `localizations`: optional; localized title/description coverage
- Others (`fileDetails`, `processingDetails`, `suggestions`, `player`, `liveStreamingDetails`, `paidProductPlacementDetails`): skip unless later use-case

###### Fact check / corrections
- `videos.id` is the video ID used in URLs like `https://www.youtube.com/watch?v=VIDEO_ID` and `https://youtu.be/VIDEO_ID`.
- `statistics.dislikeCount` is private and only returned when the request is authenticated by the video owner. Do not rely on it for public channels.
- `snippet.localized` returns one localized title/description based on the `hl` parameter. The `localizations` part provides a map of translated metadata, if the owner provided it.
- `localizations` is metadata only; it does not indicate available audio tracks or dubbing.
- `localizations` can be empty for most videos; do not treat it as a complete language list.
- `contentDetails.caption` only indicates if captions exist, not their language or whether they are manual vs auto-generated.
- Caption track metadata requires OAuth (`youtube.force-ssl`). For non-owned videos this may be restricted; plan a test call before depending on it.
- The Data API does not expose an explicit Shorts/long-form flag. The most reliable public heuristic is duration (`contentDetails.duration`), with YouTube Shorts defined as short-form videos up to 3 minutes (see [YouTube Help](https://support.google.com/youtube/answer/10059070)).
- Thumbnail sizes (`snippet.thumbnails.*.width/height`) describe the preview image renditions, not the video aspect ratio. Sizes can be missing (e.g., `maxres`), so use thumbnail ratios only as a weak heuristic.
- The actual frame dimensions (`fileDetails.videoStreams.widthPixels/heightPixels`) require `fileDetails` and are typically restricted to the video owner (OAuth). Avoid relying on them for public channels.

###### Final Parts / quota grouping selection
- Parts to request: `snippet`, `contentDetails`, `statistics`
- Store fields (videos.csv): `video_id`, `channel_id`, `channel_title`, `title`, `description`, `published_at`, `category_id`, `tags`, `duration`, `caption_available`, `default_language`, `default_audio_language`, `view_count`, `like_count`, `comment_count`
- CSV plan:
  - `youtube/videos.csv`: `video_id`, `channel_id`, `channel_title`, `title`, `description`, `published_at`, `category_id`, `tags`, `duration`, `caption_available`, `default_language`, `default_audio_language`, `view_count`, `like_count`, `comment_count`
  - `youtube/videos_local.csv` (optional, only if `localizations` is enabled later): `video_id`, `language_code`, `title`, `description`


##### `videoCategories` resource
The following JSON structure shows the format of a `videoCategories` resource:
```json
{
  "kind": "youtube#videoCategory",
  "etag": etag,
  "id": string,
  "snippet": {
    "channelId": "UCBR8-60-B28hp2BmDPdntcQ",
    "title": string,
    "assignable": boolean
  }
}
```

Explanations of the Properties: [developers.google.com/youtube/v3/docs/videoCategories](https://developers.google.com/youtube/v3/docs/videoCategories)

Important for us:
###### Atomic parameters (no parts)
- Required: `id`, `snippet.title`, `snippet.assignable`
- Maybe/indirect: `snippet.channelId` (fixed to YouTube system channel; not needed)

###### Parts / quota grouping
- `snippet`: cheap and sufficient; use as coarse filter and label source

###### Fact check / corrections
- The video category is a single ID per video (`snippet.categoryId`). There is no multi-category assignment via the API.

###### Final Parts / quota grouping selection
- Parts to request: none (use the static snapshot)
- Store fields (videoCategories.csv): `category_id`, `title`, `assignable`
- CSV plan:
  - `youtube/videoCategories.csv`: `category_id`, `title`, `assignable`


##### `comments` resource
The following JSON structure shows the format of a `comments` resource:
```json
{
  "kind": "youtube#comment",
  "etag": etag,
  "id": string,
  "snippet": {
    "authorDisplayName": string,
    "authorProfileImageUrl": string,
    "authorChannelUrl": string,
    "authorChannelId": {
      "value": string
    },
    "channelId": string,
    "textDisplay": string,
    "textOriginal": string,
    "parentId": string,
    "canRate": boolean,
    "viewerRating": string,
    "likeCount": unsigned integer,
    "moderationStatus": string,
    "publishedAt": datetime,
    "updatedAt": datetime
  }
}
```

Important for us:
###### Atomic parameters (no parts)
- Required (if used as abstract fallback): `id`, `snippet.textOriginal`, `snippet.likeCount`, `snippet.publishedAt`
- Relevant: `snippet.authorDisplayName`, `snippet.authorChannelId.value`, `snippet.parentId` (filter replies), `snippet.updatedAt`
- Maybe/indirect: `snippet.textDisplay`, `snippet.authorProfileImageUrl`, `snippet.canRate`, `snippet.viewerRating`

###### Parts / quota grouping
- `snippet`: only part needed; fetch only when video description is below the chosen length threshold

###### Fact check / corrections
- The list endpoint for top-level comments is `commentThreads.list` (not `comments.list`). `comments.list` is for fetching by comment IDs.
- There is no public dislike count for comments; only `likeCount` is available.
- `textDisplay` contains HTML; prefer `textOriginal` for clean text.

###### Final Parts / quota grouping selection
- Parts to request: `snippet` (via `commentThreads.list`)
- Store fields (comments.csv): `video_id`, `comment_id`, `text_original`, `like_count`, `published_at`, `updated_at`
- CSV plan:
  - `youtube/comments.csv`: one row per top comment (store `video_id` and comment metadata; aggregate to arrays later if needed)


##### `playlists` resource
The following JSON structure shows the format of a `playlists` resource:
```json
{
  "kind": "youtube#playlist",
  "etag": etag,
  "id": string,
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "defaultLanguage": string,
    "localized": {
      "title": string,
      "description": string
    }
  },
  "status": {
    "privacyStatus": string,
    "podcastStatus": enum
  },
  "contentDetails": {
    "itemCount": unsigned integer
  },
  "player": {
    "embedHtml": string
  },
  "localizations": {
    (key): {
      "title": string,
      "description": string
    }
  }
}
```

Explanations of the Properties: [developers.google.com/youtube/v3/docs/playlists](https://developers.google.com/youtube/v3/docs/playlists)

Important for us:
###### Atomic parameters (no parts)
- Required: `id`, `snippet.title`, `snippet.description`, `snippet.channelId`, `snippet.publishedAt`, `contentDetails.itemCount`
- Relevant: `snippet.thumbnails`, `snippet.defaultLanguage`, `snippet.localized.title`, `snippet.localized.description`, `snippet.channelTitle`
- Maybe/indirect: `status.privacyStatus` (filter), `status.podcastStatus`, `localizations.*.title`, `localizations.*.description`

###### Parts / quota grouping
- `snippet`: must-have; titles/descriptions and thumbnails
- `contentDetails`: must-have; size of the playlist/course
- `status`: optional; filter private/unlisted items if needed
- `localizations`: optional; multi-language metadata coverage
- `player`: skip unless embed HTML is required

###### Fact check / corrections
- `snippet.localized` returns one localized title/description based on `hl`. The `localizations` part contains the full map of translated metadata, if provided by the owner.
- `localizations` can be empty for many playlists; do not treat it as a complete language list.
- Playlists are the only grouping concept exposed by the API. "Courses" are playlists or UI groupings and are not a separate resource.
- `contentDetails.itemCount` is cheap and avoids a count query; keep it even if you later fetch all items.

###### Final Parts / quota grouping selection
- Parts to request: `snippet`, `contentDetails`
- Store fields (playlists.csv): `playlist_id`, `channel_id`, `channel_title`, `title`, `description`, `published_at`, `item_count`, `default_language`
- CSV plan:
  - `youtube/playlists.csv`: `playlist_id`, `channel_id`, `channel_title`, `title`, `description`, `published_at`, `item_count`, `default_language`
  - `youtube/playlists_local.csv` (optional, only if `localizations` is enabled later): `playlist_id`, `language_code`, `title`, `description`

##### `playlistItems` resource
The following JSON structure shows the format of a `playlistItems` resource:
```json
{
  "kind": "youtube#playlistItem",
  "etag": etag,
  "id": string,
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "videoOwnerChannelTitle": string,
    "videoOwnerChannelId": string,
    "playlistId": string,
    "position": unsigned integer,
    "resourceId": {
      "kind": string,
      "videoId": string,
    }
  },
  "contentDetails": {
    "videoId": string,
    "startAt": string,
    "endAt": string,
    "note": string,
    "videoPublishedAt": datetime
  },
  "status": {
    "privacyStatus": string
  }
}
```

Explanations of the Properties: [developers.google.com/youtube/v3/docs/playlistItems](https://developers.google.com/youtube/v3/docs/playlistItems)

Important for us:
###### Atomic parameters (no parts)
- Required: `snippet.playlistId`, `snippet.position`, `snippet.resourceId.videoId`
- Relevant: `snippet.videoOwnerChannelTitle`, `snippet.videoOwnerChannelId`
- Maybe/indirect: `snippet.title`, `snippet.description` (use if video metadata is missing), `status.privacyStatus` (filter)

###### Parts / quota grouping
- `snippet`: must-have; playlist linkage, order, video id
- `contentDetails`: must-have; video publish date + optional segment notes
- `status`: optional; hide unavailable videos

###### Fact check / corrections
- `contentDetails.startAt` and `contentDetails.endAt` are deprecated and ignored by the API.
- `contentDetails.videoId` is redundant with `snippet.resourceId.videoId`.
- `contentDetails.note` exists but is rarely used; skip for now.

###### Final Parts / quota grouping selection
- Parts to request: `snippet`
- Store fields (playlistItems.csv): `playlist_item_id`, `playlist_id`, `position`, `video_id`, `video_owner_channel_id`, `video_owner_channel_title`
- CSV plan:
  - `youtube/playlistItems.csv`: `playlist_item_id`, `playlist_id`, `position`, `video_id`, `video_owner_channel_id`, `video_owner_channel_title`

##### `search` resource
The following JSON structure shows the format of a search result:
```json
{
  "kind": "youtube#searchResult",
  "etag": etag,
  "id": {
    "kind": string,
    "videoId": string,
    "channelId": string,
    "playlistId": string
  },
  "snippet": {
    "publishedAt": datetime,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key): {
        "url": string,
        "width": unsigned integer,
        "height": unsigned integer
      }
    },
    "channelTitle": string,
    "liveBroadcastContent": string
  }
}
```

Explanations of the Properties: [developers.google.com/youtube/v3/docs/search](https://developers.google.com/youtube/v3/docs/search)

Important for us:
###### Atomic parameters (no parts)
- Required (only if search is used for discovery): `id.kind`, `id.videoId`, `id.channelId`, `id.playlistId`, `snippet.title`, `snippet.description`, `snippet.channelTitle`, `snippet.publishedAt`
- Relevant: `snippet.thumbnails`, `snippet.channelId`, `snippet.liveBroadcastContent`
- Maybe/indirect: none

###### Parts / quota grouping
- `snippet`: only part available, but `search.list` is expensive; use only for initial discovery or when channel/video ids are unknown

###### Fact check / corrections
- `search.list` is quota-expensive and should be avoided when you already have `channelId`, `videoId`, or `playlistId`.

###### Final Parts / quota grouping selection
- Parts to request: none (skip for now)
- Store fields: none
- CSV plan: none

### Provisional Data Flow Description

**Bold: Active Steps**
Scope: `Schoolsystem2\backend\src\main\resources\*`

#### Topic-Related

**<https://en.wikipedia.org/wiki/Outline_of_academic_disciplines>**
=> **(Web Inspection Tool)** => **`\csv\topics\Disciplines_raw.md`**
`\csv\t_req_type.csv`
=> **`\scripts\topics\parse_disciplines.py`** => `\csv\topics\Disciplines_parsed.csv`
=> **`\scripts\topics\restructure_disciplines_csv.py`** [4] => `\csv\topics\Disciplines_restructured.csv`
**`\csv\topics\Disciplines_enrichment.csv`** [1]
**`\scripts\topics\sync_disciplines_enrichment.py`** => (Info about enrichment entries that need updating)
=> **`\scripts\topics\enrich_disciplines_csv.py`** => `\csv\topics\Disciplines_final.csv` [1]
[2]
`\csv\t_topic_type.csv`
**`\csv\topics\Achievements.csv`** [3]
=> **(TRANSLATION_SCRIPT)** => `\csv\topics\t_topic_PLANNING.csv` [1,3]
=> **(MANUAL_COPY_AFTER_VALIDATION)** => `\csv\t_topic.csv` [1,3]

##### Future TO-DO

[1] **`\csv\topics\Disciplines_enrichments_local.csv`** => ... => `\csv\topics\Disciplines_local.csv`
[2] Update **`\csv\topics\Branches.csv`** & integrate alongside Disciplines (low priority)
[3] **`\csv\topics\Achievements_local.csv`**
[1,3] => `\csv\topics\t_topic_local_PLANNING.csv` => ... => `\csv\t_topic_local.csv`
[4] Go though ALL Disciplines and Extend type Overrides accordingly

##### codex conversation
Trummler:
```bash
codex resume 019b6046-9a42-7481-bf0c-324837c01d94
```

#### Resource-Related

##### Compact Data Flow Description

**`\csv\youtube\_YouTube_Channels.csv`** (List of all Channels we'd like to feature)
**`\scripts\YouTube_Data\video_query.py`** (YouTube Data API)
=> `\csv\youtube\videoCategories.csv` (seed once from docs snapshot or API)
For each entry in `\csv\youtube\_YouTube_Channels.csv`:
  => `\csv\youtube\channels.csv` + `\csv\youtube\channels_local.csv`
  => `\csv\youtube\videos.csv` + `\csv\youtube\videos_local.csv`
  _`\csv\youtube\playlist_type.csv`_ (`/course` vs. non-`/course` playlist)
  **`\csv\youtube\_YouTube_Courses.txt`** (OPTIONAL; list of playlists to mark as courses)
  => `\csv\youtube\playlists.csv` + `\csv\youtube\playlists_local.csv`
    => `\csv\youtube\playlistItems.csv`

**`\scripts\YouTube_Data\audiotrack_query.py`**
For each entry in `\csv\youtube\videos.csv`:
=> `\csv\youtube\audiotracks.csv` (Will define the 'language versions' of the Resource later, when the Video becomes their own resource)

// POSTONED until a working solution for Video Transcripts has been found
**`\scripts\YouTube_Data\transcript_query.py`** [TEMPORARY*]
For each entry in `\csv\youtube\videos.csv`:
=> `\csv\youtube\videos_transcripts.csv` [TEMPORARY*]
> (*storing in limited quantities & for analysis only; Transcripts will later be called on-demand per Video in our `\scripts\video_to_source.py`)

// POSTONED until a working solution for Video Transcripts has been found
**`\scripts\video_to_source.py`** [PLANNED]
For each entry in `\csv\youtube\videos.csv`:
=> `\csv\youtube\t_source_PLANNING.csv` (new preparational Source entries for later manual import into `\csv\t_source.csv`)

##### More Detailed Data Flow Description

**Naming**
0) **Seed video categories**
=> `\csv\youtube\videoCategories.csv` (seed once from docs snapshot or API)

For each entry in **`\csv\youtube\_YouTube_Channels.csv`**:
1) **Channel bootstrap**
- If channel not yet present in `\csv\youtube\channels.csv`:
  => `\csv\youtube\channels.csv` + `\csv\youtube\channels_local.csv`
- track progress via a `last_updated` field in `channels.csv`.

2) **Videos (primary script, Data API)**
- Use the uploads playlist (`channels.contentDetails.relatedPlaylists.uploads`) and `playlistItems.list` pagination.
- Avoid date-filtered `search.list` because it is quota-expensive; use pagination and stop when known IDs are hit.
- New channel: paginate (newest-first) but store `videos.csv` sorted by `published_at` ascending.
- Known channel: fetch newest batches until the oldest video in a batch is already in `videos.csv`, then stop.
=> `\csv\youtube\videos.csv` + `\csv\youtube\videos_local.csv`

3) **Playlists (primary script, Data API)**
- Fetch all playlists (`playlists.list`).
- `playlists.snippet.publishedAt` is the creation time (not a last-updated timestamp), so change detection should compare title/description/itemCount (and local fields if present).
- If playlist is new or changed: refresh `playlistItems.csv` for that playlist.
=> `\csv\youtube\playlists.csv` + `\csv\youtube\playlists_local.csv`
=> `\csv\youtube\playlistItems.csv`

4) **Audio tracks (secondary script)**
- Run **`\scripts\YouTube_Data\audiotrack_query.py`** on `\csv\youtube\videos.csv`.
=> `\csv\youtube\audiotracks.csv` (used later to define language versions of resources).

**Audio tracks (open limitation)**
- The Data API does not expose a list of available audio tracks. Only `defaultAudioLanguage` is available, so multi-audio detection likely needs a non-Data-API approach.

5) **Transcripts & comments (postponed)**
// POSTONED until a working solution for Video Transcripts has been found
// "THRESHOLD" = Desired length of the video transcript; if the transcript is shorter, the rest will be supplemented with comments.
**`\scripts\video_to_source.py`** [PLANNED]
For each entry in `\csv\youtube\videos.csv`:
=> if `this.duration` < `MIN_DURATION` (e.g. 60s ~ 3min): discard the video.
  => `\csv\youtube\video_to_source_log.csv` (status: too short); Go to next Video.
=> `str this.transcript` = `get_transcript(this.video_id)`;
=> `str[] this.comments` = `this.transcript.length()` < [THRESHOLD] ? `get_comments(this.video_id)` : `[]` (Uses the YouTube Data API to pull the first page of best rated comments of this video, _unless_ the length of the transcript itself is already above a certain threshold)
=> `str ai_input1` = (video title + video description + [video transcript + as many top comments as needed to get above the 'transcript length THRESHOLD'])
=> `str ai_input2` = (video title + video description + [the 'transcript length THRESHOLD' worth of top comments])
=> `int poison_rating` = [OpenAI text-embedding-3-small score between "nonsensical" and `ai_input1`]
=> `int edu_rating` = [OpenAI text-embedding-3-small score between "educational" and `ai_input1`]
=> `int edu_rating2` = [OpenAI text-embedding-3-small score between "educational" and `ai_input2`]
=> `boolean poisoned` = [high `poison_rating`]
  => if (low `edu_rating` & `poisoned`) OR (low `edu_rating2` & `poisoned`): discard the video.
    => `\csv\youtube\video_to_source_log.csv` (bad status); Go to next Video.
  => else: proceed.
=> `abstract` = `get_abstract(poisoned ? ai_input2 : ai_input1)` (ai interface creates a scientific-ish abstract for this video)
=> `\csv\youtube\t_source_PLANNING.csv` (new preparational Source entry with this video's metadata + `abstract` as 'description'; Will then be manually migrated to `\csv\t_source.csv` as soon as approved)

(Data Import phase: Each Video landing in `\csv\youtube\t_source_PLANNING.csv` will have their `sa_resource` ("standalone_resource") set to `1` (true) and will therefore become their own standalone resource)

**Modes (primary script)**
- `update` (default): walk `\csv\youtube\_YouTube_Channels.csv` top-down, update known and add new channels.
- `discover` / `new`: only process channels not yet in `channels.csv`.
- Optional `start-from` identifier that matches `sauthorID`, `title`, `custom_url`, or `channel_id` (with or without `@`).

##### Future TO-DO

- Figure out how to reliable pull Video Transcripts for Abstract Creation => Make `\scripts\YouTube_Data\transcript_query.py` work
  - define reasonable rules & Thresholds
  - Build `\scripts\video_to_source.py`

##### codex conversation
Trummler:
```bash
codex resume 019b6f1f-e6cf-7c63-b6c9-0d9f47ef727f
```


#### Semi-Topic-Related

**`\csv\t_tag_PLANNING.txt`**
=> **(MANUAL_COPY_AFTER_VALIDATION)** => `\csv\t_tag.csv`



#### (Unordered)

`\csv\ct_resource_tags_PLANNING.csv.txt`
`\csv\ct_resource_tags.csv`
`\csv\ct_resource_to_topic_PLANNING.csv.txt`
`\csv\ct_resource_to_topic.csv`
`\csv\ct_topic_tags_PLANNING.csv.txt`
`\csv\ct_topic_tags.csv`
`\csv\ct_uses_source.csv`
`\csv\t_resource_type.csv`
`\csv\t_resource.csv`
`\csv\t_source_author.csv`
`\csv\t_source_type.csv`
`\csv\t_source.csv`



#### (Unused Files)

`\csv\ct_lrequirements.csv`
`\csv\t_contact_type.csv`
`\csv\t_inter_type.csv`
`\csv\t_language.csv`
`\csv\t_timezone.csv`
`\csv\t_topic_levels.csv`

`\csv\t_topic_url.csv`




