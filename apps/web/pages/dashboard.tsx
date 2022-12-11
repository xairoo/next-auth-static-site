import { useSession } from "next-auth-static-site";
import useSWR from "swr";
import fetcher from "../utils/fetcher";
import Protected from "../components/protected";

export default function Dashboard() {
  const { status, data: session, token } = useSession();

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
      <>
        <h1>Dashboard</h1>
        <div>Protected page.</div>
        <div>
          Signed in as {session.email} <br />
        </div>

        <div>
          {!error && data && (
            <div>
              <div>{data.content}</div>
              <div>Server time: {data.serverTime}</div>
            </div>
          )}
        </div>
      </>
    );
  }
}
