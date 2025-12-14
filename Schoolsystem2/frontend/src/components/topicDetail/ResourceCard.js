function isYouTubeUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('youtube.com') || lower.includes('youtu.be');
}

function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    if (host.includes('youtu.be')) {
      const id = u.pathname.replace(/^\/+/, '').split('/')[0];
      return id
        ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
        : null;
    }

    if (host.includes('youtube.com')) {
      if (u.pathname === '/watch') {
        const id = u.searchParams.get('v');
        return id
          ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
          : null;
      }
      if (u.pathname.startsWith('/embed/')) {
        return url;
      }
      if (u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.replace('/shorts/', '').split('/')[0];
        return id
          ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
          : null;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Card for a single scored resource on the topic detail page.
 * @param {{
 *   entry: {
 *     resource: { id: number, title: string, description: string, type: string, isActive: boolean, url: string },
 *     score: number,
 *     matchedTags?: { tagId: number, label: string, topicWeight: number, resourceWeight: number, contribution: number }[]
 *   }
 * }} config
 */
export function createResourceCard({ entry }) {
  const root = document.createElement('article');
  root.className = 'resource-card';

  const header = document.createElement('div');
  header.className = 'resource-card__header';

  const title = document.createElement('a');
  title.className = 'resource-card__title';
  title.href = entry?.resource?.url || '#';
  title.target = '_blank';
  title.rel = 'noreferrer';
  title.textContent = entry?.resource?.title || `Resource #${entry?.resource?.id ?? ''}`;

  const meta = document.createElement('div');
  meta.className = 'resource-card__meta';
  const type = entry?.resource?.type || 'Unknown';
  const score = typeof entry?.score === 'number' ? entry.score : 0;
  meta.textContent = `${type} • score ${score}`;

  header.appendChild(title);
  header.appendChild(meta);
  root.appendChild(header);

  const description = document.createElement('p');
  description.className = 'resource-card__description';
  description.textContent = entry?.resource?.description || '';
  root.appendChild(description);

  const url = entry?.resource?.url;
  const embedUrl = url && isYouTubeUrl(url) ? getYouTubeEmbedUrl(url) : null;
  if (embedUrl) {
    const embed = document.createElement('div');
    embed.className = 'resource-card__embed';
    const iframe = document.createElement('iframe');
    iframe.title = entry?.resource?.title || 'YouTube video';
    iframe.src = embedUrl;
    iframe.loading = 'lazy';
    iframe.allow =
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    embed.appendChild(iframe);
    root.appendChild(embed);
  }

  const matchedTags = Array.isArray(entry?.matchedTags) ? entry.matchedTags : [];
  if (matchedTags.length > 0) {
    const explain = document.createElement('details');
    explain.className = 'resource-card__explain';

    const summary = document.createElement('summary');
    summary.textContent = 'Why this resource?';
    explain.appendChild(summary);

    const list = document.createElement('ul');
    list.className = 'resource-card__matched-tags';
    matchedTags.forEach((mt) => {
      const li = document.createElement('li');
      li.textContent = `${mt.label}: topic ${mt.topicWeight} × resource ${mt.resourceWeight} = ${mt.contribution}`;
      list.appendChild(li);
    });
    explain.appendChild(list);
    root.appendChild(explain);
  }

  return root;
}
