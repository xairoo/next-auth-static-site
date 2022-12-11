import Link from "../link";
import { useSession, useLogout, loginUrl } from "next-static-site-auth";
import { useTranslation } from "next-i18next-static-site";
import style from "./authInfo.module.css";

export default function AuthInfo() {
  const { status, data: session } = useSession();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.substring(0, 2);
  const logout = useLogout();

  if (status === "unauthenticated") {
    return (
      <div>
        <Link
          href={loginUrl({ pathname: `/login` })}
          // href={loginUrl({
          //   //
          //   pathname: "en/login",
          //   callbackUrl: false,
          // })}
          /* It's fine to link also directly to your login page: href="/login" */
        >
          {t("Login")}
        </Link>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div>
        {session?.email} / <Link href={`/logout`}>{t("Logout")} (link)</Link> /{" "}
        <span
          className={style.link}
          onClick={() =>
            logout({
              // apiRequest: false, // Optional, skip logout API request. Defaults to `true`
              callbackUrl: `/${lang}/logged-out`,
            })
          }
          // onClick={() => logout()}
        >
          {t("Logout")} (function)
        </span>
      </div>
    );
  }

  return null;
}
