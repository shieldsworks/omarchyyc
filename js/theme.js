(() => {
  const select = document.getElementById('theme-select');
  if (!select) return;
  const choices = new Set(Array.from(select.options, option => option.value));

  function apply(choice) {
    const theme = choices.has(choice) ? choice : 'auto';
    if (theme === 'auto') delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = theme;
    select.value = theme;
  }

  apply(document.documentElement.dataset.theme);
  select.parentElement.hidden = false;
  select.addEventListener('change', () => {
    apply(select.value);
    try {
      if (select.value === 'auto') localStorage.removeItem('oyc-theme');
      else localStorage.setItem('oyc-theme', select.value);
    } catch (_) {}
  });
  window.addEventListener('storage', event => {
    if (event.key === 'oyc-theme' || event.key === null) apply(event.newValue);
  });
})();
