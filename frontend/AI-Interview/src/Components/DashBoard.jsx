import React from 'react'
import HistorySection from './DashBoard/HistorySection'
import SideBar from './SideBar'
import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between px-6 py-4 bg-[#111827] border-b border-gray-800">
        <h1 className="text-2xl font-semibold text-gray-100">Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-[#F5F5F0] font-medium rounded-lg transition-colors" onClick={() => navigate("/session-setup")}>
            New Session
          </button>
        </div>
      </div>
    </>
  )
}


const DashBoard = () => {
  return (
    <>
      <div className="flex min-h-screen bg-[#0F1420] relative">
        <div className="flex-shrink-0 sticky top-0 h-full" >
          <SideBar />
        </div>
        
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-6">
            <HistorySection />
          </div>
        </div>
      </div>
    </>

  )
}

export default DashBoard