import React from 'react'
import Sidebar from './SideBar'
import axios from 'axios'
import { useState, useEffect } from 'react'

const Inputvalues = () => {

    useEffect(() => {

        


    }, [])

    return (
        <div className="p-4 border-t border-gray-800 gap-4 flex items-center justify-center bg-gray-900 relative">
            <input
                type="text"
                placeholder="Enter your Answer here..."
                className="w-128 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <select className="mt-2 w-32 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="option1" className='text-black'>Option 1</option>   
                <option value="option2" className='text-black'>Option 2</option>
                <option value="option3" className='text-black'>Option 3</option>
            </select>  
            
            <button className="mt-2 w-24 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors right-2 absolute">
                Submit
            </button>

        

        </div>
    )
}

const Session = () => {
  return (
    <section className="bg-black text-white h-screen w-full flex overflow-hidden">
      <Sidebar />
 
        <div className="flex-1 flex flex-col overflow-hidden">

            <div className="relative flex items-center justify-center h-screen w-full bg-black overflow-hidden">
                {/* Radial gradient glow */}
                <div className="absolute w-[600px] h-[600px] bg-[#5736c6] rounded-full blur-[150px] opacity-40" />

                {/* Content */}
                <h1 className="relative z-10 text-zinc-300 text-5xl md:text-6xl font-bold tracking-tight text-center">
                    Start Your Preparation
                </h1>
            </div>


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