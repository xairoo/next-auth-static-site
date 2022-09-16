import Link from "next/link";
import { useSession, useLogout, loginUrl } from "next-static-site-auth";
import style from "./authInfo.module.css";

export default function AuthInfo() {
  const { status, data: session } = useSession();
  const logout = useLogout();

  if (status === "unauthenticated") {
    return (
      <div>
        Not signed in,{" "}
        <Link
          href={loginUrl()}
          // href={loginUrl({
          //   //
          //   url: "en/login",
          //   callbackUrl: false,
          // })}
          /* It's fine to link also directly to your login page: href="/login" */
        >
          <a>login</a>
        </Link>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div>
        Signed in as {session?.email},{" "}
        <Link href="/logout">
          <a>logout (link)</a>
        </Link>{" "}
        or{" "}
        <span
          className={style.link}
          onClick={() =>
            logout({
              // apiRequest: false, // Optional, skip logout API request. Defaults to `true`
            })
          }
          // onClick={() => logout()}
        >
          logout (function)
        </span>
      </div>
    );
  }

  return null;
}
