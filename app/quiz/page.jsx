"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./quiz.module.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { PiDiamondThin } from "react-icons/pi";

export default function QuizName() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    if (name.trim()) {
      localStorage.setItem("quizName", name);
      setLoading(true);
      setTimeout(() => {
        router.push("/quiz/location");
      }, 2000);
    }
  };

  return (
    <section className={styles.page}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingDiamond}>
            <p className={styles.loadingText}>SAVING DATA...</p>
          </div>
        </div>
      )}

      <div className={`${styles.pageContent} ${loading ? styles.fadeOut : ""}`}>
        <div className={styles.topLeft}>
          <p className={styles.subtitle}>TO START ANALYSIS</p>
        </div>

        <div className={styles.center}>
          <span className={styles.hint}>CLICK TO TYPE</span>
          <input
            type="text"
            className={styles.input}
            placeholder="Introduce yourself"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className={styles.bottomNav}>
          <Link href="/" className={styles.backBtn}>
            <div className={styles.iconWrapper}>
              <PiDiamondThin size={40} color="black" strokeWidth={0.001} />
              <IoMdArrowDropleft className={styles.caretIcon} color="black" size={18} />
            </div>
            <span>BACK</span>
          </Link>

          <button className={styles.nextBtn} onClick={handleSubmit} disabled={!name.trim()}>
            <span>PROCEED</span>
            <div className={styles.iconWrapper}>
              <PiDiamondThin size={40} color="black" strokeWidth={0.001} />
              <IoMdArrowDropright className={styles.caretIcon} color="black" size={18} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}