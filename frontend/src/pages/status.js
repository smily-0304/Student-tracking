import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Status() {
   const navigate = useNavigate();
  const [info, setInfo] = useState([]);
  const [branch, setBranch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

useEffect(() => {
  axios.get('http://localhost:4000/view')
    .then(res => {
      const dataWithStatus = res.data.map((student, index) => ({
        ...student,
       
        uniqueId: student._id || student.id || `temp-${index}-${student.Name}`,
        status: "Present" 
      }));
      setInfo(dataWithStatus);
    })
    .catch(err => console.error(err));
}, []);

const handleStatus = async () => {
 
  if (!selectedDate) {
    alert("Please select a date first!");
    return;
  }


  const attendanceData = {
    date: selectedDate,
    technology: branch ,
    students: filteredData.map(s => ({
      name: s.Name,
      status: s.status
    }))
  };

  try {
  
    const response = await axios.post('http://localhost:4000/status', attendanceData);
    if (response.status === 200) {
     
      setIsSubmitted(true)
    
    setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }
    
  } catch (err) {
    console.error("Error submitting attendance:", err);
    alert("Failed to submit attendance.");
  }
};

// Change 'studentName' to 'studentId'
const handleStatusChange = (id, newStatus) => {
  const updatedInfo = info.map((student) => {
    // Match based on a unique ID field from your database
    if (student.uniqueId === id) { 
      return { ...student, status: newStatus };
    }
    return student;
  });
  setInfo(updatedInfo);
};


  const filteredData = info.filter((student) => {
    const matchesBranch = branch === "" || student.Tech.toLowerCase() === branch.toLowerCase();

    return matchesBranch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 px-6 py-12 lg:px-8 text-white">
        <div className="sm:mx-auto sm:w-full ">
                    <button 
                      onClick={() => navigate('/')}
                      className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
                    >
                      <ArrowLeft size={20} /> Back to Dashboard
                    </button>
                    </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400 mb-8">
          Mark Attendance
        </h1>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Filter by Technology</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="block w-full rounded-xl bg-gray-800 border-0 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Technologies</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="frontend">Frontend</option>
             
             
              <option value="AI">AI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="block w-full rounded-xl bg-gray-800 border-0 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

 
        <div className="overflow-hidden shadow-2xl ring-1 ring-white/5 sm:rounded-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">S.No</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student Name</th>

                <th className="px-6 py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Set Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-gray-900">
              {filteredData.length > 0 ? (
                filteredData.map((d, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">{d.Name}</td>
                   
                    <td className="px-6 py-4 text-center">
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d.uniqueId, e.target.value)}
                        className={`text-xs font-bold py-1 px-3 rounded-lg border-0 ring-1 ring-inset focus:ring-2 ${
                          d.status === "Present" 
                            ? "bg-green-900/20 text-green-400 ring-green-500/30 focus:ring-green-500" 
                            : "bg-red-900/20 text-red-400 ring-red-500/30 focus:ring-red-500"
                        }`}
                      >
                        <option value="Present" className="bg-gray-800">Present</option>
                        <option value="Absent" className="bg-gray-800">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                    No students found for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       <div className="mt-8 flex justify-end">
  <button 
    onClick={handleStatus} 
    disabled={isSubmitted}
    className={`font-bold py-3 px-8 rounded-xl transition-all duration-500 shadow-lg active:scale-95 flex items-center gap-2 ${
      isSubmitted 
        ? "bg-green-500 text-white cursor-default" 
        : "bg-indigo-600 hover:bg-indigo-500 text-white"
    }`}
  >
    {isSubmitted ? (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Attendance Saved!
      </>
    ) : (
      "Submit Attendance"
    )}
  </button>
</div>
      </div>
    </div>
  );
}

export default Status;