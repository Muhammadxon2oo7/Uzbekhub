// app/about/page.tsx

"use client";

import React from "react";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation("translation");

  return (
    <div>
      <h1>{t("welcome")}</h1>
    </div>
  );
}
