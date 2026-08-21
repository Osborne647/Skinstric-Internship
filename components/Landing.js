"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Landing.module.css";
import { PiDiamondThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      router.push("/quiz");
    }, 4000);
  };

  return (
    <section className={styles.landing}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingDiamond}>
            <p className={styles.loadingText}>PREPARING YOUR ANALYSIS...</p>
          </div>
        </div>
      )}

      <div
        className={`${styles.landingContent} ${loading ? styles.fadeOut : ""}`}
      >
        <h1 className={styles.heading}>
          Sophisticated
          <br />
          skincare
        </h1>
        <div className={styles.rightDiamond}>
          <div
            className={styles.ctaGroup}
            onClick={handleStart}
            style={{ cursor: "pointer" }}
          >
            <p className={styles.btnname}>TAKE TEST</p>
            <div className={styles.iconWrapper}>
              <PiDiamondThin size={60} color="black" strokeWidth={0.001} />
              <IoMdArrowDropright
                className={styles.caretIcon}
                color="black"
                size={18}
              />
            </div>
          </div>
        </div>
        <span className={styles.label}>
          Skinetic developed an AI that creates a highly personalized routine
          tailored to what your skin needs.
        </span>
      </div>
    </section>
  );
}
