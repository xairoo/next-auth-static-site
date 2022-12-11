import Link from "../link";
import LanguageMenu from "./languageMenu";
import AuthInfo from "./authInfo";
import styles from "./index.module.css";
import { useTranslation } from "next-i18next-static-site";

export default function Header() {
  const { t } = useTranslation();

  return (
    <div className={styles.header}>
      <div className={styles.flex}>
        <div>
          <Link href="/">{t("Home")}</Link>
        </div>
        <div>
          <Link href="/second-page">{t("Second Page")}</Link>
        </div>
        <div>
          <Link href="/dashboard">{t("Dashboard")}</Link>
        </div>
      </div>
      <LanguageMenu />
      <AuthInfo />
    </div>
  );
}
