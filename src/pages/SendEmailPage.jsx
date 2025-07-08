import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendEmailPage = () => {
  const [emailInput, setEmailInput] = useState("");
  const [recipients, setRecipients] = useState([]);
  const [subject, setSubject] = useState("");

  const templateName = "share_referral.html";

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (!email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (recipients.includes(email)) {
      toast.warning("Email already added.");
      return;
    }
    setRecipients([...recipients, email]);
    setEmailInput("");
  };

  const handleRemoveEmail = (emailToRemove) => {
    setRecipients((prev) => prev.filter((e) => e !== emailToRemove));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Unauthorized. Please log in as admin.");
      return;
    }

    if (recipients.length === 0) {
      toast.error("Please add at least one recipient.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/adminemail/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipients,
          subject,
          templateName,
          replacements: {},
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Email sending failed.");

      toast.success("Emails sent successfully!");
      setRecipients([]);
      setSubject("");
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Send Templated Email</h2>

      <form onSubmit={handleSendEmail} className="space-y-4">
        {/* Email input with add button */}
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter email and click Add"
            className="flex-1 p-2 border rounded"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddEmail}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Email
          </button>
        </div>

        {/* Display added emails */}
        {recipients.length > 0 && (
          <div className="bg-gray-50 p-3 border rounded text-sm">
            <p className="mb-2 font-medium">Recipients:</p>
            <ul className="flex flex-wrap gap-2">
              {recipients.map((email) => (
                <li
                  key={email}
                  className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded"
                >
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    className="ml-2 text-red-600 font-bold hover:text-red-800"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <input
          type="text"
          placeholder="Subject"
          className="w-full p-2 border rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />

        <input
          type="text"
          value={templateName}
          readOnly
          className="w-full p-2 border rounded bg-gray-100 text-gray-700 cursor-not-allowed"
          title="Template name (fixed)"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Send Email
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default SendEmailPage;
