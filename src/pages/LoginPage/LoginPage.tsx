import { useState } from 'react';
import styles from './SearchPage.module.css';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

    const handleLogin = async () => {
        setStatus('loading');
        try {
            // Vervang dit later door je echte API call, bijv:
            // const res = await fetch('/auth/login', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(form),
            // });
            // if (!res.ok) throw new Error('Inloggen mislukt');

            console.log('Inloggen met:', form);
            setStatus('idle');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.dashboard} style={{ maxWidth: '480px' }}>
                    <h1 className={styles.dashboardTitle}>
                        <LogIn style={{ marginRight: '10px' }} />
                        Inloggen
                    </h1>

                    <div className={styles.filterPanel} style={{ display: 'block' }}>
                        <div className={styles.filterGroup} style={{ marginBottom: '20px' }}>
                            <label className={styles.filterLabel}>
                                <Mail size={16} /> E-mailadres
                            </label>
                            <input
                                type="email"
                                className={styles.filterInput}
                                placeholder="jouw@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className={styles.filterGroup} style={{ marginBottom: '20px' }}>
                            <label className={styles.filterLabel}>
                                <Lock size={16} /> Wachtwoord
                            </label>
                            <input
                                type="password"
                                className={styles.filterInput}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>

                        {status === 'error' && (
                            <p style={{ color: '#e74c3c', marginBottom: '15px', fontSize: '14px' }}>
                                Ongeldig e-mailadres of wachtwoord.
                            </p>
                        )}

                        <button
                            onClick={handleLogin}
                            className={styles.submitBtn}
                            style={{ marginTop: '10px', width: '100%' }}
                            disabled={status === 'loading' || !form.email || !form.password}
                        >
                            <LogIn size={16} />
                            {status === 'loading' ? 'Bezig met inloggen...' : 'Inloggen'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}