import React, { useEffect, useState } from "react";
import { Eye, Pencil } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('adminToken'); 

      const res = await fetch(`${API_BASE_URL}/adminjob/jobs`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,   
          'Content-Type': 'application/json',
        },
      });
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [API_BASE_URL]);

  if (loading) return <p className="p-4">Loading jobs...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;



  const handleView = (id) => {
    navigate(`/adminjob/jobdetail/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/adminjob/edit/${id}`);
  };

  return (
    <div >
      <h2 className="text-2xl font-bold mb-6">All Jobs</h2>

      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">Job Role</th>
                <th className="py-2 px-4 border-b text-left">Company</th>
                <th className="py-2 px-4 border-b text-left">Job Unique Id</th>
                <th className="py-2 px-4 border-b text-left">Posted by</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                {/* <th className="py-2 px-4 border-b text-left">CTC</th> */}
                {/* <th className="py-2 px-4 border-b text-left">Experience</th> */}
                <th className="py-2 px-4 border-b text-left">End Date</th>
                 <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="py-2 px-4 border-b">{job.jobRole}</td>
                  <td className="py-2 px-4 border-b ">
                    {job.companyName}
                  </td>
                  <td className="py-2 px-4 border-b">{job.jobUniqueId}</td>
                  <td className="py-2 px-4 border-b">{job.user.email}</td>
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

                  {/* <td className="py-2 px-4 border-b">{job.ctc}</td> */}
                  {/* <td className="py-2 px-4 border-b">{job.experienceRequired} yrs</td> */}
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
        </div>
      )}
    </div>
  );
};

export default Jobs;
