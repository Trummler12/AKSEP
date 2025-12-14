import { searchTopicsByInterest } from '../services/interestService.js';
import { createInterestForm } from '../components/interest/InterestForm.js';
import { createInterestResults } from '../components/interest/InterestResults.js';

/**
 * /interesting – free text interests, results sorted by score.
 * @param {{ path: string, params: object, query: URLSearchParams }} context
 */
export function createInterestView(context) {
  const container = document.createElement('div');
  container.className = 'view view--interest';

  const MIN_TEXT_LEN = 12;
  const MAX_TEXT_LEN = 2048;
  const COOLDOWN_MS = 60_000;

  const heading = document.createElement('h1');
  heading.textContent = 'Interest-based topic search';

  const intro = document.createElement('p');
  intro.textContent =
    'Describe your interests in free text — the system will suggest matching topics sorted by a relevance score.';

  const errorBox = document.createElement('div');
  errorBox.className = 'alert alert--error';
  errorBox.style.display = 'none';

  const status = document.createElement('div');
  status.className = 'text-muted';
  status.textContent = '';

  const hint = document.createElement('div');
  hint.className = 'text-muted';
  hint.textContent = '';

  const formHost = document.createElement('div');
  const resultsHost = document.createElement('div');

  container.appendChild(heading);
  container.appendChild(intro);
  container.appendChild(errorBox);
  container.appendChild(status);
  container.appendChild(hint);
  container.appendChild(formHost);
  container.appendChild(resultsHost);

  const initialText = (context.query && context.query.get('q')) || '';
  let isSearching = false;
  let lastSubmittedText = null;
  let cooldownUntil = 0;
  let cooldownTimerId = null;
  let currentResponse = null;
  let selectedTags = [];

  const form = createInterestForm({
    initialText,
    onSubmit: (text) => {
      runSearch(text);
    }
  });
  formHost.appendChild(form.root);

  function normalize(text) {
    return (text || '').trim();
  }

  function updateButtonState() {
    const now = Date.now();
    const currentText = normalize(form.textarea.value);

    if (isSearching) {
      form.button.disabled = true;
      hint.textContent = 'Searching…';
      return;
    }

    const lengthOk = currentText.length >= MIN_TEXT_LEN && currentText.length <= MAX_TEXT_LEN;
    if (!lengthOk) {
      form.button.disabled = true;
      hint.textContent = `Enter between ${MIN_TEXT_LEN} and ${MAX_TEXT_LEN} characters.`;
      return;
    }

    if (now < cooldownUntil) {
      const remaining = Math.ceil((cooldownUntil - now) / 1000);
      form.button.disabled = true;
      hint.textContent = `Please wait ${remaining}s before searching again.`;
      return;
    }

    if (lastSubmittedText !== null && currentText === lastSubmittedText) {
      form.button.disabled = true;
      hint.textContent = 'Edit your text before searching again.';
      return;
    }

    form.button.disabled = false;
    hint.textContent = '';
  }

  function startCooldown() {
    cooldownUntil = Date.now() + COOLDOWN_MS;
    if (cooldownTimerId) {
      window.clearInterval(cooldownTimerId);
      cooldownTimerId = null;
    }
    cooldownTimerId = window.setInterval(() => {
      if (Date.now() >= cooldownUntil) {
        window.clearInterval(cooldownTimerId);
        cooldownTimerId = null;
      }
      updateButtonState();
    }, 250);
    updateButtonState();
  }

  form.textarea.addEventListener('input', () => {
    errorBox.style.display = 'none';
    errorBox.textContent = '';
    updateButtonState();
  });
  updateButtonState();

  function normalizeTagLabel(label) {
    return (label || '').trim();
  }

  function toggleTag(tagLabel) {
    const normalized = normalizeTagLabel(tagLabel);
    if (!normalized) return;

    const lower = normalized.toLowerCase();
    const next = Array.isArray(selectedTags) ? [...selectedTags] : [];
    const idx = next.findIndex((t) => (t || '').toLowerCase() === lower);
    if (idx >= 0) {
      next.splice(idx, 1);
    } else {
      next.push(normalized);
    }
    selectedTags = next;
    renderResults();
  }

  function clearSelectedTags() {
    selectedTags = [];
    renderResults();
  }

  function showLoadingPlaceholder() {
    resultsHost.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'interest-results__loading';
    box.textContent = 'Loading results...';
    resultsHost.appendChild(box);
  }

  function renderResults() {
    resultsHost.innerHTML = '';
    if (!currentResponse) return;
    resultsHost.appendChild(
      createInterestResults({
        response: currentResponse,
        selectedTags,
        onTagToggle: toggleTag,
        onClearTags: clearSelectedTags
      })
    );
  }

  async function runSearch(text) {
    const interestsText = (text || '').trim();

    if (interestsText.length < MIN_TEXT_LEN || interestsText.length > MAX_TEXT_LEN) {
      errorBox.style.display = 'block';
      errorBox.textContent = `Please enter between ${MIN_TEXT_LEN} and ${MAX_TEXT_LEN} characters.`;
      updateButtonState();
      return;
    }

    if (Date.now() < cooldownUntil) {
      updateButtonState();
      return;
    }

    if (lastSubmittedText !== null && interestsText === lastSubmittedText) {
      updateButtonState();
      return;
    }

    status.textContent = 'Searching…';
    errorBox.style.display = 'none';
    errorBox.textContent = '';
    currentResponse = null;
    selectedTags = [];
    showLoadingPlaceholder();

    form.textarea.disabled = true;
    isSearching = true;
    updateButtonState();

    try {
      const response = await searchTopicsByInterest({
        interestsText,
        maxResults: 50,
        explainMatches: true
      });

      const count = Array.isArray(response.topics) ? response.topics.length : 0;
      status.textContent = `Found ${count} topics.`;

      currentResponse = response;
      renderResults();
    } catch (err) {
      status.textContent = '';
      errorBox.style.display = 'block';
      errorBox.textContent = err?.message || 'Unexpected error while searching.';
      resultsHost.innerHTML = '';
    } finally {
      form.textarea.disabled = false;
      isSearching = false;
      lastSubmittedText = interestsText;
      startCooldown();
    }
  }

  return container;
}
