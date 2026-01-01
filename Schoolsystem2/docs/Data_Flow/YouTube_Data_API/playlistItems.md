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
      Identifies the API resource's type. The value will be <code translate="no" dir="ltr">youtube#playlist<wbr>Item</code>.</td>
    </tr>
    <tr id="etag">
      <td><code itemprop="property" translate="no" dir="ltr">etag</code></td>
      <td><code class="apitype notranslate" dir="ltr">etag</code><br>
      The Etag of this resource.</td>
    </tr>
    <tr id="id">
      <td><code itemprop="property" translate="no" dir="ltr">id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the playlist item.</td>
    </tr>
    <tr id="snippet">
      <td><code itemprop="property" translate="no" dir="ltr">snippet</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet</code> object contains basic details about the playlist item, such as its title and position in the playlist.</td>
    </tr>
    <tr id="snippet.publishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>published<wbr>At</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time that the item was added to the playlist. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="snippet.channelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the user that added the item to the playlist.</td>
    </tr>
    <tr id="snippet.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The item's title.</td>
    </tr>
    <tr id="snippet.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The item's description.</td>
    </tr>
    <tr id="snippet.thumbnails">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>thumbnails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.</td>
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
      The channel title of the channel that the playlist item belongs to.</td>
    </tr>
    <tr id="snippet.videoOwnerChannelTitle">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>videoOwnerChannelTitle</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel title of the channel that uploaded this video.</td>
    </tr>
    <tr id="snippet.videoOwnerChannelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>videoOwnerChannelId</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel ID of the channel that uploaded this video.</td>
    </tr>
    <tr id="snippet.playlistId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>playlistId</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the playlist that the playlist item is in.</td>
    </tr>
    <tr id="snippet.position">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>position</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of <code translate="no" dir="ltr">0</code>, the second item has a position of <code translate="no" dir="ltr">1</code>, and so forth.</td>
    </tr>
    <tr id="snippet.resourceId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>resourceId</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">id</code> object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.</td>
    </tr>
    <tr id="snippet.resourceId.kind">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.resourceId.</span>kind</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The kind, or type, of the referred resource.</td>
    </tr>
    <tr id="snippet.resourceId.videoId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.resourceId.</span>videoId</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      If the <code translate="no" dir="ltr">snippet.resourceId.kind</code> property's value is <code translate="no" dir="ltr">youtube#video</code>, then this property will be present and its value will contain the ID that YouTube uses to uniquely identify the video in the playlist.</td>
    </tr>
    <tr id="contentDetails">
      <td><code itemprop="property" translate="no" dir="ltr">contentDetails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">contentDetails</code> object is included in the resource if the included item is a YouTube video. The object contains additional information about the video.</td>
    </tr>
    <tr id="contentDetails.videoId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>videoId</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify a video. To <a href="/youtube/v3/docs/videos/list">retrieve the <code translate="no" dir="ltr">video</code> resource</a>, set the <code translate="no" dir="ltr">id</code> query parameter to this value in your API request.</td>
    </tr>
    <tr id="contentDetails.startAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>startAt</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span class="deprecated"><b>Note:</b> This property has been deprecated and, if set, its value is ignored.</span><br><br>The time, measured in seconds from the start of the video, when the video should start playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) The default value is <code translate="no" dir="ltr">0</code>.</td>
    </tr>
    <tr id="contentDetails.endAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>endAt</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span class="deprecated"><b>Note:</b> This property has been deprecated and, if set, its value is ignored.</span><br><br>The time, measured in seconds from the start of the video, when the video should stop playing. (The playlist owner can specify the times when the video should start and stop playing when the video is played in the context of the playlist.) By default, assume that the <code translate="no" dir="ltr">video.endTime</code> is the end of the video.</td>
    </tr>
    <tr id="contentDetails.note">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>note</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      A user-generated note for this item. The property value has a maximum length of 280 characters.</td>
    </tr>
    <tr id="contentDetails.videoPublishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>videoPublishedAt</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time that the video was published to YouTube. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="status">
      <td><code itemprop="property" translate="no" dir="ltr">status</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">status</code> object contains information about the playlist item's privacy status.</td>
    </tr>
    <tr id="status.privacyStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>privacyStatus</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The playlist item's privacy status. The channel that uploaded the video that the playlist item represents can set this value using either the <code translate="no" dir="ltr">videos.insert</code> or <code translate="no" dir="ltr">videos.update</code> method.</td>
    </tr>

  </tbody>
</table>