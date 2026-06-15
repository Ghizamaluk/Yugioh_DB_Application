/**
 * YGO Database — shared language module
 * Usage: include this script, then call initLangSwitcher('container-id')
 * Lang is persisted in localStorage key 'ygo_lang'
 * Requires: names.js to be loaded (always)
 * Lazy-loads: descs.js on first desc request
 */

const YGO_LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'es', label: 'ES' },
];

function getLang() {
  return localStorage.getItem('ygo_lang') || 'en';
}

function setLang(code) {
  localStorage.setItem('ygo_lang', code);
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

// names.js must be loaded before calling this
function cardNameLang(enName) {
  const lang = getLang();
  if (lang === 'en') return enName;
  const t = (typeof YGO_CARD_NAMES !== 'undefined') && YGO_CARD_NAMES[enName];
  return (t && t[lang]) || enName;
}

// descs.js is lazy-loaded on first call if not already present
let _descsLoading = false;
let _descsCallbacks = [];

function cardDescLang(enName, enDesc, onReady) {
  const lang = getLang();
  if (lang === 'en') return enDesc;
  if (typeof YGO_CARD_DESCS !== 'undefined') {
    const t = YGO_CARD_DESCS[enName];
    return (t && t[lang]) || enDesc;
  }
  // Lazy-load descs.js then call onReady if provided
  if (onReady && !_descsLoading) {
    _descsLoading = true;
    const s = document.createElement('script');
    s.src = 'descs.js';
    s.onload = () => { _descsCallbacks.forEach(cb => cb()); _descsCallbacks = []; };
    document.head.appendChild(s);
  }
  if (onReady) _descsCallbacks.push(onReady);
  return enDesc; // return EN desc while loading
}
