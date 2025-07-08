import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Briefcase, Wallet2 } from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/adminuser/users?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [API_BASE_URL, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers(page);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">User ID</th>
                  <th className="py-2 px-4 border-b text-left">First Name</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Present Company</th>
                  <th className="py-2 px-4 border-b text-left">Position</th>
                   <th className="py-2 px-4 border-b text-left">Services</th>
                  <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b">{user._id}</td>
                    <td className="py-2 px-4 border-b">{user.firstName}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user?.presentCompany?.companyName || '-'}</td>
                    <td className="py-2 px-4 border-b">{user?.presentCompany?.role || '-'}</td>
                <td className="py-2 px-4 border-b text-sm text-gray-700">
  {user.services?.filter(s => s.enabled).length > 0 ? (
    user.services
      .filter((s) => s.enabled)
      .map((s) => (
        <div key={s._id}>
          <span className="font-medium">{s.type}</span> (₹{s.price})
        </div>
      ))
  ) : (
    <span className="text-gray-400 italic">None</span>
  )}
</td>

                    <td className="py-2 px-4 border-b">
                      <div className="flex gap-4">
                        <button
                          onClick={() => navigate("/post-job", { state: { user } })}
                          title="Refer Job"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FilePlus size={20} />
                        </button>
                        <button
                          onClick={() => navigate(`/posted-jobs/${user._id}`)}
                          title="View Posted Jobs"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Briefcase size={20} />
                        </button>
                        <button
                          onClick={() => navigate(`/user-wallet/${user._id}`)}
                          title="View Wallet"
                          className="text-emerald-600 hover:text-emerald-800"
                        >
                          <Wallet2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-indigo-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
