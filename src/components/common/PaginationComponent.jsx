const PaginationComponent = ({ activePage, totalPages, onPageChange, t }) => (
  <div className="pagination-controls">
    <button
      className="pagination-btn"
      onClick={() => onPageChange("prev")}
      disabled={activePage === 0}
    >
      ◀ {t("adminDashboard.previous")}
    </button>
    <span className="pagination-info">
      {t("adminDashboard.page")} {activePage + 1} / {totalPages}
    </span>
    <button
      className="pagination-btn"
      onClick={() => onPageChange("next")}
      disabled={activePage + 1 >= totalPages}
    >
      {t("adminDashboard.next")} ▶
    </button>
  </div>
);

export default PaginationComponent;
