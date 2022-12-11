import { useEffect } from "react";
import { useLogout } from "next-static-site-auth";
import { useTranslation } from "next-i18next-static-site";

export default function Logout() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.substring(0, 2);

  const logout = useLogout();

  useEffect(() => {
    logout({
      // redirect: false,
      apiRequest: false,
      callbackUrl: `/${lang}/logged-out`,
    });
  }, []);

  return null;
}
