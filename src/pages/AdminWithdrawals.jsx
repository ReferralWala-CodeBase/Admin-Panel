import React, { useEffect, useState } from 'react';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [description, setDescription] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/adminwallet/userwithdrawals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch withdrawals');
      const data = await res.json();
      setWithdrawals(data.withdrawals || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (transactionId, action) => {
    setCurrentAction(action);
    setCurrentTransactionId(transactionId);
    setDescription('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/adminwallet/userwithdraw/process`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: currentTransactionId,
          action: currentAction,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed');

      alert(`Withdrawal ${currentAction}ed successfully`);
      setShowModal(false);
      fetchWithdrawals();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  if (loading) return <p>Loading withdrawals...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Withdrawal Requests</h2>
      {withdrawals.length === 0 ? (
        <p>No withdrawal requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">User</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">UPI ID</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Timestamp</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{w.user?.firstName} {w.user?.lastName}</td>
                  <td className="py-2 px-4 border-b">{w.user?.email}</td>
                  <td className="py-2 px-4 border-b">{w.upiId}</td>
                  <td className="py-2 px-4 border-b">₹{w.amount}</td>
                  <td className={`py-2 px-4 border-b font-medium ${
                    w.status === 'success' ? 'text-green-600' :
                    w.status === 'failed' ? 'text-red-500' : 'text-yellow-600'
                  }`}>
                    {w.status}
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(w.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    {w.status === 'pending' && (
                      <>
                        <button
                          onClick={() => openModal(w.transactionId, 'approve')}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => openModal(w.transactionId, 'reject')}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2 capitalize">
              Confirm {currentAction} Withdrawal
            </h3>
            <p className="text-sm mb-4">
              Please provide a description for this action (optional):
            </p>
            <textarea
              className="w-full border rounded-md p-2 mb-4 text-sm"
              rows={3}
              placeholder={`E.g. ${currentAction === 'reject' ? 'Incorrect UPI ID' : 'Paid via UPI'}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 text-sm text-white rounded ${
                  currentAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
