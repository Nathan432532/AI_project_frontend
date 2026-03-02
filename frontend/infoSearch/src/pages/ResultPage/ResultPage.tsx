import { useState } from 'react';
import styles from './ResultPage.module.css';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
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
    "id": 2,
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
    "id": 3,
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
  }
];

// ── Sub-component: ResultCard ─────────────────────────────────────────────────

interface ResultCardProps {
  result: SearchResult;
  onReadMore: (result: SearchResult) => void;
  onContact: (result: SearchResult) => void;
}

function ResultCard({ result, onReadMore }: ResultCardProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  return (
    <li className={styles.result}>
      <p className={styles.resultIndex}>{result.id}.</p>
      <h2 className={styles.resultName}>{result.bedrijfsnaam}</h2>
      <p className={styles.resultDescription}>{result.beschrijving}</p>

      <div className={styles.resultActions}>
      <p className={styles.resultScore}>Score: {result.score}/10</p>
        <button
          className={styles.btnMore}
          onClick={() => onReadMore(result)}
        >
          Lees meer
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
      </div>
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResultsPage({
  results = DUMMY_RESULTS,
  onSave,
  onReadMore,
  onContact,
}: ResultsPageProps) {

  const handleReadMore = (result: SearchResult) => {
    onReadMore?.(result);
    console.log('Lees meer:', result);
  };

  const handleContact = (result: SearchResult) => {
    onContact?.(result);
    console.log('Contactgegevens:', result);
  };

  return (
    <main className={styles.main}>

      <h1 className={styles.title}>Zoekresultaten</h1>

      {/* ACTIE KNOPPEN */}
      <div className={styles.actionBar}>
        <button className={styles.btnSave} onClick={onSave}>
          Opslaan
        </button>
        <button className={styles.btnExport} onClick={() => downloadAsPDF(results, "zoekresultaten.pdf")}>
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
            onReadMore={handleReadMore}
            onContact={handleContact}
          />
        ))}
      </ul>

    </main>
  );
}

export const downloadAsPDF = (data: SearchResult[], filename = "report.pdf") => {
  const doc = new jsPDF();

  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxwidth = pageWidth - margin * 2;

  doc.setFontSize(16);
  doc.text("Data Report", margin, y);
  y += 10;
  
  doc.setFontSize(12);

  data.forEach((item) => {
    doc.text(`${item.id}. ${item.bedrijfsnaam}`, margin, y);
    doc.text(`${item.score}/10`, pageWidth - margin - 20, y);
    y += 8;

    doc.text(`Locatie: ${item.locatie}`, margin + 10, y);
    y += 10;

    doc.text(`Sector: ${item.sector}`, margin + 10, y);
    y += 10;

    doc.text(`Techstack: ${item.techstack.join(", ")}`, margin + 10, y);
    y += 10;

    doc.text(`Contact: ${item.contactgegevens}`, margin + 10, y);
    y += 10;

    const wrapperBeschrijving = doc.splitTextToSize(item.beschrijving, maxwidth);
    doc.text(wrapperBeschrijving, margin + 10, y);
    y += wrapperBeschrijving.length * 8;

    const wrapperWaarom = doc.splitTextToSize(item.waarom, maxwidth);
    doc.text(wrapperWaarom, margin + 10, y);
    y += wrapperWaarom.length * 8;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(filename);
}