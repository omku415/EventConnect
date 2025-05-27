import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Correct import
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // State to hold the events
  // Fetch events when the component mounts
  const { manager } = useSelector((state) => state.auth); // Access manager data from Redux

  const handleViewParticipants = (eventId) => {
    navigate(`/view-participant/${eventId}`);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/managers/events/${manager.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
        setEvents(response.data); // Update state with the fetched events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents(); // Fetch events only if manager and token exist
  }, [manager]); // Re-fetch events if manager or token changes

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No events found.</div>
      ) : (
        events.map((event) => (
          <div key={event.id} className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">{event.event_name}</h2>
              <p>{event.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">View Event</button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleViewParticipants(event.id)}
                >
                  View Participants
                </button>
              </div>
            </div>
            <figure>
              <img src={event.image} alt={event.event_name} />
            </figure>
          </div>
        ))
      )}
    </div>
  );
}

export default ManagerDashboard;
