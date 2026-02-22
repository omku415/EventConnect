import React, { useEffect, useState } from "react";
import { Users, UserCheck, Calendar, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";

function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalManagers: 0,
    pendingManagers: 0,
    totalEvents: 0,
    pendingEvents: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/admin-stats`
      );
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <User size={28} />,
      color: "bg-purple-500",
    },
    {
      title: "Total Managers",
      value: stats.totalManagers,
      icon: <Users size={28} />,
      color: "bg-blue-500",
    },
    {
      title: "Pending Managers",
      value: stats.pendingManagers,
      icon: <UserCheck size={28} />,
      color: "bg-yellow-500",
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <Calendar size={28} />,
      color: "bg-green-500",
    },
    {
      title: "Pending Events",
      value: stats.pendingEvents,
      icon: <Clock size={28} />,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="pt-20 px-6 min-h-screen bg-gray-100">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, Admin 👋
        </h1>
        <p className="text-gray-600">
          Here is the overview of your system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500">{card.title}</p>
              <h2 className="text-3xl font-bold mt-1">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.color} text-white p-3 rounded-lg`}
            >
              {card.icon}
            </div>

          </div>
        ))}

      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex gap-4">

          <Link
            to="/pending-managers"
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition"
          >
            Verify Managers
          </Link>

          <Link
            to="/verify-events"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
          >
            Verify Events
          </Link>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;