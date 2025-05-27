import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSelectedEventId } from "../../Redux/eventSlice";

const ViewParticipants = () => {
  const { eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (eventId) {
      dispatch(setSelectedEventId(eventId));
      fetchParticipants();
    }
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/managers/view-participants/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParticipants(response.data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };
  console.log(participants);
  return (
    <ul className="list bg-base-100 rounded-box shadow-md">
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
        Participants for this event
      </li>

      {participants.map((participant) => (
        <li
          key={participant.id}
          className="list-row flex items-center gap-4 px-4 py-3 border-t"
        >
          <img
            src={participant.profile_image}
            alt={participant.name}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="flex-1">
            <div>{participant.name}</div>
            <div className="text-xs uppercase font-semibold opacity-60">
              {participant.email}
            </div>
            <div className="text-xs text-gray-500">{participant.phone}</div>
          </div>

          <span className="btn btn-xs bg-green-500 text-white cursor-default select-none">
            Joined
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ViewParticipants;
