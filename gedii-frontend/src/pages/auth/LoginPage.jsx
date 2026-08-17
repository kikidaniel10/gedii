import { useState } from 'react';
import coatOfArms from '../../assets/coat-of-arms.png';
import mincomBuilding from '../../assets/mincom-building.png';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const translations = {
  fr: {
    title: 'Connexion',
    subtitle: 'Ministère de la Communication',
    emailLabel: 'Email',
    passwordLabel: 'Mot de passe',
    emailPlaceholder: 'exemple@mincom.cm',
    passwordPlaceholder: 'Saisissez votre mot de passe',
    submit: 'Se connecter',
    register: 'Créer un compte',
    languageLabel: 'Langue',
    themeLight: '☀️ Mode clair',
    themeDark: '🌙 Mode sombre',
    emailRequired: 'Veuillez renseigner votre adresse email.',
    emailInvalid: 'Veuillez saisir une adresse email valide (exemple@mincom.cm).',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Ministry of Communication',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    emailPlaceholder: 'example@mincom.cm',
    passwordPlaceholder: 'Enter your password',
    submit: 'Log in',
    register: 'Create an account',
    languageLabel: 'Language',
    themeLight: '☀️ Light mode',
    themeDark: '🌙 Dark mode',
    emailRequired: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address (example@mincom.cm).',
  },
};

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const strings = translations[language] || translations.fr;

  const validateEmail = (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return strings.emailRequired;
    }

    if (!emailPattern.test(trimmed)) {
      return strings.emailInvalid;
    }

    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextError = validateEmail(email);
    setEmailError(nextError);

    if (nextError) {
      return;
    }

    // Branchement sur AuthService a l'etape suivante
  };

  const handleEmailChange = (e) => {
    const nextValue = e.target.value;
    setEmail(nextValue);

    if (emailError) {
      setEmailError(validateEmail(nextValue));
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(113, 190, 140, 0.18), transparent 28%),
            radial-gradient(circle at bottom right, rgba(15, 91, 61, 0.18), transparent 32%),
            linear-gradient(135deg, var(--color-bg-strong) 0%, var(--color-bg) 45%, var(--color-bg-strong) 100%);
          transition: background 0.25s ease;
        }

        .top-actions {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .language-select,
        .theme-toggle {
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text);
          border-radius: 999px;
          padding: 0.7rem 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          box-shadow: 0 10px 20px var(--color-shadow);
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .language-select {
          min-width: 122px;
          cursor: pointer;
        }

        .language-select:focus-visible,
        .theme-toggle:focus-visible {
          outline: 3px solid rgba(109, 209, 162, 0.45);
          outline-offset: 3px;
        }

        .theme-toggle:hover,
        .language-select:hover {
          transform: translateY(-1px);
          border-color: rgba(109, 209, 162, 0.6);
        }

        .login-shell {
          position: relative;
          width: min(1200px, 100%);
          min-height: 720px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          border-radius: 28px;
          border: 1px solid var(--color-border);
          box-shadow: 0 30px 80px var(--color-shadow);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(4px);
          animation: fadeSlideIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .visual-panel {
          position: relative;
          min-height: 100%;
          background-image: linear-gradient(rgba(8, 17, 13, 0.38), rgba(8, 17, 13, 0.66)), url(${mincomBuilding});
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .visual-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(15, 91, 61, 0.22), rgba(255,255,255,0));
        }

        .visual-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(0,0,0,0.12));
        }

        .brand-badge {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 132px;
          height: 132px;
          padding: 18px;
          border-radius: 50%;
          background: rgba(18, 34, 27, 0.68);
          border: 1px solid rgba(255, 255, 255, 0.24);
          box-shadow: 0 20px 42px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
        }

        .brand-badge img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 6px 16px rgba(0,0,0,0.2));
        }

        .login-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(255,255,255,0.04), var(--color-surface)),
            linear-gradient(180deg, rgba(255,255,255,0.02), var(--color-surface-alt));
          padding: 48px 56px;
          transition: background 0.25s ease;
        }

        .login-card {
          width: min(100%, 420px);
          animation: fadeSlideIn 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
        }

        .eyebrow {
          margin: 0 0 12px;
          font-family: 'IBM Plex Mono', 'SFMono-Regular', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-primary);
          font-weight: 700;
        }

        .title {
          margin: 0;
          font-family: 'Fraunces', Georgia, serif;
          font-size: clamp(2.2rem, 3vw, 3rem);
          line-height: 1.08;
          color: var(--color-text);
          letter-spacing: -0.03em;
        }

        .subtitle {
          margin: 10px 0 30px;
          color: var(--color-text-soft);
          font-size: 0.98rem;
          letter-spacing: 0.01em;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field label {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .field input {
          width: 100%;
          padding: 0.95rem 1rem;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          background: rgba(255, 255, 255, 0.02);
          color: var(--color-text);
          font-size: 1rem;
          box-shadow: inset 0 1px 2px rgba(10, 21, 17, 0.04);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
        }

        .field input:hover {
          border-color: rgba(109, 209, 162, 0.45);
        }

        .field input::placeholder {
          color: var(--color-text-soft);
        }

        .field input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 4px rgba(109, 209, 162, 0.18), inset 0 1px 2px rgba(10, 21, 17, 0.04);
        }

        .field input[aria-invalid='true'] {
          border-color: #e76e6e;
          box-shadow: 0 0 0 4px rgba(231, 110, 110, 0.14);
        }

        .error-message {
          min-height: 18px;
          font-size: 0.8rem;
          color: #f06c6c;
          margin-top: -4px;
        }

        .submit-button {
          margin-top: 10px;
          border: 1px solid rgba(17, 79, 53, 0.18);
          border-radius: 14px;
          padding: 1rem 1.25rem;
          background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease, background 0.2s ease;
          box-shadow: 0 14px 28px rgba(35, 93, 62, 0.28);
        }

        .submit-button:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 18px 32px rgba(35, 93, 62, 0.34);
        }

        .submit-button:active {
          transform: translateY(1px) scale(0.995);
          box-shadow: 0 10px 18px rgba(35, 93, 62, 0.26);
          filter: brightness(0.95);
        }

        .submit-button:focus-visible,
        .register-link:focus-visible,
        .field input:focus-visible,
        .theme-toggle:focus-visible {
          outline: 3px solid rgba(109, 209, 162, 0.45);
          outline-offset: 3px;
        }

        .register-link {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: fit-content;
          margin: 4px auto 0;
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
          position: relative;
          transition: color 0.2s ease;
        }

        .register-link:hover {
          color: var(--color-primary-dark);
        }

        .register-link::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
        }

        .register-link:hover::after,
        .register-link:focus-visible::after {
          transform: scaleX(1);
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .login-shell {
            grid-template-columns: 1fr;
            min-height: auto;
          }

          .visual-panel {
            min-height: 220px;
            background-position: center top;
          }

          .brand-badge {
            width: 92px;
            height: 92px;
          }

          .login-panel {
            padding: 32px 24px 40px;
          }
        }

        @media (max-width: 560px) {
          .login-page {
            padding: 16px;
          }

          .visual-panel {
            min-height: 150px;
          }

          .brand-badge {
            width: 64px;
            height: 64px;
            padding: 12px;
          }

          .login-card {
            width: 100%;
          }

          .title {
            font-size: 2rem;
          }

          .submit-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="top-actions">
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <span>{strings.languageLabel}</span>
            <select
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label={strings.languageLabel}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </label>

          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Passer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}>
            {theme === 'dark' ? strings.themeLight : strings.themeDark}
          </button>
        </div>

        <div className="login-shell">
          <aside className="visual-panel" aria-label="Ministère de la Communication">
            <div className="brand-badge">
              <img src={coatOfArms} alt="République du Cameroun" />
            </div>
          </aside>

          <main className="login-panel">
            <div className="login-card">
              <p className="eyebrow">GEDII — Cellule Informatique</p>
              <h1 className="title">{strings.title}</h1>
              <p className="subtitle">{strings.subtitle}</p>

              <form onSubmit={handleSubmit} className="form" noValidate>
                <div className="field">
                  <label htmlFor="email">{strings.emailLabel}</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={strings.emailPlaceholder}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    required
                  />
                  <span id="email-error" className="error-message" aria-live="polite">
                    {emailError}
                  </span>
                </div>

                <div className="field">
                  <label htmlFor="password">{strings.passwordLabel}</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={strings.passwordPlaceholder}
                    required
                  />
                </div>

                <button type="submit" className="submit-button">
                  {strings.submit}
                </button>

                <a href="/register" className="register-link">
                  {strings.register}
                </a>
              </form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
