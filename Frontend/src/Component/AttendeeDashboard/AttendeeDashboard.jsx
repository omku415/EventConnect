import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Feedback from "../Feedback/Feedback";
import {
  setSelectedEventId,
  clearSelectedEventId,
} from "../../Redux/eventSlice";

function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // for pagination
  const [page, setPage] = useState(1);
  const eventsPerPage = 9;

  const startIndex = (page - 1) * eventsPerPage;
  const visibleEvents = events.slice(startIndex, startIndex + eventsPerPage);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  const selectedEventId = useSelector((state) => state.event.selectedEventId);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEventsAndJoined = async () => {
      try {
        const token = localStorage.getItem("token");

        const eventsRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attendees/events/approved`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setEvents(eventsRes.data);

        const joinedRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attendees/events/joined`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const joinedIds = joinedRes.data.map((event) => event.id);
        setJoinedEvents(joinedIds);
      } catch (error) {
        console.error("Error fetching events or joined events:", error);
      }
    };

    fetchEventsAndJoined();
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
        },
      );

      setJoinedEvents((prev) => [...prev, eventId]);
    } catch (error) {
      console.error("Error joining event:", error);
      alert("Failed to join event. Please try again.");
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attendees/feedback`,
        {
          ...feedbackData,
          eventId: selectedEventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Feedback submitted successfully!");
      dispatch(clearSelectedEventId());
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-3 px-2 py-4">
        {events.length === 0 ? (
          <div className="text-center text-gray-500 mt-6">No events found.</div>
        ) : (
          visibleEvents.map((event) => {
            const hasJoined = joinedEvents.includes(event.id);
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
                  <h2 className="card-title text-base">{event.event_name}</h2>

                  {/* Line 1 : Start and End Date */}
                  <p className="text-xs text-gray-500">
                    {new Date(event.start_date).toLocaleDateString()} |{" "}
                    {new Date(event.end_date).toLocaleDateString()}
                  </p>

                  {/* Line 2 : Event Status */}
                  <p
                    className={`text-xs font-semibold ${
                      eventEnded ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {eventEnded ? "Event Over" : "Ongoing"}
                  </p>

                  {/* Line 3 : Buttons */}
                  <div className="flex gap-2 mt-1">
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => handleJoin(event.id)}
                      disabled={hasJoined || eventEnded}
                    >
                      {hasJoined ? "Joined" : eventEnded ? "Over" : "Join"}
                    </button>

                    <button
                      className="btn btn-outline btn-xs"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Details
                    </button>
                  </div>

                  {/* Feedback section */}
                  {hasJoined && eventEnded && (
                    <div className="flex justify-center mt-1">
                      <button
                        className="btn btn-outline btn-secondary btn-xs"
                        onClick={() =>
                          dispatch(
                            selectedEventId === event.id
                              ? clearSelectedEventId()
                              : setSelectedEventId(event.id),
                          )
                        }
                      >
                        {selectedEventId === event.id ? "Cancel" : "Feedback"}
                      </button>
                    </div>
                  )}

                  {selectedEventId === event.id && (
                    <Feedback onSubmit={handleFeedbackSubmit} />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-center items-center gap-4 pb-6">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          className="btn btn-sm"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* EVENT DETAILS MODAL */}
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

            <p className="mt-3 text-gray-700">{selectedEvent.description}</p>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedEvent.start_date).toLocaleDateString()}
              </p>

              <p>
                <strong>End Date:</strong>{" "}
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

export default AttendeeDashboard;
