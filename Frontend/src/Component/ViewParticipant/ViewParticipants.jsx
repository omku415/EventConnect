import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewParticipants = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/managers/view-participants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  return (
    <div>
      {events.map((event) => (
        <div key={event.eventId} className="mb-6">
          <h2 className="text-lg font-bold mb-2">{event.eventName}</h2>
          {event.participants.length === 0 ? (
            <p className="text-sm text-gray-500">No participants yet</p>
          ) : (
            <ul className="list bg-base-100 rounded-box shadow-md">
              {event.participants.map((p) => (
                <li
                  key={p.id}
                  className="list-row flex items-center gap-4 px-4 py-3 border-t"
                >
                  <img
                    src={p.profile_image}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div>{p.name}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">
                      {p.email}
                    </div>
                    <div className="text-xs text-gray-500">{p.phone}</div>
                  </div>
                  <span className="btn btn-xs bg-green-500 text-white cursor-default select-none">
                    Joined
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewParticipants;
