
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.btn}>
        <span className={styles.companyname}>SKINSTRIC</span>
      </Link>
    </nav>
  );
}