import React, { useEffect, useState } from "react";
import axios from "axios";

function EventDisplayA() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/verify-events`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(res.data.events); // Adjust if your backend sends differently
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/update-event-status/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update UI after change
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      console.error(`Error updating event status:`, error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
      {events.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No events found.</div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 p-4"
          >
            <figure className="w-1/3">
              <img
                src={event.image} // cloudinary image url from DB
                alt="Event Image"
                className="h-full object-cover rounded-l-lg"
              />
            </figure>
            <div className="card-body w-2/3 flex flex-col">
              <h2 className="card-title text-2xl font-semibold text-gray-800">
                {event.event_name}
              </h2>

              <div className="text-sm text-gray-500 mt-2">
                📅 {event.start_date} → {event.end_date}
              </div>

              <div className="badge badge-info w-fit mt-2">{event.type}</div>

              <p className="text-sm mt-2 text-gray-600">
                {event.description.length > 100
                  ? event.description.slice(0, 100) + "..."
                  : event.description}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`badge ${
                    event.status === "Pending"
                      ? "badge-warning"
                      : event.status === "Approved"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {event.status}
                </div>
              </div>

              <div className="card-actions justify-start mt-4 gap-3">
                <button
                  className="btn btn-success btn-sm w-32"
                  onClick={() => handleStatusChange(event.id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="btn btn-error btn-sm w-32"
                  onClick={() => handleStatusChange(event.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default EventDisplayA;
