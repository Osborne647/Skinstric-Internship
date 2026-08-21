"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./results.module.css";
import { PiDiamondThin } from "react-icons/pi";
import { IoMdArrowDropleft } from "react-icons/io";
import { RiImageCircleFill } from "react-icons/ri";
import { TbAtom2 } from "react-icons/tb";

export default function QuizResults() {
  const [loading, setLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  const analyzeImage = async (base64) => {
  setLoading(true);

  setTimeout(async () => {
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
      setLoading(false);
      alert("Something went wrong.");
    }
  }, 3000);
};

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Unable to access camera. Please check permissions.");
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg").split(",")[1];
    closeCamera();
    analyzeImage(base64);
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const handleGallery = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      analyzeImage(base64);
    };
  };

  return (
  <section className={styles.page}>
    {loading && (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingDiamond}>
          <p className={styles.loadingText}>ANALYZING...</p>
        </div>
      </div>
    )}

    <div className={`${styles.pageContent} ${loading ? styles.fadeOut : ""}`}>
      <div className={styles.topLeft}>
        <p className={styles.subtitle}>TO START ANALYSIS</p>
      </div>

      <div className={styles.options}>
        <div className={styles.optionLeft} onClick={openCamera} style={{ cursor: "pointer" }}>
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

      {cameraOpen && (
        <div className={styles.cameraOverlay}>
          <video ref={videoRef} autoPlay playsInline className={styles.cameraFeed} />
          <div className={styles.cameraControls}>
            <button onClick={takePhoto} className={styles.captureBtn}>
              CAPTURE
            </button>
            <button onClick={closeCamera} className={styles.cancelBtn}>
              CANCEL
            </button>
          </div>
        </div>
      )}

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
    </div>
  </section>
);
}