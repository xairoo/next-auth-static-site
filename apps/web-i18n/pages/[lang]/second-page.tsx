import { useTranslation } from "next-i18next-static-site";

export default function SecondPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("Second Page")}</h1>
      <div>{t("Public page")}.</div>
    </div>
  );
}
