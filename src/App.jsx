import { useState } from "react";
import Login from "./screens/login/login/Login";
import CreateAccount from "./screens/login/createAccount/CreateAccount";
import UserDashboard from './screens/user-dashboard/UserDashboard';
import AdminDashboard from './screens/admin-dashboard/AdminDashboard';
import RecoverPassword from './screens/login/recoverPassword/RecoverPassword';
import ValidateCodeEmailVerification from './screens/login/validateCodeEmailVerification/ValidateCodeEmailVerification';
import ValidateCodeResetPassword from './screens/login/validateCodeResetPassword/ValidateCodeResetPassword';
import ResetPassword from './screens/login/resetPassword/ResetPassword';
import Modal from "./components/common/Modal";
import "./styles/base.css";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [modalMessage, setModalMessage] = useState("");

  return (
    <Router>
      {modalMessage && <Modal message={modalMessage} onClose={() => setModalMessage("")} />}
      <Routes>
        <Route path="/" element={<Login setModalMessage={setModalMessage} />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/recover-password" element={<RecoverPassword isInactive={false} />} />
        <Route path="/send-activation-link" element={<RecoverPassword isInactive={true} />} />
        <Route path="/validate-code-password" element={<ValidateCodeResetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/validate-code-email" element={<ValidateCodeEmailVerification />} />
        <Route path="/user-dashboard" element={<ProtectedRoute requiredRoles={["ROLE_USER", "ROLE_ANALYST"]}><UserDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRoles={["ROLE_ADMIN", "ROLE_ANALYST"]}><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
