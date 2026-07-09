import React from 'react'
import HistorySection from './DashBoard/HistorySection'
import SideBar from './SideBar'





const DashBoard = () => {
  return (
    <div className="flex bg-black">
      <SideBar />
      <HistorySection />
    </div>
  )
}

export default DashBoard