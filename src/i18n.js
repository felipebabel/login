import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import pt from "./locales/pt.json";
import en from "./locales/en.json";
import es from "./locales/es.json"; 
import de from "./locales/de.json"; 

i18n.use(initReactI18next).init({
  resources: {
    pt: { translation: pt },
    en: { translation: en },
    es: { translation: es }, 
    de: { translation: de }  
  },
  lng: "en", 
  fallbackLng: "en", 
  interpolation: { escapeValue: false }
});

export default i18n;