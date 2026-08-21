"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const router = useRouter();

  const handleReset = (e) => {
    e.preventDefault();
    localStorage.clear();
    router.push("/");
  };

  return (
    <nav className={styles.navbar}>
      <Link
        href="/"
        onClick={() => localStorage.clear()}
        className={styles.btn}
      >
        <span className={styles.companyname}>SKINSTRIC</span>
      </Link>
    </nav>
  );
}
