/**
 * Send the interest text to the backend and render the results.
 */
/**
 * Convert a fully qualified URL into a shorter host/path format.
 * Example: https://en.wikipedia.org/wiki/Agroecology -> en.wikipedia.org/Agroecology
 * @param {string} url - The full URL to shorten.
 * @returns {string} Shortened URL or the original string if parsing fails.
 */
function shortenUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/wiki\//, '/');
    return `${u.hostname}${path}`;
  } catch {
    return url;
  }
}

async function analyze() {
  const textarea = document.getElementById('interest-input');
  const table = document.getElementById('result-table');
  const tbody = table.querySelector('tbody');

  const response = await fetch('/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: textarea.value })
  });

  if (!response.ok) {
    console.error('Request failed');
    return;
  }

  const data = await response.json();
  tbody.innerHTML = '';

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.topicID}</td>
      <td>${item.topic}</td>
      <td>${item.description || ''}</td>
      <td>${item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${shortenUrl(item.url)}</a>` : ''}</td>
      <td>${item.score}</td>
    `;
    tbody.appendChild(row);
  });

  table.classList.remove('hidden');
}

document.getElementById('analyze-btn').addEventListener('click', analyze);
