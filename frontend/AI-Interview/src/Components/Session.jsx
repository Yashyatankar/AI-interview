import React from 'react'
import Sidebar from './SideBar'
import axios from 'axios'
import Select from 'react-select'

const Inputvalues = () => {

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    return (
        <div className="p-4 border-t border-gray-800 gap-4 flex items-center justify-center bg-gray-900 relative">
            <input
                type="text"
                placeholder="Enter your Answer here..."
                className="w-128 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            Since your app already uses Tailwind, the cleanest way to style react-select responsively is with the unstyled prop + classNames API (available in react-select v5+) instead of the old styles object — it lets Tailwind classes drive everything, including responsive breakpoints.
jsximport React from 'react'
import Select from 'react-select'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const Inputvalues = () => {
    return (
        <div className="p-4 border-t border-gray-800 gap-4 flex flex-col sm:flex-row items-center justify-center bg-gray-900 relative">
            <input
                type="text"
                placeholder="Enter your Answer here..."
                className="w-full sm:w-96 md:w-128 p-2 rounded-md border border-gray-300 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <Select
                options={options}
                placeholder="Flavor..."
                className="w-full sm:w-48"
                classNamePrefix="rs"
                unstyled
                classNames={{
                    control: (state) =>
                        `rounded-md border px-1 py-0.5 bg-gray-800 border-gray-600 hover:border-gray-500 ${
                            state.isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
                        }`,
                    placeholder: () => 'text-gray-400',
                    singleValue: () => 'text-white',
                    input: () => 'text-white',
                    menu: () => 'mt-1 rounded-md bg-gray-800 border border-gray-700 shadow-lg overflow-hidden z-20',
                    option: (state) =>
                        `px-3 py-2 cursor-pointer ${
                            state.isFocused ? 'bg-blue-600 text-white' : 'text-gray-200'
                        } ${state.isSelected ? 'bg-blue-500 text-white' : ''}`,
                    dropdownIndicator: () => 'text-gray-400 hover:text-white px-2',
                    indicatorSeparator: () => 'bg-gray-600',
                    clearIndicator: () => 'text-gray-400 hover:text-white px-1',
                }}
            />
            
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