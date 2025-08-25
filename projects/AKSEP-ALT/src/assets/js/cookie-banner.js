function getCookie(name) {
  return document.cookie.split(';').map(v => v.trim()).find(v => v.startsWith(name + '='))?.split('=')[1];
}

document.addEventListener('DOMContentLoaded', () => {
  const cookieName = 'aksep-theme';
  if (getCookie(cookieName)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = '<span>Bitte Dark Mode aktivieren, sonst verfolgt dich ein helles Cookie \u{1F36A}</span> <button class="cookie-ok" type="button">OK</button>';

  const style = document.createElement('style');
  style.textContent = '.cookie-banner{position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:0.5rem 1rem;border-radius:4px;z-index:1000;display:flex;gap:0.5rem;align-items:center;font-size:0.9rem;} .cookie-banner .cookie-ok{background:#444;color:#fff;border:none;padding:0.25rem 0.5rem;cursor:pointer;}';
  document.head.appendChild(style);
  document.body.appendChild(banner);

  banner.querySelector('.cookie-ok').addEventListener('click', () => {
    banner.remove();
  });
});