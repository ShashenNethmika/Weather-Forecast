// Enhancements layer without touching existing script.js logic
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const favoritesEl = $('#favorites');
  const saveBtn = $('#save-city');
  const unitBtn = $('#unit-toggle');
  const siBtn = $('#si-toggle');

  // Persistence
  const FAV_KEY='wf_favorites';
  const UNIT_KEY='wf_unit';
  const LANG_KEY='wf_lang';

  let favorites = [];
  try{ favorites = JSON.parse(localStorage.getItem(FAV_KEY)||'[]'); }catch{ favorites=[]; }

  function renderFavorites(){
    if(!favoritesEl) return;
    favoritesEl.innerHTML='';
    favorites.forEach((c,idx)=>{
      const chip=document.createElement('button');
      chip.className='fav-chip';
      chip.textContent=c;
      chip.onclick=()=>{ const inp=$('#location-input'); if(inp){ inp.value=c; const btn=$('#search-button'); btn&&btn.click(); } };
      const del=document.createElement('span'); del.className='fav-del'; del.textContent='×'; del.onclick=(e)=>{ e.stopPropagation(); favorites.splice(idx,1); localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); renderFavorites(); };
      chip.appendChild(del);
      favoritesEl.appendChild(chip);
    });
  }

  function saveCurrentCity(){
    const city = $('#city-name')?.textContent?.trim();
    if(!city || city==='City') return;
    if(!favorites.includes(city)){ favorites.push(city); localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); renderFavorites(); }
  }

  // Unit persistence: sync with existing unit toggle behavior in script.js
  function loadUnit(){
    const u = localStorage.getItem(UNIT_KEY);
    if(u && unitBtn){ unitBtn.textContent = u; }
  }
  function persistUnit(){ if(unitBtn){ localStorage.setItem(UNIT_KEY, unitBtn.textContent || '°C'); } }

  // Sinhala toggle minimal i18n
  const dictionary = {
    si: {
      'Search Weather':'කාලගුණ සෙවීම', 'Enter City':'නගරය ඇතුල් කරන්න', 'Use My Location':'මගේ ස්ථානය භාවිතා කරන්න', 'Light Mode':'අලෝක ප්‍රකාරය', 'Dark Mode':'අඳුරු ප්‍රකාරය', 'Temperature':'උෂ්ණත්වය', 'Condition':'තත්ත්වය', 'Description':'විස්තරය', 'Humidity':'ආර්ද්‍රතාව', 'Wind Speed':'සුළං වේගය', 'Hourly Forecast':'පැයවාර අනාවැකි', 'Daily Forecast':'දිනපතා අනාවැකි', 'Save City':'නගරය සුරකින්න'
    }
  };
  function applySinhala(on){
    const labels = $$('[data-i18n]');
    labels.forEach(el=>{ const key=el.getAttribute('data-i18n'); if(on && dictionary.si[key]) el.textContent = dictionary.si[key]+':' ; else { el.textContent = key+':'; } });
    const locLabel = document.querySelector('label[for="location-input"]'); if(locLabel){ locLabel.textContent = on ? 'නගරය ඇතුල් කරන්න' : 'Enter City'; }
    const searchBtn = $('#search-button'); if(searchBtn){ searchBtn.textContent = on ? 'සොයන්න' : 'Search'; }
    const geoBtn = $('#geolocation-button'); if(geoBtn){ geoBtn.textContent = on ? 'මගේ ස්ථානය' : 'Use My Location'; }
    const themeBtn = $('#theme-toggle'); if(themeBtn){ themeBtn.textContent = (themeBtn.textContent.includes('Dark') ? (on?'අඳුරු ප්‍රකාරය':'Dark Mode') : (on?'අලෝක ප්‍රකාරය':'Light Mode')); }
    const saveCity = $('#save-city'); if(saveCity){ saveCity.textContent = on ? 'නගරය සුරකින්න' : 'Save City'; }
  }

  function loadLang(){ const l = localStorage.getItem(LANG_KEY); const on = l==='si'; applySinhala(on); if(siBtn){ siBtn.textContent = on ? 'English' : 'සිංහල'; } }

  // Hook events
  saveBtn&&saveBtn.addEventListener('click', saveCurrentCity);
  unitBtn&&unitBtn.addEventListener('click', ()=>{ setTimeout(persistUnit, 0); });
  siBtn&&siBtn.addEventListener('click', ()=>{ const on = (siBtn.textContent==='සිංහල'); localStorage.setItem(LANG_KEY, on?'si':'en'); applySinhala(on); siBtn.textContent = on ? 'English' : 'සිංහල'; });

  // PWA install prompt optional
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); window.__deferredPrompt=e; });

  // Initial
  renderFavorites();
  loadUnit();
  loadLang();
})();
