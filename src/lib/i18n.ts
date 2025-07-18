"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uzTranslation from "@/../public/locales/uz/translation.json";
import enTranslation from "@/../public/locales/en/translation.json";
import ruTranslation from "@/../public/locales/ru/translation.json";

const resources = {
  uz: { translation: uzTranslation },
  en: { translation: enTranslation },
  ru: { translation: ruTranslation },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "uz",
      supportedLngs: ["uz", "en", "ru"],
      detection: {
        order: ["localStorage", "navigator", "htmlTag"],
        caches: ["localStorage"],
      },
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
