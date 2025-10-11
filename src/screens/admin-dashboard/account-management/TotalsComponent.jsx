import React from "react";
import "./TotalsComponent.css";

class TotalsComponent extends React.Component {
  render() {
    const { totals = {}, t } = this.props;
    const {
      total = 0,
      totalActive = 0,
      totalInactive = 0,
      totalPending = 0,
      totalBlocked = 0,
      totalActiveSession = 0
    } = totals;

    return (
      <div className="totals-section">
        <div className="total-card total-all">
          {t("adminDashboard.total")}: {total}
        </div>
        <div className="total-card total-active">
          {t("adminDashboard.totalActive")}: {totalActive}
        </div>
        <div className="total-card total-inactive">
          {t("adminDashboard.totalInactive")}: {totalInactive}
        </div>
        <div className="total-card total-pending">
          {t("adminDashboard.totalPending")}: {totalPending}
        </div>
        <div className="total-card total-blocked">
          {t("adminDashboard.totalBlocked")}: {totalBlocked}
        </div>
        <div className="total-card total-active">
          {t("adminDashboard.totalActiveSession")}: {totalActiveSession}
        </div>
      </div>
    );
  }
}

export default TotalsComponent;
