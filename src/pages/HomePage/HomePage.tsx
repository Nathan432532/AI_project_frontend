import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./HomePage.module.css";
import { Bot, Plus, Search } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Stats {
  totalJobs: number;
  totalCompanies: number;
}

// ── Dummy/fallback data (getoond als API niet bereikbaar is) ──────────────────

const FALLBACK_STATS: Stats = {
  totalJobs: 3,
  totalCompanies: 2,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobRes, companyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/saved/jobs`),
          fetch(`${API_BASE_URL}/api/saved/companies`),
        ]);

        if (!jobRes.ok || !companyRes.ok) throw new Error("Ophalen mislukt");

        const jobs = await jobRes.json();
        const companies = await companyRes.json();

        setStats({
          totalJobs: Array.isArray(jobs) ? jobs.length : 0,
          totalCompanies: Array.isArray(companies) ? companies.length : 0,
        });
      } catch (err) {
        console.error("Fout bij ophalen statistieken, dummy data geladen:", err);
        setStats(FALLBACK_STATS);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const total = stats !== null ? stats.totalJobs + stats.totalCompanies : null;

  return (
    <main className={styles.main}>
      {/* WELCOME */}
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          Welkom, {user?.firstName ?? "Gebruiker"}
        </h1>
        <p className={styles.welcomeSub}>Wat wil je doen vandaag?</p>
      </div>

      {/* PRIMARY ACTIONS */}
      <div className={styles.primaryGrid}>
        <Link to="/saved" className={styles.card}>
          <div className={styles.cardIcon}><Search /></div>
          <h3 className={styles.cardTitle}>Eerdere zoekopdrachten ophalen</h3>
          <p className={styles.cardDesc}>
            Bekijk en beheer je opgeslagen zoekopdrachten en resultaten.
          </p>
        </Link>

        <Link to="/keuze" className={styles.card}>
          <div className={styles.cardIcon}><Plus /></div>
          <h3 className={styles.cardTitle}>Nieuwe zoekopdracht starten</h3>
          <p className={styles.cardDesc}>
            Begin met een nieuwe analyse voor vacatures of bedrijven.
          </p>
        </Link>
      </div>

      {/* SECONDARY ACTIONS */}
      <div className={styles.secondaryGrid}>
        <div className={styles.cardSecondary}>
          <div className={styles.secondaryInner}>
            <div className={styles.secondaryIcon}><Bot /></div>
            <div>
              <h3 className={styles.cardTitle}>Model hertrainen</h3>
              <p className={styles.cardDesc}>
                Optimaliseer de prestaties door het model te hertrainen op nieuwe data.
              </p>
            </div>
          </div>
          <div className={styles.adminRow}>
            <Link to="/admin/settings/job" className={styles.btnAdmin}>
              ⚙ Vacature-instellingen
            </Link>
            <Link to="/admin/settings/company" className={styles.btnAdmin}>
              ⚙ Bedrijfs-instellingen
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {statsLoading ? "…" : total}
          </span>
          <span className={styles.statLabel}>Opgeslagen zoekopdrachten</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {statsLoading ? "…" : stats?.totalCompanies}
          </span>
          <span className={styles.statLabel}>Bedrijfsresultaten</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {statsLoading ? "…" : stats?.totalJobs}
          </span>
          <span className={styles.statLabel}>Vacatureresultaten</span>
        </div>
      </div>
    </main>
  );
}
