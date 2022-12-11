// import Link from "../Link";
import Link from "next/link";
import styles from "./index.module.css";
import { loginUrl } from "next-auth-static-site";
import { useTranslation, Trans } from "next-i18next-static-site";

export default function Protected() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.substring(0, 2);

  return (
    <div className={styles.warning}>
      <div className={styles.title}>{t("Protected content")}.</div>
      <div>
        <Trans
          i18nKey="pleaseLogin"
          components={{
            loginLink: (
              <Link
                href={loginUrl({ pathname: `/${lang}/login` })}
                title={t("Login")}
              />
            ),
          }}
        ></Trans>
      </div>
    </div>
  );
}
