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
          }
        );
        setEvents(eventsRes.data);

        const joinedRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/attendees/events/joined`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
        }
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
        }
      );

      alert("Feedback submitted successfully!");
      dispatch(clearSelectedEventId());
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback.");
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No events found.</div>
      ) : (
        events.map((event) => {
          const hasJoined = joinedEvents.includes(event.id);
          const eventEnded = new Date(event.end_date) < new Date();

          return (
            <div key={event.id} className="card bg-base-100 w-96 shadow-sm">
              <figure>
                <img src={event.image} alt={event.event_name} />
              </figure>

              <div className="card-body">
                <h2 className="card-title">{event.event_name}</h2>
                <p>{event.description}</p>

                <p className="text-sm text-gray-500 mt-2">
                  <strong>Start:</strong>{" "}
                  {new Date(event.start_date).toLocaleDateString()} <br />
                  <strong>End:</strong>{" "}
                  {new Date(event.end_date).toLocaleDateString()}
                </p>

                {eventEnded && (
                  <p className="text-red-600 font-semibold mt-1">
                    This event is over.
                  </p>
                )}

                <div className="flex justify-between items-center mt-4 gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleJoin(event.id)}
                    disabled={hasJoined || eventEnded}
                  >
                    {hasJoined
                      ? "Joined ✅"
                      : eventEnded
                      ? "Event Over"
                      : "Join Event"}
                  </button>

                  {hasJoined && eventEnded && (
                    <button
                      className="btn btn-outline btn-secondary"
                      onClick={() =>
                        dispatch(
                          selectedEventId === event.id
                            ? clearSelectedEventId()
                            : setSelectedEventId(event.id)
                        )
                      }
                    >
                      {selectedEventId === event.id
                        ? "Cancel"
                        : "Give Feedback"}
                    </button>
                  )}
                </div>

                {selectedEventId === event.id && (
                  <Feedback onSubmit={handleFeedbackSubmit} />
                )}

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
