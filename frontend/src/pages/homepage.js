import React, { useEffect } from 'react'; // Added useEffect
import axios from 'axios'; // Added axios
import { UserPlus, Users, CalendarCheck, PieChart, ArrowRight, GraduationCap } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Homepage() {
  const navigate = useNavigate();

  // --- KEEP-ALIVE LOGIC ---
  useEffect(() => {
    // This pings the backend immediately when the homepage loads
    // It uses the /view endpoint just to trigger a response and wake Render up
    const wakeUpServer = async () => {
      try {
        await axios.get('https://student-backend-fjoq.onrender.com/view');
        console.log("✅ Render Backend Keep-Alive: Server is awake!");
      } catch (error) {
        console.log("⏳ Render Backend Keep-Alive: Server is waking up...");
      }
    };

    wakeUpServer();

    // Optional: Set up an interval to ping every 10 minutes while the tab is open
    const interval = setInterval(wakeUpServer, 600000); 
    
    return () => clearInterval(interval); // Clean up on unmount
  }, []);
  // -------------------------

  return (
    <div className="relative isolate min-h-screen bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* Dynamic Background Gradients */}
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-[#6366f1] to-[#a855f7] opacity-30"
        />
      </div>

      {/* Header Section */}
      <div className="mx-auto max-w-4xl text-center">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
            <GraduationCap size={16} /> Advanced Management
          </span>
        </div>
        <h1 className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-7xl">
          Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Attendance</span> Tracking
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
          A high-performance interface designed for educators. Monitor real-time presence and manage student data with precision and ease.
        </p>
      </div>

      {/* Main Grid */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-stretch gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
        
        {/* Card 1: Student Info */}
        <div className="bg-white/5 border-white/10 rounded-3xl p-8 ring-1 transition-all duration-300 hover:scale-[1.02] sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                <UserPlus className="h-8 w-8 text-indigo-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Records</span>
            </div>
            <h3 className="text-2xl font-bold leading-7 text-white">Student Info</h3>
            <p className="mt-4 text-base leading-7 text-gray-400">
              Manage individual profiles, enrollment records, and personal documentation.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <button
              onClick={() => navigate('/add')}
              className="w-full group flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-white/20"
            >
              Add Student Details
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/view')}
              className="w-full block rounded-xl px-4 py-3 text-center text-sm font-bold text-gray-300 ring-1 ring-inset ring-white/10 hover:bg-white/5 transition-all"
            >
              View Student List
            </button>
          </div>
        </div>

        {/* Card 2: Attendance Tracking */}
        <div className="relative bg-gray-800/50 border-indigo-500 shadow-indigo-500/20 rounded-3xl p-8 ring-1 transition-all duration-300 hover:scale-[1.02] sm:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                <CalendarCheck className="h-8 w-8 text-indigo-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Live Status</span>
            </div>
            <h3 className="text-2xl font-bold leading-7 text-white">Attendance Status</h3>
            <p className="mt-4 text-base leading-7 text-gray-400">
              Monitor daily presence, analyze trends, and generate performance reports.
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <button
              onClick={() => navigate('/status')}
              className="w-full group flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-400"
            >
              Attendance Status
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/percentage')}
              className="w-full block rounded-xl px-4 py-3 text-center text-sm font-bold text-gray-300 ring-1 ring-inset ring-white/10 hover:bg-white/5 transition-all"
            >
              Attendance %
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Visual Detail */}
      <div className="mt-16 flex justify-center opacity-50">
        <div className="flex gap-8 text-gray-400 grayscale contrast-125">
          <div className="flex items-center gap-2"><PieChart size={20}/> Analytics Ready</div>
          <div className="flex items-center gap-2"><Users size={20}/> Multi-User Sync</div>
        </div>
      </div>
    </div>
  );
}