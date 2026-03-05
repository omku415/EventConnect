import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManagerDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const eventsPerPage = 9;

  const startIndex = (page - 1) * eventsPerPage;
  const visibleEvents = events.slice(startIndex, startIndex + eventsPerPage);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const { manager } = useSelector((state) => state.auth);

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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [manager]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 py-4">
        {visibleEvents.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">
            No events found.
          </div>
        ) : (
          visibleEvents.map((event) => {
            const eventEnded = new Date(event.end_date) < new Date();

            return (
              <div key={event.id} className="card bg-base-100 shadow-sm">
                <figure className="px-4 pt-4">
                  <img
                    src={event.image}
                    alt={event.event_name}
                    className="rounded-lg h-40 w-full object-cover"
                  />
                </figure>

                <div className="card-body p-3">
                  <h2 className="card-title text-base">
                    {event.event_name}
                  </h2>

                  {/* Dates */}
                  <p className="text-xs text-gray-500">
                    {new Date(event.start_date).toLocaleDateString()} |{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </p>

                  {/* Status */}
                  <p
                    className={`text-xs font-semibold ${
                      eventEnded ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {eventEnded ? "Event Over" : "Ongoing"}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-2">
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Event
                    </button>

                    <button
                      className="btn btn-secondary btn-xs"
                      onClick={() => handleViewParticipants(event.id)}
                    >
                      Participants
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pb-6">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => {
            setPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          className="btn btn-sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => {
            setPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Next
        </button>
      </div>

      {/* EVENT MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg p-6 relative">

            <button
              className="absolute top-3 right-3 btn btn-sm btn-circle"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>

            <img
              src={selectedEvent.image}
              alt={selectedEvent.event_name}
              className="w-full h-64 object-cover rounded-lg"
            />

            <h2 className="text-2xl font-bold mt-4">
              {selectedEvent.event_name}
            </h2>

            <p className="mt-3 text-gray-700">
              {selectedEvent.description}
            </p>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Start:</strong>{" "}
                {new Date(selectedEvent.start_date).toLocaleDateString()}
              </p>

              <p>
                <strong>End:</strong>{" "}
                {new Date(selectedEvent.end_date).toLocaleDateString()}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default ManagerDashboard;