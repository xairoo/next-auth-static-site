import { useEffect } from "react";
import { useRouter } from "next/router";
import { useLogout } from "next-static-site-auth";

export default function Logout() {
  // const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    // logout({ disableRemoteRequest: false }); // Skip logout API request
    // logout('http://api.example.com/path-to-your-logout-endpoint'); // Overwrite logout API endpoint URL
    logout({ redirect: false, apiRequest: false });

    // router.push("/");
  });

  return null;
}
