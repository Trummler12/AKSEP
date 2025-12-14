/**
 * Interest search form (free text).
 * @param {{
 *   initialText?: string,
 *   onSubmit?: (text: string) => void,
 *   disabled?: boolean
 * }} config
 */
export function createInterestForm({ initialText = '', onSubmit, disabled = false } = {}) {
  const form = document.createElement('form');
  form.className = 'interest-form';

  const MIN_LEN = 12;
  const MAX_LEN = 2048;

  const label = document.createElement('label');
  label.className = 'interest-form__label';
  label.textContent = 'Your interests (free text)';

  const textarea = document.createElement('textarea');
  textarea.className = 'interest-form__textarea';
  textarea.rows = 5;
  textarea.placeholder = 'e.g. astronomy, biology, physics experiments…';
  textarea.minLength = MIN_LEN;
  textarea.maxLength = MAX_LEN;
  textarea.value = initialText;
  textarea.disabled = !!disabled;

  const actions = document.createElement('div');
  actions.className = 'interest-form__actions';

  const button = document.createElement('button');
  button.type = 'submit';
  button.className = 'button button--primary';
  button.textContent = 'Find interesting topics';
  button.disabled = !!disabled;

  actions.appendChild(button);

  form.appendChild(label);
  form.appendChild(textarea);
  form.appendChild(actions);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(textarea.value || '');
    }
  });

  return { root: form, textarea, button };
}
