import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  BuildingOfficeIcon,
  BriefcaseIcon as BriefcaseSolidIcon,
} from "@heroicons/react/24/solid";

import {
  CurrencyRupeeIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  UsersIcon,
  CalendarIcon,
  IdentificationIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const JobDetail = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${API_BASE_URL}/adminjob/jobdetail/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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

  const getDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const iconMap = {
    CTC: <CurrencyRupeeIcon className="w-5 h-5 text-gray-900" />,
    "Experience Required": <BriefcaseIcon className="w-5 h-5 text-gray-900" />,
    "Work Mode": <GlobeAltIcon className="w-5 h-5 text-gray-900" />,
    "No. of Referrals": <UsersIcon className="w-5 h-5 text-gray-900" />,
    "End Date": <CalendarIcon className="w-5 h-5 text-gray-900" />,
    "Job ID": <IdentificationIcon className="w-5 h-5 text-gray-900" />,
  };

  const InfoCard = ({ label, value }) => (
    <div className="flex items-center gap-3 p-2 rounded-xl shadow-md border-2 bg-white text-white hover:scale-[1.02] transition-transform duration-200">
      <div className="bg-white text-gray-900 bg-opacity-20 p-2 rounded-full">
        {iconMap[label]}
      </div>
      <div className="flex flex-col text-gray-900">
        <span className="text-xs font-medium opacity-90">{label}</span>
        <span className="text-sm font-semibold">{value || "N/A"}</span>
      </div>
    </div>
  );

  if (loading) return <p>Loading job details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!jobData) return <p>No job found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      {/* Job Header Card */}
      <div className="flex flex-col md:flex-row items-center gap-6 py-2 w-full mx-auto">
        {/* Company Logo */}
        <div className="w-24 h-24 flex-shrink-0 rounded-full border-4 border-blue-700 bg-blue-100 flex items-center justify-center overflow-hidden shadow-md">
          {/* {!imgError && jobData?.companyLogoUrl ? (
            <img
              src={jobData.companyLogoUrl}
              alt="Company Logo"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <BuildingOfficeIcon className="w-10 h-10 text-blue-600" />
          )} */}
            <BuildingOfficeIcon className="w-10 h-10 text-blue-600" />
        </div>
        <div className="flex flex-col items-start sm:items-start space-y-2 text-left w-full">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BriefcaseSolidIcon className="w-5 h-5 text-blue-600" />
            {jobData?.jobRole || "Role not specified"}
          </h2>

          <span className="text-sm md:text-md font-medium text-gray-800 bg-gray-200 px-4 py-1 rounded-full shadow-sm">
            {jobData?.employmentType || "N/A"}
          </span>
        </div>
      </div>

      {/* Company & Location */}
      <div className="flex mt-4 flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
        <p className="text-md md:text-xl font-bold text-gray-900">
          {jobData?.companyName || "Company not specified"}
        </p>
        <span className="text-sm md:text-md font-normal text-blue-700 bg-blue-100 px-4 py-1 rounded-full shadow-sm">
          {jobData?.location || "N/A"}
        </span>
      </div>

      <hr />

      {/* Info Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8 text-sm md:text-base mb-8">
        <InfoCard label="CTC" value={jobData?.ctc} />
        <InfoCard label="Experience Required" value={`${jobData?.experienceRequired} Years`} />
        <InfoCard label="Work Mode" value={jobData?.workMode} />
        <InfoCard label="No. of Referrals" value={jobData?.noOfReferrals} />
        <InfoCard label="End Date" value={getDate(jobData?.endDate)} />
        <InfoCard label="Job ID" value={jobData?.jobUniqueId} />

        {/* View Job Link */}
        <div className="flex items-center justify-start p-3 border-2 rounded-xl shadow-md bg-white hover:scale-[1.02] transition-transform duration-200">
          <a
            href={jobData?.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-900 font-medium hover:underline"
            title="Open job link in a new tab"
          >
            <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            View Job
          </a>
        </div>
      </div>

      {/* Job Description Section */}
      <div className="mt-4 border-t-2 py-4 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <DocumentTextIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Job Description</h2>
        </div>
        <p
          className="text-gray-700 text-sm md:text-[15px] leading-relaxed whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: jobData?.jobDescription || "No description available for this job." }}
        />
      </div>
    </div>
  );
};

export default JobDetail;
