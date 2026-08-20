"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./weather.module.css";

const Weather = () => {
  const router = useRouter()
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loc = localStorage.getItem("quizLocation") || "New York";
  
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=71dfa7ca093f42bbb00161726262008&q=${encodeURIComponent(loc)}&aqi=yes`
      );
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Weather fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchWeather();
}, []);

  if (loading) return <div className={styles.page}>Loading...</div>;
  if (!data || data.error) return <div className={styles.page}>Could not load weather data.</div>;

  const { current, location: loc } = data;
  const aqi = current.air_quality || {};

  const getSeason = (lat, month) => {
    const northern = ["WINTER", "WINTER", "SPRING", "SPRING", "SPRING", "SUMMER", "SUMMER", "SUMMER", "FALL", "FALL", "FALL", "WINTER"];
    const southern = ["SUMMER", "SUMMER", "FALL", "FALL", "FALL", "WINTER", "WINTER", "WINTER", "SPRING", "SPRING", "SPRING", "SUMMER"];
    return lat >= 0 ? northern[month] : southern[month];
  };

  const getClimateZone = (lat) => {
    const absLat = Math.abs(lat);
    if (absLat <= 23.5) return "TROPICAL";
    if (absLat <= 35) return "SUBTROPICAL";
    if (absLat <= 55) return "TEMPERATE";
    if (absLat <= 66.5) return "SUBARCTIC";
    return "POLAR";
  };

  const getAqiLabel = (val) => {
    if (val <= 50) return "Good";
    if (val <= 100) return "Moderate";
    if (val <= 150) return "Unhealthy (Sensitive)";
    if (val <= 200) return "Unhealthy";
    return "Very Poor";
  };

  const getSafeExposure = (uv) => {
    if (uv <= 2) return 60 * 6;
    if (uv <= 5) return 60 * 3;
    if (uv <= 7) return 90;
    if (uv <= 10) return 45;
    return 20;
  };

  const uvIndex = current.uv;
  const season = getSeason(loc.lat, new Date().getMonth());
  const climateZone = getClimateZone(loc.lat);
  const safeExposure = getSafeExposure(uvIndex);
  const usEpaIndex = aqi["us-epa-index"] || 1;
  const aqiScore = Math.round(aqi.pm2_5 || 10);

  const pollutants = [
    { name: "WHO", val: usEpaIndex, label: getAqiLabel(usEpaIndex * 50) },
    { name: "NO₂", val: Math.round(aqi.no2 || 0), label: getAqiLabel(aqi.no2 || 0) },
    { name: "CO", val: Math.round(aqi.co || 0), label: getAqiLabel(aqi.co || 0) },
    { name: "O₃", val: Math.round(aqi.o3 || 0), label: getAqiLabel(aqi.o3 || 0) },
    { name: "SO₂", val: Math.round(aqi.so2 || 0), label: getAqiLabel(aqi.so2 || 0) },
    { name: "PM10", val: Math.round(aqi.pm10 || 0), label: getAqiLabel(aqi.pm10 || 0) },
    { name: "PM2.5", val: Math.round(aqi.pm2_5 || 0), label: getAqiLabel(aqi.pm2_5 || 0) },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.breadcrumb}>ANALYSIS</p>
        <h1 className={styles.title}>WEATHER</h1>
        <p className={styles.subtitle}>WEATHER CONDITIONS IN YOUR LOCATION</p>
      </header>

      <p className={styles.location}>📍 {loc.name} {loc.region} {loc.country}</p>

      <div className={styles.grid}>
        {/* Air Quality */}
        <div className={styles.card}>
          <h3>AIR QUALITY INDEX</h3>
          <p className={styles.bigNumber}>{aqiScore}</p>
          <p className={styles.desc}>
            Air quality is {aqiScore <= 50 ? "satisfactory and poses little or no risk" : "moderate, acceptable for most people"}.
          </p>
        </div>

        {/* Pollen */}
        <div className={styles.card}>
          <h3>POLLEN</h3>
          <div className={styles.pollenTags}>
            <span className={styles.tag}>Wood Pollen</span>
            <span className={styles.tag}>Tree Pollen</span>
            <span className={styles.tag}>Grass Pollen</span>
          </div>
          <p className={styles.bigNumber}>{Math.round(aqi.pm10 || 20)}</p>
          <p className={styles.desc}>
            Pollen levels based on regional particulate data.
          </p>
        </div>

        {/* Pollution */}
        <div className={styles.card}>
          <h3>POLLUTION</h3>
          <table className={styles.pollutionTable}>
            <tbody>
              {pollutants.map((p) => (
                <tr key={p.name}>
                  <td>{p.name}</td>
                  <td>{p.val}</td>
                  <td>{p.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* UV Index */}
        <div className={styles.card}>
          <h3>UV INDEX</h3>
          <p className={styles.bigNumber}>{uvIndex}</p>
          <p className={styles.desc}>{uvIndex <= 2 ? "Low" : uvIndex <= 5 ? "Moderate" : uvIndex <= 7 ? "High" : "Very High"}</p>
        </div>

        {/* Season */}
        <div className={styles.card}>
          <h3>SEASON</h3>
          <p className={styles.bigNumber}>{season}</p>
        </div>

        {/* Safe Exposure */}
        <div className={styles.card}>
          <h3>SAFE EXPOSURE TIME</h3>
          <p className={styles.bigNumber}>{safeExposure}</p>
          <p className={styles.desc}>Minutes</p>
        </div>

        {/* Climate Zone */}
        <div className={styles.card}>
          <h3>CLIMATE ZONE</h3>
          <p className={styles.bigNumber}>{climateZone}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.backBtn} onClick={() => router.push("/quiz/demographics")}>← BACK</button>
      </div>
    </div>
  );
};

export default Weather;