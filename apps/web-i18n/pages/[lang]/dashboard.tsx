import { useSession } from "next-auth-static-site";
import useSWR from "swr";
import fetcher from "../../utils/fetcher";
import Protected from "../../components/protected";
import styles from "./dashboard.module.css";
import { Trans, useTranslation } from "next-i18next-static-site";

export default function Dashboard() {
  const { status, data: session, token } = useSession();
  const { t } = useTranslation();

  // Fetch some external data if authenticated
  const { data, error } = useSWR(
    token && status === "authenticated"
      ? {
          url: process.env.NEXT_PUBLIC_DATA_URL
            ? process.env.NEXT_PUBLIC_DATA_URL
            : "http://localhost:5000/data",
          method: "GET",
          token,
        }
      : null, // Fetch only if bearer token is set
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 1000 * 5,
    }
  );

  if (status === "loading") {
    return null; // Display nothing or...

    // Display loading state
    return (
      <>
        <h1>Dashboard</h1>
        <div>Loading...</div>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <h1>Dashboard</h1>
        <Protected />
      </>
    );
  }

  if (status === "authenticated") {
    return (
      <div>
        <h1>Dashboard</h1>
        <div>{t("Protected content")}.</div>
        <div>
          <Trans
            i18nKey="signedInAs"
            values={{ email: session.email }}
            components={{ em: <em /> }}
          />
        </div>

        <div>
          {!error && data && (
            <div>
              <div>{data.content}</div>
              <div>
                {t("Server time")}: {data.serverTime}
              </div>
            </div>
          )}
          {error && <div className={styles.error}>{error.toString()}</div>}
        </div>
      </div>
    );
  }
}
