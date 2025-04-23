import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PendingManagers = () => {
  const [pendingManagers, setPendingManagers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return; // Prevent further execution if no token
    }
    const fetchPendingManagers = async () => {
    
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/pending-managers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPendingManagers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch managers:", err);
      }
    };

    fetchPendingManagers();
  }, []);

  const handleAccept = async (managerId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/approve-manager/${managerId}`
      );
      setPendingManagers((prev) => prev.filter((m) => m.id !== managerId));
    } catch (err) {
      console.error("Failed to approve manager:", err);
    }
  };

  const handleReject = async (managerId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/reject-manager/${managerId}`
      );
      setPendingManagers((prev) => prev.filter((m) => m.id !== managerId));
    } catch (err) {
      console.error("Failed to reject manager:", err);
    }
  };

  return (
    <ul className="list bg-base-100 rounded-box shadow-md divide-y divide-base-300">
      <li className="p-4 text-sm font-semibold text-gray-500">
        Manager Requests
      </li>

      {pendingManagers.length === 0 ? (
        <li className="p-4 text-gray-400">No pending requests</li>
      ) : (
        pendingManagers.map((manager) => (
          <li
            key={manager.id}
            className="flex items-center justify-between p-4"
          >
            <div>
              <div className="font-semibold">{manager.name}</div>
              <div className="text-xs text-gray-500">📞 {manager.phone}</div>
            </div>

            <div className="flex gap-2">
              <a
                href={manager.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                view Resume
              </a>

              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAccept(manager.id)}
              >
                Accept
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleReject(manager.id)}
              >
                Reject
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default PendingManagers;
