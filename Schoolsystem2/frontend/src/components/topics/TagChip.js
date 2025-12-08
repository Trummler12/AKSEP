/**
 * Klickbarer Tag-Badge.
 * @param {{ label: string, active?: boolean, onToggle?: () => void }} config
 */
export function createTagChip({ label, active = false, onToggle }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tag-chip';
  if (active) {
    button.classList.add('tag-chip--active');
  }

  button.textContent = label;

  button.addEventListener('click', () => {
    if (typeof onToggle === 'function') {
      onToggle();
    }
  });

  return button;
}
