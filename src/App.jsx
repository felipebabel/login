import { useState } from "react"; 
import Login from "./components/screens/login/login/Login";
import CreateAccount from "./components/screens/login/createAccount/CreateAccount";
import UserDashboard from './components/user-dashboard/UserDashboard';
import AdminDashboard from './components/admin-dashboard/AdminDashboard';
import RecoverPassword from './components/screens/login/recoverPassword/RecoverPassword';
import ValidateCodeEmailVerification from './components/screens/login/validateCodeEmailVerification/ValidateCodeEmailVerification';
import ValidateCodeResetPassword from './components/screens/login/validateCodeResetPassword/ValidateCodeResetPassword';
import ResetPassword from './components/screens/login/resetPassword/ResetPassword';
import Modal from "./components/common/Modal";
import "./components/styles/base.css";
import "./components/styles/components.css";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [modalMessage, setModalMessage] = useState("");

  return (
    <Router>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage("")} />}
      <Routes>
        <Route path="/" element={<Login setModalMessage={setModalMessage} />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/validate-code-password" element={<ValidateCodeResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/validate-code-email" element={<ValidateCodeEmailVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
