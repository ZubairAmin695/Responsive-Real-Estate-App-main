import React, { useEffect } from 'react'
import { service } from '../components/export'
import { useDarkMode } from '../components/DarkModeContext'
import AOS from 'aos'
import 'aos/dist/aos.css'


const Services = () => {

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, [])

  const { darkMode, toggleDarkMode } = useDarkMode();


  return (
    <div className={`${darkMode ? 'dark bg-black' : 'light bg-transparent'} pb-20`}>

      <section id='services' className={`${darkMode ? 'dark bg-gray-800' : 'light bg-red-100'} lg:w-[95%] w-full
        h-fit m-auto rounded-xl flex flex-col justify-center items-start lg:px-20 px-6 py-20 gap-20`}>

        <div className='flex flex-col justify-center items-start gap-4'>
          <h1 data-aos="zoom-in" className='text-red-500 dark:text-white'>OUR SERVICE</h1>
          <h1 data-aos="zoom-in" className='text-black text-[40px] font-semibold leading-10 dark:text-white'>
            Top Real Estate <br /> Service Available</h1>

        </div>

        <div id='service-box' className='grid lg:grid-cols-3 grid-cols-1 justify-center items-center gap-8'>
          {
            service.map((item, index) => (
              <div data-aos="zoom-in" data-aos-delay="200" key={index} className='bg-white 
               dark:bg-black h-[350px] px-8 py-16 flex flex-col justify-center items-start gap-4 rounded-xl
               border-b-[5px] border-blue-600 hover:bg-blue-300 cursor-pointer'>

                <div className='p-6 rounded-full bg-blue-200'>
                  <item.icon className='text-blue-600 size-10 transform hover:scale-110 transition-transform 
                    duration-300 cursor-pointer' />
                </div>

                <h1 className='text-black text-[22px] font-semibold dark:text-white' >{item.title}</h1>

                <p className='text-lg text-slate-700 dark:text-white'>{item.desc}</p>

                <button className='border-b-2 border-blue-600 text-blue-600 font-semibold p-0 dark:text-white'>READ MORE</button>
              </div>
            ))
          }
        </div>

        




      </section>

    </div>
  )
}

export default Services
