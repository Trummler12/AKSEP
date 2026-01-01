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
      Identifies the API resource's type. The value will be <code translate="no" dir="ltr">youtube#video</code>.</td>
    </tr>
    <tr id="etag">
      <td><code itemprop="property" translate="no" dir="ltr">etag</code></td>
      <td><code class="apitype notranslate" dir="ltr">etag</code><br>
      The Etag of this resource.</td>
    </tr>
    <tr id="id">
      <td><code itemprop="property" translate="no" dir="ltr">id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the video.</td>
    </tr>
    <tr id="snippet">
      <td><code itemprop="property" translate="no" dir="ltr">snippet</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet</code> object contains basic details about the video, such as its title, description, and category.</td>
    </tr>
    <tr id="snippet.publishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>published<wbr>At</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time that the video was published. Note that this time might be different than the time that the video was uploaded. For example, if a video is uploaded as a private video and then made public at a later time, this property will specify the time that the video was made public.<br><br>There are a couple of special cases: <ul><li>If a video is uploaded as a private video and the video metadata is retrieved by the channel owner, then the property value specifies the date and time that the video was uploaded.</li> <li>If a video is uploaded as an unlisted video, the property value also specifies the date and time that the video was uploaded. In this case, anyone who knows the video's unique video ID can retrieve the video metadata.</li></ul> The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="snippet.channelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.</td>
    </tr>
    <tr id="snippet.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's title. The property value has a maximum length of 100 characters and may contain all valid UTF-8 characters except <b>&lt;</b> and <b>&gt;</b>. You must set a value for this property if you call the <code translate="no" dir="ltr">videos.<wbr>update</code> method and are updating the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos#snippet">snippet</a></code> part of a <code translate="no" dir="ltr">video</code> resource.</td>
    </tr>
    <tr id="snippet.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's description. The property value has a maximum length of 5000 bytes and may contain all valid UTF-8 characters except <b>&lt;</b> and <b>&gt;</b>.</td>
    </tr>
    <tr id="snippet.thumbnails">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>thumbnails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.</td>
    </tr>
    <tr id="snippet.thumbnails.(key)">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr></span>(key)</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      Valid key values are:<ul><li><code translate="no" dir="ltr">default</code> – The default thumbnail image. The default thumbnail for a video – or a resource that refers to a video, such as a playlist item or search result – is 120px wide and 90px tall. The default thumbnail for a channel is 88px wide and 88px tall.</li><li><code translate="no" dir="ltr">medium</code> – A higher resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 320px wide and 180px tall. For a channel, this image is 240px wide and 240px tall.</li><li><code translate="no" dir="ltr">high</code> – A high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.</li><li><code translate="no" dir="ltr">standard</code> – An even higher resolution version of the thumbnail image than the <code translate="no" dir="ltr">high</code> resolution image. This image is available for some videos and other resources that refer to videos, like playlist items or search results. This image is 640px wide and 480px tall.</li><li><code translate="no" dir="ltr">maxres</code> – The highest resolution version of the thumbnail image. This image size is available for some videos and other resources that refer to videos, like playlist items or search results. This image is 1280px wide and 720px tall.</li></ul></td>
    </tr>
    <tr id="snippet.thumbnails.(key).url">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr>(key).<wbr></span>url</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The image's URL.</td>
    </tr>
    <tr id="snippet.thumbnails.(key).width">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr>(key).<wbr></span>width</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The image's width.</td>
    </tr>
    <tr id="snippet.thumbnails.(key).height">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr>(key).<wbr></span>height</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The image's height.</td>
    </tr>
    <tr id="snippet.channelTitle">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>channel<wbr>Title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Channel title for the channel that the video belongs to.</td>
    </tr>
    <tr id="snippet.tags[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>tags[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of keyword tags associated with the video. Tags may contain spaces. The property value has a maximum length of 500 characters. Note the following rules regarding the way the character limit is calculated: <ul> <li>The property value is a list, and commas between items in the list count toward the limit.</li> <li>If a tag contains a space, the API server handles the tag value as though it were wrapped in quotation marks, and the quotation marks count toward the character limit. So, for the purposes of character limits, the tag <b>Foo-Baz</b> contains seven characters, but the tag <b>Foo Baz</b> contains nine characters.</li> </ul></td>
    </tr>
    <tr id="snippet.categoryId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>category<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The YouTube <a href="/youtube/v3/docs/videoCategories/list">video category</a> associated with the video. You must set a value for this property if you call the <code translate="no" dir="ltr">videos.<wbr>update</code> method and are updating the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos#snippet">snippet</a></code> part of a <code translate="no" dir="ltr">video</code> resource.</td>
    </tr>
    <tr id="snippet.liveBroadcastContent">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>live<wbr>Broadcast<wbr>Content</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">live</code></li>
<li><code translate="no" dir="ltr">none</code></li>
<li><code translate="no" dir="ltr">upcoming</code></li>

</ul>
</td>
    </tr>
    <tr id="snippet.defaultLanguage">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>default<wbr>Language</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The language of the text in the <code translate="no" dir="ltr">video</code> resource's <code translate="no" dir="ltr">snippet.<wbr>title</code> and <code translate="no" dir="ltr">snippet.<wbr>description</code> properties.</td>
    </tr>
    <tr id="snippet.localized">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>localized</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet.<wbr>localized</code> object contains either a localized title and description for the video or the title in the <a href="#snippet.defaultLanguage">default language</a> for the video's metadata. <ul><li>Localized text is returned in the resource snippet if the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list">videos.list</a></code> request used the <code translate="no" dir="ltr">hl</code> parameter to specify a language for which localized text should be returned <i>and</i> localized text is available in that language.</li> <li>Metadata for the default language is returned if an <code translate="no" dir="ltr">hl</code> parameter value is not specified <i>or</i> a value is specified but localized metadata is not available for the specified language.</li></ul> The property contains a read-only value. Use the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos#localizations">localizations</a></code> object to add, update, or delete localized titles.</td>
    </tr>
    <tr id="snippet.localized.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>localized.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized video title.</td>
    </tr>
    <tr id="snippet.localized.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>localized.<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized video description.</td>
    </tr>
    <tr id="snippet.defaultAudioLanguage">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>default<wbr>Audio<wbr>Language</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The <code translate="no" dir="ltr">default_<wbr>audio_<wbr>language</code> property specifies the language spoken in the video's default audio track.</td>
    </tr>
    <tr id="contentDetails">
      <td><code itemprop="property" translate="no" dir="ltr">content<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">content<wbr>Details</code> object contains information about the video content, including the length of the video and an indication of whether captions are available for the video.</td>
    </tr>
    <tr id="contentDetails.duration">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>duration</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The length of the video. The property value is an <a href="//en.wikipedia.org/wiki/ISO_8601#Durations">ISO 8601</a> duration. For example, for a video that is at least one minute long and less than one hour long, the duration is in the format <code translate="no" dir="ltr">PT#M#S</code>, in which the letters <code translate="no" dir="ltr">PT</code> indicate that the value specifies a period of time, and the letters <code translate="no" dir="ltr">M</code> and <code translate="no" dir="ltr">S</code> refer to length in minutes and seconds, respectively. The <code translate="no" dir="ltr">#</code> characters preceding the <code translate="no" dir="ltr">M</code> and <code translate="no" dir="ltr">S</code> letters are both integers that specify the number of minutes (or seconds) of the video. For example, a value of <code translate="no" dir="ltr">PT15M33S</code> indicates that the video is 15 minutes and 33 seconds long.<br><br> If the video is at least one hour long, the duration is in the format <code translate="no" dir="ltr">PT#H#M#S</code>, in which the <code translate="no" dir="ltr">#</code> preceding the letter <code translate="no" dir="ltr">H</code> specifies the length of the video in hours and all of the other details are the same as described above. If the video is at least one day long, the letters <code translate="no" dir="ltr">P</code> and <code translate="no" dir="ltr">T</code> are separated, and the value's format is <code translate="no" dir="ltr">P#DT#H#M#S</code>. Please refer to the ISO 8601 specification for complete details.</td>
    </tr>
    <tr id="contentDetails.dimension">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>dimension</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Indicates whether the video is available in 3D or in 2D.</td>
    </tr>
    <tr id="contentDetails.definition">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>definition</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Indicates whether the video is available in high definition (<code translate="no" dir="ltr">HD</code>) or only in standard definition.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">hd</code></li>
<li><code translate="no" dir="ltr">sd</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.caption">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>caption</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Indicates whether captions are available for the video.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">false</code></li>
<li><code translate="no" dir="ltr">true</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.licensedContent">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>licensed<wbr>Content</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the video represents licensed content, which means that the content was uploaded to a channel linked to a YouTube content partner and then claimed by that partner.</td>
    </tr>
    <tr id="contentDetails.regionRestriction">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>region<wbr>Restriction</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">region<wbr>Restriction</code> object contains information about the countries where a video is (or is not) viewable. The object will contain either the <code translate="no" dir="ltr">content<wbr>Details.<wbr>region<wbr>Restriction.<wbr>allowed</code> property or the <code translate="no" dir="ltr">content<wbr>Details.<wbr>region<wbr>Restriction.<wbr>blocked</code> property.</td>
    </tr>
    <tr id="contentDetails.regionRestriction.allowed[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>region<wbr>Restriction.<wbr></span>allowed[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of region codes that identify countries where the video is viewable. If this property is present and a country is not listed in its value, then the video is blocked from appearing in that country. If this property is present and contains an empty list, the video is blocked in all countries.</td>
    </tr>
    <tr id="contentDetails.regionRestriction.blocked[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>region<wbr>Restriction.<wbr></span>blocked[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of region codes that identify countries where the video is blocked. If this property is present and a country is not listed in its value, then the video is viewable in that country. If this property is present and contains an empty list, the video is viewable in all countries.</td>
    </tr>
    <tr id="contentDetails.contentRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>content<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      Specifies the ratings that the video received under various rating schemes.</td>
    </tr>
    <tr id="contentDetails.contentRating.acbRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>acb<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Australian Classification Board (ACB) or Australian Communications and Media Authority (ACMA) rating. ACMA ratings are used to classify children's television programming.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">acbC</code> – Programs that have been given a <code translate="no" dir="ltr">C</code> classification by the Australian Communications and Media Authority. These programs are intended for children (other than preschool children) who are younger than 14 years of age.</li>
<li><code translate="no" dir="ltr">acbE</code> – E</li>
<li><code translate="no" dir="ltr">acbG</code> – G</li>
<li><code translate="no" dir="ltr">acbM</code> – M</li>
<li><code translate="no" dir="ltr">acbMa15plus</code> – MA15+</li>
<li><code translate="no" dir="ltr">acbP</code> – Programs that have been given a <code translate="no" dir="ltr">P</code> classification by the Australian Communications and Media Authority. These programs are intended for preschool children.</li>
<li><code translate="no" dir="ltr">acbPg</code> – PG</li>
<li><code translate="no" dir="ltr">acbR18plus</code> – R18+</li>
<li><code translate="no" dir="ltr">acbUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.agcomRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>agcom<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Italy's Autorità per le Garanzie nelle Comunicazioni (AGCOM).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">agcomT</code> – T</li>
<li><code translate="no" dir="ltr">agcomUnrated</code></li>
<li><code translate="no" dir="ltr">agcomVm14</code> – VM14</li>
<li><code translate="no" dir="ltr">agcomVm18</code> – VM18</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.anatelRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>anatel<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Anatel (Asociación Nacional de Televisión) rating for Chilean television.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">anatelA</code> – A</li>
<li><code translate="no" dir="ltr">anatelF</code> – F</li>
<li><code translate="no" dir="ltr">anatelI</code> – I</li>
<li><code translate="no" dir="ltr">anatelI10</code> – I-10</li>
<li><code translate="no" dir="ltr">anatelI12</code> – I-12</li>
<li><code translate="no" dir="ltr">anatelI7</code> – I-7</li>
<li><code translate="no" dir="ltr">anatelR</code> – R</li>
<li><code translate="no" dir="ltr">anatelUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.bbfcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>bbfc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's British Board of Film Classification (BBFC) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">bbfc12</code> – 12</li>
<li><code translate="no" dir="ltr">bbfc12a</code> – 12A</li>
<li><code translate="no" dir="ltr">bbfc15</code> – 15</li>
<li><code translate="no" dir="ltr">bbfc18</code> – 18</li>
<li><code translate="no" dir="ltr">bbfcPg</code> – PG</li>
<li><code translate="no" dir="ltr">bbfcR18</code> – R18</li>
<li><code translate="no" dir="ltr">bbfcU</code> – U</li>
<li><code translate="no" dir="ltr">bbfcUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.bfvcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>bfvc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Thailand's Board of Film and Video Censors.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">bfvc13</code> – 13</li>
<li><code translate="no" dir="ltr">bfvc15</code> – 15</li>
<li><code translate="no" dir="ltr">bfvc18</code> – 18</li>
<li><code translate="no" dir="ltr">bfvc20</code> – 20</li>
<li><code translate="no" dir="ltr">bfvcB</code> – B</li>
<li><code translate="no" dir="ltr">bfvcE</code> – E</li>
<li><code translate="no" dir="ltr">bfvcG</code> – G</li>
<li><code translate="no" dir="ltr">bfvcUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.bmukkRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>bmukk<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Austrian Board of Media Classification (Bundesministerium für Unterricht, Kunst und Kultur).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">bmukk10</code> – 10+</li>
<li><code translate="no" dir="ltr">bmukk12</code> – 12+</li>
<li><code translate="no" dir="ltr">bmukk14</code> – 14+</li>
<li><code translate="no" dir="ltr">bmukk16</code> – 16+</li>
<li><code translate="no" dir="ltr">bmukk6</code> – 6+</li>
<li><code translate="no" dir="ltr">bmukk8</code> – 8+</li>
<li><code translate="no" dir="ltr">bmukkAa</code> – Unrestricted</li>
<li><code translate="no" dir="ltr">bmukkUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.catvRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>catv<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Rating system for Canadian TV - Canadian TV Classification System The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian English-language broadcasts. For more information, see the <a href="http://www.cbsc.ca/english/agvot/englishsystem.php">Canadian Broadcast Standards Council</a> website.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">catv14plus</code> – 14+</li>
<li><code translate="no" dir="ltr">catv18plus</code> – 18+</li>
<li><code translate="no" dir="ltr">catvC</code> – C</li>
<li><code translate="no" dir="ltr">catvC8</code> – C8</li>
<li><code translate="no" dir="ltr">catvG</code> – G</li>
<li><code translate="no" dir="ltr">catvPg</code> – PG</li>
<li><code translate="no" dir="ltr">catvUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.catvfrRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>catvfr<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Canadian Radio-Television and Telecommunications Commission (CRTC) for Canadian French-language broadcasts. For more information, see the <a href="http://www.cbsc.ca/english/agvot/frenchsystem.php">Canadian Broadcast Standards Council</a> website.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">catvfr13plus</code> – 13+</li>
<li><code translate="no" dir="ltr">catvfr16plus</code> – 16+</li>
<li><code translate="no" dir="ltr">catvfr18plus</code> – 18+</li>
<li><code translate="no" dir="ltr">catvfr8plus</code> – 8+</li>
<li><code translate="no" dir="ltr">catvfrG</code> – G</li>
<li><code translate="no" dir="ltr">catvfrUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cbfcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>cbfc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Central Board of Film Certification (CBFC - India) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">cbfcA</code> – A</li>
<li><code translate="no" dir="ltr">cbfcS</code> – S</li>
<li><code translate="no" dir="ltr">cbfcU</code> – U</li>
<li><code translate="no" dir="ltr">cbfcUnrated</code></li>
<li><code translate="no" dir="ltr">cbfcUA</code> – U/A</li>
<li><code translate="no" dir="ltr">cbfcUA7plus</code> – U/A</li>
<li><code translate="no" dir="ltr">cbfcUA13plus</code> – U/A</li>
<li><code translate="no" dir="ltr">cbfcUA16plus</code> – U/A</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cccRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>ccc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Consejo de Calificación Cinematográfica (Chile) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">ccc14</code> – 14+</li>
<li><code translate="no" dir="ltr">ccc18</code> – 18+</li>
<li><code translate="no" dir="ltr">ccc18s</code> – 18+ - contenido pornográfico</li>
<li><code translate="no" dir="ltr">ccc18v</code> – 18+ - contenido excesivamente violento</li>
<li><code translate="no" dir="ltr">ccc6</code> – 6+ - Inconveniente para menores de 7 años</li>
<li><code translate="no" dir="ltr">cccTe</code> – Todo espectador</li>
<li><code translate="no" dir="ltr">cccUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cceRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>cce<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Portugal's Comissão de Classificação de Espect´culos.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">cceM12</code> – 12</li>
<li><code translate="no" dir="ltr">cceM14</code> – 14</li>
<li><code translate="no" dir="ltr">cceM16</code> – 16</li>
<li><code translate="no" dir="ltr">cceM18</code> – 18</li>
<li><code translate="no" dir="ltr">cceM4</code> – 4</li>
<li><code translate="no" dir="ltr">cceM6</code> – 6</li>
<li><code translate="no" dir="ltr">cceUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.chfilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>chfilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Switzerland.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">chfilm0</code> – 0</li>
<li><code translate="no" dir="ltr">chfilm12</code> – 12</li>
<li><code translate="no" dir="ltr">chfilm16</code> – 16</li>
<li><code translate="no" dir="ltr">chfilm18</code> – 18</li>
<li><code translate="no" dir="ltr">chfilm6</code> – 6</li>
<li><code translate="no" dir="ltr">chfilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.chvrsRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>chvrs<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Canadian Home Video Rating System (CHVRS) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">chvrs14a</code> – 14A</li>
<li><code translate="no" dir="ltr">chvrs18a</code> – 18A</li>
<li><code translate="no" dir="ltr">chvrsE</code> – E</li>
<li><code translate="no" dir="ltr">chvrsG</code> – G</li>
<li><code translate="no" dir="ltr">chvrsPg</code> – PG</li>
<li><code translate="no" dir="ltr">chvrsR</code> – R</li>
<li><code translate="no" dir="ltr">chvrsUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cicfRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>cicf<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Commission de Contrôle des Films (Belgium).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">cicfE</code> – E</li>
<li><code translate="no" dir="ltr">cicfKntEna</code> – KNT/ENA</li>
<li><code translate="no" dir="ltr">cicfKtEa</code> – KT/EA</li>
<li><code translate="no" dir="ltr">cicfUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cnaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>cna<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Romania's CONSILIUL NATIONAL AL AUDIOVIZUALULUI (CNA).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">cna12</code> – 12</li>
<li><code translate="no" dir="ltr">cna15</code> – 15</li>
<li><code translate="no" dir="ltr">cna18</code> – 18</li>
<li><code translate="no" dir="ltr">cna18plus</code> – 18+</li>
<li><code translate="no" dir="ltr">cnaAp</code> – AP</li>
<li><code translate="no" dir="ltr">cnaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cncRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>cnc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Rating system in France - Commission de classification cinematographique<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">cnc10</code> – 10</li>
<li><code translate="no" dir="ltr">cnc12</code> – 12</li>
<li><code translate="no" dir="ltr">cnc16</code> – 16</li>
<li><code translate="no" dir="ltr">cnc18</code> – 18</li>
<li><code translate="no" dir="ltr">cncE</code> – E</li>
<li><code translate="no" dir="ltr">cncT</code> – T</li>
<li><code translate="no" dir="ltr">cncUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.csaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>csa<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from France's Conseil supérieur de l?audiovisuel, which rates broadcast content.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">csa10</code> – 10</li>
<li><code translate="no" dir="ltr">csa12</code> – 12</li>
<li><code translate="no" dir="ltr">csa16</code> – 16</li>
<li><code translate="no" dir="ltr">csa18</code> – 18</li>
<li><code translate="no" dir="ltr">csaInterdiction</code> – Interdiction</li>
<li><code translate="no" dir="ltr">csaT</code> – T</li>
<li><code translate="no" dir="ltr">csaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.cscfRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>cscf<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Luxembourg's Commission de surveillance de la classification des films (CSCF).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">cscf12</code> – 12</li>
<li><code translate="no" dir="ltr">cscf16</code> – 16</li>
<li><code translate="no" dir="ltr">cscf18</code> – 18</li>
<li><code translate="no" dir="ltr">cscf6</code> – 6</li>
<li><code translate="no" dir="ltr">cscf9</code> – 9</li>
<li><code translate="no" dir="ltr">cscfA</code> – A</li>
<li><code translate="no" dir="ltr">cscfAl</code> – AL</li>
<li><code translate="no" dir="ltr">cscfUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.czfilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>czfilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in the Czech Republic.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">czfilm12</code> – 12</li>
<li><code translate="no" dir="ltr">czfilm14</code> – 14</li>
<li><code translate="no" dir="ltr">czfilm18</code> – 18</li>
<li><code translate="no" dir="ltr">czfilmU</code> – U</li>
<li><code translate="no" dir="ltr">czfilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.djctqRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>djctq<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Departamento de Justiça, Classificação, Qualificação e Títulos (DJCQT - Brazil) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">djctq10</code> – 10</li>
<li><code translate="no" dir="ltr">djctq12</code> – 12</li>
<li><code translate="no" dir="ltr">djctq14</code> – 14</li>
<li><code translate="no" dir="ltr">djctq16</code> – 16</li>
<li><code translate="no" dir="ltr">djctq18</code> – 18</li>
<li><code translate="no" dir="ltr">djctqL</code> – L</li>
<li><code translate="no" dir="ltr">djctqUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.djctqRatingReasons[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>djctq<wbr>Rating<wbr>Reasons[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      Reasons that explain why the video received its DJCQT (Brazil) rating.</td>
    </tr>
    <tr id="contentDetails.contentRating.ecbmctRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>ecbmct<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Rating system in Turkey - Evaluation and Classification Board of the Ministry of Culture and Tourism<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">ecbmct13a</code> – 13A</li>
<li><code translate="no" dir="ltr">ecbmct13plus</code> – 13+</li>
<li><code translate="no" dir="ltr">ecbmct15a</code> – 15A</li>
<li><code translate="no" dir="ltr">ecbmct15plus</code> – 15+</li>
<li><code translate="no" dir="ltr">ecbmct18plus</code> – 18+</li>
<li><code translate="no" dir="ltr">ecbmct7a</code> – 7A</li>
<li><code translate="no" dir="ltr">ecbmct7plus</code> – 7+</li>
<li><code translate="no" dir="ltr">ecbmctG</code> – G</li>
<li><code translate="no" dir="ltr">ecbmctUnrated</code></li>
<li><code translate="no" dir="ltr">ecbmct6a</code> – 6A</li>
<li><code translate="no" dir="ltr">ecbmct6plus</code> – 6+</li>
<li><code translate="no" dir="ltr">ecbmct10a</code> – 10A</li>
<li><code translate="no" dir="ltr">ecbmct10plus</code> – 10+</li>
<li><code translate="no" dir="ltr">ecbmct16plus</code> – 16+</li>
</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.eefilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>eefilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Estonia.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">eefilmK12</code> – K-12</li>
<li><code translate="no" dir="ltr">eefilmK14</code> – K-14</li>
<li><code translate="no" dir="ltr">eefilmK16</code> – K-16</li>
<li><code translate="no" dir="ltr">eefilmK6</code> – K-6</li>
<li><code translate="no" dir="ltr">eefilmL</code> – L</li>
<li><code translate="no" dir="ltr">eefilmMs12</code> – MS-12</li>
<li><code translate="no" dir="ltr">eefilmMs6</code> – MS-6</li>
<li><code translate="no" dir="ltr">eefilmPere</code> – Pere</li>
<li><code translate="no" dir="ltr">eefilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.egfilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>egfilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Egypt.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">egfilm18</code> – 18</li>
<li><code translate="no" dir="ltr">egfilmBn</code> – BN</li>
<li><code translate="no" dir="ltr">egfilmGn</code> – GN</li>
<li><code translate="no" dir="ltr">egfilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.eirinRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>eirin<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Eirin (映倫) rating. Eirin is the Japanese rating system.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">eirinG</code> – G</li>
<li><code translate="no" dir="ltr">eirinPg12</code> – PG-12</li>
<li><code translate="no" dir="ltr">eirinR15plus</code> – R15+</li>
<li><code translate="no" dir="ltr">eirinR18plus</code> – R18+</li>
<li><code translate="no" dir="ltr">eirinUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.fcbmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>fcbm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Malaysia's Film Censorship Board.<br><br>Valid values for this property are:
<ul>
<li><code translate="no" dir="ltr">fcbm13</code> – 13</li>
<li><code translate="no" dir="ltr">fcbm16</code> – 16</li>
<li><code translate="no" dir="ltr">fcbm18</code> – 18</li>
<li><code translate="no" dir="ltr">fcbm18pa</code> – 18PA</li>
<li><code translate="no" dir="ltr">fcbm18pl</code> – 18PL</li>
<li><code translate="no" dir="ltr">fcbm18sg</code> – 18SG</li>
<li><code translate="no" dir="ltr">fcbm18sx</code> – 18SX</li>
<li><code translate="no" dir="ltr">fcbmP12</code> – P12</li>
<li><code translate="no" dir="ltr">fcbmP13</code> – P13</li>
<li><code translate="no" dir="ltr">fcbmPg13</code> – PG13</li>
<li><code translate="no" dir="ltr">fcbmU</code> – U</li>
<li><code translate="no" dir="ltr">fcbmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.fcoRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>fco<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Hong Kong's Office for Film, Newspaper and Article Administration.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">fcoI</code> – I</li>
<li><code translate="no" dir="ltr">fcoIi</code> – II</li>
<li><code translate="no" dir="ltr">fcoIia</code> – IIA</li>
<li><code translate="no" dir="ltr">fcoIib</code> – IIB</li>
<li><code translate="no" dir="ltr">fcoIii</code> – III</li>
<li><code translate="no" dir="ltr">fcoUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.fmocRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>fmoc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span class="deprecated">This property has been deprecated as of November 2, 2015. Use the <code translate="no" dir="ltr"><a href="#contentDetails.contentRating.cncRating">contentDetails.contentRating.cncRating</a></code> property instead.</span><br><br>The video's Centre national du cinéma et de l'image animé (French Ministry of Culture) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">fmoc10</code> – 10</li>
<li><code translate="no" dir="ltr">fmoc12</code> – 12</li>
<li><code translate="no" dir="ltr">fmoc16</code> – 16</li>
<li><code translate="no" dir="ltr">fmoc18</code> – 18</li>
<li><code translate="no" dir="ltr">fmocE</code> – E</li>
<li><code translate="no" dir="ltr">fmocU</code> – U</li>
<li><code translate="no" dir="ltr">fmocUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.fpbRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>fpb<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from South Africa's Film and Publication Board.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">fpb10</code> – 10</li>
<li><code translate="no" dir="ltr">fpb1012Pg</code> – 10-12PG</li>
<li><code translate="no" dir="ltr">fpb13</code> – 13</li>
<li><code translate="no" dir="ltr">fpb16</code> – 16</li>
<li><code translate="no" dir="ltr">fpb18</code> – 18</li>
<li><code translate="no" dir="ltr">fpb79Pg</code> – 7-9PG</li>
<li><code translate="no" dir="ltr">fpbA</code> – A</li>
<li><code translate="no" dir="ltr">fpbPg</code> – PG</li>
<li><code translate="no" dir="ltr">fpbUnrated</code></li>
<li><code translate="no" dir="ltr">fpbX18</code> – X18</li>
<li><code translate="no" dir="ltr">fpbXx</code> – XX</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.fpbRatingReasons[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>fpb<wbr>Rating<wbr>Reasons[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      Reasons that explain why the video received its FPB (South Africa) rating.</td>
    </tr>
    <tr id="contentDetails.contentRating.fskRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>fsk<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Freiwillige Selbstkontrolle der Filmwirtschaft (FSK - Germany) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">fsk0</code> – FSK 0</li>
<li><code translate="no" dir="ltr">fsk12</code> – FSK 12</li>
<li><code translate="no" dir="ltr">fsk16</code> – FSK 16</li>
<li><code translate="no" dir="ltr">fsk18</code> – FSK 18</li>
<li><code translate="no" dir="ltr">fsk6</code> – FSK 6</li>
<li><code translate="no" dir="ltr">fskUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.grfilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>grfilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Greece.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">grfilmE</code> – E</li>
<li><code translate="no" dir="ltr">grfilmK</code> – K</li>
<li><code translate="no" dir="ltr">grfilmK12</code> – K-12</li>
<li><code translate="no" dir="ltr">grfilmK13</code> – K-13</li>
<li><code translate="no" dir="ltr">grfilmK15</code> – K-15</li>
<li><code translate="no" dir="ltr">grfilmK17</code> – K-17</li>
<li><code translate="no" dir="ltr">grfilmK18</code> – K-18</li>
<li><code translate="no" dir="ltr">grfilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.icaaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>icaa<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Instituto de la Cinematografía y de las Artes Audiovisuales (ICAA - Spain) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">icaa12</code> – 12</li>
<li><code translate="no" dir="ltr">icaa13</code> – 13</li>
<li><code translate="no" dir="ltr">icaa16</code> – 16</li>
<li><code translate="no" dir="ltr">icaa18</code> – 18</li>
<li><code translate="no" dir="ltr">icaa7</code> – 7</li>
<li><code translate="no" dir="ltr">icaaApta</code> – APTA</li>
<li><code translate="no" dir="ltr">icaaUnrated</code></li>
<li><code translate="no" dir="ltr">icaaX</code> – X</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.ifcoRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>ifco<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Irish Film Classification Office (IFCO - Ireland) rating. See the <a href="http://www.ifco.ie/website/ifco/ifcoweb.nsf/web/classcatintro">IFCO</a> website for more information.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">ifco12</code> – 12</li>
<li><code translate="no" dir="ltr">ifco12a</code> – 12A</li>
<li><code translate="no" dir="ltr">ifco15</code> – 15</li>
<li><code translate="no" dir="ltr">ifco15a</code> – 15A</li>
<li><code translate="no" dir="ltr">ifco16</code> – 16</li>
<li><code translate="no" dir="ltr">ifco18</code> – 18</li>
<li><code translate="no" dir="ltr">ifcoG</code> – G</li>
<li><code translate="no" dir="ltr">ifcoPg</code> – PG</li>
<li><code translate="no" dir="ltr">ifcoUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.ilfilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>ilfilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Israel.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">ilfilm12</code> – 12</li>
<li><code translate="no" dir="ltr">ilfilm16</code> – 16</li>
<li><code translate="no" dir="ltr">ilfilm18</code> – 18</li>
<li><code translate="no" dir="ltr">ilfilmAa</code> – AA</li>
<li><code translate="no" dir="ltr">ilfilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.incaaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>incaa<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's INCAA (Instituto Nacional de Cine y Artes Audiovisuales - Argentina) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">incaaAtp</code> – ATP (Apta para todo publico)</li>
<li><code translate="no" dir="ltr">incaaC</code> – X (Solo apta para mayores de 18 años, de exhibición condicionada)</li>
<li><code translate="no" dir="ltr">incaaSam13</code> – 13 (Solo apta para mayores de 13 años)</li>
<li><code translate="no" dir="ltr">incaaSam16</code> – 16 (Solo apta para mayores de 16 años)</li>
<li><code translate="no" dir="ltr">incaaSam18</code> – 18 (Solo apta para mayores de 18 años)</li>
<li><code translate="no" dir="ltr">incaaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.kfcbRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>kfcb<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Kenya Film Classification Board.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">kfcb16plus</code> – 16</li>
<li><code translate="no" dir="ltr">kfcbG</code> – GE</li>
<li><code translate="no" dir="ltr">kfcbPg</code> – PG</li>
<li><code translate="no" dir="ltr">kfcbR</code> – 18</li>
<li><code translate="no" dir="ltr">kfcbUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.kijkwijzerRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>kijkwijzer<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      voor de Classificatie van Audiovisuele Media (Netherlands).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">kijkwijzer12</code> – 12</li>
  <li><code translate="no" dir="ltr">kijkwijzer14</code> – 14</li>
<li><code translate="no" dir="ltr">kijkwijzer16</code> – 16</li>
<li><code translate="no" dir="ltr">kijkwijzer18</code> – 18</li>
<li><code translate="no" dir="ltr">kijkwijzer6</code> – 6</li>
<li><code translate="no" dir="ltr">kijkwijzer9</code> – 9</li>
<li><code translate="no" dir="ltr">kijkwijzerAl</code> – AL</li>
<li><code translate="no" dir="ltr">kijkwijzerUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.kmrbRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>kmrb<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Korea Media Rating Board (영상물등급위원회) rating. The KMRB rates videos in South Korea.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">kmrb12plus</code> – 12세 이상 관람가</li>
<li><code translate="no" dir="ltr">kmrb15plus</code> – 15세 이상 관람가</li>
<li><code translate="no" dir="ltr">kmrbAll</code> – 전체관람가</li>
<li><code translate="no" dir="ltr">kmrbR</code> – 청소년 관람불가</li>
<li><code translate="no" dir="ltr">kmrbTeenr</code></li>
<li><code translate="no" dir="ltr">kmrbUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.lsfRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>lsf<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Indonesia's Lembaga Sensor Film.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">lsf13</code> – 13</li>
<li><code translate="no" dir="ltr">lsf17</code> – 17</li>
<li><code translate="no" dir="ltr">lsf21</code> – 21</li>
<li><code translate="no" dir="ltr">lsfA</code> – A</li>
<li><code translate="no" dir="ltr">lsfBo</code> – BO</li>
<li><code translate="no" dir="ltr">lsfD</code> – D</li>
<li><code translate="no" dir="ltr">lsfR</code> – R</li>
<li><code translate="no" dir="ltr">lsfSu</code> – SU</li>
<li><code translate="no" dir="ltr">lsfUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mccaaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mccaa<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Malta's Film Age-Classification Board.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mccaa12</code> – 12</li>
<li><code translate="no" dir="ltr">mccaa12a</code> – 12A</li>
<li><code translate="no" dir="ltr">mccaa14</code> – 14 - this rating was removed from the new classification structure introduced in 2013.</li>
<li><code translate="no" dir="ltr">mccaa15</code> – 15</li>
<li><code translate="no" dir="ltr">mccaa16</code> – 16 - this rating was removed from the new classification structure introduced in 2013.</li>
<li><code translate="no" dir="ltr">mccaa18</code> – 18</li>
<li><code translate="no" dir="ltr">mccaaPg</code> – PG</li>
<li><code translate="no" dir="ltr">mccaaU</code> – U</li>
<li><code translate="no" dir="ltr">mccaaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mccypRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mccyp<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Danish Film Institute's (Det Danske Filminstitut) Media Council for Children and Young People.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mccyp11</code> – 11</li>
<li><code translate="no" dir="ltr">mccyp15</code> – 15</li>
<li><code translate="no" dir="ltr">mccyp7</code> – 7</li>
<li><code translate="no" dir="ltr">mccypA</code> – A</li>
<li><code translate="no" dir="ltr">mccypUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mcstRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mcst<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating system for Vietnam - MCST<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mcst0</code> – 0</li>
<li><code translate="no" dir="ltr">mcst16plus</code> – 16+</li>
<li><code translate="no" dir="ltr">mcstC13</code> – C13</li>
<li><code translate="no" dir="ltr">mcstC16</code> – C16</li>
<li><code translate="no" dir="ltr">mcstC18</code> – C18</li>
<li><code translate="no" dir="ltr">mcstP</code> – P</li>
<li><code translate="no" dir="ltr">mcstUnrated</code></li>
<li><code translate="no" dir="ltr">mcstT13</code> – T13</li>
<li><code translate="no" dir="ltr">mcstT16</code> – T16</li>
<li><code translate="no" dir="ltr">mcstT18</code> – T18</li>
<li><code translate="no" dir="ltr">mcstK</code> – K</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mdaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mda<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Singapore's Media Development Authority (MDA) and, specifically, it's Board of Film Censors (BFC).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mdaG</code> – G</li>
<li><code translate="no" dir="ltr">mdaM18</code> – M18</li>
<li><code translate="no" dir="ltr">mdaNc16</code> – NC16</li>
<li><code translate="no" dir="ltr">mdaPg</code> – PG</li>
<li><code translate="no" dir="ltr">mdaPg13</code> – PG13</li>
<li><code translate="no" dir="ltr">mdaR21</code> – R21</li>
<li><code translate="no" dir="ltr">mdaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.medietilsynetRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>medietilsynet<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Medietilsynet, the Norwegian Media Authority.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">medietilsynet11</code> – 11</li>
<li><code translate="no" dir="ltr">medietilsynet12</code> – 12</li>
<li><code translate="no" dir="ltr">medietilsynet15</code> – 15</li>
<li><code translate="no" dir="ltr">medietilsynet18</code> – 18</li>
<li><code translate="no" dir="ltr">medietilsynet6</code> – 6</li>
<li><code translate="no" dir="ltr">medietilsynet7</code> – 7</li>
<li><code translate="no" dir="ltr">medietilsynet9</code> – 9</li>
<li><code translate="no" dir="ltr">medietilsynetA</code> – A</li>
<li><code translate="no" dir="ltr">medietilsynetUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mekuRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>meku<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Finland's Kansallinen Audiovisuaalinen Instituutti (National Audiovisual Institute).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">meku12</code> – 12</li>
<li><code translate="no" dir="ltr">meku16</code> – 16</li>
<li><code translate="no" dir="ltr">meku18</code> – 18</li>
<li><code translate="no" dir="ltr">meku7</code> – 7</li>
<li><code translate="no" dir="ltr">mekuS</code> – S</li>
<li><code translate="no" dir="ltr">mekuUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mibacRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mibac<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Ministero dei Beni e delle Attività Culturali e del Turismo (Italy).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mibacT</code></li>
<li><code translate="no" dir="ltr">mibacUnrated</code></li>
<li><code translate="no" dir="ltr">mibacVap</code></li>
<li><code translate="no" dir="ltr">mibacVm6</code></li>
<li><code translate="no" dir="ltr">mibacVm12</code></li>
<li><code translate="no" dir="ltr">mibacVm14</code></li>
<li><code translate="no" dir="ltr">mibacVm18</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mocRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>moc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Ministerio de Cultura (Colombia) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">moc12</code> – 12</li>
<li><code translate="no" dir="ltr">moc15</code> – 15</li>
<li><code translate="no" dir="ltr">moc18</code> – 18</li>
<li><code translate="no" dir="ltr">moc7</code> – 7</li>
<li><code translate="no" dir="ltr">mocBanned</code> – Banned</li>
<li><code translate="no" dir="ltr">mocE</code> – E</li>
<li><code translate="no" dir="ltr">mocT</code> – T</li>
<li><code translate="no" dir="ltr">mocUnrated</code></li>
<li><code translate="no" dir="ltr">mocX</code> – X</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.moctwRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>moctw<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Taiwan's Ministry of Culture (文化部).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">moctwG</code> – G</li>
<li><code translate="no" dir="ltr">moctwP</code> – P</li>
<li><code translate="no" dir="ltr">moctwPg</code> – PG</li>
<li><code translate="no" dir="ltr">moctwR</code> – R</li>
<li><code translate="no" dir="ltr">moctwR12</code> – R-12</li>
<li><code translate="no" dir="ltr">moctwR15</code> – R-15</li>
<li><code translate="no" dir="ltr">moctwUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mpaaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mpaa<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Motion Picture Association of America (MPAA) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mpaaG</code> – G</li>
<li><code translate="no" dir="ltr">mpaaNc17</code> – NC-17</li>
<li><code translate="no" dir="ltr">mpaaPg</code> – PG</li>
<li><code translate="no" dir="ltr">mpaaPg13</code> – PG-13</li>
<li><code translate="no" dir="ltr">mpaaR</code> – R</li>
<li><code translate="no" dir="ltr">mpaaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mpaatRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mpaat<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The Motion Picture Association of America's rating for movie trailers and preview.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mpaatGb</code> – GB (Green Band - Approved for all audiences)</li>
<li><code translate="no" dir="ltr">mpaatRb</code> – RB (Red Band - Recommended for ages 17+)</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.mtrcbRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>mtrcb<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Movie and Television Review and Classification Board (Philippines).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">mtrcbG</code> – G</li>
<li><code translate="no" dir="ltr">mtrcbPg</code> – PG</li>
<li><code translate="no" dir="ltr">mtrcbR13</code> – R-13</li>
<li><code translate="no" dir="ltr">mtrcbR16</code> – R-16</li>
<li><code translate="no" dir="ltr">mtrcbR18</code> – R-18</li>
<li><code translate="no" dir="ltr">mtrcbUnrated</code></li>
<li><code translate="no" dir="ltr">mtrcbX</code> – X</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.nbcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>nbc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Maldives National Bureau of Classification.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">nbc12plus</code> – 12+</li>
<li><code translate="no" dir="ltr">nbc15plus</code> – 15+</li>
<li><code translate="no" dir="ltr">nbc18plus</code> – 18+</li>
<li><code translate="no" dir="ltr">nbc18plusr</code> – 18+R</li>
<li><code translate="no" dir="ltr">nbcG</code> – G</li>
<li><code translate="no" dir="ltr">nbcPg</code> – PG</li>
<li><code translate="no" dir="ltr">nbcPu</code> – PU</li>
<li><code translate="no" dir="ltr">nbcUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.nfrcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>nfrc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the <a href="http://www.nfc.bg/">Bulgarian National Film Center</a>.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">nfrcA</code> – A</li>
<li><code translate="no" dir="ltr">nfrcB</code> – B</li>
<li><code translate="no" dir="ltr">nfrcC</code> – C</li>
<li><code translate="no" dir="ltr">nfrcD</code> – D</li>
<li><code translate="no" dir="ltr">nfrcUnrated</code></li>
<li><code translate="no" dir="ltr">nfrcX</code> – X</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.nfvcbRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>nfvcb<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Nigeria's National Film and Video Censors Board.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">nfvcb12</code> – 12</li>
<li><code translate="no" dir="ltr">nfvcb12a</code> – 12A</li>
<li><code translate="no" dir="ltr">nfvcb15</code> – 15</li>
<li><code translate="no" dir="ltr">nfvcb18</code> – 18</li>
<li><code translate="no" dir="ltr">nfvcbG</code> – G</li>
<li><code translate="no" dir="ltr">nfvcbPg</code> – PG</li>
<li><code translate="no" dir="ltr">nfvcbRe</code> – RE</li>
<li><code translate="no" dir="ltr">nfvcbUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.nkclvRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>nkclv<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from the Nacionãlais Kino centrs (National Film Centre of Latvia).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">nkclv12plus</code> – 12+</li>
<li><code translate="no" dir="ltr">nkclv18plus</code> – 18+</li>
<li><code translate="no" dir="ltr">nkclv7plus</code> – 7+</li>
<li><code translate="no" dir="ltr">nkclvU</code> – U</li>
<li><code translate="no" dir="ltr">nkclvUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.oflcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>oflc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's Office of Film and Literature Classification (OFLC - New Zealand) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">oflcG</code> – G</li>
<li><code translate="no" dir="ltr">oflcM</code> – M</li>
<li><code translate="no" dir="ltr">oflcPg</code> – PG</li>
<li><code translate="no" dir="ltr">oflcR13</code> – R13</li>
<li><code translate="no" dir="ltr">oflcR15</code> – R15</li>
<li><code translate="no" dir="ltr">oflcR16</code> – R16</li>
<li><code translate="no" dir="ltr">oflcR18</code> – R18</li>
<li><code translate="no" dir="ltr">oflcRp13</code> – RP13</li>
<li><code translate="no" dir="ltr">oflcRp16</code> – RP16</li>
<li><code translate="no" dir="ltr">oflcUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.pefilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>pefilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Peru.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">pefilm14</code> – 14</li>
<li><code translate="no" dir="ltr">pefilm18</code> – 18</li>
<li><code translate="no" dir="ltr">pefilmPg</code> – PG</li>
<li><code translate="no" dir="ltr">pefilmPt</code> – PT</li>
<li><code translate="no" dir="ltr">pefilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.resorteviolenciaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>resorteviolencia<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Venezuela.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">resorteviolenciaA</code> – A</li>
<li><code translate="no" dir="ltr">resorteviolenciaB</code> – B</li>
<li><code translate="no" dir="ltr">resorteviolenciaC</code> – C</li>
<li><code translate="no" dir="ltr">resorteviolenciaD</code> – D</li>
<li><code translate="no" dir="ltr">resorteviolenciaE</code> – E</li>
<li><code translate="no" dir="ltr">resorteviolenciaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.rtcRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>rtc<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's General Directorate of Radio, Television and Cinematography (Mexico) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">rtcA</code> – A</li>
<li><code translate="no" dir="ltr">rtcAa</code> – AA</li>
<li><code translate="no" dir="ltr">rtcB</code> – B</li>
<li><code translate="no" dir="ltr">rtcB15</code> – B15</li>
<li><code translate="no" dir="ltr">rtcC</code> – C</li>
<li><code translate="no" dir="ltr">rtcD</code> – D</li>
<li><code translate="no" dir="ltr">rtcUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.rteRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>rte<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Ireland's Raidió Teilifís Éireann.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">rteCh</code> – CH</li>
<li><code translate="no" dir="ltr">rteGa</code> – GA</li>
<li><code translate="no" dir="ltr">rteMa</code> – MA</li>
<li><code translate="no" dir="ltr">rtePs</code> – PS</li>
<li><code translate="no" dir="ltr">rteUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.russiaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>russia<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's National Film Registry of the Russian Federation (MKRF - Russia) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">russia0</code> – 0+</li>
<li><code translate="no" dir="ltr">russia12</code> – 12+</li>
<li><code translate="no" dir="ltr">russia16</code> – 16+</li>
<li><code translate="no" dir="ltr">russia18</code> – 18+</li>
<li><code translate="no" dir="ltr">russia6</code> – 6+</li>
<li><code translate="no" dir="ltr">russiaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.skfilmRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>skfilm<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Slovakia.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">skfilmG</code> – G</li>
<li><code translate="no" dir="ltr">skfilmP2</code> – P2</li>
<li><code translate="no" dir="ltr">skfilmP5</code> – P5</li>
<li><code translate="no" dir="ltr">skfilmP8</code> – P8</li>
<li><code translate="no" dir="ltr">skfilmUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.smaisRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>smais<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating in Iceland.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">smais12</code> – 12</li>
<li><code translate="no" dir="ltr">smais14</code> – 14</li>
<li><code translate="no" dir="ltr">smais16</code> – 16</li>
<li><code translate="no" dir="ltr">smais18</code> – 18</li>
<li><code translate="no" dir="ltr">smais7</code> – 7</li>
<li><code translate="no" dir="ltr">smaisL</code> – L</li>
<li><code translate="no" dir="ltr">smaisUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.smsaRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>smsa<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's rating from Statens medieråd (Sweden's National Media Council).<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">smsa11</code> – 11</li>
<li><code translate="no" dir="ltr">smsa15</code> – 15</li>
<li><code translate="no" dir="ltr">smsa7</code> – 7</li>
<li><code translate="no" dir="ltr">smsaA</code> – All ages</li>
<li><code translate="no" dir="ltr">smsaUnrated</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.tvpgRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>tvpg<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's TV Parental Guidelines (TVPG) rating.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">tvpgG</code> – TV-G</li>
<li><code translate="no" dir="ltr">tvpgMa</code> – TV-MA</li>
<li><code translate="no" dir="ltr">tvpgPg</code> – TV-PG</li>
<li><code translate="no" dir="ltr">tvpgUnrated</code></li>
<li><code translate="no" dir="ltr">tvpgY</code> – TV-Y</li>
<li><code translate="no" dir="ltr">tvpgY7</code> – TV-Y7</li>
<li><code translate="no" dir="ltr">tvpgY7Fv</code> – TV-Y7-FV</li>
<li><code translate="no" dir="ltr">pg14</code> – TV-14</li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.contentRating.ytRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr>content<wbr>Rating.<wbr></span>yt<wbr>Rating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      A rating that YouTube uses to identify age-restricted content.<br><br>Valid values for this property are:
<ul>
<li><code translate="no" dir="ltr">ytAgeRestricted</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.projection">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>projection</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Specifies the projection format of the video.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">360</code></li>
<li><code translate="no" dir="ltr">rectangular</code></li>

</ul>
</td>
    </tr>
    <tr id="contentDetails.hasCustomThumbnail">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">content<wbr>Details.<wbr></span>has<wbr>Custom<wbr>Thumbnail</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the video uploader has provided a custom thumbnail image for the video. This property is only visible to the video uploader.</td>
    </tr>
    <tr id="status">
      <td><code itemprop="property" translate="no" dir="ltr">status</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">status</code> object contains information about the video's uploading, processing, and privacy statuses.</td>
    </tr>
    <tr id="status.uploadStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>upload<wbr>Status</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The status of the uploaded video.<br><br>Valid values for this property are:
<ul>
<li><code translate="no" dir="ltr">deleted</code></li>
<li><code translate="no" dir="ltr">failed</code></li>
<li><code translate="no" dir="ltr">processed</code></li>
<li><code translate="no" dir="ltr">rejected</code></li>
<li><code translate="no" dir="ltr">uploaded</code></li>

</ul>
</td>
    </tr>
    <tr id="status.failureReason">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>failure<wbr>Reason</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value explains why a video failed to upload. This property is only present if the <code translate="no" dir="ltr">upload<wbr>Status</code> property indicates that the upload failed.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">codec</code></li>
<li><code translate="no" dir="ltr">conversion</code></li>
<li><code translate="no" dir="ltr">emptyFile</code></li>
<li><code translate="no" dir="ltr">invalidFile</code></li>
<li><code translate="no" dir="ltr">tooSmall</code></li>
<li><code translate="no" dir="ltr">uploadAborted</code></li>

</ul>
</td>
    </tr>
    <tr id="status.rejectionReason">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>rejection<wbr>Reason</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value explains why YouTube rejected an uploaded video. This property is only present if the <code translate="no" dir="ltr">upload<wbr>Status</code> property indicates that the upload was rejected.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">claim</code></li>
<li><code translate="no" dir="ltr">copyright</code></li>
<li><code translate="no" dir="ltr">duplicate</code></li>
<li><code translate="no" dir="ltr">inappropriate</code></li>
<li><code translate="no" dir="ltr">legal</code></li>
<li><code translate="no" dir="ltr">length</code></li>
<li><code translate="no" dir="ltr">termsOfUse</code></li>
<li><code translate="no" dir="ltr">trademark</code></li>
<li><code translate="no" dir="ltr">uploaderAccountClosed</code></li>
<li><code translate="no" dir="ltr">uploaderAccountSuspended</code></li>

</ul>
</td>
    </tr>
    <tr id="status.privacyStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>privacy<wbr>Status</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's privacy status.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">private</code></li>
<li><code translate="no" dir="ltr">public</code></li>
<li><code translate="no" dir="ltr">unlisted</code></li>

</ul>
</td>
    </tr>
    <tr id="status.publishAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>publish<wbr>At</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time when the video is scheduled to publish. It can be set only if the privacy status of the video is private. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format. Note the following two additional points about this property's behavior: <ul> <li>If you set this property's value when calling the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/update">videos.update</a></code> method, you must also set the <code translate="no" dir="ltr"><a href="#status.privacyStatus">status.privacyStatus</a></code> property value to <code translate="no" dir="ltr">private</code> even if the video is already private.</li> <li>This property can only be set if the video's privacy status is <code translate="no" dir="ltr">private</code> and the video has never been published.</li> <li>If your request schedules a video to be published at some time in the past, the video will be published right away. As such, the effect of setting the <code translate="no" dir="ltr">status.publishAt</code> property to a past date and time is the same as of changing the video's <code translate="no" dir="ltr"><a href="#status.privacyStatus">privacyStatus</a></code> from <code translate="no" dir="ltr">private</code> to <code translate="no" dir="ltr">public</code>.</li> </ul></td>
    </tr>
    <tr id="status.license">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>license</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's license.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">creativeCommon</code></li>
<li><code translate="no" dir="ltr">youtube</code></li>

</ul>
</td>
    </tr>
    <tr id="status.embeddable">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>embeddable</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      This value indicates whether the video can be embedded on another website.</td>
    </tr>
    <tr id="status.publicStatsViewable">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>public<wbr>Stats<wbr>Viewable</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      This value indicates whether the extended video statistics on the video's watch page are publicly viewable. By default, those statistics are viewable, and statistics like a video's viewcount and ratings will still be publicly visible even if this property's value is set to <code translate="no" dir="ltr">false</code>.</td>
    </tr>
    <tr id="status.madeForKids">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>made<wbr>For<wbr>Kids</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
        This value indicates whether the video is designated as child-directed, and it contains the
        current "made for kids" status of the video. For example, the status might be determined
        based on the value of the <code translate="no" dir="ltr">self<wbr>Declared<wbr>Made<wbr>For<wbr>Kids</code> property. See the
        <a href="https://support.google.com/youtube/answer/9527654">YouTube Help Center</a> for more
        information about setting the audience for your channel, videos, or broadcasts.
</td>
    </tr>
    <tr id="status.selfDeclaredMadeForKids">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>self<wbr>Declared<wbr>Made<wbr>For<wbr>Kids</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      In a <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/insert">videos.<wbr>insert</a></code> or
        <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/update">videos.<wbr>update</a></code> request, this
        property allows the channel owner to designate the video as being child-directed. In a
        <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list">videos.<wbr>list</a></code> request, the property
        value is only returned if the channel owner authorized the API request.</td>
    </tr>
    <tr id="status.containsSyntheticMedia">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.<wbr></span>contains<wbr>Synthetic<wbr>Media</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      In a <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/insert">videos.<wbr>insert</a></code> or
        <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/update">videos.<wbr>update</a></code> request, this
        property allows the channel owner to disclose that a video contains realistic <b>Altered or
        Synthetic</b> (<b>A/S</b>) content. Learn more about
        <a href="https://blog.youtube/inside-youtube/our-approach-to-responsible-ai-innovation/">YouTube
           policies related to A/S content</a>.<br><br>
        Examples of A/S content include videos that:
        <ul>
          <li>Make a real person appear to say or do something they didn't actually say or do</li>
          <li>Alter footage of a real event or place</li>
          <li>Generate a realistic-looking scene that did not actually occur</li>
        </ul>
      </td>
    </tr>
    <tr id="statistics">
      <td><code itemprop="property" translate="no" dir="ltr">statistics</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">statistics</code> object contains statistics about the video.</td>
    </tr>
    <tr id="statistics.viewCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.<wbr></span>view<wbr>Count</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      <p>The number of times the video has been viewed.</p>

      <p>Starting March 31, 2025, for Shorts, viewCount will return the number of times a Short starts to play or replay, with no minimum watch time requirement.</p>
            </td>
    </tr>
    <tr id="statistics.likeCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.<wbr></span>like<wbr>Count</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The number of users who have indicated that they liked the video.</td>
    </tr>
    <tr id="statistics.dislikeCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.<wbr></span>dislike<wbr>Count</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
        <div class="note"><b>Note:</b> The <code translate="no" dir="ltr">statistics.dislikeCount</code> property was
          made private as of December 13, 2021. This means that the property is included in an API
          response only if the API request was authenticated by the video owner. See the
          <a href="/youtube/v3/revision_history#release_notes_12_15_2021">revision history</a> for more information.</div>
        <br>The number of users who have indicated that they disliked the video.</td>
    </tr>
    <tr id="statistics.favoriteCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.<wbr></span>favorite<wbr>Count</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      <b>Note:</b> This property has been deprecated. The deprecation is effective as of August 28, 2015. The property's value is now always set to <code translate="no" dir="ltr">0</code>.</td>
    </tr>
    <tr id="statistics.commentCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.<wbr></span>comment<wbr>Count</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The number of comments for the video.</td>
    </tr>
    <tr id="paidProductPlacementDetails">
      <td><code itemprop="property" translate="no" dir="ltr">paid<wbr>Product<wbr>Placement<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">paid<wbr>Product<wbr>Placement<wbr>Details</code> object contains information about paid product placement in the video.</td>
    </tr>
    <tr id="paidProductPlacementDetails.hasPaidProductPlacement">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">paid<wbr>Product<wbr>Placement<wbr>Details.<wbr></span>has<wbr>Paid<wbr>Product<wbr>Placement</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Set to <code translate="no" dir="ltr">true</code> if the content uses paid product placement. Defaults to <code translate="no" dir="ltr">false</code>.</td>
    </tr>
    <tr id="player">
      <td><code itemprop="property" translate="no" dir="ltr">player</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">player</code> object contains information that you would use to play the video in an embedded player.</td>
    </tr>
    <tr id="player.embedHtml">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">player.<wbr></span>embed<wbr>Html</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      An <code translate="no" dir="ltr">&lt;iframe&gt;</code> tag that embeds a player that plays the video.<ul><li>If the API request to retrieve the resource specifies a value for the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list#maxHeight">maxHeight</a></code> and/or <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list#maxWidth">maxWidth</a></code> parameters, the size of the embedded player is scaled to satisfy the <code translate="no" dir="ltr">maxHeight</code> and/or <code translate="no" dir="ltr">maxWidth</code> requirements.</li><li>If the video's aspect ratio is unknown, the embedded player defaults to a 4:3 format.</li></ul></td>
    </tr>
    <tr id="player.embedHeight">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">player.<wbr></span>embed<wbr>Height</code></td>
      <td><code class="apitype notranslate" dir="ltr">long</code><br>The height of the embedded player returned in the <code translate="no" dir="ltr">player.<wbr>embed<wbr>Html</code> property. This property is only returned if the request specified a value for the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list#maxHeight">max<wbr>Height</a></code> and/or <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list#maxWidth">max<wbr>Width</a></code> parameters and the video's aspect ratio is known.</td>
    </tr>
    <tr id="player.embedWidth">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">player.<wbr></span>embed<wbr>Width</code></td>
      <td><code class="apitype notranslate" dir="ltr">long</code><br>The width of the embedded player returned in the <code translate="no" dir="ltr">player.<wbr>embed<wbr>Html</code> property. This property is only returned if the request specified a value for the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list#maxHeight">max<wbr>Height</a></code> and/or <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/list#maxWidth">max<wbr>Width</a></code> parameters and the video's aspect ratio is known.</td>
    </tr>
    <tr id="topicDetails">
      <td><code itemprop="property" translate="no" dir="ltr">topic<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">topic<wbr>Details</code> object encapsulates information about topics associated with the video.<br><br> <b>Important:</b> See the definitions of the <code translate="no" dir="ltr">topic<wbr>Details.<wbr>relevant<wbr>Topic<wbr>Ids[]</code> and <code translate="no" dir="ltr">topic<wbr>Details.<wbr>topic<wbr>Ids[]</code> properties as well as the <a href="/youtube/v3/revision_history#november-10-2016">revision history</a> for more details about upcoming changes related to topic IDs.</td>
    </tr>
    <tr id="topicDetails.topicIds[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">topic<wbr>Details.<wbr></span>topic<wbr>Ids[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      <span class="deprecated"><b>Important:</b> This property has been deprecated as of November 10, 2016. The API no longer returns values for this property, and any topics associated with a video are now returned by the <code translate="no" dir="ltr">topicDetails.relevantTopicIds[]</code> property value.</span></td>
    </tr>
    <tr id="topicDetails.relevantTopicIds[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">topic<wbr>Details.<wbr></span>relevant<wbr>Topic<wbr>Ids[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of topic IDs that are relevant to the video.<br><br><span class="deprecated">This property has been deprecated as of November 10, 2016. It will be supported until November 10, 2017.</span><br><br><b>Important:</b> Due to the deprecation of Freebase and the Freebase API, topic IDs started working differently as of February 27, 2017. At that time, YouTube started returning a small set of curated topic IDs.<br><br>
      <devsite-expandable id="supported-topic-ids" style="margin-left: 0;" is-upgraded="">
  <a class="expand-control" href="#" aria-controls="supported-topic-ids" aria-expanded="false" tabindex="0" role="button">See topic IDs supported as of February 15, 2017</a>
  <div class="devsite-table-wrapper"><table class="responsive">
    <tbody><tr>
      <th colspan="2">Topics</th>
    </tr>
    <tr class="alt">
      <td colspan="2"><b>Music topics</b></td>
    </tr>
    <tr>
      <td>/m/04rlf</td>
      <td>Music (parent topic)</td>
    </tr>
    <tr>
      <td>/m/02mscn</td>
      <td>Christian music</td>
    </tr>
    <tr>
      <td>/m/0ggq0m</td>
      <td>Classical music</td>
    </tr>
    <tr>
      <td>/m/01lyv</td>
      <td>Country</td>
    </tr>
    <tr>
      <td>/m/02lkt</td>
      <td>Electronic music</td>
    </tr>
    <tr>
      <td>/m/0glt670</td>
      <td>Hip hop music</td>
    </tr>
    <tr>
      <td>/m/05rwpb</td>
      <td>Independent music</td>
    </tr>
    <tr>
      <td>/m/03_d0</td>
      <td>Jazz</td>
    </tr>
    <tr>
      <td>/m/028sqc</td>
      <td>Music of Asia</td>
    </tr>
    <tr>
      <td>/m/0g293</td>
      <td>Music of Latin America</td>
    </tr>
    <tr>
      <td>/m/064t9</td>
      <td>Pop music</td>
    </tr>
    <tr>
      <td>/m/06cqb</td>
      <td>Reggae</td>
    </tr>
    <tr>
      <td>/m/06j6l</td>
      <td>Rhythm and blues</td>
    </tr>
    <tr>
      <td>/m/06by7</td>
      <td>Rock music</td>
    </tr>
    <tr>
      <td>/m/0gywn</td>
      <td>Soul music</td>
    </tr>
    <tr class="alt">
      <td colspan="2"><b>Gaming topics</b></td>
    </tr>
    <tr>
      <td>/m/0bzvm2</td>
      <td>Gaming (parent topic)</td>
    </tr>
    <tr>
      <td>/m/025zzc</td>
      <td>Action game</td>
    </tr>
    <tr>
      <td>/m/02ntfj</td>
      <td>Action-adventure game</td>
    </tr>
    <tr>
      <td>/m/0b1vjn</td>
      <td>Casual game</td>
    </tr>
    <tr>
      <td>/m/02hygl</td>
      <td>Music video game</td>
    </tr>
    <tr>
      <td>/m/04q1x3q</td>
      <td>Puzzle video game</td>
    </tr>
    <tr>
      <td>/m/01sjng</td>
      <td>Racing video game</td>
    </tr>
    <tr>
      <td>/m/0403l3g</td>
      <td>Role-playing video game</td>
    </tr>
    <tr>
      <td>/m/021bp2</td>
      <td>Simulation video game</td>
    </tr>
    <tr>
      <td>/m/022dc6</td>
      <td>Sports game</td>
    </tr>
    <tr>
      <td>/m/03hf_rm</td>
      <td>Strategy video game</td>
    </tr>


    <tr class="alt">
      <td colspan="2"><b>Sports topics</b></td>
    </tr>
    <tr>
      <td>/m/06ntj</td>
      <td>Sports (parent topic)</td>
    </tr>
    <tr>
      <td>/m/0jm_</td>
      <td>American football</td>
    </tr>
    <tr>
      <td>/m/018jz</td>
      <td>Baseball</td>
    </tr>
    <tr>
      <td>/m/018w8</td>
      <td>Basketball</td>
    </tr>
    <tr>
      <td>/m/01cgz</td>
      <td>Boxing</td>
    </tr>
    <tr>
      <td>/m/09xp_</td>
      <td>Cricket</td>
    </tr>
    <tr>
      <td>/m/02vx4</td>
      <td>Football</td>
    </tr>
    <tr>
      <td>/m/037hz</td>
      <td>Golf</td>
    </tr>
    <tr>
      <td>/m/03tmr</td>
      <td>Ice hockey</td>
    </tr>
    <tr>
      <td>/m/01h7lh</td>
      <td>Mixed martial arts</td>
    </tr>
    <tr>
      <td>/m/0410tth</td>
      <td>Motorsport</td>
    </tr>
    <tr>
      <td>/m/07bs0</td>
      <td>Tennis</td>
    </tr>
    <tr>
      <td>/m/07_53</td>
      <td>Volleyball</td>
    </tr>
    <tr class="alt">
      <td colspan="2"><b>Entertainment topics</b></td>
    </tr>
    <tr>
      <td>/m/02jjt</td>
      <td>Entertainment (parent topic)</td>
    </tr>
    <tr>
      <td>/m/09kqc</td>
      <td>Humor</td>
    </tr>
    <tr>
      <td>/m/02vxn</td>
      <td>Movies</td>
    </tr>
    <tr>
      <td>/m/05qjc</td>
      <td>Performing arts</td>
    </tr>
    <tr>
      <td>/m/066wd</td>
      <td>Professional wrestling</td>
    </tr>
    <tr>
      <td>/m/0f2f9</td>
      <td>TV shows</td>
    </tr>
    <tr class="alt">
      <td colspan="2"><b>Lifestyle topics</b></td>
    </tr>
    <tr>
      <td>/m/019_rr</td>
      <td>Lifestyle (parent topic)</td>
    </tr>
    <tr>
      <td>/m/032tl</td>
      <td>Fashion</td>
    </tr>
    <tr>
      <td>/m/027x7n</td>
      <td>Fitness</td>
    </tr>
    <tr>
      <td>/m/02wbm</td>
      <td>Food</td>
    </tr>
    <tr>
      <td>/m/03glg</td>
      <td>Hobby</td>
    </tr>
    <tr>
      <td>/m/068hy</td>
      <td>Pets</td>
    </tr>
    <tr>
      <td>/m/041xxh</td>
      <td>Physical attractiveness [Beauty]</td>
    </tr>
    <tr>
      <td>/m/07c1v</td>
      <td>Technology</td>
    </tr>
    <tr>
      <td>/m/07bxq</td>
      <td>Tourism</td>
    </tr>
    <tr>
      <td>/m/07yv9</td>
      <td>Vehicles</td>
    </tr>
    <tr class="alt">
      <td colspan="2"><b>Society topics</b></td>
    </tr>
    <tr>
      <td>/m/098wr</td>
      <td>Society (parent topic)</td>
    </tr>
    <tr>
      <td>/m/09s1f</td>
      <td>Business</td>
    </tr>
    <tr>
      <td>/m/0kt51</td>
      <td>Health</td>
    </tr>
    <tr>
      <td>/m/01h6rj</td>
      <td>Military</td>
    </tr>
    <tr>
      <td>/m/05qt0</td>
      <td>Politics</td>
    </tr>
    <tr>
      <td>/m/06bvp</td>
      <td>Religion</td>
    </tr>
    <tr class="alt">
      <td colspan="2"><b>Other topics</b></td>
    </tr>
    <tr>
      <td>/m/01k8wb</td>
      <td>Knowledge</td>
    </tr>
  </tbody></table></div>
</devsite-expandable>
      </td>
    </tr>
    <tr id="topicDetails.topicCategories[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">topic<wbr>Details.<wbr></span>topic<wbr>Categories[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of Wikipedia URLs that provide a high-level description of the video's content.</td>
    </tr>
    <tr id="recordingDetails">
      <td><code itemprop="property" translate="no" dir="ltr">recording<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">recording<wbr>Details</code> object encapsulates information about the location, date and address where the video was recorded.</td>
    </tr>
    <tr id="recordingDetails.locationDescription">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">recording<wbr>Details.<wbr></span>location<wbr>Description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span class="deprecated">This property has been deprecated as of June 1, 2017. Please see the <a href="/youtube/v3/revision_history#release_notes_06_01_2017">deprecation announcement</a> for more details.</span><br><br>
      The text description of the location where the video was recorded.</td>
    </tr>
    <tr id="recordingDetails.location">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">recording<wbr>Details.<wbr></span>location</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The geolocation information associated with the video. Note that the child property values identify the location that the video owner wants to associate with the video. The value is editable, searchable on public videos, and might be displayed to users for public videos.</td>
    </tr>
    <tr id="recordingDetails.location.latitude">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">recording<wbr>Details.<wbr>location.<wbr></span>latitude</code></td>
      <td><code class="apitype notranslate" dir="ltr">double</code><br>
      <span class="deprecated">This property has been deprecated as of June 1, 2017. Please see the <a href="/youtube/v3/revision_history#release_notes_06_01_2017">deprecation announcement</a> for more details.</span><br><br>
      Latitude in degrees.</td>
    </tr>
    <tr id="recordingDetails.location.longitude">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">recording<wbr>Details.<wbr>location.<wbr></span>longitude</code></td>
      <td><code class="apitype notranslate" dir="ltr">double</code><br>
      <span class="deprecated">This property has been deprecated as of June 1, 2017. Please see the <a href="/youtube/v3/revision_history#release_notes_06_01_2017">deprecation announcement</a> for more details.</span><br><br>
      Longitude in degrees.</td>
    </tr>
    <tr id="recordingDetails.location.altitude">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">recording<wbr>Details.<wbr>location.<wbr></span>altitude</code></td>
      <td><code class="apitype notranslate" dir="ltr">double</code><br>
      <span class="deprecated">This property has been deprecated as of July 9, 2018. Please see the <a href="/youtube/v3/revision_history#release_notes_07_09_2018">deprecation announcement</a> for more details.</span><br><br>
      Altitude above the reference ellipsoid, in meters.</td>
    </tr>
    <tr id="recordingDetails.recordingDate">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">recording<wbr>Details.<wbr></span>recording<wbr>Date</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time when the video was recorded. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> (<code translate="no" dir="ltr">YYYY-MM-DDThh:mm:ss.<wbr>sss<wbr>Z</code>) format.</td>
    </tr>
    <tr id="fileDetails">
      <td><code itemprop="property" translate="no" dir="ltr">file<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">file<wbr>Details</code> object encapsulates information about the video file that was uploaded to YouTube, including the file's resolution, duration, audio and video codecs, stream bitrates, and more. This data can only be retrieved by the video owner.<br><br> The <code translate="no" dir="ltr">file<wbr>Details</code> object will only be returned if the <code translate="no" dir="ltr"><a href="#processingDetails.fileDetailsAvailability">processing<wbr>Details.<wbr>file<wbr>Availability</a></code> property has a value of <code translate="no" dir="ltr">available</code>.</td>
    </tr>
    <tr id="fileDetails.fileName">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>file<wbr>Name</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The uploaded file's name. This field is present whether a video file or another type of file was uploaded.</td>
    </tr>
    <tr id="fileDetails.fileSize">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>file<wbr>Size</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The uploaded file's size in bytes. This field is present whether a video file or another type of file was uploaded.</td>
    </tr>
    <tr id="fileDetails.fileType">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>file<wbr>Type</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The uploaded file's type as detected by YouTube's video processing engine. Currently, YouTube only processes video files, but this field is present whether a video file or another type of file was uploaded.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">archive</code> – The file is an archive file, such as a .zip archive.</li>
<li><code translate="no" dir="ltr">audio</code> – The file is a known audio file type, such as an .mp3 file.</li>
<li><code translate="no" dir="ltr">document</code> – The file is a document or text file, such as a MS Word document.</li>
<li><code translate="no" dir="ltr">image</code> – The file is an image file, such as a .jpeg image.</li>
<li><code translate="no" dir="ltr">other</code> – The file is another non-video file type.</li>
<li><code translate="no" dir="ltr">project</code> – The file is a video project file, such as a Microsoft Windows Movie Maker project, that does not contain actual video data.</li>
<li><code translate="no" dir="ltr">video</code> – The file is a known video file type, such as an .mp4 file.</li>

</ul>
</td>
    </tr>
    <tr id="fileDetails.container">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>container</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The uploaded video file's container format.</td>
    </tr>
    <tr id="fileDetails.videoStreams[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>video<wbr>Streams[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of video streams contained in the uploaded video file. Each item in the list contains detailed metadata about a video stream.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].widthPixels">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>width<wbr>Pixels</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The encoded video content's width in pixels. You can calculate the video's encoding aspect ratio as <code translate="no" dir="ltr">width_<wbr>pixels</code>&nbsp;/&nbsp;<code translate="no" dir="ltr">height_<wbr>pixels</code>.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].heightPixels">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>height<wbr>Pixels</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The encoded video content's height in pixels.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].frameRateFps">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>frame<wbr>Rate<wbr>Fps</code></td>
      <td><code class="apitype notranslate" dir="ltr">double</code><br>
      The video stream's frame rate, in frames per second.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].aspectRatio">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>aspect<wbr>Ratio</code></td>
      <td><code class="apitype notranslate" dir="ltr">double</code><br>
      The video content's display aspect ratio, which specifies the aspect ratio in which the video should be displayed.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].codec">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>codec</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video codec that the stream uses.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].bitrateBps">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>bitrate<wbr>Bps</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The video stream's bitrate, in bits per second.</td>
    </tr>
    <tr id="fileDetails.videoStreams[].rotation">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>rotation</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The amount that YouTube needs to rotate the original source content to properly display the video.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">clockwise</code> – The video needs to be rotated 90 degrees clockwise.</li>
<li><code translate="no" dir="ltr">counterClockwise</code> – The video needs to be rotated 90 degrees counter-clockwise.</li>
<li><code translate="no" dir="ltr">none</code> – The video does not need to be rotated.</li>
<li><code translate="no" dir="ltr">other</code> – The video needs to be rotated in some other, non-trivial way.</li>
<li><code translate="no" dir="ltr">upsideDown</code> – The video needs to be rotated upside down.</li>

</ul>
</td>
    </tr>
    <tr id="fileDetails.videoStreams[].vendor">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>video<wbr>Streams[].<wbr></span>vendor</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.</td>
    </tr>
    <tr id="fileDetails.audioStreams[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>audio<wbr>Streams[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of audio streams contained in the uploaded video file. Each item in the list contains detailed metadata about an audio stream.</td>
    </tr>
    <tr id="fileDetails.audioStreams[].channelCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>audio<wbr>Streams[].<wbr></span>channel<wbr>Count</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The number of audio channels that the stream contains.</td>
    </tr>
    <tr id="fileDetails.audioStreams[].codec">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>audio<wbr>Streams[].<wbr></span>codec</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The audio codec that the stream uses.</td>
    </tr>
    <tr id="fileDetails.audioStreams[].bitrateBps">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>audio<wbr>Streams[].<wbr></span>bitrate<wbr>Bps</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The audio stream's bitrate, in bits per second.</td>
    </tr>
    <tr id="fileDetails.audioStreams[].vendor">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr>audio<wbr>Streams[].<wbr></span>vendor</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      A value that uniquely identifies a video vendor. Typically, the value is a four-letter vendor code.</td>
    </tr>
    <tr id="fileDetails.durationMs">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>duration<wbr>Ms</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The length of the uploaded video in milliseconds.</td>
    </tr>
    <tr id="fileDetails.bitrateBps">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>bitrate<wbr>Bps</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The uploaded video file's combined (video and audio) bitrate in bits per second.</td>
    </tr>
    <tr id="fileDetails.creationTime">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">file<wbr>Details.<wbr></span>creation<wbr>Time</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The date and time when the uploaded video file was created. The value is specified in <a href="http://www.w3.org/TR/NOTE-datetime">ISO 8601</a> format. Currently, the following ISO 8601 formats are supported: <ul> <li>Date only: <code translate="no" dir="ltr">YYYY-MM-DD</code></li> <li>Naive time: <code translate="no" dir="ltr">YYYY-MM-DDTHH:MM:SS</code></li> <li>Time with timezone: <code translate="no" dir="ltr">YYYY-MM-DDTHH:MM:SS+HH:MM</code></li> </ul></td>
    </tr>
    <tr id="processingDetails">
      <td><code itemprop="property" translate="no" dir="ltr">processing<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">processing<wbr>Details</code> object encapsulates information about YouTube's progress in processing the uploaded video file. The properties in the object identify the current processing status and an estimate of the time remaining until YouTube finishes processing the video. This part also indicates whether different types of data or content, such as file details or thumbnail images, are available for the video.<br><br> The <code translate="no" dir="ltr">processing<wbr>Progress</code> object is designed to be polled so that the video uploaded can track the progress that YouTube has made in processing the uploaded video file. This data can only be retrieved by the video owner.</td>
    </tr>
    <tr id="processingDetails.processingStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>processing<wbr>Status</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video's processing status. This value indicates whether YouTube was able to process the video or if the video is still being processed.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">failed</code> – Video processing has failed. See ProcessingFailureReason.</li>
<li><code translate="no" dir="ltr">processing</code> – Video is currently being processed. See ProcessingProgress.</li>
<li><code translate="no" dir="ltr">succeeded</code> – Video has been successfully processed.</li>
<li><code translate="no" dir="ltr">terminated</code> – Processing information is no longer available.</li>
</ul>
</td>
    </tr>
    <tr id="processingDetails.processingProgress">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>processing<wbr>Progress</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">processing<wbr>Progress</code> object contains information about the progress YouTube has made in processing the video. The values are really only relevant if the video's processing status is <code translate="no" dir="ltr">processing</code>.</td>
    </tr>
    <tr id="processingDetails.processingProgress.partsTotal">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr>processing<wbr>Progress.<wbr></span>parts<wbr>Total</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      An estimate of the total number of parts that need to be processed for the video. The number may be updated with more precise estimates while YouTube processes the video.</td>
    </tr>
    <tr id="processingDetails.processingProgress.partsProcessed">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr>processing<wbr>Progress.<wbr></span>parts<wbr>Processed</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The number of parts of the video that YouTube has already processed. You can estimate the percentage of the video that YouTube has already processed by calculating:<br> <code translate="no" dir="ltr">100 * parts_<wbr>processed /<wbr> parts_<wbr>total</code><br><br> Note that since the estimated number of parts could increase without a corresponding increase in the number of parts that have already been processed, it is possible that the calculated progress could periodically decrease while YouTube processes a video.</td>
    </tr>
    <tr id="processingDetails.processingProgress.timeLeftMs">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr>processing<wbr>Progress.<wbr></span>time<wbr>Left<wbr>Ms</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      An estimate of the amount of time, in millseconds, that YouTube needs to finish processing the video.</td>
    </tr>
    <tr id="processingDetails.processingFailureReason">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>processing<wbr>Failure<wbr>Reason</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The reason that YouTube failed to process the video. This property will only have a value if the <code translate="no" dir="ltr">processing<wbr>Status</code> property's value is <code translate="no" dir="ltr">failed</code>.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">other</code> – Some other processing component has failed.</li>
<li><code translate="no" dir="ltr">streamingFailed</code> – Video could not be sent to streamers.</li>
<li><code translate="no" dir="ltr">transcodeFailed</code> – Content transcoding has failed.</li>
<li><code translate="no" dir="ltr">uploadFailed</code> – File delivery has failed.</li>
</ul>
</td>
    </tr>
    <tr id="processingDetails.fileDetailsAvailability">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>file<wbr>Details<wbr>Availability</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value indicates whether file details are available for the uploaded video. You can retrieve a video's file details by requesting the <code translate="no" dir="ltr">file<wbr>Details</code> part in your <code translate="no" dir="ltr">videos.<wbr>list()</code> request.</td>
    </tr>
    <tr id="processingDetails.processingIssuesAvailability">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>processing<wbr>Issues<wbr>Availability</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value indicates whether the video processing engine has generated suggestions that might improve YouTube's ability to process the the video, warnings that explain video processing problems, or errors that cause video processing problems. You can retrieve these suggestions by requesting the <code translate="no" dir="ltr">suggestions</code> part in your <code translate="no" dir="ltr">videos.<wbr>list()</code> request.</td>
    </tr>
    <tr id="processingDetails.tagSuggestionsAvailability">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>tag<wbr>Suggestions<wbr>Availability</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value indicates whether keyword (tag) suggestions are available for the video. Tags can be added to a video's metadata to make it easier for other users to find the video. You can retrieve these suggestions by requesting the <code translate="no" dir="ltr">suggestions</code> part in your <code translate="no" dir="ltr">videos.<wbr>list()</code> request.</td>
    </tr>
    <tr id="processingDetails.editorSuggestionsAvailability">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>editor<wbr>Suggestions<wbr>Availability</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value indicates whether video editing suggestions, which might improve video quality or the playback experience, are available for the video. You can retrieve these suggestions by requesting the <code translate="no" dir="ltr">suggestions</code> part in your <code translate="no" dir="ltr">videos.<wbr>list()</code> request.</td>
    </tr>
    <tr id="processingDetails.thumbnailsAvailability">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">processing<wbr>Details.<wbr></span>thumbnails<wbr>Availability</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      This value indicates whether thumbnail images have been generated for the video.</td>
    </tr>
    <tr id="suggestions">
      <td><code itemprop="property" translate="no" dir="ltr">suggestions</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">suggestions</code> object encapsulates suggestions that identify opportunities to improve the video quality or the metadata for the uploaded video. This data can only be retrieved by the video owner. <br><br> The <code translate="no" dir="ltr">suggestions</code> object will only be returned if the <code translate="no" dir="ltr"><a href="#processingDetails.tagSuggestionsAvailability">processing<wbr>Details.<wbr>tag<wbr>Suggestions<wbr>Availability</a></code> property or the <code translate="no" dir="ltr"><a href="#processingDetails.editorSuggestionsAvailability">processing<wbr>Details.<wbr>editor<wbr>Suggestions<wbr>Availability</a></code> property has a value of <code translate="no" dir="ltr">available</code>.</td>
    </tr>
    <tr id="suggestions.processingErrors[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr></span>processing<wbr>Errors[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of errors that will prevent YouTube from successfully processing the uploaded video. These errors indicate that, regardless of the video's current <a href="#processingProgress.processingStatus">processing status</a>, eventually, that status will almost certainly be <code translate="no" dir="ltr">failed</code>.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">archiveFile</code> – An archive file (e.g., a ZIP archive).</li>
<li><code translate="no" dir="ltr">audioFile</code> – File contains audio only (e.g., an MP3 file).</li>
<li><code translate="no" dir="ltr">docFile</code> – Document or text file (e.g., MS Word document).</li>
<li><code translate="no" dir="ltr">imageFile</code> – Image file (e.g., a JPEG image).</li>
<li><code translate="no" dir="ltr">notAVideoFile</code> – Other non-video file.</li>
<li><code translate="no" dir="ltr">projectFile</code> – Movie project file (e.g., Microsoft Windows Movie Maker project).</li>

</ul>
</td>
    </tr>
    <tr id="suggestions.processingWarnings[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr></span>processing<wbr>Warnings[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of reasons why YouTube may have difficulty transcoding the uploaded video or that might result in an erroneous transcoding. These warnings are generated before YouTube actually processes the uploaded video file. In addition, they identify issues that do not necessarily indicate that video processing will fail but that still might cause problems such as sync issues, video artifacts, or a missing audio track.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">hasEditlist</code> – Edit lists are not currently supported.</li>
<li><code translate="no" dir="ltr">inconsistentResolution</code> – Conflicting container and stream resolutions.</li>
<li><code translate="no" dir="ltr">problematicAudioCodec</code> – Audio codec that is known to cause problems was used.</li>
<li><code translate="no" dir="ltr">problematicVideoCodec</code> – Video codec that is known to cause problems was used.</li>
<li><code translate="no" dir="ltr">unknownAudioCodec</code> – Unrecognized audio codec, transcoding is likely to fail.</li>
<li><code translate="no" dir="ltr">unknownContainer</code> – Unrecognized file format, transcoding is likely to fail.</li>
<li><code translate="no" dir="ltr">unknownVideoCodec</code> – Unrecognized video codec, transcoding is likely to fail.</li>

</ul>
</td>
    </tr>
    <tr id="suggestions.processingHints[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr></span>processing<wbr>Hints[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of suggestions that may improve YouTube's ability to process the video.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">nonStreamableMov</code> – The MP4 file is not streamable, this will slow down the processing.</li>
<li><code translate="no" dir="ltr">sendBestQualityVideo</code> – Probably a better quality version of the video exists.</li>

</ul>
</td>
    </tr>
    <tr id="suggestions.tagSuggestions[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr></span>tag<wbr>Suggestions[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of keyword tags that could be added to the video's metadata to increase the likelihood that users will locate your video when searching or browsing on YouTube.</td>
    </tr>
    <tr id="suggestions.tagSuggestions[].tag">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr>tag<wbr>Suggestions[].<wbr></span>tag</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The keyword tag suggested for the video.</td>
    </tr>
    <tr id="suggestions.tagSuggestions[].categoryRestricts[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr>tag<wbr>Suggestions[].<wbr></span>category<wbr>Restricts[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A set of video categories for which the tag is relevant. You can use this information to display appropriate tag suggestions based on the video category that the video uploader associates with the video. By default, tag suggestions are relevant for all categories if there are no restricts defined for the keyword.</td>
    </tr>
    <tr id="suggestions.editorSuggestions[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">suggestions.<wbr></span>editor<wbr>Suggestions[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of video editing operations that might improve the video quality or playback experience of the uploaded video.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">audioQuietAudioSwap</code> – The audio track appears silent and could be swapped with a better quality one.</li>
<li><code translate="no" dir="ltr">videoAutoLevels</code> – Picture brightness levels seem off and could be corrected.</li>
<li><code translate="no" dir="ltr">videoCrop</code> – Margins (mattes) detected around the picture could be cropped.</li>
<li><code translate="no" dir="ltr">videoStabilize</code> – The video appears shaky and could be stabilized.</li>

</ul>
</td>
    </tr>
    <tr id="liveStreamingDetails">
      <td><code itemprop="property" translate="no" dir="ltr">live<wbr>Streaming<wbr>Details</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">live<wbr>Streaming<wbr>Details</code> object contains metadata about a live video broadcast. The object will only be present in a <code translate="no" dir="ltr">video</code> resource if the video is an upcoming, live, or completed live broadcast.</td>
    </tr>
    <tr id="liveStreamingDetails.actualStartTime">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">live<wbr>Streaming<wbr>Details.<wbr></span>actual<wbr>Start<wbr>Time</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The time that the broadcast actually started. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format. This value will not be available until the broadcast begins.</td>
    </tr>
    <tr id="liveStreamingDetails.actualEndTime">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">live<wbr>Streaming<wbr>Details.<wbr></span>actual<wbr>End<wbr>Time</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The time that the broadcast actually ended. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format. This value will not be available until the broadcast is over.</td>
    </tr>
    <tr id="liveStreamingDetails.scheduledStartTime">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">live<wbr>Streaming<wbr>Details.<wbr></span>scheduled<wbr>Start<wbr>Time</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The time that the broadcast is scheduled to begin. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="liveStreamingDetails.scheduledEndTime">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">live<wbr>Streaming<wbr>Details.<wbr></span>scheduled<wbr>End<wbr>Time</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The time that the broadcast is scheduled to end. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format. If the value is empty or the property is not present, then the broadcast is scheduled to continue indefinitely.</td>
    </tr>
    <tr id="liveStreamingDetails.concurrentViewers">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">live<wbr>Streaming<wbr>Details.<wbr></span>concurrent<wbr>Viewers</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The number of viewers currently watching the broadcast. The property and its value will be
        present if the broadcast has current viewers and the broadcast owner has not hidden the
        viewcount for the video. Note that YouTube stops tracking the number of concurrent viewers
        for a broadcast when the broadcast ends. So, this property would not identify the number of
        viewers watching an archived video of a live broadcast that already ended.<br>
        <div class="caution">The concurrent viewer counts that the YouTube Data API returns might
          differ from the processed, despammed concurrent viewer counts available through YouTube
          Analytics. Learn more about live streaming metrics in the
          <a href="https://support.google.com/youtube/answer/2853833">YouTube Help Center</a>.</div>
      </td>
    </tr>
    <tr id="liveStreamingDetails.activeLiveChatId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">live<wbr>Streaming<wbr>Details.<wbr></span>active<wbr>Live<wbr>Chat<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID of the currently active live chat attached to this video. This field is filled only if the video is a currently live broadcast that has live chat. Once the broadcast transitions to complete this field will be removed and the live chat closed down. For persistent broadcasts that live chat id will no longer be tied to this video but rather to the new video being displayed at the persistent page.</td>
    </tr>
    <tr id="localizations">
      <td><code itemprop="property" translate="no" dir="ltr">localizations</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">localizations</code> object contains translations of the video's metadata.</td>
    </tr>
    <tr id="localizations.(key)">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.<wbr></span>(key)</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The language of the localized text associated with the key value. The value is a string that contains a <a href="http://www.rfc-editor.org/rfc/bcp/bcp47.txt">BCP-47</a> language code.</td>
    </tr>
    <tr id="localizations.(key).title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.<wbr>(key).<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized video title.</td>
    </tr>
    <tr id="localizations.(key).description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.<wbr>(key).<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized video description.</td>
    </tr>

  </tbody>
</table>