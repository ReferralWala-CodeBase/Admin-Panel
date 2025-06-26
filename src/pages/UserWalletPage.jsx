import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

const FILTERS = ['All', 'Reward', 'Spend', 'Withdraw', 'Refund', 'Purchase'];

const UserWalletPage = () => {
  const { userId } = useParams();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const walletRes = await fetch(`${API_BASE_URL}/adminwallet/userwallet/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const txRes = await fetch(`${API_BASE_URL}/adminwallet/userwallet/${userId}/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!walletRes.ok || !txRes.ok) throw new Error("Failed to load wallet data");

        const walletData = await walletRes.json();
        const transactionData = await txRes.json();

        setWallet(walletData.wallet);
        setTransactions(transactionData.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [userId]);

  useEffect(() => {
    const filterTx = () => {
      const allEntries = transactions.flatMap(tx =>
        tx.history.map(h => ({
          ...h,
          transactionId: tx._id,
          userId: tx.userId,
        }))
      );

      if (selectedFilter === 'All') {
        setFiltered(allEntries);
      } else {
        setFiltered(allEntries.filter(entry => entry.type?.toLowerCase() === selectedFilter.toLowerCase()));
      }
    };

    filterTx();
  }, [selectedFilter, transactions]);

  if (loading) return <p className="text-gray-600">Loading wallet...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Wallet Overview</h2>

      {/* Wallet Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-4 border">
          <h4 className="text-sm text-gray-500">Coins</h4>
          <p className="text-xl font-semibold text-emerald-600">{wallet?.coins}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4 border">
          <h4 className="text-sm text-gray-500">Blocked Coins</h4>
          <p className="text-xl font-semibold text-yellow-500">{wallet?.blockedCoins}</p>
        </div>
        {/* <div className="bg-white shadow rounded-xl p-4 border">
          <h4 className="text-sm text-gray-500">Total Transactions</h4>
          <p className="text-xl font-semibold text-indigo-500">{transactions.length}</p>
        </div> */}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-4 flex-wrap">
        {FILTERS.map(type => (
          <button
            key={type}
            className={classNames(
              "px-4 py-2 rounded-full text-sm border font-medium",
              selectedFilter === type
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            )}
            onClick={() => setSelectedFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No transactions found for this filter.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="py-2 px-4 border-b text-left">Transaction ID</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Balance After</th>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{entry.transactionId}</td>
                  <td className="py-2 px-4 border-b capitalize">{entry.type}</td>
                  <td className="py-2 px-4 border-b">₹{entry.amount}</td>
                  <td className={`py-2 px-4 border-b font-medium ${
                    entry.status === 'success'
                      ? 'text-green-600'
                      : entry.status === 'failed'
                      ? 'text-red-500'
                      : 'text-yellow-600'
                  }`}>
                    {entry.status}
                  </td>
                  <td className="py-2 px-4 border-b">{entry.balanceAfter ?? '—'}</td>
                  <td className="py-2 px-4 border-b">{entry.description || '—'}</td>
                  <td className="py-2 px-4 border-b">{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserWalletPage;


{/* Grouped Transactions by Transaction ID */}
// {transactions.length === 0 ? (
//   <p className="text-gray-500">No transactions found.</p>
// ) : (
//   <div className="space-y-6">
//     {transactions.map((tx, idx) => {
//       const filteredEntries = selectedFilter === 'All'
//         ? tx.history
//         : tx.history.filter(h => h.type?.toLowerCase() === selectedFilter.toLowerCase());

//       if (filteredEntries.length === 0) return null;

//       return (
//         <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden shadow">
//           <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
//             Transaction ID: <span className="text-blue-600">{tx._id}</span>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm bg-white">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-left">Type</th>
//                   <th className="px-4 py-2 text-left">Amount</th>
//                   <th className="px-4 py-2 text-left">Status</th>
//                   <th className="px-4 py-2 text-left">Balance After</th>
//                   <th className="px-4 py-2 text-left">Description</th>
//                   <th className="px-4 py-2 text-left">Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEntries.map((entry, i) => (
//                   <tr key={i} className="border-t hover:bg-gray-50">
//                     <td className="px-4 py-2 capitalize">{entry.type}</td>
//                     <td className="px-4 py-2">₹{entry.amount}</td>
//                     <td className={`px-4 py-2 font-medium ${
//                       entry.status === 'success'
//                         ? 'text-green-600'
//                         : entry.status === 'failed'
//                         ? 'text-red-500'
//                         : 'text-yellow-600'
//                     }`}>
//                       {entry.status}
//                     </td>
//                     <td className="px-4 py-2">{entry.balanceAfter ?? '—'}</td>
//                     <td className="px-4 py-2">{entry.description || '—'}</td>
//                     <td className="px-4 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// )}
