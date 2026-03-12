import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Percentage() {
   const navigate = useNavigate();
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    tech: "",
  });
  const [reportData, setReportData] = useState([]);

  const handleFetch = async (e) => {
    e.preventDefault();
    try {
     
      const res = await axios.get("https://student-backend-fjoq.onrender.com/report", {
        params: filters,
      });
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching report", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      
       <div className="sm:mx-auto sm:w-full ">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
              >
                <ArrowLeft size={20} /> Back to Dashboard
              </button>
              </div>
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">
          Attendance Percentage Report
        </h2>

        <form
          onSubmit={handleFetch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <input
            type="date"
            className="bg-gray-700 p-2 rounded border-0"
            onChange={(e) =>
              setFilters({ ...filters, fromDate: e.target.value })
            }
            required
          />
          <input
            type="date"
            className="bg-gray-700 p-2 rounded border-0"
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            required
          />
          <select
            className="bg-gray-700 p-2 rounded border-0"
            onChange={(e) => setFilters({ ...filters, tech: e.target.value })}
          >
            
            <option value="">All Tech</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="frontend">Frontend</option>
            <option value='AI'>AI</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-bold"
          >
            Generate
          </button>
        </form>

        <div className="overflow-hidden shadow-2xl ring-1 ring-white/5 sm:rounded-xl mt-6">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Student Name
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Days Present
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900">
              {reportData.length > 0 ? (
                reportData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-white">
                      {item._id}
                    </td>

                    {/* Displaying 3 / 5 format here */}
                    <td className="px-6 py-4 text-center text-sm font-medium text-indigo-300">
                      <span className="text-xl font-bold text-white">
                        {item.presentDays}
                      </span>
                      <span className="mx-1 text-gray-500">/</span>
                      <span>{item.totalDays}</span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`text-sm font-bold px-3 py-1 rounded-full ${
                          item.presentDays / item.totalDays >= 0.75
                            ? "bg-green-900/20 text-green-400"
                            : "bg-red-900/20 text-red-400"
                        }`}
                      >
                        {((item.presentDays / item.totalDays) * 100).toFixed(0)}
                        %
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    No report data available for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
