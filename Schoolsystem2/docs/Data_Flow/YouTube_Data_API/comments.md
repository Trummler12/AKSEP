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
      Identifies the API resource's type. The value will be <code translate="no" dir="ltr">youtube#comment</code>.</td>
    </tr>
    <tr id="etag">
      <td><code itemprop="property" translate="no" dir="ltr">etag</code></td>
      <td><code class="apitype notranslate" dir="ltr">etag</code><br>
      The Etag of this resource.</td>
    </tr>
    <tr id="id">
      <td><code itemprop="property" translate="no" dir="ltr">id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID that YouTube uses to uniquely identify the comment.</td>
    </tr>
    <tr id="snippet">
      <td><code itemprop="property" translate="no" dir="ltr">snippet</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      The <code translate="no" dir="ltr">snippet</code> object contains basic details about the comment.</td>
    </tr>
    <tr id="snippet.authorDisplayName">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>author<wbr>Display<wbr>Name</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The display name of the user who posted the comment.</td>
    </tr>
    <tr id="snippet.authorProfileImageUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>author<wbr>Profile<wbr>Image<wbr>Url</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The URL for the avatar of the user who posted the comment.</td>
    </tr>
    <tr id="snippet.authorChannelUrl">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>author<wbr>Channel<wbr>Url</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The URL of the comment author's YouTube channel, if available.</td>
    </tr>
    <tr id="snippet.authorChannelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>author<wbr>Channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">object</code><br>
      This object encapsulates information about the comment author's YouTube channel, if available.</td>
    </tr>
    <tr id="snippet.authorChannelId.value">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr>author<wbr>Channel<wbr>Id.<wbr></span>value</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID of the comment author's YouTube channel, if available.</td>
    </tr>
    <tr id="snippet.channelId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>channel<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The ID of the YouTube channel associated with the comment.</td>
    </tr>
    <tr id="snippet.textDisplay">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>text<wbr>Display</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The comment's text. The text can be retrieved in either plain text or HTML. (The <code translate="no" dir="ltr">comments.<wbr>list</code> and <code translate="no" dir="ltr">comment<wbr>Threads.<wbr>list</code> methods both support a <code translate="no" dir="ltr">text<wbr>Format</code> parameter, which specifies the chosen text format.)<br><br>Even the plain text may differ from the original comment text. For example, it may replace video links with video titles.</td>
    </tr>
    <tr id="snippet.textOriginal">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>text<wbr>Original</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The original, raw text of the comment as it was initially posted or last updated. The original text is only returned to the authenticated user if they are the comment's author.</td>
    </tr>
    <tr id="snippet.parentId">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.<wbr></span>parent<wbr>Id</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The unique ID of the parent comment. This property is only set if the comment was submitted as a reply to another comment.</td>
    </tr>
    <tr id="snippet.canRate">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>canRate</code></td>
      <td><code class="apitype notranslate" dir="ltr">boolean</code><br>
      This setting indicates whether the current viewer can rate the comment.</td>
    </tr>
    <tr id="snippet.viewerRating">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>viewerRating</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The rating the viewer has given to this comment. This property doesn't identify <code translate="no" dir="ltr">dislike</code> ratings, though this behavior is subject to change. In the meantime, the property value is <code translate="no" dir="ltr">like</code> if the viewer has rated the comment positively. The value is <code translate="no" dir="ltr">none</code> in all other cases, including the user having given the comment a negative rating or not having rated the comment.<br><br>Valid values for this property are:
      <ul>
        <li><code translate="no" dir="ltr">like</code></li>
        <li><code translate="no" dir="ltr">none</code></li>
      </ul>
      </td>
    </tr>
    <tr id="snippet.likeCount">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>likeCount</code></td>
      <td><code class="apitype notranslate" dir="ltr">unsigned integer</code><br>
      The total number of likes (positive ratings) the comment has received.</td>
    </tr>
    <tr id="snippet.moderationStatus">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>moderationStatus</code></td>
      <td><code class="apitype notranslate" dir="ltr">string</code><br>
      The comment's moderation status. This property is only returned if the API request was authorized by the owner of the channel or the video on which the requested comments were made. Also, this property isn't set if the API request used the <code translate="no" dir="ltr"><a href="/youtube/v3/docs/comments/list#id">id</a></code> filter parameter.<br><br>Valid values for this property are:
      <ul>
        <li><code translate="no" dir="ltr">heldForReview</code></li>
        <li><code translate="no" dir="ltr">likelySpam</code></li>
        <li><code translate="no" dir="ltr">published</code></li>
        <li><code translate="no" dir="ltr">rejected</code></li>
      </ul>
      </td>
    </tr>
    <tr id="snippet.publishedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>publishedAt</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time when the comment was orignally published. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    <tr id="snippet.updatedAt">
      <td><code itemprop="property" translate="no" dir="ltr"><span class="quiet">snippet.</span>updatedAt</code></td>
      <td><code class="apitype notranslate" dir="ltr">datetime</code><br>
      The date and time when the comment was last updated. The value is specified in <a href="//www.w3.org/TR/NOTE-datetime">ISO 8601</a> format.</td>
    </tr>
    </tbody>
  </table>