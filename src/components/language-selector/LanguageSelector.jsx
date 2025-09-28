import React, { useState, useEffect, useRef } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowMenu(false);
  };

const getFlagSrc = (lng) => {
  switch (lng) {
    case 'pt':
      return `${import.meta.env.BASE_URL}assets/image/pt.png`;
    case 'en':
      return `${import.meta.env.BASE_URL}assets/image/en.png`;
    case 'es':
      return `${import.meta.env.BASE_URL}assets/image/es.png`;
    case 'de':
      return `${import.meta.env.BASE_URL}assets/image/de.png`;
    default:
      return `${import.meta.env.BASE_URL}assets/image/en.png`;
  }
};

  const currentLanguage = i18n.language;

  return (
    <div className="language-selector-dropdown" ref={menuRef}> {}
      <button className="current-language-button" onClick={() => setShowMenu(!showMenu)}>
        <img src={getFlagSrc(currentLanguage)} alt={`Bandeira do idioma ${currentLanguage}`} />
        <span className="language-code">{currentLanguage.toUpperCase()}</span>
      </button>

      {showMenu && (
        <div className="language-menu">
          {['pt', 'en', 'es', 'de'].map((lang) => (
            <button
              key={lang}
              onClick={() => changeLanguage(lang)}
              className={`menu-item ${currentLanguage === lang ? 'active' : ''}`}
            >
              <img src={getFlagSrc(lang)} alt={`Bandeira do idioma ${lang}`} />
              <span className="language-name">{t(`language.${lang}`)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;