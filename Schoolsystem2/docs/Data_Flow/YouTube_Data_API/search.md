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
      Identifies the API resource's type. The value will be <code translate="no" dir="ltr">youtube#search<wbr>Result</code>.</td>
    </tr>
    <tr id="etag">
      <td><code itemprop="property" translate="no" dir="ltr">etag</code></td>
      <td><code class="apitype notranslate" dir="ltr">etag</code><br>
      The Etag of this resource.</td>
    </tr>
    <tr id="id">
      <td><code itemprop="property" translate="no" dir="ltr">id</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">id</code> object contains information that can be used to uniquely identify the resource that matches the search request.</td>
    </tr>
    <tr id="id.kind">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">id.<wbr></span>kind</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The type of the API resource.</td>
    </tr>
    <tr id="id.videoId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">id.<wbr></span>video<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      If the <code translate="no" dir="ltr">id.<wbr>type</code> property's value is <code translate="no" dir="ltr">youtube#video</code>, then this property will be present and its value will contain the ID that YouTube uses to uniquely identify a video that matches the search query.</td>
    </tr>
    <tr id="id.channelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">id.<wbr></span>channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      If the <code translate="no" dir="ltr">id.<wbr>type</code> property's value is <code translate="no" dir="ltr">youtube#channel</code>, then this property will be present and its value will contain the ID that YouTube uses to uniquely identify a channel that matches the search query.</td>
    </tr>
    <tr id="id.playlistId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">id.<wbr></span>playlist<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      If the <code translate="no" dir="ltr">id.<wbr>type</code> property's value is <code translate="no" dir="ltr">youtube#playlist</code>, then this property will be present and its value will contain the ID that YouTube uses to uniquely identify a playlist that matches the search query.</td>
    </tr>
    <tr id="snippet">
      <td><code itemprop="property" translate="no" dir="ltr">snippet</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet</code> object contains basic details about a search result, such as its title or description. For example, if the search result is a video, then the title will be the video's title and the description will be the video's description.</td>
    </tr>
    <tr id="snippet.publishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>published<wbr>At</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The creation date and time of the resource that the search result identifies. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="snippet.channelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies.</td>
    </tr>
    <tr id="snippet.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The title of the search result.</td>
    </tr>
    <tr id="snippet.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      A description of the search result.</td>
    </tr>
    <tr id="snippet.thumbnails">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>thumbnails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      A map of thumbnail images associated with the search result. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.</td>
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
      The title of the channel that published the resource that the search result identifies.</td>
    </tr>
    <tr id="snippet.liveBroadcastContent">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>liveBroadcastContent</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      An indication of whether a <code translate="no" dir="ltr">video</code> or <code translate="no" dir="ltr">channel</code> resource has live broadcast content. Valid property values are <code translate="no" dir="ltr">upcoming</code>, <code translate="no" dir="ltr">live</code>, and <code translate="no" dir="ltr">none</code>.<br><br> For a <code translate="no" dir="ltr">video</code> resource, a value of <code translate="no" dir="ltr">upcoming</code> indicates that the video is a live broadcast that has not yet started, while a value of <code translate="no" dir="ltr">live</code> indicates that the video is an active live broadcast. For a <code translate="no" dir="ltr">channel</code> resource, a value of <code translate="no" dir="ltr">upcoming</code> indicates that the channel has a scheduled broadcast that has not yet started, while a value of <code translate="no" dir="ltr">live</code> indicates that the channel has an active live broadcast.</td>
    </tr>

  </tbody>
</table>