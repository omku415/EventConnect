import React, { useEffect, useState } from "react";
import axios from "axios";
function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attendees/events/approved`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching approved events:", error);
      }
    };

    fetchApprovedEvents();
  }, []);

  const handleJoin = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attendees/join-event`,
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJoinedEvents((prev) => [...prev, eventId]);
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Failed to join event. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No events found.</div>
      ) : (
        events.map((event) => {
          // Assume you have a list of event IDs the user has joined
          const hasJoined = joinedEvents.includes(event.id); // You manage this from backend or state
          const eventEnded = new Date(event.end_date) < new Date();

          return (
            <div key={event.id} className="card bg-base-100 w-96 shadow-sm">
              <figure>
                <img src={event.image} alt={event.event_name} />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{event.event_name}</h2>
                <p>{event.description}</p>

                <div className="flex justify-between items-center mt-4 gap-2">
                  {/* Join Button */}
                  {!hasJoined ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleJoin(event.id)}
                    >
                      Join Event
                    </button>
                  ) : (
                    <button className="btn btn-success btn-disabled">
                      Joined ✅
                    </button>
                  )}

                  {/* Feedback Button (Only show if joined AND event has ended) */}
                  {hasJoined && eventEnded && (
                    <button
                      className="btn btn-outline btn-secondary"
                      onClick={() => openFeedbackModal(event.id)}
                    >
                      Give Feedback
                    </button>
                  )}
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-link">View Event</button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default AttendeeDashboard;
