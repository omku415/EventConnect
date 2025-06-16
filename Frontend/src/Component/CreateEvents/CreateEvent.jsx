import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
function CreateEvent() {
  const today = new Date().toISOString().split("T")[0];
  const managerId = localStorage.getItem("id");
  const [formData, setFormData] = useState({
    event_name: "",
    image: null,
    start_date: "",
    end_date: "",
    description: "",
    type: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0], // Here 'image' because field name is image
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    const managerId = localStorage.getItem("managerId"); // Get manager ID

    if (formData.event_name) data.append("event_name", formData.event_name);
    if (formData.image) data.append("image", formData.image);
    if (formData.start_date) data.append("start_date", formData.start_date);
    if (formData.end_date) data.append("end_date", formData.end_date);
    if (formData.description) data.append("description", formData.description);
    if (formData.type) data.append("type", formData.type);
    data.append("status", "Pending");
    data.append("manager_id", managerId); // ✅ This is critical

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/managers/create-events`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Event created successfully!");

      setFormData({
        event_name: "",
        image: null,
        start_date: "",
        end_date: "",
        description: "",
        type: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        `Event creation failed: ${error.response?.data?.error || error.message}`
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg"
      >
        <legend className="text-xl font-semibold mb-4 text-center">
          Create Event
        </legend>

        <label htmlFor="event_name" className="block mt-2">
          Event Name
        </label>
        <input
          id="event_name"
          type="text"
          name="event_name"
          className="input w-full mt-1"
          placeholder="Enter event name"
          value={formData.event_name}
          onChange={handleChange}
          required
        />

        <label htmlFor="image" className="block mt-3">
          Event Image
        </label>
        <input
          id="image"
          type="file"
          name="image"
          accept="image/*"
          className="file-input w-full mt-1"
          onChange={handleFileChange}
          required
        />

        <label htmlFor="start_date" className="block mt-3">
          Start Date
        </label>
        <input
          id="start_date"
          type="date"
          name="start_date"
          className="input w-full mt-1"
          value={formData.start_date}
          min={today}
          onChange={handleChange}
          required
        />

        <label htmlFor="end_date" className="block mt-3">
          End Date
        </label>
        <input
          id="end_date"
          type="date"
          name="end_date"
          className="input w-full mt-1"
          value={formData.end_date}
          min={today}
          onChange={handleChange}
          required
        />

        <label htmlFor="description" className="block mt-3">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="textarea w-full mt-1"
          placeholder="Describe the event"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label htmlFor="type" className="block mt-3">
          Type
        </label>
        <select
          id="type"
          name="type"
          className="select w-full mt-1"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          <option value="Workshop">Workshop</option>
          <option value="Webinar">Webinar</option>
          <option value="Seminar">Seminar</option>
          <option value="Competition">Competition</option>
          <option value="Conference">Conference</option>
          <option value="Meetup">Meetup</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Other">Other</option>
        </select>

        <button type="submit" className="btn btn-primary w-full mt-6">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
