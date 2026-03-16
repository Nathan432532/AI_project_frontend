import { useState, useEffect } from 'react';
import styles from './SearchPage.module.css'; // We hergebruiken je bestaande styling
import { Save, Settings, MessageSquare, Sliders } from 'lucide-react';

interface LLMSettings {
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<LLMSettings>({
        systemPrompt: '',
        temperature: 0.0,
        maxTokens: 2000,
    });

    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    const [placeholders, setPlaceholders] = useState<LLMSettings>({
        systemPrompt: '',
        temperature: 0.0,
        maxTokens: 2000,
    })

    useEffect(() => {
        fetch('/admin/settings/job')
            .then((response) => response.json())
            .then((data) => {
                if (data.systemPrompt) {
                    setPlaceholders(data);
                }
            })
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        setStatus('saving');
        const payload = {
            systemPrompt: settings.systemPrompt || placeholders.systemPrompt,
            temperature: settings.temperature ?? placeholders.temperature,
            maxTokens: settings.maxTokens || placeholders.maxTokens,
        };
        try {
            const res = await fetch('/admin/settings/job', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Opslaan mislukt');
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('idle');
        } finally {
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.dashboard} style={{ maxWidth: '900px' }}>
                    <h1 className={styles.dashboardTitle}>
                        <Settings style={{ marginRight: '10px' }} />
                        Admin LLM Configuratie Jobs
                    </h1>

                    <div className={styles.filterPanel} style={{ display: 'block' }}>
                        {/* Prompt Sectie */}
                        <div className={styles.filterGroup} style={{ marginBottom: '25px' }}>
                            <label className={styles.filterLabel}>
                                <MessageSquare size={16} /> Systeem Prompt
                            </label>
                            <textarea
                                className={styles.filterInput}
                                style={{ minHeight: '200px', padding: '15px', fontFamily: 'monospace' }}
                                value={settings.systemPrompt}
                                onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                                placeholder={placeholders.systemPrompt || "Definieer hier de rol en instructies voor de AI..."}
                            />
                        </div>

                        {/* Hyperparameters Sectie */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>
                                    <Sliders size={16} /> Temperature ({settings.temperature})
                                </label>
                                <input
                                    type="range" min="0" max="2" step="0.1"
                                    value={settings.temperature}
                                    onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                                />
                                <small style={{ color: '#000000' }}>Lager = feitelijk/strikt. Hoger = creatief.</small>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Max Tokens</label>
                                <input
                                    type="number"
                                    className={styles.filterInput}
                                    value={settings.maxTokens}
                                    onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className={styles.submitBtn}
                            style={{ marginTop: '30px', backgroundColor: status === 'success' ? '#2ecc71' : '' }}
                        >
                            <Save /> {status === 'saving' ? 'Bezig met opslaan...' : status === 'success' ? 'Opgeslagen!' : 'Instellingen Opslaan'}
                        </button>
                    </div>
                </div>
            </main >
        </div >
    );
}