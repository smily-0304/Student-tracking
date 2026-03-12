import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react'; // Added CheckCircle icon

function AddStudent() {
  const navigate = useNavigate();
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [email, setEmail] = useState('')
  const [branch, setBranch] = useState('python')
  // New state for button feedback
  const [isSubmitted, setIsSubmitted] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault();
  
 
  setIsSubmitted(true); 
  
  const data = { Name: name, Number: number, EmailId: email, Tech: branch };

  try {
    await axios.post('https://student-backend-fjoq.onrender.com/add', data);
    console.log("Success");

    // Keep the success state for 3 seconds, then reset
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);

  } catch (error) {
    console.error("Submission failed:", error);
    // 2. If it fails, turn the button back to Indigo immediately
    setIsSubmitted(false);
    alert("Backend Error: Is your server running on port 4000?");
  }
};

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full ">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-6"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                <UserPlus className="h-10 w-10 text-indigo-400" />
            </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
          Add New Student
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter the details to register a student in the tracking system.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800/50 p-8 rounded-3xl ring-1 ring-white/10 shadow-xl">
          {/* Form inputs remain the same... */}
          <div>
            <label className="block text-sm font-medium text-gray-200">Full Name</label>
            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} required placeholder="John Doe"
              className="mt-2 block w-full rounded-xl bg-gray-800 border-0 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Mobile Number</label>
            <input type="text" value={number} onChange={(e)=>setNumber(e.target.value)} required placeholder="91+"
              className="mt-2 block w-full rounded-xl bg-gray-800 border-0 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Email address</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder="student@gmail.com"
              className="mt-2 block w-full rounded-xl bg-gray-800 border-0 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Technology</label>
            <select value={branch} onChange={(e)=>setBranch(e.target.value)}
              className="mt-2 block w-full rounded-xl bg-gray-800 border-0 px-4 py-3 text-white ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="frontend">Frontend</option>
              <option value="AI">AI</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitted}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 ${
                isSubmitted 
                ? "bg-green-600 shadow-green-500/20" 
                : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
              }`}
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 size={18} />
                  Student Registered!
                </>
              ) : (
                "Register Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddStudent