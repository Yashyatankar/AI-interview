import React from 'react'

const HistorySection = () => {
  return (
    <>
        <section className='w-full  flex flex-col gap-4 p-4 bg-[#0F1420] rounded-lg mt-4'>

            <div  className='w-full flex justify-between items-center pb-4 border-b border-gray-700 pl-3'>
                <div>

                    <h1 className='text-xl font-semibold text-[#F5F5F0] mb-0.5'>
                        Recent Interview Sessions
                    </h1>
                    <p className="text-sm text-gray-400">A detailed history of your past assessments</p>

                </div>
                <div className='flex items-center gap-2 cursor-pointer pr-4'>
                    <h1 className='text-sm text-[#6366F1] font-semibold hover:text-blue-400'>
                        View History &rarr;
                    </h1>
                </div>
            </div>
            

        </section>
    
    </>
  )
}

export default HistorySection