export default function Modal({ message, onClose }) {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}>
      <div style={{
        background: "#fff",
        padding: "2rem",
        borderRadius: "8px",
        maxWidth: "400px",
        textAlign: "center",
      }}>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
