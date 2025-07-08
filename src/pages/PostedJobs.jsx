import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, Pencil } from 'lucide-react';
const PostedJobs = () => {
  const { userId } = useParams();
  const [userJobs, setUserJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/adminjob/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user's jobs");
        const data = await res.json();
        setUserJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserJobs();
  }, [API_BASE_URL, userId]);

  if (loading) return <p className="p-4">Loading posted jobs...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (userJobs.length === 0) return <p>No posted jobs found for this user.</p>;


    const handleView = (id) => {
    navigate(`/adminjob/jobdetail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/adminjob/edit/${id}`);
  };
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Jobs posted by User</h2>
        {userJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Job Role</th>
            <th className="py-2 px-4 border-b text-left">Company</th>
                            <th className="py-2 px-4 border-b text-left">Job Unique Id</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">End Date</th>
             <th className="py-2 px-4 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userJobs.map((job) => (
            <tr key={job._id}>
              <td className="py-2 px-4 border-b">{job.jobRole}</td>
              <td className="py-2 px-4 border-b">{job.companyName}</td>
                                <td className="py-2 px-4 border-b">{job.jobUniqueId}</td>
               <td className="py-2 px-4 border-b">
  <div className="flex items-center gap-2">
    <span
      className={`h-4 w-4 rounded-full ${
        job.status === "active" ? "bg-green-600" : "bg-red-600"
      }`}
      aria-label={job.status}
    ></span>
    <span>{job.status}</span>
  </div>
</td>
              <td className="py-2 px-4 border-b">{job.experienceRequired} yrs</td>
              <td className="py-2 px-4 border-b">{new Date(job.endDate).toLocaleDateString()}</td>
            <td className="py-2 px-4 border-b">
                               <button
                                 className="text-blue-600 hover:text-blue-800 mr-3"
                                 onClick={() => handleView(job._id)}
                               >
                                 <Eye size={18} />
                               </button>
                               <button
                                 className="text-green-600 hover:text-green-800"
                                 onClick={() => handleEdit(job._id)}
                               >
                                 <Pencil size={18} />
                               </button>
                             </td>
            </tr>
          ))}
        </tbody>
      </table>
       )}
      <button
        onClick={() => navigate(-1)}
        className="mt-4 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
};

export default PostedJobs;
