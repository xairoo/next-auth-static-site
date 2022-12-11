import { useTranslation } from "next-i18next-static-site";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("Logged Out")}</h1>
      <div>{t("See you later")}!</div>
    </div>
  );
}
