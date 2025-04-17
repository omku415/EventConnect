import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/authSlice";

const UpdateProfile = () => {
  const { attendee } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: attendee?.name || "",
    phone: attendee?.phone || "",
    profile_image: null,
  });

  useEffect(() => {
    if (attendee) {
      setFormData({
        name: attendee.name || "",
        phone: attendee.phone || "",
        profile_image: attendee.profile_image || null,
      });
    }
  }, [attendee]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profile_image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.name) {
      data.append("name", formData.name);
    }
    if (formData.phone) {
      data.append("phone", formData.phone);
    }
    if (formData.profile_image) {
      data.append("profile_image", formData.profile_image);
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/attendees/update-profile/${attendee.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      dispatch(login(res.data.updatedData));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(`Update failed: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-base-200 border border-base-300 p-6 rounded-box shadow-lg"
      >
        {/* Display the Cloudinary profile image (if available) */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold">Profile Image</h3>
          {attendee?.profile_image ? (
            <img
              src={attendee.profile_image}
              alt="Profile"
              className="w-32 h-32 rounded-full mt-3"
            />
          ) : (
            <p>No profile image available.</p>
          )}
        </div>

        <legend className="text-lg font-semibold mb-2">Update Profile</legend>

        <label htmlFor="name" className="block mt-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className="input w-full mt-1"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone" className="block mt-3">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          className="input w-full mt-1"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="profile_image" className="block mt-3">
          Profile Image
        </label>
        <input
          id="profile_image"
          type="file"
          name="profile_image"
          accept="image/*"
          className="file-input w-full mt-1"
          onChange={handleFileChange}
        />

        <button type="submit" className="btn btn-primary w-full mt-6">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
