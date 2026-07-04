import React from 'react'
import Sidebar from './SideBar'

const Inputvalues = () => {
  return (
    <div className="p-4 border-t border-gray-800">
      <input
        type="text"
        placeholder="Enter your Answer here..."
        className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

const Session = () => {
  return (
    <section className="bg-black text-white h-screen w-full flex overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main scrollable content — question, transcript, etc */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* your question / interview content goes here */}
        </div>

        {/* Input pinned to bottom */}
        <Inputvalues />
      </div>
    </section>
  )
}

export default Session