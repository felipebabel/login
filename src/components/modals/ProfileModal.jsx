import React from "react";
import "./ProfileModal.css";

const ProfileModal = ({ open, onClose, data }) => {
  if (!open || !data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>User Profile: {data.username}</h2>
        <div className="profile-fields">
          <p><strong>Identifier:</strong> {data.identifier}</p>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Role:</strong> {data.role}</p>
          <p><strong>Status:</strong> {data.status}</p>
          <p><strong>Language:</strong> {data.language}</p>
          <p><strong>Phone:</strong> {data.phone || "-"}</p>
          <p><strong>Address:</strong> {data.address || "-"}</p>
          <p><strong>Address Complement:</strong> {data.addressComplement || "-"}</p>
          <p><strong>City:</strong> {data.city || "-"}</p>
          <p><strong>State:</strong> {data.state || "-"}</p>
          <p><strong>Country:</strong> {data.country || "-"}</p>
          <p><strong>Zip Code:</strong> {data.zipCode || "-"}</p>
          <p><strong>Creation Date:</strong> {data.creationUserDate}</p>
          <p><strong>Last Access Date:</strong> {data.lastAccessDate}</p>
          <p><strong>Login Date:</strong> {data.loginDate || "-"}</p>
          <p><strong>Password Change Date:</strong> {data.passwordChangeDate}</p>
          <p><strong>Force Password Change:</strong> {data.forcePasswordChange ? "Yes" : "No"}</p>
          <p><strong>Login Attempt:</strong> {data.loginAttempt}</p>
          <p><strong>Update Date:</strong> {data.updateDate}</p>
          <p><strong>Gender:</strong> {data.gender || "-"}</p>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProfileModal;
