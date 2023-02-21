
import { browser } from '$app/environment';

import { locales, loadTranslations } from '$lib/translations';


console.log(`%c${__BUILD_STRING__}`, "color: Purple;font-size:20px;")

export const load = async ({ url }) => {
  const { pathname } = url;

  var storedLocale;
  if(browser)
  {
    storedLocale = JSON.parse(localStorage.getItem("settings"))?.language;
  }

  var perferedLocale = 'en';
  if(!storedLocale && browser)
  { 
    var broserLocales = navigator.languages || [navigator.language || navigator.userLanguage];

    for(var broserLocale of broserLocales)
    {
      if(locales.get().indexOf(broserLocale) != -1)
      {
        perferedLocale = broserLocale; //Default back to English
        break;
      }
    }
    console.log(`Auto determained language: ${perferedLocale}`)
  }
  
  const initLocale = storedLocale || perferedLocale; // set default if no locale already set
  
  await loadTranslations(initLocale, pathname); // keep this just before the `return`

  return {};
}