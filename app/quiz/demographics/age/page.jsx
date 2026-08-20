"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../demographics.module.css";
import { PiDiamondThin } from "react-icons/pi";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { GoDiamond } from "react-icons/go";
import { BsDiamondFill } from "react-icons/bs";

export default function AgePage() {
  const [data, setData] = useState(null);
  const [selectedAge, setSelectedAge] = useState(null);
  const [selectedStat, setSelectedStat] = useState("age");
  const [confirmed, setConfirmed] = useState({ race: null, age: null, gender: null });
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed.data);
    }
    const saved = localStorage.getItem("confirmedDemographics");
    if (saved) {
      setConfirmed(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (confirmed.race || confirmed.age || confirmed.gender) {
      localStorage.setItem("confirmedDemographics", JSON.stringify(confirmed));
    }
  }, [confirmed]);

  const getTopPrediction = (obj) => {
    if (!obj) return "—";
    return Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  };

  const getTopConfidence = (obj) => {
    if (!obj) return 0;
    return Math.round(
      Object.entries(obj).sort((a, b) => b[1] - a[1])[0]?.[1] * 100
    ) || 0;
  };

  const handleAgeSelect = (age) => {
    setSelectedAge(age);
    setConfirmed((prev) => ({ ...prev, age }));
  };

  const getSortedEntriesByName = (obj) => {
  if (!obj) return [];
  return Object.entries(obj).sort((a, b) => {
    const numA = parseInt(a[0]);
    const numB = parseInt(b[0]);
    return numA - numB;
  });
};

  if (!data) return <p>Loading...</p>;

  const topRace = getTopPrediction(data.race);
  const topAge = getTopPrediction(data.age);
  const topGender = getTopPrediction(data.gender);
  const confidence = getTopConfidence(data.age);

  const activeAge = selectedAge || confirmed.age || topAge;
  const activeConfidence = data.age?.[activeAge]
    ? Math.round(data.age[activeAge] * 100)
    : confidence;

  return (
    <section className={styles.page}>
      <div className={styles.topLeft}>
        <p className={styles.brand}>A.I. ANALYSIS</p>
        <h1 className={styles.heading}>DEMOGRAPHICS</h1>
        <p className={styles.subtitle}>PREDICTED RACE & AGE</p>
      </div>

      <div className={styles.content}>
        <div className={styles.leftPanel}>
          <div className={styles.summary}>
            <div
              className={`${styles.summaryRow} ${selectedStat === "race" ? styles.summaryRowActive : ""}`}
              onClick={() => router.push("/quiz/demographics")}
            >
              <span className={`${styles.summaryLabel} ${selectedStat === "race" ? styles.summaryLabelActive : ""}`}>
                RACE
              </span>
              <span className={`${styles.summaryValue} ${selectedStat === "race" ? styles.summaryValueActive : ""}`}>
                {confirmed.race || topRace}
              </span>
            </div>
            <div
              className={`${styles.summaryRow} ${selectedStat === "age" ? styles.summaryRowActive : ""}`}
              onClick={() => router.push("/quiz/demographics/age")}
            >
              <span className={`${styles.summaryLabel} ${selectedStat === "age" ? styles.summaryLabelActive : ""}`}>
                AGE
              </span>
              <span className={`${styles.summaryValue} ${selectedStat === "age" ? styles.summaryValueActive : ""}`}>
                {confirmed.age || topAge}
              </span>
            </div>
            <div
              className={`${styles.summaryRow} ${selectedStat === "sex" ? styles.summaryRowActive : ""}`}
              onClick={() => router.push("/quiz/demographics/sex")}
            >
              <span className={`${styles.summaryLabel} ${selectedStat === "sex" ? styles.summaryLabelActive : ""}`}>
                SEX
              </span>
              <span className={`${styles.summaryValue} ${selectedStat === "sex" ? styles.summaryValueActive : ""}`}>
                {confirmed.gender || topGender}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.confidenceCircle}>
          <span className={styles.selectedLabel}>{activeAge}</span>
          <svg viewBox="0 0 120 120" className={styles.donut}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#eee" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="black"
              strokeWidth="10"
              strokeDasharray={`${activeConfidence * 3.39} ${339 - activeConfidence * 3.39}`}
              strokeDashoffset="85"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.confidenceText}>{activeConfidence}%</span>
          <p className={styles.confidenceLabel}>A.I. CONFIDENCE</p>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <span>AGE</span>
            <span>A.I. CONFIDENCE</span>
          </div>
          <div className={styles.raceList}>
            {getSortedEntriesByName(data.age).map(([age, score]) => (
              <div
                key={age}
                className={`${styles.raceRow} ${selectedAge === age ? styles.raceRowActive : ""}`}
                onClick={() => handleAgeSelect(age)}
                style={{ cursor: "pointer" }}
              >
                <span className={styles.raceDot}>
                  {selectedAge === age ? (
                    <BsDiamondFill size={18} color="white" />
                  ) : (
                    <GoDiamond size={18} color="rgba(0,0,0,0.3)" />
                  )}
                </span>
                <span className={styles.raceName}>{age}</span>
                <span className={`${styles.raceScore} ${selectedAge === age ? styles.raceScoreActive : ""}`}>
                  {Math.round(score * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomNav}>
        <Link href="/quiz/demographics" className={styles.backBtn}>
          <div className={styles.iconWrapper}>
            <PiDiamondThin size={40} color="black" strokeWidth={0.001} />
            <IoMdArrowDropleft className={styles.caretIcon} color="black" size={18} />
          </div>
          <span>BACK</span>
        </Link>

        <p className={styles.disclaimer}>
          If A.I. estimate is wrong, select the correct data.
        </p>

        <div className={styles.rightBtns}>
          <button
            className={styles.resetBtn}
            onClick={() => setConfirmed({ race: null, age: null, gender: null })}
          >
            RESET
          </button>
          <button
            className={styles.confirmBtn}
            onClick={() => {
              localStorage.setItem("confirmedDemographics", JSON.stringify(confirmed));
              router.push("/quiz/analysis");
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </section>
  );
}