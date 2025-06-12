import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ManagerFeedbackList from "../ShowFeedback/ManagerFeedbackList";

const ViewFeedback = () => {
  const { managerId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const manager = JSON.parse(localStorage.getItem("manager"));
    const token = localStorage.getItem("token");

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/managers/view-feedback/${managerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Error fetching feedback:", err));
  }, [managerId]);

  return <ManagerFeedbackList feedbacks={feedbacks} />;
};

export default ViewFeedback;
