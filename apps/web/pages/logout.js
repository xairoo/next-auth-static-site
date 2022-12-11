import { useEffect } from "react";
import { useLogout } from "next-auth-static-site";

export default function Logout() {
  // const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    logout({
      // redirect: false,
      apiRequest: false,
      callbackUrl: `/logged-out`,
    });
  }, []);

  return null;
}
