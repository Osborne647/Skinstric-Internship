import Link from "next/link";
import styles from "./Landing.module.css";
import { PiDiamondThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";

export default function Home() {
  return (
    <section className={styles.landing}>
      <h1 className={styles.heading}>
        Sophisticated
        <br />
        skincare
      </h1>
      <div className={styles.rightDiamond}>
      <div className={styles.ctaGroup}>
        <p className={styles.btnname}>TAKE TEST</p>
        <Link href="/quiz" className={styles.diamondLink}>
          <div className={styles.iconWrapper}>
            <PiDiamondThin size={60} color="black" strokeWidth={0.001} />
            <IoMdArrowDropright
              className={styles.caretIcon}
              color="black"
              size={18}
            />
          </div>
        </Link>
      </div>
      </div>
      <span className={styles.label}>
        Skinetic developed an AI that creates a highly personalized routine
        tailored to what your skin needs.
      </span>
    </section>
  );
}
