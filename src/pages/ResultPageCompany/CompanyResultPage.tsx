import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import styles from './CompanyResultPage.module.css';
import { downloadAsExcel } from '../../scripts/downloadxl';
import { Pin, Building } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CompanyResult {
  id: number;
  bedrijfsnaam: string;
  sector: string;
  locatie: string;
  beschrijving: string;
  waarom: string;
  score: number;
  contactgegevens: string;
  techstack: string[];
  machinepark?: string[];
  businessTrigger?: string;
  matchKwaliteit?: 'Sterke match' | 'Goede match' | 'Gedeeltelijke match';
}

// ── Dummy data ────────────────────────────────────────────────────────────────

const DUMMY_RESULTS: CompanyResult[] = [
  {
    id: 1,
    bedrijfsnaam: 'METAL-FORMING BELGIUM',
    sector: 'Zware Metaalindustrie',
    locatie: 'Staalweg 88, 3600 Genk, Limburg',
    beschrijving:
      'Metal-Forming Belgium heeft een technische infrastructuur die perfect is voor het project. Ze gebruiken Siemens S7-1500 systemen en Profinet, wat direct in lijn is met de vereisten.',
    waarom:
      'De tech-stack van Metal-Forming Belgium bevat exact dezelfde componenten als nodig zijn voor het project. Dit zorgt voor een optimale integratie en snelle implementatie.',
    score: 10,
    contactgegevens: 'Luc Mertens, Plant Manager — l.mertens@metalforming.be — +32 89 77 88 99',
    techstack: ['Siemens S7-1500', 'Sinamics Drives', 'Profinet', 'Safety PLC'],
    machinepark: ['Walsinstallaties', 'CNC-bewerkingscentra (Groot formaat)', 'Frequentieregelaars (High power)'],
    businessTrigger: 'Aanleg van een compleet nieuwe productielijn voor chassis-onderdelen van elektrische voertuigen.',
    matchKwaliteit: 'Sterke match',
  },
  {
    id: 2,
    bedrijfsnaam: 'AGRO-BOTICS NV',
    sector: 'Landbouwmechanisatie & Robotica',
    locatie: 'Kouterstraat 15, 8500 Kortrijk, West-Vlaanderen',
    beschrijving:
      'AGRO-BOTICS NV heeft een sterke focus op robotica en autonome systemen. Ze gebruiken CAN-bus en Linux-based controllers, wat goed aansluit bij de projectvereisten.',
    waarom:
      'De tech-stack en het machinepark passen goed aan voor het project. De sector en technologie sluiten aan, zeker voor automatische foutmeldingen en remote monitoring.',
    score: 8,
    contactgegevens: 'Dirk Vanhecke, Technisch Directeur — d.vanhecke@agrobotics.be — +32 56 12 34 56',
    techstack: ['CODESYS', 'CAN-bus', 'Linux-based controllers', 'Python (scripting)'],
    machinepark: ['Autonome GPS-gestuurde voertuigen', 'Hydraulische systemen', 'Batterij-management units'],
    businessTrigger: 'Lancering van een nieuwe generatie zelfrijdende oogstmachines en internationale expansie naar de Franse markt.',
    matchKwaliteit: 'Goede match',
  },
  {
    id: 3,
    bedrijfsnaam: 'BREW-TECH AUTOMATION',
    sector: 'Voedingsmiddelenindustrie (Brouwerijen)',
    locatie: 'Brouwerijstraat 1, 3080 Tervuren, Vlaams-Brabant',
    beschrijving:
      'Brew-Tech Automation is bezig met modernisering van hun PLC-sturingen. Ze werken met Schneider Electric en SCADA-systemen in een actieve productieomgeving.',
    waarom:
      'Hoewel er geen directe technologie-overlap is, biedt de moderniseringscontext een interessante samenwerkingskans. De sector en schaalgrootte zijn relevant voor het project.',
    score: 5,
    contactgegevens: 'Sarah Janssens, Maintenance Manager — maintenance@brewtech.com — +32 2 444 55 66',
    techstack: ['Schneider Electric (EcoStruxure)', 'Wonderware InTouch (SCADA)', 'Modbus TCP'],
    machinepark: ['Afvullijnen', 'Pasteuriseer-installaties', 'Palletiser-robots'],
    businessTrigger: 'Modernisering van de bestaande PLC-sturingen van S5 naar de nieuwste standaarden en uitbreiding van de productiecapaciteit met 20%.',
    matchKwaliteit: 'Gedeeltelijke match',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function matchClass(kwaliteit?: string): string {
  if (!kwaliteit) return '';
  if (kwaliteit === 'Sterke match') return styles.matchStrong;
  if (kwaliteit === 'Goede match') return styles.matchGood;
  return styles.matchPartial;
}

// ── Sub-component: CompanyCard ────────────────────────────────────────────────

function CompanyCard({ result }: { result: CompanyResult }) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [expanded, setExpanded] = useState(false);

  return (
    <li className={styles.result}>
      {/* HEADER */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.resultIndex}>{result.id}.</span>
          <h2 className={styles.resultName}>{result.bedrijfsnaam}</h2>
          <span className={styles.resultSector}>{result.sector}</span>
        </div>
        <div className={styles.scoreWrapper}>
          <span className={styles.scoreBadge}>{result.score}/10</span>
        </div>
      </div>

      {/* PROJECT TYPE ROW */}
      <div className={styles.projectTypeRow}>
        <span className={styles.projectType}><Building /> Bedrijf voor samenwerking</span>
        {result.matchKwaliteit && (
          <span className={`${styles.matchBadge} ${matchClass(result.matchKwaliteit)}`}>
            {result.matchKwaliteit}
          </span>
        )}
      </div>

      {/* META */}
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <span className={styles.metaIcon}><Pin /></span>
          <span>{result.locatie}</span>
        </div>
      </div>

      {/* BESCHRIJVING */}
      <p className={styles.resultDescription}>
        {expanded ? result.beschrijving : result.beschrijving.slice(0, 130) + '…'}
      </p>

      {/* EXPANDED */}
      {expanded && (
        <div className={styles.expandedInfo}>
          <div className={styles.infoRow}>
            <strong>Waarom een match:</strong> {result.waarom}
          </div>

          {result.businessTrigger && (
            <div className={styles.infoRow}>
              <strong>Business trigger:</strong> {result.businessTrigger}
            </div>
          )}

          <div className={styles.infoRow}>
            <strong>Tech stack:</strong>
            <div className={styles.techChips}>
              {result.techstack.map((t) => (
                <span key={t} className={styles.techChip}>{t}</span>
              ))}
            </div>
          </div>

          {result.machinepark && result.machinepark.length > 0 && (
            <div className={styles.infoRow}>
              <strong>Machinepark:</strong>
              <div className={styles.machineChips}>
                {result.machinepark.map((m) => (
                  <span key={m} className={styles.machineChip}>{m}</span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.infoRow}>
            <strong>Contact:</strong> {result.contactgegevens}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <button className={styles.btnMore} onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Toon minder' : 'Lees meer'}
          </button>
          {expanded && (
            <button
              className={styles.btnContact}
              onClick={() => alert(`Contact: ${result.contactgegevens}`)}
            >
              ✉ Contacteer
            </button>
          )}
        </div>

        <div className={styles.feedbackButtons}>
          <button
            className={`${styles.thumbUp} ${feedback === 'up' ? styles.active : ''}`}
            onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
            title="Goede match"
          >
            <FaThumbsUp />
          </button>
          <button
            className={`${styles.thumbDown} ${feedback === 'down' ? styles.active : ''}`}
            onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
            title="Geen goede match"
          >
            <FaThumbsDown />
          </button>
        </div>
      </div>
    </li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CompanyResultPage() {
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/company-results`);
        if (!response.ok) throw new Error('Failed to fetch results');
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error('Fout bij ophalen resultaten, dummy data geladen:', err);
        setResults(DUMMY_RESULTS);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '60px' }}>Laden…</p>;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Bedrijfsresultaten</h1>

      {/* ACTION BAR */}
      <div className={styles.actionBar}>
        <button className={styles.btnSave} onClick={() => saveToDatabase(results)}>
          Opslaan
        </button>
        <button
          className={styles.btnExport}
          onClick={() => downloadAsExcel(results, 'bedrijf-resultaten.xlsx')}
        >
          Exporteren
        </button>
        <Link to="/keuze">
          <button className={styles.btnNew}>Nieuwe zoekopdracht</button>
        </Link>
      </div>

      {/* COUNT */}
      <p className={styles.resultCount}>
        {results.length} bedrijf{results.length !== 1 ? 'en' : ''} gevonden
      </p>

      {/* LIST */}
      <ul className={styles.resultsList}>
        {results.map((result) => (
          <CompanyCard key={`${result.id}-${result.bedrijfsnaam}`} result={result} />
        ))}
      </ul>
    </main>
  );
}

// ── Save helper ───────────────────────────────────────────────────────────────

const saveToDatabase = async (data: CompanyResult | CompanyResult[]) => {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Opslaan mislukt');
    alert('Data succesvol opgeslagen!');
  } catch (error) {
    console.error('Fout bij opslaan:', error);
    alert('Er is een fout opgetreden bij het opslaan.');
  }
};
