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
      Identifies the API resource's type. The value will be <code translate="no" dir="ltr">youtube#channel</code>.</td>
    </tr>
    <tr id="etag">
      <td><code itemprop="property" translate="no" dir="ltr">etag</code></td>
      <td><code class="apitype notranslate" dir="ltr">etag</code><br>
      The Etag of this resource.</td>
    </tr>
    <tr id="id">
      <td><code itemprop="property" translate="no" dir="ltr">id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the channel.</td>
    </tr>
    <tr id="snippet">
      <td><code itemprop="property" translate="no" dir="ltr">snippet</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet</code> object contains basic details about the channel, such as its title, description, and thumbnail images.</td>
    </tr>
    <tr id="snippet.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel's title.</td>
    </tr>
    <tr id="snippet.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel's description. The property's value has a maximum length of 1000 characters.</td>
    </tr>
    <tr id="snippet.customUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>custom<wbr>Url</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel's custom URL. The <a href="https://support.google.com/youtube/answer/2657968">YouTube Help Center</a> explains eligibility requirements for getting a custom URL as well as how to set up the URL.</td>
    </tr>
    <tr id="snippet.publishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>published<wbr>At</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time that the channel was created. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="snippet.thumbnails">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>thumbnails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      A map of thumbnail images associated with the channel. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.<br><br>When displaying thumbnails in your application, make sure that your code uses the image URLs exactly as they are returned in API responses. For example, your application should not use the <code translate="no" dir="ltr">http</code> domain instead of the <code translate="no" dir="ltr">https</code> domain in a URL returned in an API response.<br><br>Channel thumbnail URLs are available only in the <code translate="no" dir="ltr">https</code> domain, which is how the URLs appear in API responses. You might see broken images in your application if it tries to load YouTube images from the <code translate="no" dir="ltr">http</code> domain. Thumbnail images might be empty for newly created channels and might take up to one day to populate.</td>
    </tr>
    <tr id="snippet.thumbnails.(key)">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr></span>(key)</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      Valid key values are:<ul><li><code translate="no" dir="ltr">default</code> – The default thumbnail image. The default thumbnail for a video – or a resource that refers to a video, such as a playlist item or search result – is 120px wide and 90px tall. The default thumbnail for a channel is 88px wide and 88px tall.</li><li><code translate="no" dir="ltr">medium</code> – A higher resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 320px wide and 180px tall. For a channel, this image is 240px wide and 240px tall.</li><li><code translate="no" dir="ltr">high</code> – A high resolution version of the thumbnail image. For a video (or a resource that refers to a video), this image is 480px wide and 360px tall. For a channel, this image is 800px wide and 800px tall.</li></ul></td>
    </tr>
    <tr id="snippet.thumbnails.(key).url">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>thumbnails.<wbr>(key).<wbr></span>url</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The image's URL. For additional guidelines on using thumbnail URLs in your application, see the <code translate="no" dir="ltr"><a href="#snippet.thumbnails">snippet.<wbr>thumbnails</a></code> property definition.</td>
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
    <tr id="snippet.defaultLanguage">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>default<wbr>Language</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The language of the text in the <code translate="no" dir="ltr">channel</code> resource's <code translate="no" dir="ltr">snippet.<wbr>title</code> and <code translate="no" dir="ltr">snippet.<wbr>description</code> properties.</td>
    </tr>
    <tr id="snippet.localized">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>localized</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet.<wbr>localized</code> object contains a localized title and description for the channel or it contains the channel's title and description in the <a href="#snippet.defaultLanguage">default language</a> for the channel's metadata. <ul><li>Localized text is returned in the resource snippet if the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/channels/list">channels.list</a></code> request used the <code translate="no" dir="ltr">hl</code> parameter to specify a language for which localized text should be returned, the <code translate="no" dir="ltr">hl</code> parameter value identifies a <a href="/youtube/v3/docs/i18nLanguages">YouTube application language</a>, and localized text is available in that language.</li> <li>Metadata for the default language is returned if an <code translate="no" dir="ltr">hl</code> parameter value is not specified <i>or</i> a value is specified but localized metadata is not available for the specified language.</li></ul> The property contains a read-only value. Use the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/channels#localizations">localizations</a></code> object to add, update, or delete localized metadata.</td>
    </tr>
    <tr id="snippet.localized.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>localized.<wbr></span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized channel title.</td>
    </tr>
    <tr id="snippet.localized.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.localized.</span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized channel description.</td>
    </tr>
    <tr id="snippet.country">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>country</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The country with which the channel is associated. To set this property's value, update the value of the <code translate="no" dir="ltr"><a href="#brandingSettings.channel.country">brandingSettings.channel.country</a></code> property.</td>
    </tr>
    <tr id="contentDetails">
      <td><code itemprop="property" translate="no" dir="ltr">contentDetails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">contentDetails</code> object encapsulates information about the channel's content.</td>
    </tr>
    <tr id="contentDetails.relatedPlaylists">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.</span>relatedPlaylists</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">relatedPlaylists</code> object is a map that identifies playlists associated with the channel, such as the channel's uploaded videos or liked videos. You can retrieve any of these playlists using the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlists/list">playlists.list</a></code> method.</td>
    </tr>
    <tr id="contentDetails.relatedPlaylists.likes">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.relatedPlaylists.</span>likes</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID of the playlist that contains the channel's liked videos. Use the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlistItems/insert">playlistItems.insert</a></code> and <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlistItems/delete">playlistItems.delete</a></code> methods to add or remove items from that list.</td>
    </tr>
    <tr id="contentDetails.relatedPlaylists.favorites">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.relatedPlaylists.</span>favorites</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>The ID of the playlist that contains the channel's favorite videos. Use the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlistItems/insert">playlistItems.insert</a></code> and <code translate="no" dir="ltr"><a href="/youtube/v3/docs/playlistItems/delete">playlistItems.delete</a></code> methods to add or remove items from that list.<br><br>Note that YouTube has deprecated favorite video functionality. For example, the <code translate="no" dir="ltr">video</code> resource's <code translate="no" dir="ltr">statistics.favoriteCount</code> property was deprecated on August 28, 2015. As a result, for historical reasons, this property value might contain a playlist ID that refers to an empty playlist and, therefore, cannot be fetched.</td>
    </tr>
    <tr id="contentDetails.relatedPlaylists.uploads">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentDetails.relatedPlaylists.</span>uploads</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID of the playlist that contains the channel's uploaded videos. Use the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/insert">videos.insert</a></code> method to upload new videos and the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/videos/delete">videos.delete</a></code> method to delete previously uploaded videos.</td>
    </tr>
    <tr id="statistics">
      <td><code itemprop="property" translate="no" dir="ltr">statistics</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">statistics</code> object encapsulates statistics for the channel.</td>
    </tr>
    <tr id="statistics.viewCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.</span>viewCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      <p>The sum of the number of times all the videos in all formats have been viewed for a channel.</p>

      <p>Starting March 31, 2025, for Shorts on a channel, viewCount will be updated to include the number of times a Short starts to play or replay.
      </p>
      </td>
    </tr>
    <tr id="statistics.commentCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.</span>commentCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The number of comments for the channel.</td>
    </tr>
    <tr id="statistics.subscriberCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.</span>subscriberCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
        The number of subscribers that the channel has. This value is rounded down to three
        significant figures. For more details about how subscriber counts are rounded, see
        <a href="/youtube/v3/revision_history#release_notes_09_10_2019">Revision History</a> or
        <a href="https://support.google.com/youtube/answer/6051134">YouTube Help Center</a>.</td>
    </tr>
    <tr id="statistics.hiddenSubscriberCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.</span>hiddenSubscriberCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the channel's subscriber count is publicly visible.</td>
    </tr>
    <tr id="statistics.videoCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">statistics.</span>videoCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned long</code><br>
      The number of public videos uploaded to the channel. Note that the value reflects the count of
        the channel's public videos only, even to owners. This behavior is consistent with counts
        shown on the YouTube website.</td>
    </tr>
    <tr id="topicDetails">
      <td><code itemprop="property" translate="no" dir="ltr">topicDetails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">topicDetails</code> object encapsulates information about topics associated with the channel.<br><br> <b>Important:</b> For more details about changes related to topic IDs, see the <code translate="no" dir="ltr">topicDetails.topicIds[]</code> property definition and the <a href="/youtube/v3/revision_history#november-10-2016">revision history</a>.</td>
    </tr>
    <tr id="topicDetails.topicIds[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">topicDetails.</span>topicIds[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of topic IDs associated with the channel.<br><br><span class="deprecated">This property has been deprecated as of November 10, 2016. It will be supported until November 10, 2017.</span><br><br><b>Important:</b> Due to the deprecation of Freebase and the Freebase API, topic IDs started working differently as of February 27, 2017. At that time, YouTube started returning a small set of curated topic IDs.<br><br>
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
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">topicDetails.</span>topicCategories[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      A list of Wikipedia URLs that describe the channel's content.</td>
    </tr>
    <tr id="status">
      <td><code itemprop="property" translate="no" dir="ltr">status</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">status</code> object encapsulates information about the privacy status of the channel.</td>
    </tr>
    <tr id="status.privacyStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>privacyStatus</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Privacy status of the channel.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">private</code></li>
<li><code translate="no" dir="ltr">public</code></li>
<li><code translate="no" dir="ltr">unlisted</code></li>

</ul>
</td>
    </tr>
    <tr id="status.isLinked">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>isLinked</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the channel data identifies a user that is already linked to either a YouTube username or a Google+ account. A user that has one of these links already has a public YouTube identity, which is a prerequisite for several actions, such as uploading videos.</td>
    </tr>
    <tr id="status.longUploadsStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>longUploadsStatus</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Indicates whether the channel is eligible to upload videos that are more than 15 minutes long. This property is only returned if the channel owner authorized the API request. For more information about this feature, see <a href="https://support.google.com/youtube/answer/71673">YouTube Help Center</a>.<br><br>Valid values for this property are:
<ul>
  <li><code translate="no" dir="ltr">allowed</code> – This channel can upload videos that are more than 15 minutes long.</li>
<li><code translate="no" dir="ltr">disallowed</code> – This channel is not able or eligible to upload videos that are more than 15 minutes long. A channel is only eligible to upload long videos if it is in good standing based on <a href="http://www.youtube.com/t/community_guidelines">YouTube Community Guidelines</a> and it does not have any worldwide Content ID blocks on its content.<br><br>After the channel owner resolves the issues that are preventing the channel from uploading longer videos, the channel will revert to either the <code translate="no" dir="ltr">allowed</code> or <code translate="no" dir="ltr">eligible</code> state.</li>
<li><code translate="no" dir="ltr">eligible</code> – This channel is eligible to upload videos that are more than 15 minutes long. However, the channel owner must first enable the ability to upload longer videos through <a href="https://www.youtube.com/verify">Phone verification</a>. For more details about this feature, see <a href="https://support.google.com/youtube/answer/71673">YouTube Help Center</a>.</li>

</ul>
</td>
    </tr>
    <tr id="status.madeForKids">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>madeForKids</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
        This value indicates whether the channel is designated as child-directed, and it contains
        the current "made for kids" status of the channel. For example, the status might be
        determined based on the value of the <code translate="no" dir="ltr">selfDeclaredMadeForKids</code> property. For more
        information about setting the audience for your channel, videos, or broadcasts, see
        <a href="https://support.google.com/youtube/answer/9527654">YouTube Help Center</a> .
    </td></tr>
    <tr id="status.selfDeclaredMadeForKids">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">status.</span>selfDeclaredMadeForKids</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
        In a <code translate="no" dir="ltr"><a href="/youtube/v3/docs/channels/update">channels.update</a></code> request,
        this property allows the channel owner to designate the channel as child-directed. The
        property value is only returned if the channel owner authorized the API request.
      </td>
    </tr>
    <tr id="brandingSettings">
      <td><code itemprop="property" translate="no" dir="ltr">brandingSettings</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">brandingSettings</code> object encapsulates information about the branding of the channel.</td>
    </tr>
    <tr id="brandingSettings.channel">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.</span>channel</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">channel</code> object encapsulates branding properties of the channel page.</td>
    </tr>
    <tr id="brandingSettings.channel.title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel's title. The title has a maximum length of 30 characters.</td>
    </tr>
    <tr id="brandingSettings.channel.description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The channel description, which appears in the channel information box on your channel page. The property's value has a maximum length of 1000 characters.</td>
    </tr>
    <tr id="brandingSettings.channel.keywords">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>keywords</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      Keywords associated with your channel. The value is a space-separated list of strings. Channel
        keywords might be truncated if they exceed the maximum allowed length of 500 characters or
        if they contained unescaped quotation marks (<code translate="no" dir="ltr">"</code>). Note that the 500 character
        limit is not a per-keyword limit but rather a limit on the total length of all keywords.</td>
    </tr>
    <tr id="brandingSettings.channel.trackingAnalyticsAccountId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>trackingAnalyticsAccountId</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID for a <a href="http://www.google.com/analytics/index.html">Google Analytics account</a> that you want to use to track and measure traffic to your channel.</td>
    </tr>
    <tr id="brandingSettings.channel.unsubscribedTrailer">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>unsubscribedTrailer</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The video that should play in the featured video module in the channel page's browse view for unsubscribed viewers. Subscribed viewers may see a different video that highlights more recent channel activity.<br><br> If specified, the property's value must be the YouTube video ID of a public or unlisted video that is owned by the channel owner.</td>
    </tr>
    <tr id="brandingSettings.channel.defaultLanguage">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>defaultLanguage</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The language of the text in the <code translate="no" dir="ltr">channel</code> resource's <code translate="no" dir="ltr">snippet.title</code> and <code translate="no" dir="ltr">snippet.description</code> properties.</td>
    </tr>
    <tr id="brandingSettings.channel.country">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.channel.</span>country</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The country with which the channel is associated. Update this property to set the value of the <code translate="no" dir="ltr"><a href="#snippet.country">snippet.country</a></code> property.</td>
    </tr>
    <tr id="brandingSettings.watch">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.</span>watch</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      <b>Note:</b> This object and all of its child properties have been deprecated.<br><br> The <code translate="no" dir="ltr">watch</code> object encapsulates branding properties of the watch pages for the channel's videos.</td>
    </tr>
    <tr id="brandingSettings.watch.textColor">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.watch.</span>textColor</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <b>Note:</b> This property has been deprecated.<br><br> The text color for the video watch page's branded area.</td>
    </tr>
    <tr id="brandingSettings.watch.backgroundColor">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.watch.</span>backgroundColor</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <b>Note:</b> This property has been deprecated.<br><br> The background color for the video watch page's branded area.</td>
    </tr>
    <tr id="brandingSettings.watch.featuredPlaylistId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.watch.</span>featuredPlaylistId</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <b>Note:</b> This property has been deprecated. The API returns an error if you attempt to set its value.</td>
    </tr>
    <tr id="brandingSettings.image">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.</span>image</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      <span style="color:red">This property and all of its child properties have been deprecated.</span><br><br>
      The <code translate="no" dir="ltr">image</code> object encapsulates information about images that display on the channel's channel page or video watch pages.</td>
    </tr>
    <tr id="brandingSettings.image.bannerImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for the banner image shown on the channel page on the YouTube website. The image is 1060px by 175px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerMobileImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerMobileImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for the banner image shown on the channel page in mobile applications. The image is 640px by 175px.</td>
    </tr>
    <tr id="brandingSettings.image.watchIconImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>watchIconImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for the image that appears above the video player. This is a 25-pixel-high image with a flexible width that cannot exceed 170 pixels. If you do not provide this image, your channel name will appear instead of an image.</td>
    </tr>
    <tr id="brandingSettings.image.trackingImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>trackingImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a 1px by 1px tracking pixel that can be used to collect statistics for views of the channel or video pages.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTabletLowImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTabletLowImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a low-resolution banner image that displays on the channel page in tablet applications. The image's maximum size is 1138px by 188px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTabletImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTabletImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a banner image that displays on the channel page in tablet applications. The image is 1707px by 283px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTabletHdImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTabletHdImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a high-resolution banner image that displays on the channel page in tablet applications. The image's maximum size is 2276px by 377px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTabletExtraHdImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTabletExtraHdImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for an extra-high-resolution banner image that displays on the channel page in tablet applications. The image's maximum size is 2560px by 424px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerMobileLowImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerMobileLowImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a low-resolution banner image that displays on the channel page in mobile applications. The image's maximum size is 320px by 88px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerMobileMediumHdImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerMobileMediumHdImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a medium-resolution banner image that displays on the channel page in mobile applications. The image's maximum size is 960px by 263px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerMobileHdImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerMobileHdImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a high-resolution banner image that displays on the channel page in mobile applications. The image's maximum size is 1280px by 360px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerMobileExtraHdImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerMobileExtraHdImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a very high-resolution banner image that displays on the channel page in mobile applications. The image's maximum size is 1440px by 395px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTvImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTvImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for an extra-high-resolution banner image that displays on the channel page in television applications. The image's maximum size is 2120px by 1192px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTvLowImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTvLowImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a low-resolution banner image that displays on the channel page in television applications. The image's maximum size is 854px by 480px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTvMediumImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTvMediumImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a medium-resolution banner image that displays on the channel page in television applications. The image's maximum size is 1280px by 720px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerTvHighImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerTvHighImageUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The URL for a high-resolution banner image that displays on the channel page in television applications. The image's maximum size is 1920px by 1080px.</td>
    </tr>
    <tr id="brandingSettings.image.bannerExternalUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.image.</span>bannerExternalUrl</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
        This property specifies the location of the banner image that YouTube uses to generate
        the various banner image sizes for a channel.</td>
    </tr>
    <tr id="brandingSettings.hints[]">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.</span>hints[]</code></td>
      <td><code class="apitype notranslate" dir="ltr">list</code><br>
      <span style="color:red">This property and all of its child properties have been deprecated.</span><br><br>
        The <code translate="no" dir="ltr">hints</code> object encapsulates additional branding properties.</td>
    </tr>
    <tr id="brandingSettings.hints[].property">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.hints[].</span>property</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        A property.</td>
    </tr>
    <tr id="brandingSettings.hints[].value">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">brandingSettings.hints[].</span>value</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      <span style="color:red">This property has been deprecated.</span><br><br>
        The property's value.</td>
    </tr>
    <tr id="auditDetails">
      <td><code itemprop="property" translate="no" dir="ltr">auditDetails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">auditDetails</code> object encapsulates channel data that a multichannel network (MCN) would evaluate while determining whether to accept or reject a particular channel. Note that any API request that retrieves this resource part must provide an authorization token that contains the <code translate="no" dir="ltr">https://www.googleapis.com/auth/youtubepartner-channel-audit</code> scope. In addition, any token that uses that scope must be revoked when the MCN decides to accept or reject the channel or within two weeks of the date that the token was issued.</td>
    </tr>
    <tr id="auditDetails.overallGoodStanding">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">auditDetails.</span>overallGoodStanding</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      This field indicates whether there are any issues with the channel. Currently, this field represents the result of the logical <code translate="no" dir="ltr">AND</code> operation over the <code translate="no" dir="ltr">communityGuidelinesGoodStanding</code>, <code translate="no" dir="ltr">copyrightStrikesGoodStanding</code>, and <code translate="no" dir="ltr">contentIdClaimsGoodStanding</code> properties, meaning that this property has a value of <code translate="no" dir="ltr">true</code> if all of those other properties also have a value of <code translate="no" dir="ltr">true</code>. However, this property will have a value of <code translate="no" dir="ltr">false</code> if any of those properties has a value of <code translate="no" dir="ltr">false</code>. Note, however, that the methodology used to set this property's value is subject to change.</td>
    </tr>
    <tr id="auditDetails.communityGuidelinesGoodStanding">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">auditDetails.</span>communityGuidelinesGoodStanding</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the channel respects YouTube's community guidelines.</td>
    </tr>
    <tr id="auditDetails.copyrightStrikesGoodStanding">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">auditDetails.</span>copyrightStrikesGoodStanding</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the channel has any copyright strikes.</td>
    </tr>
    <tr id="auditDetails.contentIdClaimsGoodStanding">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">auditDetails.</span>contentIdClaimsGoodStanding</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      Indicates whether the channel has any unresolved claims.</td>
    </tr>
    <tr id="contentOwnerDetails">
      <td><code itemprop="property" translate="no" dir="ltr">contentOwnerDetails</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">contentOwnerDetails</code> object encapsulates channel data that is visible only to the YouTube Partner that has linked the channel to their Content Manager.</td>
    </tr>
    <tr id="contentOwnerDetails.contentOwner">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentOwnerDetails.</span>contentOwner</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID of the content owner linked to the channel.</td>
    </tr>
    <tr id="contentOwnerDetails.timeLinked">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">contentOwnerDetails.</span>timeLinked</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time of when the channel was linked to the content owner. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="localizations">
      <td><code itemprop="property" translate="no" dir="ltr">localizations</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">localizations</code> object encapsulates translations of the channel's metadata.</td>
    </tr>
    <tr id="localizations.(key)">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.</span>(key)</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The language of the localized metadata associated with the key value. The value is a string that contains a <a href="http://www.rfc-editor.org/rfc/bcp/bcp47.txt">BCP-47</a> language code.</td>
    </tr>
    <tr id="localizations.(key).title">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.(key).</span>title</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized channel title.</td>
    </tr>
    <tr id="localizations.(key).description">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">localizations.(key).</span>description</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The localized channel description.</td>
    </tr>

  </tbody>
</table>