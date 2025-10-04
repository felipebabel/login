import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AlertComponent from '@/components/alert/AlertComponent';
import { UPDATE_ACCOUNT, GET_USER } from "@api/endpoints";
import { useTranslation } from "react-i18next";
import "./ProfileManagement.css";
import CountrySelect from "../../../components/common/Countries";

const ProfileManagement = ({ fetchWithLoading, t, setUserIdentifier, setNameDash }) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [userNameEdited, setUserNameEdited] = useState(location.state?.userName || "undefined");
  const [email, setEmail] = useState(location.state?.email || "");
  const [createUserDate, setCreateUserDate] = useState(""); // Formatted date
  const [creationUserDate, setCreationUserDate] = useState(location.state?.createUserDate || ""); // Raw date
  const [name, setName] = useState(location.state?.name || "");
  const [loading, setLoading] = useState(false);
  const [customAlert, setCustomAlert] = useState({ show: false, message: "" });
  const [userName, setUserName] = useState(location.state?.userName || "undefined");
  const [phone, setPhone] = useState(location.state?.phone || "");
  const [gender, setGender] = useState(location.state?.gender || "");
  const [city, setCity] = useState(location.state?.city || "");
  const [state, setState] = useState(location.state?.state || "");
  const [country, setCountry] = useState(location.state?.country || "");
  const [address, setAddress] = useState(location.state?.address || "");
  const [addressComplement, setAddressComplement] = useState(location.state?.addressComplement || "");
const [birthDate, setBirthDate] = useState(location.state?.birthDate || "");
const [birthDateInput, setBirthDateInput] = useState(
  location.state?.birthDate
    ? formatBirthDateDisplay(location.state?.birthDate)
    : ""
);
  const [zipCode, setZipCode] = useState(location.state?.zipCode || "");
  const [userId, setUserId] = useState("");
  const [userLanguage, setUserLanguage] = useState("");
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 15);

  if (!digits) return "";

  let countryCode = "";
  if (digits.startsWith("55")) {
    countryCode = digits.slice(0, 2);
  } else if (digits.length > 1) {
    countryCode = digits.slice(0, 1);
  } else {
    countryCode = digits;
  }

  let rest = digits.slice(countryCode.length);
  const ddd = rest.slice(0, 2);
  rest = rest.slice(2);

  let phonePart = "";
  if (rest.length <= 4) {
    phonePart = rest;
  } else if (rest.length <= 8) {
    phonePart = `${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
  } else {
    phonePart = `${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
  }

  let formatted = `+${countryCode}`;
  if (ddd) formatted += ` (${ddd}`;
  if (ddd && rest.length > 0) formatted += `)`;
  if (phonePart) formatted += ` ${phonePart}`;

  return formatted.trim();
};

const handleBirthDateChange = (e) => {
  let value = e.target.value.replace(/\D/g, ""); // remove tudo que não é número
  let formatted = "";

  if (i18n.language === "pt") {
    // dd/mm/yyyy
    if (value.length >= 1) formatted = value.slice(0,2);
    if (value.length >= 3) formatted += "/" + value.slice(2,4);
    if (value.length >= 5) formatted += "/" + value.slice(4,8);
  } else {
    // mm/dd/yyyy
    if (value.length >= 1) formatted = value.slice(0,2);
    if (value.length >= 3) formatted += "/" + value.slice(2,4);
    if (value.length >= 5) formatted += "/" + value.slice(4,8);
  }

  setBirthDateInput(formatted);
};

  const genderMap = { M: "male", F: "female", O: "other" };

  const languageOptions = {
    pt: t("language.pt"),
    en: t("language.en"),
    es: t("language.es"),
    de: t("language.de"),
  };

  const languageMap = { pt: "PORTUGUESE", en: "ENGLISH", es: "SPANISH", de: "GERMAN" };
  const languageMapDate = { EN: "en-US", PT: "pt-BR", DE: "de-DE", ES: "es-ES" };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userName) return;
      try {
        const response = await fetch(`${GET_USER}?username=${userName}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();

        setUserName(data.username);
        if (setNameDash) setNameDash(data.name);
        setUserId(data.identifier);
        setUserLanguage(data.language || "EN");
        i18n.changeLanguage(data.language?.toLowerCase() || "en");
        setUserIdentifier(data.identifier);
        setUserNameEdited(data.username);
        setEmail(data.email);
        setName(data.name);
        setPhone(data.phone || "");
        setGender(data.gender ? genderMap[data.gender] : "");
        setBirthDate(data.birthDate || "");
        setCity(data.city || "");
        setCountry(data.country || "");
        setState(data.state || "");
        setAddress(data.address || "");
        setAddressComplement(data.addressComplement || "");
        setZipCode(data.zipCode || "");
        setCreationUserDate(data.creationUserDate);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userName]);

const formatDateToISO = (dateStr) => {
  if (!dateStr) return null;

  const parts = dateStr.split("/");
  if (parts.length !== 3) return null; 

  let day, month, year;

  if (i18n.language === "pt") {
    [day, month, year] = parts;
  } else {
    [month, day, year] = parts;
  }

  // checa se todas as partes existem e são números
  if (!day || !month || !year) return null;
  day = day.padStart(2, "0");
  month = month.padStart(2, "0");
  year = year.padStart(4, "0");

  return `${year}-${month}-${day}`;
};

const formatBirthDateDisplay = (isoDate) => {
  if (!isoDate) return "";
  const dateObj = new Date(isoDate);
  const locale = i18n.language === "pt" ? "pt-BR" : "en-US";
  return dateObj.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

  useEffect(() => {
    if (!creationUserDate) return;
    const locale = languageMapDate[i18n.language.toUpperCase()] || "en-US";
    const formattedDate = new Date(creationUserDate).toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCreateUserDate(formattedDate);
  }, [i18n.language, creationUserDate]);

  const handleSaveProfile = async () => {
    const payload = {
      user: userNameEdited,
      name: name,
      language: languageMap[i18n.language] || "ENGLISH",
      phone,
      gender,
      birthDate: formatDateToISO(birthDate),
      city,
      state,
      address,
      addressComplement,
      country,
      zipCode,
    };

    try {
      const urlWithParams = new URL(UPDATE_ACCOUNT);
      urlWithParams.searchParams.append("user", userId);

      const response = await fetch(urlWithParams.toString(), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setUserName(userNameEdited);
        if (setNameDash) setNameDash(name);
        setCustomAlert({ show: true, message: t("alert.profileSaved") });
      } else {
        setCustomAlert({ show: true, message: t("alert.updateFailed") });
      }
    } catch (error) {
      setError(t("errorServer"));
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-fields">
        <div className="profile-field">
          <label>{t("userDashboard.usernameLabel")}</label>
          <input type="text" value={userNameEdited} onChange={(e) => setUserNameEdited(e.target.value)} className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.name")}</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.dateCreationUser")}</label>
          <input type="text" value={createUserDate} disabled className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.phone")}</label>
          <input type="text" value={phone} 
            placeholder="+55 11 99999-9999"
            defaultCountry="US"
            onChange={(e) => setPhone(formatPhone(e.target.value))} className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.gender")}</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="profile-select">
            <option value="">{t("userDashboard.selectGender")}</option>
            <option value="male">{t("userDashboard.male")}</option>
            <option value="female">{t("userDashboard.female")}</option>
            <option value="other">{t("userDashboard.other")}</option>
          </select>
        </div>

              <div className="profile-field">
        <label>{t("userDashboard.birthDate")}</label>
<input
  type="text"
  value={birthDateInput}
  onChange={handleBirthDateChange}
  onBlur={() => setBirthDate(parseInputToISO(birthDateInput))}
  placeholder={i18n.language === "pt" ? "dd/mm/aaaa" : "mm/dd/yyyy"}
  className="profile-input"
/>
      </div>


        <div className="profile-field">
          <label>{t("userDashboard.city")}</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.state")}</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.address")}</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="profile-input" />
        </div>
        <div className="profile-field">
          <label>{t("userDashboard.addressComplement")}</label>
            <input
              type="text"
              name="complement"
              placeholder="Complement (optional)"
              value={addressComplement} onChange={(e) => setAddressComplement(e.target.value)} className="profile-input"
            />       
           </div>
 

        <div className="profile-field">
          <label>{t("userDashboard.zipCode")}</label>
          <input type="text" value={zipCode}    onChange={(e) => setZipCode(e.target.value.slice(0, 50))} className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.emailLabel")}</label>
          <input type="email" value={email} disabled className="profile-input" />
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.country")}</label>
          <CountrySelect value={country} onChange={(e) => setCountry(e.target.value)} className="profile-select" t={t}/>
        </div>

        <div className="profile-field">
          <label>{t("userDashboard.languageLabel")}</label>
          <select
            value={i18n.language}
            onChange={(e) => {
              setUserLanguage(e.target.value.toUpperCase());
              i18n.changeLanguage(e.target.value);
            }}
            className="profile-select"
          >
            {Object.keys(languageOptions).map((key) => (
              <option key={key} value={key}>
                {languageOptions[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AlertComponent customAlert={customAlert} setCustomAlert={setCustomAlert} />

      <button className="profile-save-btn" onClick={handleSaveProfile}>
        {t("userDashboard.saveChangesButton")}
      </button>
    </div>
  );
};

export default ProfileManagement;
