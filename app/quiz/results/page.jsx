"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./results.module.css";
import { PiDiamondThin } from "react-icons/pi";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoCameraOutline, IoImagesOutline } from "react-icons/io5";
import { RiImageCircleFill } from "react-icons/ri";
import { TbAtom2 } from "react-icons/tb";

export default function QuizResults() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCamera = async () => {
    // Future: open camera
    alert("Camera access coming soon");
  };

  const handleGallery = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setLoading(true);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64 = reader.result.split(",")[1];

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      
      const data = await res.json();
      console.log("API response:", data);
      localStorage.setItem("analysisResult", JSON.stringify(data));
      router.push("/quiz/analysis");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
};

  return (
    <section className={styles.page}>
      <div className={styles.topLeft}>
        <p className={styles.subtitle}>TO START ANALYSIS</p>
      </div>

      <div className={styles.options}>
        <div className={styles.optionLeft}>
          <p className={styles.optionLabel}>
            ALLOW AI TO SCAN
            <br />
            YOUR FACE
          </p>
          <div className={styles.connector}></div>
          <div className={styles.diamondFrame}>
            <div className={styles.iconCircle}>
              <TbAtom2 size={90} color="black" />
            </div>
          </div>
        </div>

        <label className={styles.optionRight}>
          <div className={styles.diamondFrame}>
            <div className={styles.iconCircle}>
              <RiImageCircleFill size={90} color="black" />
            </div>
          </div>
          <div className={styles.connector}></div>
          <p className={styles.optionLabel}>
            ALLOW AI ACCESS
            <br />
            GALLERY
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleGallery}
            className={styles.fileInput}
          />
        </label>
      </div>

      {loading && <p className={styles.loading}>Analyzing...</p>}

      <div className={styles.bottomNav}>
        <Link href="/quiz/location" className={styles.backBtn}>
          <div className={styles.iconWrapper}>
            <PiDiamondThin size={40} color="black" strokeWidth={0.001} />
            <IoMdArrowDropleft
              className={styles.caretIcon}
              color="black"
              size={18}
            />
          </div>
          <span>BACK</span>
        </Link>
      </div>
    </section>
  );
}
