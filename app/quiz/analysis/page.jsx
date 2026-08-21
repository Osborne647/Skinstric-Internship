"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./analysis.module.css";
import { PiDiamondThin } from "react-icons/pi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

export default function AnalysisPage() {
  const [result, setResult] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      setResult(parsed.data);
    }
    const saved = localStorage.getItem("confirmedDemographics");
    if (saved) {
      setDemographics(JSON.parse(saved));
    }
  }, []);

  const navigateWithLoading = (path, text) => {
    setLoadingText(text);
    setLoading(true);
    setTimeout(() => {
      router.push(path);
    }, 3000);
  };

  const getTopPrediction = (obj) => {
    if (!obj) return "—";
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  };

  return (
    <section className={styles.page}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingDiamond}>
            <p className={styles.loadingText}>{loadingText}</p>
          </div>
        </div>
      )}

      <div className={`${styles.pageContent} ${loading ? styles.fadeOut : ""}`}>
        <div className={styles.intro}>
          <h2 className={styles.heading}>A.I. ANALYSIS</h2>
        </div>

        <div className={styles.diamondNav}>
          <div className={styles.diamondFrame}>
            <div className={styles.diamondFrametwo}>
              <span className={styles.labelTop} onClick={() => navigateWithLoading("/quiz/demographics", "LOADING DEMOGRAPHICS...")} style={{cursor: "pointer"}}>
                <span className={styles.labelText}>DEMOGRAPHICS</span>
              </span>
              <span className={styles.labelRight}>
                <span className={styles.labelText}>COSMETIC CONCERNS</span>
              </span>
              <span className={styles.labelBottom}>
                <span className={styles.labelText}>SKIN TYPE DETAILS</span>
              </span>
              <span className={styles.labelLeft} onClick={() => navigateWithLoading("/quiz/weather", "LOADING WEATHER...")} style={{cursor: "pointer"}}>
                <span className={styles.labelText}>WEATHER</span>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.confirmedInfo}>
          <div className={styles.confirmedItem}>
            <span className={styles.confirmedLabel}>RACE</span>
            <span>{demographics?.race || (result && getTopPrediction(result.race)) || "—"}</span>
          </div>
          <div className={styles.confirmedItem}>
            <span className={styles.confirmedLabel}>SEX</span>
            <span>{demographics?.gender || (result && getTopPrediction(result.gender)) || "—"}</span>
          </div>
          <div className={styles.confirmedItem}>
            <span className={styles.confirmedLabel}>AGE</span>
            <span>{demographics?.age || (result && getTopPrediction(result.age)) || "—"}</span>
          </div>
        </div>

        <div className={styles.bottomNav}>
          <Link href="/quiz/results" className={styles.backBtn}>
            <div className={styles.iconWrapper}>
              <PiDiamondThin size={60} color="black" strokeWidth={0.001} />
              <IoMdArrowDropleft className={styles.caretIcon} color="black" size={30} />
            </div>
            <span className={styles.backbtn}>BACK</span>
          </Link>

          <button className={styles.nextBtn} onClick={() => router.push("/quiz/summary")}>
            <span className={styles.proceedbtn}>GET SUMMARY</span>
            <div className={styles.iconWrapper}>
              <PiDiamondThin size={60} color="black" strokeWidth={0.001} />
              <IoMdArrowDropright className={styles.caretIcon} color="black" size={30} />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}