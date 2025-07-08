import React, { useEffect, useState } from 'react';

const AdminContactPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const token = localStorage.getItem('adminToken');

 const fetchMessages = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/contact/getmsg`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Failed to fetch contact messages');

    const data = await res.json();
    setMessages(data.data || []);
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us Messages</h1>
      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No contact messages found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Mobile</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{msg.firstName} {msg.lastName}</td>
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3">{msg.mobile}</td>
                  <td className="p-3">{msg.message}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
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

export default AdminContactPage;
