/**
 * YGO Database — shared language module
 * Usage: include this script, then call initLangSwitcher('container-id')
 * Lang is persisted in localStorage key 'ygo_lang'
 */

const YGO_LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
];

function getLang() {
  return localStorage.getItem('ygo_lang') || 'en';
}

function setLang(code) {
  localStorage.setItem('ygo_lang', code);
}

// Returns the API language query param string (empty string for EN)
function apiLangParam() {
  const lang = getLang();
  return lang === 'en' ? '' : '&language=' + lang;
}

function initLangSwitcher(containerId, onChangeFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const current = getLang();
  const wrapper = document.createElement('div');
  wrapper.id = 'ygo-lang-switcher';
  wrapper.style.cssText = 'display:flex;gap:3px;align-items:center;flex:0 0 auto;';
  YGO_LANGS.forEach(({ code, label }) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.dataset.lang = code;
    btn.className = 'ygo-lang-btn' + (code === current ? ' ygo-lang-active' : '');
    btn.addEventListener('click', () => {
      if (getLang() === code) return;
      setLang(code);
      document.querySelectorAll('.ygo-lang-btn').forEach(b => b.classList.remove('ygo-lang-active'));
      btn.classList.add('ygo-lang-active');
      if (onChangeFn) onChangeFn(code);
    });
    wrapper.appendChild(btn);
  });
  container.appendChild(wrapper);
}
