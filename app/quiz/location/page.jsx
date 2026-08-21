"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../quiz.module.css";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { PiDiamondThin } from "react-icons/pi";

export default function QuizLocation() {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (window.google && window.google.maps) {
      autocompleteRef.current =
        new window.google.maps.places.AutocompleteService();
      return;
    }

    const existing = document.querySelector(
      'script[src*="maps.googleapis.com"]',
    );
    if (existing) {
      existing.addEventListener("load", () => {
        autocompleteRef.current =
          new window.google.maps.places.AutocompleteService();
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB5hQjm7W9AyhtKUlRpZyFzj07VQekt4eI&libraries=places`;
    script.async = true;
    script.onload = () => {
      autocompleteRef.current =
        new window.google.maps.places.AutocompleteService();
    };
    document.head.appendChild(script);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocation(value);

    if (value.length > 2 && autocompleteRef.current) {
      autocompleteRef.current.getPlacePredictions(
        {
          input: value,
          types: ["(cities)"],
        },
        (predictions, status) => {
          if (status === "OK" && predictions) {
            setSuggestions(predictions);
          } else {
            setSuggestions([]);
          }
        },
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (place) => {
    setLocation(place.description);
    setSuggestions([]);
  };

 const handleSubmit = async () => {
  if (!location.trim()) return;
  setLoading(true);

  const name = localStorage.getItem("quizName") || "";
  localStorage.setItem("quizLocation", location);

  setTimeout(async () => {
    try {
      const res = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, location }),
        }
      );
      const data = await res.json();
      localStorage.setItem("quizResult", JSON.stringify(data));
      router.push("/quiz/results");
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Something went wrong. Try again.");
    }
  }, 3000);
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
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder="Where are you from?"
              value={location}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {suggestions.length > 0 && (
              <ul
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "4px",
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  zIndex: 10,
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {suggestions.map((s) => (
                  <li
                    key={s.place_id}
                    onClick={() => handleSelect(s)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#f5f5f5")
                    }
                    onMouseLeave={(e) => (e.target.style.background = "#fff")}
                  >
                    {s.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.bottomNav}>
          <Link href="/" className={styles.backBtn}>
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

          <button
            className={styles.nextBtn}
            onClick={handleSubmit}
            disabled={!location.trim()}
          >
            <span>PROCEED</span>
            <div className={styles.iconWrapper}>
              <PiDiamondThin size={40} color="black" strokeWidth={0.001} />
              <IoMdArrowDropright
                className={styles.caretIcon}
                color="black"
                size={18}
              />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
