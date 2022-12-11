import { useEffect } from "react";
import { useLogout } from "next-auth-static-site";
import { useTranslation } from "next-i18next-static-site";

export default function Logout() {
  const { i18n } = useTranslation();
  const lang = i18n.language.substring(0, 2);

  const logout = useLogout();

  useEffect(() => {
    logout({
      apiRequest: false,
      callbackUrl: `/${lang}/logged-out`,
    });
  }, []);

  return null;
}
