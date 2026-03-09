import { useEffect, useState } from 'react';
import styles from './ResultPage.module.css';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import * as XLSX from 'xlsx';
import { downloadAsExcel } from '../../scripts/downloadxl';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// ── Types ─────────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: number;
  bedrijfsnaam: string;
  beschrijving: string;
  waarom: string;
  score: number;
  contactgegevens: string;
  techstack: string[];
  locatie: string;
  sector: string;
}

interface ResultsPageProps {
  results?: SearchResult[];
  onSave?: () => void;
  onReadMore?: (result: SearchResult) => void;
  onContact?: (result: SearchResult) => void;
}

// ── Dummy data (verwijder dit als je echte data van de backend krijgt) ─────────


const DUMMY_RESULTS: SearchResult[] = [
 {
    "id": 1,
    "bedrijfsnaam": "NV INDUSTRI-BUILD BELGIUM",
    "beschrijving": "Een bedrijf dat actief is in het gebied van prefab betonoplossingen, met een specifieke focus op PLC-gestuurde machines.",
    "waarom": "De technologische stack en machineparkering van NV INDUSTRI-BUILD BELGIUM zijn sterk gericht op industriële automatisering, wat een goede match is voor de technologie die nodig is in een mail cleaner. Hoewel het bedrijf niet direct met e-mailfilteringe ervaring bekend is, kan de technische expertise worden omgezet.",
    "score": 7,
    "contactgegevens": "N/A",
    "techstack": ["Siemens S7"],
    "locatie": "België",
    "sector": "Prefab betonoplossingen"
  },
  {
    'id': 2, 
    'bedrijfsnaam': 'METAL-FORMING BELGIUM', 
    'beschrijving': 'Metal-Forming Belgium heeft een technische infrastructuur die perfect is voor de Predictive Maintenance software. Ze gebruiken Siemens S7-1500 systemen en Profinet, wat direct in line is met het product.', 
    'waarom': 'De tech-stack van Metal-Forming Belgium bevat exact dezelfde componenten als nodig zijn voor dePredictive Maintenance software. Dit zorgt voor een optimale integratie.', 
    'score': 10, 
    'contactgegevens': 'l.mertens@metalforming.be', 
    'techstack': ['Siemens S7-1500', 'Profinet'], 
    'locatie': 'Staalweg 88, 3600 Genk, Limburg, Genk-Zuid', 
    'sector': 'Zware Metaalindustrie'}, 
  
  {
    'id': 3, 
    'bedrijfsnaam': 
    'AGRO-BOTICS NV', 
    'beschrijving': 'AGRO-BOTICS NV heeft een technische infrastructuur die compatibel is met de Predictive Maintenance software. Ze gebruiken Siemens S7-1500 systemen en hebben een sterk focus op robotica, wat perfect aansluit bij het product.', 
    'waarom': 'De tech-stack bevat Siemens S7-1500 systemen die compatibel zijn met de Predictive Maintenance software. De sector en technologie passen goed aan, zeker voor automatische foutmeldingen via Profinet.', 
    'score': 8, 
    'contactgegevens': 'Dirk Vanhecke, Technisch Directeur, d.vanhecke@agrobotics.be, +32 56 12 34 56', 
    'techstack': ['Siemens S7-1500', 'CAN-bus'], 
    'locatie': 'Kouterstraat 15, 8500 Kortrijk, West-Vlaanderen', 
    'sector': 'Landbouwmechanisatie & Robotica'
  }, 
  {
    'id': 3, 
    'bedrijfsnaam': 'BREW-TECH AUTOMATION', 
    'beschrijving': 'Brew-Tech Automation heeft een technische infrastructuur die compatibel is met de Predictive Maintenance software, hoewel ze geen directe compatibiliteit hebben met Siemens S7-1500. Ze kunnen het product wel integreren via Profinet.', 
    'waarom': 'Hoewel Brew-Tech Automation geen directe compatibiliteit heeft met de exacte technologieën van het product, biedt hun machinepark en business-triggers een potentiële omgeving waarin het product zou kunnen werken. De sector is ook relevant.', 
    'score': 5, 
    'contactgegevens': 'maintenance@brewtech.com', 
    'techstack': ['Schneider Electric (EcoStruxure)', 'Modbus TCP'], 
    'locatie': 'Brouwerijstraat 1, 3080 Tervuren, Vlaams-Brabant', 
    'sector': 'Voedering (Brouwerijen)'
  },
 {
    "id": 4,
    "bedrijfsnaam": "NV INDUSTRI-BUILD BELGIUM",
    "beschrijving": "Een bedrijf dat actief is in het gebied van prefab betonoplossingen, met een specifieke focus op PLC-gestuurde machines.",
    "waarom": "De technologische stack en machineparkering van NV INDUSTRI-BUILD BELGIUM zijn sterk gericht op industriële automatisering, wat een goede match is voor de technologie die nodig is in een mail cleaner. Hoewel het bedrijf niet direct met e-mailfilteringe ervaring bekend is, kan de technische expertise worden omgezet.",
    "score": 7,
    "contactgegevens": "N/A",
    "techstack": ["Siemens S7"],
    "locatie": "België",
    "sector": "Prefab betonoplossingen"
  },
   {
    "id": 5,
    "bedrijfsnaam": "NV INDUSTRI-BUILD BELGIUM",
    "beschrijving": "Een bedrijf dat actief is in het gebied van prefab betonoplossingen, met een specifieke focus op PLC-gestuurde machines.",
    "waarom": "De technologische stack en machineparkering van NV INDUSTRI-BUILD BELGIUM zijn sterk gericht op industriële automatisering, wat een goede match is voor de technologie die nodig is in een mail cleaner. Hoewel het bedrijf niet direct met e-mailfilteringe ervaring bekend is, kan de technische expertise worden omgezet.",
    "score": 7,
    "contactgegevens": "N/A",
    "techstack": ["Siemens S7"],
    "locatie": "België",
    "sector": "Prefab betonoplossingen"
  }]

// ── Sub-component: ResultCard ─────────────────────────────────────────────────
function ResultCard({ result }: {result: SearchResult}) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <li className={styles.result}>
      <p className={styles.resultIndex}>{result.id}.</p>
      <h2 className={styles.resultName}>{result.bedrijfsnaam}</h2>
      <p className={styles.resultDescription}>
        {expanded ? result.beschrijving : result.beschrijving.slice(0, 120) + "..."}
      </p>

      {/* EXTRA INFO alleen tonen als expanded */}
      {expanded && (
        <>
          <p className={styles.resultWhy}><strong>Waarom:</strong> {result.waarom}</p>
          <p className={styles.resultLocatie}><strong>Locatie:</strong> {result.locatie}</p>
          <p className={styles.resultSector}><strong>Sector:</strong> {result.sector}</p>
          <p className={styles.resultTechstack}><strong>Techstack:</strong> {result.techstack.join(", ")}</p>
          <p className={styles.resultContact}><strong>Contact:</strong> {result.contactgegevens}</p>
        </>
      )}

      <div className={styles.resultActions}>
        <p className={styles.resultScore}>Score: {result.score}/10</p>

        <button
          className={styles.btnMore}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Toon minder" : "Lees meer"}
        </button>

        <div className={styles.feedbackButtons}>
          <button
            className={`${styles.thumbUp} ${feedback === 'up' ? styles.active : ''}`}
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            title="Positieve feedback"
          >
            <FaThumbsUp />
          </button>

          <button
            className={`${styles.thumbDown} ${feedback === 'down' ? styles.active : ''}`}
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            title="Negatieve feedback"
          >
            <FaThumbsDown />
          </button>
        </div>
          {expanded && (
            <button
              className={styles.btnSave}
              onClick={() => saveToDatabase(result)}
            >
              Opslaan
            </button>
          )}
      </div>
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch('${API_BASE_URL}/api/results');
        if (!response.ok) throw new Error('Failed to fetch results');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Onbekende fout');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, []);

  if (loading) return <p>Laden...</p>;
  if (error) console.error('Fout bij ophalen resultaten:', error);
  if (results.length === 0) setResults(DUMMY_RESULTS); // Gebruik dummy data als er geen resultaten zijn
  return (
    <main className={styles.main}>

      <h1 className={styles.title}>Zoekresultaten</h1>

      {/* ACTIE KNOPPEN */}
      <div className={styles.actionBar}>
        <button className={styles.btnSave} onClick={() => saveToDatabase(results)}>
          Opslaan
        </button>
        <button className={styles.btnExport} onClick={() => downloadAsExcel(results, "zoekresultaten.xlsx")}>
          Exporteren
        </button>
        <Link to="/keuze">
        <button className={styles.btnNew}>
          Nieuwe zoekopdracht
        </button>
        </Link>
      </div>

      {/* AANTAL RESULTATEN */}
      <p className={styles.resultCount}>{results.length} zoekresultaten</p>

      {/* RESULTATEN LIJST */}
      <ul className={styles.resultsList}>
        {results.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
          />
        ))}
      </ul>

    </main>
  );
}

const saveToDatabase = async (data: SearchResult | SearchResult[]) => {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Opslaan mislukt');
    alert('Data succesvol opgeslagen!');
  } catch (error) {
    console.error('Fout bij opslaan:', error);
    alert('Er is een fout opgetreden bij het opslaan.');
  }
}