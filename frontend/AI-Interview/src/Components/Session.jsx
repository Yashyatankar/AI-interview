import React from 'react';
import Sidebar from './SideBar';
import Select from 'react-select';

const InputValues = () => {
  return (
    <div className="p-4 border-t border-gray-800 bg-gray-950">
      <div className="relative max-w-4xl mx-auto flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter your Answer here..."
          className="flex-1 p-3 pl-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all active:scale-95">
          Submit
        </button>
      </div>
    </div>
  );
};

const Session = () => {
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];

  return (
    <section className="bg-black text-white h-screen w-full flex overflow-hidden font-sans">
      {/* Sidebar - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-950">
        
        {/* Header / Top Bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-200">Interview Session</h2>
            <Select
                options={options}
                placeholder="Flavor..."
                className="w-full sm:w-48"
                classNamePrefix="rs"
                unstyled
                menuPlacement="top"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                classNames={{
                    control: (state) =>
                        `rounded-md border px-1 py-0.5 bg-gray-800 border-gray-600 hover:border-gray-500 ${
                            state.isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''
                        }`,
                    placeholder: () => 'text-gray-400',
                    singleValue: () => 'text-white',
                    input: () => 'text-white',
                    menu: () => 'mb-1 rounded-md bg-gray-800 border border-gray-700 shadow-lg overflow-hidden z-20',
                    option: (state) =>
                        `px-3 py-2 cursor-pointer ${
                            state.isFocused ? 'bg-blue-600 text-white' : 'text-gray-200'
                        } ${state.isSelected ? 'bg-blue-500 text-white' : ''}`,
                    dropdownIndicator: () => 'text-gray-400 hover:text-white px-2',
                    indicatorSeparator: () => 'bg-gray-600',
                    clearIndicator: () => 'text-gray-400 hover:text-white px-1',
                }}
            />
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Hero Section */}
            <div className="relative flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-900/20 rounded-full blur-[120px]" />
              <h1 className="relative z-10 text-4xl md:text-7xl font-bold tracking-tight text-white mb-4">
                Start Your Preparation
              </h1>
              <p className="text-gray-400 max-w-md">
                Select a flavor profile above and answer the questions to begin your evaluation.
              </p>
            </div>

            {/* Content area for dynamic Q&A */}
            <div className="space-y-4">
              {/* Example Question Card */}
              <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
                <h3 className="text-xl font-semibold mb-2">Question 1</h3>
                <p className="text-gray-300">How do you handle state management in a large-scale React application?</p>
              </div>
            </div>
          </div>
        </main>

        {/* Input Area pinned to bottom */}
        <InputValues />
      </div>
    </section>
  );
};

export default Session;