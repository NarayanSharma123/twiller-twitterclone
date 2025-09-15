import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationES from "./locales/es/translation.json";
import translationHI from "./locales/hi/translation.json";
import translationPT from "./locales/pt/translation.json";
import translationZH from "./locales/zh/translation.json";
import translationJA from "./locales/ja/translation.json";
import translationDE from "./locales/de/translation.json";
import translationAR from "./locales/ar/translation.json";

const resources = {
  en: { translation: translationEN },
  fr: { translation: translationFR },
  es: { translation: translationES },
  hi: { translation: translationHI },
  pt: { translation: translationPT },
  zh: { translation: translationZH },
  ja: { translation: translationJA },
  de: { translation: translationDE },
  ar: { translation: translationAR },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
