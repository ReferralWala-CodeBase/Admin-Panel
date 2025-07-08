import React, { useEffect, useState } from 'react';

const AdminApplicantStatusPage = () => {
  const [statuses, setStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  const fetchStatuses = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/adminjob/applicant-statuses?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch applicant statuses');
      }

      const data = await res.json();
      setStatuses(data.statuses || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Applicant Statuses</h2>

      <div className="overflow-auto rounded-lg shadow">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 border">Applicant</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Applied At</th>
              <th className="px-4 py-3 border">Job Role</th>
              <th className="px-4 py-3 border">Company</th>
              <th className="px-4 py-3 border">Job Link</th>
              <th className="px-4 py-3 border">Posted By</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr key={status._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  {status.userId?.firstName} {status.userId?.lastName}
                  <br />
                  <span className="text-xs text-gray-500">{status.userId?.email}</span>
                </td>
                <td className="px-4 py-2 capitalize">{status.status}</td>
                <td className="px-4 py-2">{new Date(status.appliedAt).toLocaleString()}</td>
                <td className="px-4 py-2">{status.jobPostId?.jobRole || '-'}</td>
                <td className="px-4 py-2">{status.jobPostId?.companyName || '-'}</td>
                <td className="px-4 py-2">
                  {status.jobPostId?.jobLink ? (
                    <a
                      href={status.jobPostId.jobLink}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-4 py-2">
                  {status.jobPostId?.user?.firstName} {status.jobPostId?.user?.lastName}
                  <br />
                  <span className="text-xs text-gray-500">{status.jobPostId?.user?.email}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 gap-2">
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
    </div>
  );
};

export default AdminApplicantStatusPage;
