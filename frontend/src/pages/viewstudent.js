import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewStudent() {
  const navigate = useNavigate();
  const [info, setinfo] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/view")
      .then((res) => {
        setinfo(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:4000/delete/${id}`)
      .then((res) => {
        console.log("Delete Successfully", res.data);
        setinfo((prevInfo) => prevInfo.filter((student) => student._id !== id));
      })
      .catch((err) => {
        console.log("error in delete", err);
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 px-6 py-12 lg:px-8 text-white">
      <div className="max-w-6xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-8 w-fit"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
            <Users className="h-8 w-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Student Directory
            </h2>
            <p className="text-gray-400 text-sm">
              View and manage all registered student records.
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden shadow-2xl ring-1 ring-white/10 rounded-2xl bg-gray-800/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800/80 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    s.no
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    Name of the Student
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    Technology
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    Email ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                    Phone Number
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 bg-gray-900/40">
                {info.length > 0
                  ? info.map((d, key) => (
                      <tr
                        key={key}
                        className="hover:bg-indigo-500/5 transition-colors group"
                      >
                        <td className="px-6 py-4 text-gray-500 font-medium">
                          {key + 1}
                        </td>
                        <td className="px-6 py-4 text-white font-semibold group-hover:text-indigo-300 transition-colors">
                          {d.Name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 rounded-md text-xs font-bold uppercase">
                            {d.Tech}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-medium">
                          {d.EmailId}
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono tracking-tighter">
                          {d.Number}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDelete(d._id)}
                            className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {info.length === 0 && (
            <div className="p-20 text-center">
              <div className="inline-flex p-4 rounded-full bg-gray-800 mb-4">
                <Users className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-500 italic">
                No student records found in the directory.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
