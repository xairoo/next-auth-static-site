import Link from "next/link";
import styles from "./index.module.css";
import { loginUrl } from "next-static-site-auth";

export default function Protected() {
  return (
    <div className={styles.warning}>
      <div className={styles.title}>Protected route.</div>
      <div className="">
        Please <Link href={loginUrl()}>login</Link> to view this page.
      </div>
    </div>
  );
}
