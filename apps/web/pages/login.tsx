import { useState } from "react";
import { useRouter } from "next/router";
import { useLogin } from "next-auth-static-site";
import styles from "./login.module.css";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("user@example.com");
  const [password, setPassword] = useState<string>("123456");
  const [status, setStatus] = useState<null | string>(null);
  const login = useLogin();

  const handleEmail = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setStatus("Loading...");

    const response = await login({
      body: {
        email: email,
        password: password,
      },
      callbackUrl: router.query?.callbackUrl?.toString(),
      // callbackUrl: false,
    });

    if (response.error) {
      console.log(response.error);
      setStatus(response.error);
      // Handle the error...
      // setError(response.error);
      return;
    }

    if (response.callbackUrl) {
      router.push(response.callbackUrl);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <div>This is a custom login page.</div>

      <h2>Test credentials, click to apply</h2>

      <div
        className={styles.clickable}
        onClick={() => setEmail("user@example.com")}
      >
        user@example.com
      </div>

      <div>
        <span
          className={styles.clickable}
          onClick={() => setEmail("norefresh@example.com")}
        >
          norefresh@example.com
        </span>{" "}
        (token refresh will fail)
      </div>

      <div>
        Password:{" "}
        <span
          className={styles.clickable}
          onClick={() => setPassword("123456")}
        >
          123456
        </span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>
            <div className={styles.name}>Email:</div>
            <input
              className={styles.input}
              type="text"
              name="email"
              onChange={handleEmail}
              value={email}
            />
          </label>
        </div>
        <div>
          <label className={styles.label}>
            <div className={styles.name}>Password:</div>
            <input
              className={styles.input}
              type="password"
              name="password"
              onChange={handlePassword}
              value={password}
            />
          </label>
        </div>
        <input type="submit" value="Submit" />
        <div>{status}</div>
      </form>
    </div>
  );
}
