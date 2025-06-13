import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const AdminUserManagement = () => {
  const [attendees, setAttendees] = useState([]);
  const [managers, setManagers] = useState([]);

  const fetchUsers = () => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/all-attendees`)
      .then((res) => setAttendees(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/all-managers`)
      .then((res) => setManagers(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onDeleteAttendee = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/delete-attendee/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => fetchUsers())
      .catch((err) => console.error(err));
  };

  const onDeleteManager = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/delete-manager/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => fetchUsers())
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-4">
      {/* Managers Section */}
      <h2 className="text-2xl font-bold mb-2">Managers</h2>
      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {managers.length > 0 ? (
              managers.map((manager, index) => (
                <tr key={manager.id}>
                  <th>{index + 1}</th>
                  <td>{manager.name}</td>
                  <td>{manager.email}</td>
                  <td>
                    <button onClick={() => onDeleteManager(manager.id)}>
                      <Trash2 className="text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No managers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Attendees Section */}
      <h2 className="text-2xl font-bold mb-2">Attendees</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendees.length > 0 ? (
              attendees.map((attendee, index) => (
                <tr key={attendee.id}>
                  <th>{index + 1}</th>
                  <td>{attendee.name}</td>
                  <td>{attendee.email}</td>
                  <td>
                    <button onClick={() => onDeleteAttendee(attendee.id)}>
                      <Trash2 className="text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No attendees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;
