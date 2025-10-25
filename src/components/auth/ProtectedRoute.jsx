import React, { useEffect, useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function ProtectedRoute({ children, requiredRoles }) {
  const { t } = useTranslation();
  const token = localStorage.getItem("accessTokenKey");
  const userRole = localStorage.getItem("userRole");
  const location = useLocation();
  const hasShownAlert = useRef(false);

  const isUnauthorized =
    !token || (requiredRoles && !requiredRoles.includes(userRole));

  useEffect(() => {
    if (isUnauthorized && !hasShownAlert.current) {
      hasShownAlert.current = true;

      const msg = !token
        ? t("auth.sessionExpiredOrUnauthorized")
        : t("auth.accessDenied");

      alert(msg);
    }
  }, [isUnauthorized, t, requiredRoles, userRole]);

  if (isUnauthorized) {
    if (location.pathname === "/" || location.pathname.startsWith("/login")) {
      return null;
    }
return <Navigate to="/" replace />;
  }

  return children;
}
