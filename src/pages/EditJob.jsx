import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import DOMPurify from 'dompurify';
import { LocationExport } from "./Location";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Refs for Quill editor
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const quillInitializedRef = useRef(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/adminjob/jobdetail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch job details");
        const data = await res.json();
        setJobData(data.jobPost);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [API_BASE_URL, id]);

  // Quill editor setup and sync with jobData.jobDescription
  useEffect(() => {
    if (quillRef.current && !quillInitializedRef.current) {
      try {
        quillRef.current.style.direction = 'ltr';
        quillRef.current.style.textAlign = 'left';
        quillRef.current.setAttribute('dir', 'ltr');
        quillRef.current.classList.add('ltr-quill-container');

        editorRef.current = new Quill(quillRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike"],
              ["link"],
              [{ align: [] }],
              [{ indent: "-1" }, { indent: "+1" }],
              ["clean"],
            ],
          },
        });

        editorRef.current.root.style.direction = 'ltr';
        editorRef.current.root.style.textAlign = 'left';
        editorRef.current.root.setAttribute('dir', 'ltr');

        if (jobData?.jobDescription) {
          editorRef.current.clipboard.dangerouslyPasteHTML(0, jobData.jobDescription);
          editorRef.current.formatText(0, editorRef.current.getLength(), 'direction', 'ltr');
        }

        const handleTextChange = () => {
          const updatedContent = editorRef.current.root.innerHTML;
          const sanitizedContent = DOMPurify.sanitize(updatedContent);
          if (jobData?.jobDescription !== sanitizedContent) {
            setJobData(prev => ({ ...prev, jobDescription: sanitizedContent }));
          }
        };

        editorRef.current.on('text-change', handleTextChange);

        quillInitializedRef.current = true;
      } catch (error) {
        console.error('Error initializing Quill:', error);
      }
    }

    if (editorRef.current && jobData?.jobDescription) {
      const currentContent = editorRef.current.root.innerHTML;
      if (currentContent !== jobData.jobDescription) {
        try {
          editorRef.current.off('text-change');
          editorRef.current.setContents([]);
          editorRef.current.clipboard.dangerouslyPasteHTML(0, jobData.jobDescription);
          editorRef.current.formatText(0, editorRef.current.getLength(), 'direction', 'ltr');
          editorRef.current.on('text-change', () => {
            const updatedContent = editorRef.current.root.innerHTML;
            const sanitizedContent = DOMPurify.sanitize(updatedContent);
            if (jobData?.jobDescription !== sanitizedContent) {
              setJobData(prev => ({ ...prev, jobDescription: sanitizedContent }));
            }
          });
        } catch (error) {
          console.error('Error setting content:', error);
        }
      }
    }
  }, [jobData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_BASE_URL}/adminjob/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update job");
      }

      setSuccessMsg("Job updated successfully!");
      navigate("/jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!jobData) return <p>No job found.</p>;
  


  
  function getDate(endDate_param) {
    var tempDate = endDate_param + "";
    var date = '';
    for (let i = 0; i < tempDate.length; i++) {
      if (/^[a-zA-Z]$/.test(tempDate[i]))
        break;
      else
        date += tempDate[i];
    }
    return date;
  }


   // Handle location input change
  const handlelocationChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));

    if (name === "location") {
      if (value.length > 0) {
        // Filter suggestions that start with or contain the input value (case insensitive)
        const filtered = LocationExport.filter(({ city, state }) => {
          const searchTerm = value.toLowerCase();
          return (
            city.toLowerCase().includes(searchTerm) ||
            state.toLowerCase().includes(searchTerm)
          );
        });
        setLocationSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  // When user clicks a suggestion, fill input and close suggestion box
  const handleSuggestionClick = (city, state) => {
    setJobData((prev) => ({ ...prev, location: `${city}, ${state}` }));
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>

      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Role */}
        <div>
          <label htmlFor="jobRole" className="block font-medium mb-1">
            Job Role
          </label>
          <input
            type="text"
            id="jobRole"
            name="jobRole"
            value={jobData.jobRole || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block font-medium mb-1">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={jobData.companyName || ""}
            onChange={handleChange}
            required
            disabled
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Company Logo URL */}
        <div>
          <label htmlFor="companyLogoUrl" className="block font-medium mb-1">
            Company Logo URL
          </label>
          <input
            type="url"
            id="companyLogoUrl"
            name="companyLogoUrl"
            value={jobData.companyLogoUrl || ""}
            onChange={handleChange}
            disabled
            placeholder="https://example.com/logo.png"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
  <label htmlFor="status" className="block font-medium mb-1">
    Status
  </label>
  <select
    id="status"
    name="status"
    value={jobData.status || "active"}  // default to active if none
    onChange={handleChange}
    className="w-full px-3 py-2 border rounded"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
    
  </select>
</div>


        {/* Location */}
        <div>
      <label htmlFor="location" className="block font-medium mb-1">
        Location
      </label>
      <input
        type="text"
        id="location"
        name="location"
        autoComplete="off"
        value={jobData.location || ""}
        onChange={handlelocationChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click
        onFocus={() => {
          if (locationSuggestions.length > 0) setShowSuggestions(true);
        }}
        className="w-full px-3 py-2 border rounded"
      />

      {showSuggestions && locationSuggestions.length > 0 && (
        <ul className="border rounded mt-1 max-h-48 overflow-auto bg-white shadow-md z-10 absolute w-full">
          {locationSuggestions.map(({ city, state }, idx) => (
            <li
              key={`${city}-${idx}`}
              onClick={() => handleSuggestionClick(city, state)}
              className="cursor-pointer px-3 py-2 hover:bg-blue-100"
            >
              {city}, {state}
            </li>
          ))}
        </ul>
      )}
    </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="block font-medium mb-1">
            Employment Type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={jobData.employmentType || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select type</option>
             <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
          </select>
        </div>

        {/* CTC */}
        <div>
          <label htmlFor="ctc" className="block font-medium mb-1">
            CTC
          </label>
             <select
                  id="ctc"
                  name="ctc"
                  value={jobData?.ctc}
                  onChange={handleChange}

                 className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Select CTC</option>
                  <option value="3-5 LPA">3-5 LPA</option>
                  <option value="5-8 LPA">5-8 LPA</option>
                  <option value="8-12 LPA">8-12 LPA</option>
                  <option value="12-15 LPA">12-15 LPA</option>
                  <option value="15-20 LPA">15-20 LPA</option>
                  <option value="20-25 LPA">20-25 LPA</option>
                  <option value="25+ LPA">25+ LPA</option>
                </select>
        </div>

        {/* Experience Required */}
        <div>
          <label htmlFor="experienceRequired" className="block font-medium mb-1">
            Experience Required (Years)
          </label>
          <input
            type="number"
            id="experienceRequired"
            name="experienceRequired"
            value={jobData.experienceRequired || ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Work Mode */}
        <div>
          <label htmlFor="workMode" className="block font-medium mb-1">
            Work Mode
          </label>
          <select
            id="workMode"
            name="workMode"
            value={jobData.workMode || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select mode</option>
             <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Number of Referrals */}
        <div>
          <label htmlFor="noOfReferrals" className="block font-medium mb-1">
            Number of Referrals
          </label>
          <input
            type="number"
            id="noOfReferrals"
            name="noOfReferrals"
            value={jobData.noOfReferrals || ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={getDate(jobData?.endDate)}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Job Unique ID */}
        <div>
          <label htmlFor="jobUniqueId" className="block font-medium mb-1">
            Job Unique ID
          </label>
          <input
            type="text"
            id="jobUniqueId"
            name="jobUniqueId"
            value={jobData.jobUniqueId || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Job Link */}
        <div>
          <label htmlFor="jobLink" className="block font-medium mb-1">
            Job Link (URL)
          </label>
          <input
            type="url"
            id="jobLink"
            name="jobLink"
            value={jobData.jobLink || ""}
            onChange={handleChange}
            placeholder="https://example.com/job-post"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="jobDescription" className="block font-medium mb-1">
            Job Description
          </label>
                {/* Quill container with inline styles */}
                <div ref={quillRef} className="quill-editor" style={{
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
                  direction: "ltr"

                }}>
                    
                </div>
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
