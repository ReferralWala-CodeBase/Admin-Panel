import React, { useState } from 'react';

const AdminSendNotification = () => {
  const [message, setMessage] = useState('');
  const [postId, setPostId] = useState('');
  const [userIds, setUserIds] = useState(''); // comma-separated
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState('');
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('adminToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg('');
    setError('');

    const payload = {
      message,
    };

    if (postId.trim()) payload.postId = postId.trim();

    const idsArray = userIds
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '');

    if (idsArray.length > 0) {
      payload.userIds = idsArray;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/notification/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send notifications');

      setResponseMsg(data.message || 'Notifications sent successfully');
      setMessage('');
      setPostId('');
      setUserIds('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Send Notification</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Notification Message</label>
          <textarea
            className="w-full border rounded p-2"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Post ID (optional)</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Target User IDs (comma-separated, optional)
          </label>
          <input
            type="text"
            className="w-full border rounded p-2"
            placeholder="Leave empty to send to all users"
            value={userIds}
            onChange={(e) => setUserIds(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !message.trim()}
        >
          {loading ? 'Sending...' : 'Send Notification'}
        </button>

        {responseMsg && (
          <p className="text-green-600 font-medium mt-2">{responseMsg}</p>
        )}
        {error && <p className="text-red-600 font-medium mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default AdminSendNotification;
