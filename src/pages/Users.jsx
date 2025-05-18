import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, Briefcase } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken'); 
       const res = await fetch(`${API_BASE_URL}/adminuser/users`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,   
          'Content-Type': 'application/json',
        },
      });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [API_BASE_URL]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div >
      <h2 className="text-2xl font-bold mb-6"> All Users</h2>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
    <thead className="bg-gray-100">
  <tr>
    <th className="py-2 px-4 border-b border-gray-300 text-left">User ID</th>
    <th className="py-2 px-4 border-b border-gray-300 text-left">First Name</th>
    {/* <th className="py-2 px-4 border-b border-gray-300 text-left">Last Name</th> */}
    <th className="py-2 px-4 border-b border-gray-300 text-left">Email</th>
    <th className="py-2 px-4 border-b border-gray-300 text-left">Present company</th>
    <th className="py-2 px-4 border-b border-gray-300 text-left">Position</th>
    <th className="py-2 px-4 border-b border-gray-300 text-left">Action</th> 
  </tr>
</thead>
<tbody>
  {users.map((user) => (
    <tr key={user._id || user.id}>
      <td className="py-2 px-4 border-b border-gray-300">{user._id || user.id}</td>
      <td className="py-2 px-4 border-b border-gray-300">{user.firstName}</td>
      {/* <td className="py-2 px-4 border-b border-gray-300">{user.lastName}</td> */}
      <td className="py-2 px-4 border-b border-gray-300">{user.email}</td>
      <td className="py-2 px-4 border-b border-gray-300">{user?.presentCompany?.companyName}</td>
      <td className="py-2 px-4 border-b border-gray-300">{user?.presentCompany?.role}</td>
   <td className="py-2 px-4 border-b border-gray-300">
  <div className="flex gap-6">
    <button
      onClick={() => navigate("/post-job", { state: { user } })}
      title="Refer Job"
      className="text-blue-600 hover:text-blue-800"
    >
      <FilePlus size={22} />
    </button>
    <button
      onClick={() => navigate(`/posted-jobs/${user._id || user.id}`)}
      title="View Posted Jobs"
      className="text-indigo-600 hover:text-indigo-800"
    >
      <Briefcase size={22} />
    </button>
  </div>
</td>

    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
