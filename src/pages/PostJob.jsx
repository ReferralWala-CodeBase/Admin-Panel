import React, { useState ,useRef,useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import DOMPurify from 'dompurify';
import { LocationExport } from "./Location";

const PostJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
  const user = location?.state?.user;

       const quillRef = useRef(null);  // Reference for the Quill container
      const editorRef = useRef(null);  // Quill editor instance
      const initializedRef = useRef(false);  // Track if Quill has been initialized
    
          useEffect(() => {
        if (quillRef.current && !initializedRef.current) {
    
    
          // Create a custom stylesheet to override Quill's default styles
          const styleSheet = document.createElement("style");
          styleSheet.textContent = `
            .ql-editor { 
              direction: ltr !important;
              text-align: left !important;
              position: relative !important;
            }
            .ql-editor p {
              position: relative !important;
              display: block !important;
            }
          `;
          document.head.appendChild(styleSheet);
    
          editorRef.current = new Quill(quillRef.current, {
            theme: "snow",
            modules: {
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline", "strike"],
                ["link"],
                [{ align: [] }],
                // Removed RTL option
                [{ indent: "-1" }, { indent: "+1" }],
                ["clean"],
              ],
            },
          });
    
          // Force paragraph tags to use block display
          editorRef.current.clipboard.addMatcher('p', (node, delta) => {
            delta.attributes = delta.attributes || {};
            delta.attributes.style = 'display: block; position: relative;';
            return delta;
          });
    
          initializedRef.current = true;
          editorRef.current.on("text-change", handleEditorChange);
    
          if (formData.jobDescription) {
            editorRef.current.root.innerHTML = formData.jobDescription;
          }
        }
      }, []);

       
      // 🟢 Handle content changes in Quill Editor
      const handleEditorChange = () => {
        if (!editorRef.current) return;
    
        const updatedContent = editorRef.current.root.innerHTML;
        const sanitizedContent = DOMPurify.sanitize(updatedContent);
    
        // Only update state if content has changed to prevent unnecessary re-renders
        if (formData?.jobDescription !== sanitizedContent) {
          setFormData((prev) => ({
            ...prev,
            jobDescription: sanitizedContent,
          }));
        }
      }

  const initialFormData = {
    userId: user?._id || "",
    jobRole: "",
    jobUniqueId: "",
    endDate: "",
    companyName: user?.presentCompany?.companyName || "",
    companyLogoUrl: user?.presentCompany?.companyLogoUrl || "",
    jobDescription: "",
    experienceRequired: "",
    location: "",
      workMode: 'remote',
    employmentType: 'full-time',
    ctc: "",
    noOfReferrals: 1,
    jobLink: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-10 text-center">
        <p className="text-red-600 font-semibold">No user data provided. Please go back and select a user.</p>
      </div>
    );
  }

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('adminToken'); 
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/adminjob/create-job`, {
        method: "POST",
         headers: {
          Authorization: `Bearer ${token}`,   
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Job creation failed");

      alert("Job posted successfully!");
      navigate("/jobs");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };


  
     // Handle location input change
    const handlelocationChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
  
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
      setFormData((prev) => ({ ...prev, location: `${city}, ${state}` }));
      setLocationSuggestions([]);
      setShowSuggestions(false);
    };



   
   
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md mt-6 rounded-md">
      <h2 className="text-2xl font-bold mb-6">
        Post a Job for {user.firstName} {user.lastName}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">Job Role</label>
          <input name="jobRole" value={formData.jobRole} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block font-medium mb-1">Job Unique ID</label>
          <input name="jobUniqueId" value={formData.jobUniqueId} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

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

        <div>
          <label className="block font-medium mb-1">Experience Required (Years)</label>
          <input type="number" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

         <div>
      <label htmlFor="location" className="block font-medium mb-1">
        Location
      </label>
      <input
        type="text"
        id="location"
        name="location"
        autoComplete="off"
        value={formData.location || ""}
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

        <div>
          <label className="block font-medium mb-1">Work Mode</label>
          <select name="workMode" value={formData.workMode} onChange={handleChange} className="w-full border px-3 py-2 rounded">
               <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Employment Type</label>
          <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full border px-3 py-2 rounded">
           <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">CTC</label>
           <select
                  id="ctc"
                  name="ctc"
                  value={formData?.ctc}
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

        <div>
          <label className="block font-medium mb-1">No. of Referrals</label>
          <input type="number" name="noOfReferrals" value={formData.noOfReferrals} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

        <div>
          <label className="block font-medium mb-1">Job Link</label>
          <input name="jobLink" value={formData.jobLink} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </div>

  <div className="mb-6 border p-4 rounded bg-gray-50 flex items-center gap-4">
      <img
        src={formData.companyLogoUrl}
        alt="Company Logo"
        className="w-16 h-16 object-contain rounded bg-white border"
      />
      <div>
        <p className="text-lg font-semibold">{formData.companyName}</p>
        <p className="text-sm text-gray-600">User ID: {formData.userId}</p>
      </div>
    </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
