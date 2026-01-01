# Enquiry about playlists in the YouTube Data API

## Table of Contents

- [Official Documentation Reference](#official-documentation-reference)
- [Conversation](#conversation)
  - [Prompt 1](#prompt-1)
  - [Answer 1](#answer-1)
- [Evaluation](#evaluation)

## Official Documentation Reference

<table class="responsive properties" id="property-table">
  <thead>
    <tr>
      <th colspan="2">Properties</th>
    </tr>
  </thead>
  <tbody>
      <tr id="kind">
      <td><code itemprop="property" translate="no" dir="ltr">kind</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Identifies the API resource's type. The value will be <code translate="no" dir="ltr">youtube#playlist</code>.</td>
    </tr>
    <tr id="etag">
      <td><code itemprop="property" translate="no" dir="ltr">etag</code></td>
      <td><code class="apitype notranslate" dir="ltr">etag</code><br>
      The Etag of this resource.</td>
    </tr>
    <tr id="id">
      <td><code itemprop="property" translate="no" dir="ltr">id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the playlist.</td>
    </tr>
    <tr id="snippet">
      <td><code itemprop="property" translate="no" dir="ltr">snippet</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet</code> object contains basic details about the playlist, such as its title and description.</td>
    </tr>
    <tr id="snippet.publishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>published<wbr>At</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time that the playlist was created. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="snippet.channelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the channel that published the playlist.</td>
    </tr>
    <tr id="snippet.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The playlist's title.</td>
    </tr>
    <tr id="snippet.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The playlist's description.</td>
    </tr>
    <tr id="snippet.thumbnails">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>thumbnails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      A map of thumbnail images associated with the playlist. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.</td>
    </tr>
    <tr id="snippet.thumbnails.(key)">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr></span>(key)</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      Valid key values are:<ul><li><code translate="no" dir="ltr">default</code> – The default thumbnail image. The default thumbnail for a video – or a resource that refers to a video, such as a playlist item or search result – is 120px wide and 90px tall. The default thumbnail for a channel is 88px wide and 88px tall.</li><li><code translate="no" dir="ltr">medium</code> – A higher resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 320px wide and 180px tall. For a channel, this image is 240px wide and 240px tall.</li><li><code translate="no" dir="ltr">high</code> – A high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.</li><li><code translate="no" dir="ltr">standard</code> – An even higher resolution version of the thumbnail image than the <code translate="no" dir="ltr">high</code> resolution image. This image is available for some videos and other resources that refer to videos, like playlist items or search results. This image is 640px wide and 480px tall.</li><li><code translate="no" dir="ltr">maxres</code> – The highest resolution version of the thumbnail image. This image size is available for some videos and other resources that refer to videos, like playlist items or search results. This image is 1280px wide and 720px tall.</li></ul></td>
    </tr>
    <tr id="snippet.thumbnails.(key).url">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.thumbnails.(key).</span>url</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The image's URL.</td>
    </tr>
    <tr id="snippet.thumbnails.(key).width">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.thumbnails.(key).</span>width</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The image's width.</td>
    </tr>
    <tr id="snippet.thumbnails.(key).height">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.thumbnails.(key).</span>height</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The image's height.</td>
    </tr>
    <tr id="snippet.channelTitle">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>channelTitle</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel title of the channel that the video belongs to.</td>
    </tr>
    <tr id="snippet.tags[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>tags[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
      Keyword tags associated with the playlist.</td>
    </tr>
    <tr id="snippet.defaultLanguage">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>defaultLanguage</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The language of the text in the <code translate="no" dir="ltr">playlist</code> resource's <code translate="no" dir="ltr">snippet.title</code> and <code translate="no" dir="ltr">snippet.description</code> properties.</td>
    </tr>
    <tr id="snippet.localized">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>localized</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet.localized</code> object contains either a localized title and description for the playlist or the title in the <a href="#snippet.defaultLanguage">default language</a> for the playlist's metadata. <ul><li>Localized text is returned in the resource snippet if the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlists/list">playlists.list</a></code> request used the <code translate="no" dir="ltr">hl</code> parameter to specify a language for which localized text should be returned <i>and</i> localized text is available in that language.</li> <li>Metadata for the default language is returned if an <code translate="no" dir="ltr">hl</code> parameter value is not specified <i>or</i> a value is specified but localized metadata is not available for the specified language.</li></ul> The property contains a read-only value. Use the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlists#localizations">localizations</a></code> object to add, update, or delete localized titles.</td>
    </tr>
    <tr id="snippet.localized.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.localized.</span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized playlist title.</td>
    </tr>
    <tr id="snippet.localized.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.localized.</span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized playlist description.</td>
    </tr>
    <tr id="status">
      <td><code itemprop="property" translate="no" dir="ltr">status</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">status</code> object contains status information for the playlist.</td>
    </tr>
    <tr id="status.privacyStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>privacyStatus</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The playlist's privacy status.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">private</code></li>
  <li><code translate="no" dir="ltr">public</code></li>
  <li><code translate="no" dir="ltr">unlisted</code></li>
</ul>
</td>
    </tr>
    <tr id="status.podcastStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>podcastStatus</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The playlist's podcast status. If value is <code translate="no" dir="ltr">enabled</code>, the playlist is marked as a podcast show. To set a playlist's podcast status to <code translate="no" dir="ltr">enabled</code>, the playlist must have a <a href="/youtube/v3/docs/playlistImages/insert">playlist image</a>.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">enabled</code></li>
  <li><code translate="no" dir="ltr">disabled</code></li>
  <li><code translate="no" dir="ltr">unspecified</code></li>
</ul>
</td>
    </tr>
    <tr id="contentDetails">
      <td><code itemprop="property" translate="no" dir="ltr">contentDetails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">contentDetails</code> object contains information about the playlist content, including the number of videos in the playlist.</td>
    </tr>
    <tr id="contentDetails.itemCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>itemCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The number of videos in the playlist.</td>
    </tr>
    <tr id="player">
      <td><code itemprop="property" translate="no" dir="ltr">player</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">player</code> object contains information that you would use to play the playlist in an embedded player.</td>
    </tr>
    <tr id="player.embedHtml">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">player.</span>embedHtml</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      An <code translate="no" dir="ltr">&lt;iframe&gt;</code> tag that embeds a player that will play the playlist.</td>
    </tr>
    <tr id="localizations">
      <td><code itemprop="property" translate="no" dir="ltr">localizations</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">localizations</code> object encapsulates translations of the playlist's metadata.</td>
    </tr>
    <tr id="localizations.(key)">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.</span>(key)</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The language of the localized text associated with the key value. The value is a string that contains a <a href="http://www.rfc-editor.org/rfc/bcp/bcp47.txt">BCP-47</a> language code.</td>
    </tr>
    <tr id="localizations.(key).title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.(key).</span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized playlist title.</td>
    </tr>
    <tr id="localizations.(key).description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.(key).</span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized playlist description.</td>
    </tr>

  </tbody>
</table>

## Conversation

Conversation with GPT 5.2:

### Prompt 1

Please again ultrathink hard on this:
Vielen Dank, diese Informationen haben mir tatsächlich sehr gut weiterhelfen können. Nun habe ich jedoch ein anderes Problem, mit welchem ich mich rumschlagen musste; Ich habe versucht, dieses Problem mit dem Cloud Assist Gemini Modell zu lösen, aber offenbar ist das Build-in Google Cloud KI-Modell nicht dazu in der Lage, mir die Informationen zu beschaffen, die ich hier für benötige (Obwohl es halt eigentlich Build-in ist, auf derselben Seite, wo man die YouTube Data API Keys sich überhaupt holen und die Dienste, ... ach, keine Ahnung...). Ich geb' dir mal den Chatverlauf und baue ich darauf, dass du vielleicht über eine Recherche mehr in Erfahrung bringen kannst:
```
Ich versuche gerade, mit Hilfe der YouTube Data API eine Liste aller Kurse eines YouTube-Channels zurückzugeben. Es funktioniert zwar soweit schon mit der Rückgabe einer Liste aller Playlists eines Kanals, aber zu Kursen konnte ich bisher noch nichts finden. Kannst du mir hier weiterhelfen?
Die YouTube Data API v3 ermöglicht den Zugriff auf verschiedene Arten von YouTube-Daten, wie Videos, Playlists und Kanäle. Allerdings gibt es in der YouTube Data API keinen direkten Endpunkt oder Ressourcentyp, der speziell "Kurse" zurückgibt.

Was du mit "Kursen" meinst, sind in YouTube wahrscheinlich Sammlungen von Videos, die in einer bestimmten Reihenfolge organisiert sind, oft als Playlists dargestellt. Da du bereits Playlists abrufen kannst, bist du auf dem richtigen Weg.

Hier sind ein paar Punkte, die dir vielleicht weiterhelfen:

Kurse als Playlists: YouTube-Kanäle organisieren Inhalte, die als Kurse gedacht sind, typischerweise in Playlists. Jede Playlist kann eine Reihe von Videos enthalten, die einem bestimmten Thema oder einer Lernsequenz folgen.
Beschränkungen von Playlists: Beachte, dass Playlists auf YouTube eine maximale Anzahl von Videos haben können (historisch gesehen oft auf 20.000 begrenzt). Wenn ein "Kurs" extrem viele Videos enthält, könnte er auf mehrere Playlists aufgeteilt sein.
Uploads-Playlist: Jeder YouTube-Kanal hat auch eine spezielle Playlist, die alle hochgeladenen Videos des Kanals enthält. Manchmal werden auch hier thematische Kurse direkt hochgeladen, ohne separate Playlists zu erstellen. Du könntest versuchen, diese "Uploads"-Playlist abzurufen und die Videos dann nach deinen Kriterien zu filtern.
Manuelle Identifikation: Oft sind "Kurse" nicht nur durch ihre technische Struktur (als Playlist) definiert, sondern auch durch Titel, Beschreibungen oder das Thumbnail der Playlist. Du könntest die abgerufenen Playlists manuell nach Schlüsselwörtern oder Mustern in Titeln und Beschreibungen durchsuchen, um diejenigen zu identifizieren, die als Kurse gedacht sind.
Keine spezielle "Kurs"-Ressource: Es ist wichtig zu verstehen, dass die YouTube Data API keine eingebaute Semantik für "Kurse" im akademischen Sinne hat. Sie behandelt alle Video-Sammlungen als Playlists.
Zusammenfassend lässt sich sagen, dass der beste Ansatz darin besteht, die Playlists des Kanals abzurufen und dann basierend auf den Metadaten (Titel, Beschreibung) zu versuchen, die "Kurs"-Playlists zu identifizieren.

Auf YouTube wird unterschieden zwischen https://www.youtube.com/@3blue1brown/playlists und https://www.youtube.com/@3blue1brown/courses; Im Grunde sind Kurse identisch organisiert wie Playlists, fallen aber unter eine eigene Kategorie. Mein Ziel ist es nun, neben allen Playlists auch alle Kurse eines Kanals mir zurückgeben zu lassen. Nur habe ich bisher, wie gesagt, noch nicht herausfinden können, wie ich das bewerkstellige.
Ich verstehe dein Ziel sehr gut, die spezifischen "Kurse" eines YouTube-Kanals über die API abrufen zu wollen, da diese auf der YouTube-Oberfläche als eigene Kategorie erscheinen (z.B. /courses im Gegensatz zu /playlists ).

Leider ist es so, dass die YouTube Data API v3 keine separate Ressource oder Methode für "Kurse" bereitstellt. Was du auf YouTube als "Kurse" siehst, sind aus Sicht der API technisch gesehen immer noch Playlists . YouTube selbst verwendet hier eine interne Klassifizierung oder Darstellungslogik, die über die öffentliche API nicht direkt zugänglich ist.

Das bedeutet, wenn du mit der YouTube Data API arbeitest, gibt es keinen speziellen Aufruf, um nur "Kurse" abzurufen. Stattdessen musst du weiterhin die playlists.list -Methode verwenden, um alle Playlists eines Kanals zu erhalten.

Um die "Kurse" von den regulären Playlists zu unterscheiden, hast du folgende Möglichkeiten:

Metadaten-Analyse:
Titel und Beschreibung: Viele "Kurse" haben spezifische Schlüsselwörter in ihrem Titel oder ihrer Beschreibung (z.B. "Kurs", "Einführung in...", "Teil 1", "Serie"). Du kannst die Metadaten der abgerufenen Playlists analysieren und nach diesen Mustern filtern.
Thumbnail: Manchmal verwenden Kurs-Playlists ein konsistentes Thumbnail-Design, das sie von anderen Playlists unterscheidet. Dies wäre jedoch schwieriger programmatisch zu erkennen.
Anzahl der Videos: Kurse sind oft umfangreicher als normale Playlists und enthalten eine größere Anzahl von Videos. Du könntest Playlists mit einer bestimmten Mindestanzahl von Videos als potenzielle Kurse identifizieren.
Manuelle Zuordnung (Initial): Wenn es um einen bestimmten Kanal geht und die "Kurse" dort relativ statisch sind, könntest du einmalig die IDs dieser "Kurs"-Playlists manuell von der YouTube-Website ermitteln und dann gezielt diese Playlists über die API abfragen. Dies ist natürlich weniger dynamisch.
URL-Struktur (Browser vs. API): Die URL-Struktur /@kanalname/courses ist eine Benutzeroberflächen-Darstellung von YouTube. Die API arbeitet mit Ressourcen-IDs und Parametern, die diese spezifische Browser-URL-Struktur nicht direkt widerspiegeln oder abfragen können.
Zusammenfassend: Du wirst weiterhin die playlists.list Methode nutzen müssen. Die Unterscheidung zwischen "Kursen" und "anderen Playlists" muss dann von deiner Anwendung durch eine Analyse der Playlist-Metadaten erfolgen, da die API diese Unterscheidung selbst nicht trifft.

Aber wenn Kurse aus Sicht der YouTube Data API ebenfalls zu Playlists gehören, dann müsste man dies ja mit der Liste an Playlists zurückgegeben erhalten. Dies scheint jedoch nicht zu geschehen. 3Blue1Brown hat 21 Playlists und 4 Kurse. Wenn ich mir die Liste aller Playlists dieses Kanals zurückgeben lasse, dann komme ich auf eine Zahl von 21. Die 4 Kurse sind nicht mit dabei. Übersehe ich vielleicht irgendetwas?
Das ist eine sehr wichtige Beobachtung und du hast absolut Recht! Wenn die "Kurse" technisch gesehen nur Playlists wären und über die playlists.list -Methode abrufbar sein sollten, dann müssten sie in der Gesamtzahl der zurückgegebenen Playlists enthalten sein. Die Tatsache, dass sie es nicht sind, deutet darauf hin, dass meine vorherige Annahme, dass sie einfach "Playlists" sind, die nur anders dargestellt werden, nicht ganz korrekt ist, zumindest nicht im Kontext der öffentlichen YouTube Data API v3.

Es scheint, dass YouTube diese "Kurse" auf der Benutzeroberfläche als eine separate Kategorie behandelt und sie nicht über die Standard playlists.list -Methode der YouTube Data API v3 zugänglich macht.

Das bedeutet:

Kein direkter API-Zugriff: Es gibt in der aktuellen Version der YouTube Data API v3 keinen bekannten oder dokumentierten Endpunkt , der speziell "Kurse" zurückgibt oder eine Möglichkeit bietet, diese "Kurs"-Playlists von regulären Playlists zu unterscheiden, wenn sie nicht in den playlists.list -Ergebnissen erscheinen.
Interne YouTube-Klassifizierung: YouTube verwendet hier wahrscheinlich eine interne Klassifizierung oder eine andere Art von Ressource, die nicht über die öffentliche API exponiert wird. Die /courses -URL auf der Website ist eine spezielle Ansicht, die YouTube für seine eigene Darstellung nutzt, aber diese Funktionalität ist nicht direkt in der API abgebildet.
Was bedeutet das für dich?

Leider gibt es zum jetzigen Zeitpunkt keine offizielle oder bekannte Methode, um die "Kurse" eines Kanals über die YouTube Data API v3 abzurufen, wenn sie nicht in den playlists.list -Ergebnissen enthalten sind.

Deine Optionen sind daher sehr begrenzt:

Manuelle Erfassung: Wenn du die Kurse für einen bestimmten Kanal benötigst, müsstest du deren IDs manuell von der YouTube-Website sammeln und dann die playlists.list -Methode mit diesen spezifischen IDs aufrufen, um die Details der Videos in diesen "Kursen" zu erhalten. Dies ist natürlich nicht skalierbar für eine allgemeine Lösung.
Scraping (nicht empfohlen): Das "Scrapen" der YouTube-Website (also das Auslesen der Daten direkt von der Webseite statt über die API) ist gegen die Nutzungsbedingungen von YouTube und kann zur Sperrung deines Zugangs führen. Daher ist dies keine praktikable Lösung.
Feature Request: Du könntest einen Feature Request bei Google einreichen, um eine API-Methode für "Kurse" hinzuzufügen.
Es tut mir leid, dass ich dir hier keine direktere API-Lösung anbieten kann. Es ist ein bekanntes Manko der YouTube Data API, dass nicht alle auf der Website sichtbaren Informationen programmatisch zugänglich sind.

```

### Answer 1

Kurzfassung:
Nein, du übersiehst sehr wahrscheinlich nichts – **die offiziellen YouTube Data API-Endpunkte geben aktuell *keinen* separaten Zugriff auf den „Courses“-Tab eines Kanals**, und deine Beobachtung mit 3Blue1Brown passt genau dazu. Was du siehst, ist eine zusätzliche Oberfläche („tab“) der normalen YouTube-Web-UI, die in der öffentlichen Data API nicht abgebildet ist.

Ich gehe das einmal systematisch durch.

---

## 1. Was sind „Courses“ technisch überhaupt?

YouTube unterscheidet inzwischen mehrere Dinge:

1. **Normale Playlists**
   Das sind die, die du über `playlists.list` mit `channelId=...` bekommst.

2. **„Course“-Playlists / Kursdarstellung in der UI**
   Beispiel Essence of Linear Algebra: auf der Playlistseite steht explizit „3Blue1Brown Course•16 lessons, 3 hours“. ([YouTube][1])
   Technisch ist das **immer noch eine ganz normale Playlist** mit einer ID wie `PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab`.

3. **Das neue YouTube-Feature „Courses“ als Produkt (einmalig bezahlte Kurse etc.)**
   Dafür gibt es ein eigenes Help-Center-Dokument; YouTube hat zudem angekündigt, die „one-time payment Courses“ Ende 2025 wieder abzuwickeln. ([Google Help][2])
   Dieses Produkt ist eher eine Monetarisierungs-Schicht (Kauf, Quizze, Badges), die über Videos/Playlists gelegt wird.

Der **/courses-Tab** am Kanal (z.B. `https://www.youtube.com/@3blue1brown/courses`) ist eine **spezielle Kanalseite**, die YouTube mit internen APIs („InnerTube“) rendert, nicht mit der offiziellen Data API v3.

---

## 2. Was kann die *offizielle* YouTube Data API v3?

Stand Ende 2025 gibt es in der dokumentierten Data API:

* `channels`, `playlists`, `playlistItems`, `videos`, `search`, … – aber **kein Ressourcentyp „course“** und keinen Filter, der „nur Kurse“ eines Kanals liefert.
* Die Playlist-Ressource kennt zwar Felder wie `snippet`, `contentDetails`, `status`, etc., aber **kein** Attribut „isCourse“ oder ähnliches (in der offiziellen Doku nicht vorhanden/erwähnt).

Dass du bei 3Blue1Brown **21 Playlists statt 21 + 4 Kurse** zurückbekommst, ist also konsistent mit dem, was man von außen sieht:

* Einige „Course“-Playlists scheinen **nicht** als „normale Channel-Playlists“ am `channelId` hängen (bzw. YouTube liefert sie über den Channel-Playlist-Endpunkt nicht aus).
* Sie sind aber weiterhin über ihre Playlist-ID adressierbar und über die Web-UI sichtbar.

Dass Cloud Assist / Gemini dir sagt „geht nicht“, ist deshalb ziemlich plausibel: Das Tool basiert auf den dokumentierten Google-APIs – und genau dort ist für den Courses-Tab nichts vorgesehen.

---

## 3. Wie kommen dann Third-Party-Tools an den „Courses“-Tab?

Hier wird es spannend – und inoffiziell.

### 3.1 Invidious

Invidious (alternative YouTube-Frontend-Software) hat **2024/2025 explizit „Support for channel `courses` page“** nachgerüstet. ([GitHub][3])

Das heißt:

* Sie rufen nicht die YouTube Data API v3 auf,
* sondern nutzen die **internen Web-APIs / HTML-Struktur** (das sogenannte „InnerTube“-Backend plus `ytInitialData` im HTML),
* und parsen daraus die Daten des Courses-Tabs.

Invidious bietet dazu eigene API-Endpoints (z.B. `/api/v1/channels/<id>/` mit Tab-Parametern). Das ist bequem, aber:

* **undokumentiert**,
* potentiell **fragil** (wenn YouTube die interne Struktur ändert),
* und **rechtlich heikel**, weil es meistens nicht 1:1 mit den YouTube-Nutzungsbedingungen konform ist.

### 3.2 NewPipe, Piped & Co.

Andere FOSS-Clients (NewPipe, Piped) gehen denselben Weg.
NewPipe hat z.B. ein offenes Issue „Add 'Courses' Tab in Channels Tabs Layout“, wo explizit steht, dass einfach ein weiterer Tab („courses“) in die bestehende Tab-Struktur aufgenommen werden soll. ([GitHub][4])

Auch hier: Diese Projekte sprechen **nicht** die Data API v3 an, sondern einen **reverse-engineerten Web-Endpoint**.

---

## 4. Antwort auf deine Kernfrage

> „Übersehe ich vielleicht irgendetwas?“

So weit sich von außen erkennen lässt:

* **Nein. Es gibt derzeit keinen offiziellen Weg, den Courses-Tab eines Kanals über die YouTube Data API v3 abzurufen.**
* Die Kurse, die du unter `/courses` siehst, sind **keinem dokumentierten API-Endpunkt zugeordnet**.
* Deine Beobachtung „21 Playlists, 4 Kurse fehlen“ ist also kein Fehler in deinem Code, sondern eine **Lücke der offiziellen API**.

Alles, was darauf aufsetzt (Invidious, NewPipe, Scraper, `ytInitialData`-Parsing), ist:

* technisch machbar,
* aber **inoffiziell** und potentiell **ToS-kritisch**, wenn du es automatisiert und großskalig im Backend nutzt.

---

## 5. Was heißt das für dein Kompetenzlevel-System konkret?

Ich würde für dein Projekt (globale OER-/Unterrichtsressourcen-Datenbank) drei Strategien unterscheiden:

### 5.1 „Sauber & robust“: Nur offizielle API + eigene Kuratierung

* Du holst dir ganz normal **alle Playlists** eines Kanals via `playlists.list`.
* Für Kanäle, die dir besonders wichtig sind (3Blue1Brown, Veritasium, etc.), pflegst du **eine kleine, manuell kuratierte Liste** von Playlist-IDs, die du als „Kurse“ markierst (z.B. `is_course = true`, `course_type = "canonical_series"`).
* Für 3Blue1Brown sind das im Wesentlichen die bekannten Hauptreihen (Linear Algebra, Calculus, Neural Networks, Differential Equations), die sich *ohnehin* selten ändern.

Vorteile:

* 100% im Rahmen der offiziellen API-Nutzung.
* Technisch sehr stabil, gut testbar.
* Für deinen Use Case (qualitative Ressourcen, nicht Massen-Scraping) völlig ausreichend.

Nachteile:

* Du bekommst **neue Kurse** nicht automatisch, sondern müsstest gelegentlich manuell nachziehen – aber die Zahl solcher Kanäle ist überschaubar.

### 5.2 „Pragmatisch“: Heuristiken auf Playlist-Metadaten

Selbst mit nur den „normalen“ Playlists kannst du relativ weit kommen:

* Filter-Heuristiken auf `title` / `description`, z.B.:

  * enthält „Course“, „Essence of“, „Einführung in“, „Grundkurs“, „Kurs“, …
* Mindestanzahl an Videos (z.B. `>= 5` oder `>= 10`),
* optional: Länge der Beschreibung, bestimmte Keywords.

Damit kannst du **auch Kurse erkennen, die nicht im Courses-Tab stehen**, aber faktisch Kursreihen sind.

Das ist natürlich unscharf, aber für eine große OER-Datenbank empirisch oft genug.

### 5.3 „Experimentell“: Nutzung eines Dritt-Frontends (Invidious / NewPipe-Extractor)

Wenn du **bewusst** sagst „okay, wir bewegen uns hier an der Grenze zu YouTube-ToS, aber es ist ein Forschungsprojekt / Prototyp“, könntest du:

* Einen **selbst gehosteten Invidious-Server** oder NewPipe-Extractor verwenden,
* von dort per REST die Daten des `courses`-Tabs abrufen,
* und sie in deine eigene Datenbank spiegeln.

Wichtige Einschränkungen:

* Du solltest das **nicht** als produktiven Kern einer großen, öffentlichen Plattform verwenden, solange unklar ist, wie YouTube das rechtlich bewertet.
* Technisch kann YouTube jederzeit interne APIs ändern und deine Integration damit brechen.

Für ein internes Forschungs-Tool oder einmalige Datenerhebung mag das in Ordnung sein, für eine langfristige globale Bildungs-Infrastruktur würde ich eher darauf verzichten.

---

## 6. Konkreter Vorschlag für dich

Für deine Kompetenz-Level-Datenbank würde ich – aus technischer und rechtlicher Sicht – folgendes Setup wählen:

1. **Offizielle Data API als einzige Quelle für strukturierte YouTube-Daten**

   * `channels.list`, `playlists.list`, `playlistItems.list`, `videos.list`.

2. **Eigenes Kurs-Modell in deiner DB**

   * Tabelle `course_series` mit Feldern wie

     * `course_id` (interne ID)
     * `primary_playlist_id` (YouTube Playlist ID)
     * `channel_id`
     * `language_primary` / `languages_available`
     * `title`, `short_description`
     * `is_official_flagship` (z.B. „Essence of Linear Algebra“)

3. **Manuelle Kuratierung für „Flagship“-Kanäle**

   * 3Blue1Brown, Veritasium, Kurzgesagt, etc. – hier ist die Anzahl „echter Kurse“ sowieso klein, aber inhaltlich sehr wichtig.
   * Das passt gut zu deinem ohnehin kuratierten Ansatz (wissenschaftliche Kanäle, OER-Charakter, Kompetenz-Zuordnung).

4. **Heuristiken für alle anderen Kanäle**

   * Optional: Ein kleiner Classifier, der aus Playlist-Metadaten abschätzt, ob etwas „Kursartig“ ist (Titel-Pattern + Länge + evtl. Beschreibung).

5. **Sprach-Filter unabhängig vom Courses-Tab**

   * So wie wir im vorherigen Chat über **Sprachen per Audio-Track / Caption-Heuristik** gesprochen hatten, kannst du dieses Sprach-Label direkt auf die Videos und Playlists legen – unabhängig davon, ob YouTube sie als „Course“ bewirbt.

Damit bist du:

* **API-konform**,
* technisch **robust**,
* und hast gleichzeitig genug strukturelle Information, um deinen Skilltree-Ansatz weltweit sinnvoll mit Ressourcen zu füttern.

---

Wenn du möchtest, kann ich dir im nächsten Schritt ein kleines Schema/ER-Modell skizzieren, wie du:

* `topics` (deine 2200+ Disziplinen),
* `resources` (Videos, Kurse, externe OER),
* `languages`,
* und `course_series`

so modellierst, dass spätere Features wie „zeige mir nur Kurse auf Deutsch/Französisch, Level 2–3, zum Thema Differentialgleichungen“ sauber abbildbar sind.

[1]: https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&utm_source=chatgpt.com "Essence of linear algebra"
[2]: https://support.google.com/youtube/answer/12751869?hl=en&utm_source=chatgpt.com "Take a course on YouTube - Android"
[3]: https://github.com/iv-org/invidious/blob/master/CHANGELOG.md?utm_source=chatgpt.com "invidious/CHANGELOG.md at master · iv-org/invidious"
[4]: https://github.com/TeamNewPipe/NewPipe/issues/11968?utm_source=chatgpt.com "Add \"Courses\" Tab in Channels Tabs Layout · Issue #11968"

## Evaluation
### Findings (validated)
- In the official Data API v3, `playlists.list` only returns standard channel playlists. It does not surface the `/courses` tab content for 3Blue1Brown.
- `channelSections.list` exposes some additional playlist IDs (e.g., “Projects on other channels”), but still does not expose the `/courses` tab items.
- Therefore, the missing 3Blue1Brown courses are not retrievable via official API endpoints.

### Best approach (recommended)
**Primary:** Stay API‑compliant and add a **manual override list** for courses.
- Maintain a simple text file of course playlist IDs per channel (see `_YouTube_Courses.txt`), curated for flagship channels.
- Merge these IDs into `playlists.csv` by fetching details with `playlists.list` using the explicit IDs.
- This is stable, quota‑cheap, and ToS‑safe. It scales because only a handful of channels will have curated courses.

### Secondary (optional)
**Heuristic course detection** from standard playlists (title/description keywords, itemCount threshold).
- Useful for non‑flagship channels, but will miss UI‑only courses and may create false positives.

### Not recommended for production
**Scraping/InnerTube (Invidious/NewPipe)** can see the `/courses` tab, but it is undocumented, fragile, and may violate YouTube ToS at scale. Use only for research or one‑off discovery if explicitly approved.

### Decision summary
For reliable automation without ToS risk: **manual course ID overrides + API fetch by ID**. Use heuristics as a supplemental, best‑effort classifier.

