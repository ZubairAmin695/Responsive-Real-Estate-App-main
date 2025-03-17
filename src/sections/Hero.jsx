import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../components/DarkModeContext';
import heroimg from '../assets/images/hero1.webp';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Hero = ({ properties, setFilteredProperties }) => {
  const [location, setLocation] = useState('');
  const [rooms, setRooms] = useState('');
  const [area, setArea] = useState('');

  useEffect(() => {
    AOS.init({
      offset: 200,
      duration: 800,
      easing: 'ease-in-sine',
      delay: 100,
    });
  }, []);

  const { darkMode, toggleDarkMode } = useDarkMode();

  const handleSearch = () => {
    const filtered = properties.filter(property => {
      return (
        (location === '' || property.property_address.toLowerCase().includes(location.toLowerCase())) &&
        (rooms === '' || property.property_beds.toString() === rooms) &&
        (area === '' || property.property_area.toString() === area)
      );
    });
    setFilteredProperties(filtered);
  };

  const handleClearFilters = () => {
    setLocation('');
    setRooms('');
    setArea('');
    setFilteredProperties(properties);
  };

  return (
    <>
      <div className={`${darkMode ? 'dark bg-black' : 'light bg-white'}`}>
        <section id='hero' className='w-[95%] h-[600px] m-auto bg-cover bg-center rounded-xl
         flex justify-center flex-col items-start lg:px-28 px-10 gap-7 z-20'
          style={{ backgroundImage: `url(${heroimg})` }}>
          <h1 data-aos="zoom-in" className="text-6xl text-white font-samibold
           lg:pr-[500px] pr-0 lg:leading-[70px] leading-[60px]">Find Your Next Home in Lahore</h1>
          <p data-aos="zoom-in" className='text-white text-xl lg:pr-[500px] pr-0'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia unde incidunt pariatur ipsum
            voluptatum, aut nulla fugiat ducimus atque veniam excepturi soluta perferendis harum.
            Fugiat esse voluptatem similique dolores rem.</p>
        </section>
      </div>

      <div className={`${darkMode ? 'dark bg-black' : 'light bg-transparent'} z-10`}>
        <div data-aos="zoom-in" id='form' className={`${darkMode ? 'dark bg-gray-800' :
          'light bg-white'} lg:w-[70%] w-full m-auto grid lg:grid-cols-4 grid-cols-1
          justify-center items-center gap-6 p-8 rounded-xl -mt-14`}>
          <div className='w-full'>
            <h1 className='text-black font-semibold dark:text-white'>LOCATION</h1>
            <input
              type="text"
              placeholder='Enter an address, state, city or pincode'
              className='bg-white p-2 w-full mt-2 border-b-[1px] border-[#c9c7c1]'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className='w-full'>
            <h1 className='text-black font-semibold dark:text-white'>Rooms</h1>
            <select
              name="selectOption"
              id="selectOption"
              className='bg-white p-2 border-b-[1px] w-full mt-2 border-[#c9c7c1] text-gray-500 text-md'
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
            >
              <option value="" disabled>Select Property</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className='w-full'>
            <h1 className='text-black font-semibold dark:text-white'>Area</h1>
            <select
              name="selectOption"
              id="selectOption"
              className='bg-white p-2 border-b-[1px] w-full mt-2 border-[#c9c7c1] text-gray-500 text-md'
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              <option value="" disabled>Property Area</option>
              <option value="1">1 Marla</option>
              <option value="3">3 Marla</option>
              <option value="5">5 Marla</option>
              <option value="10">10 Marla</option>
              <option value="20">20 Marla</option>
            </select>
          </div>

          <div className='w-full flex gap-4'>
            <button
              className='bg-blue-600 dark:bg-red-700 hover:bg-black dark:hover:bg-white dark:hover:text-black text-lg p-4 w-full text-white font-semibold rounded-xl cursor-pointer transform hover:scale-110 transition-transform duration-300'
              onClick={handleSearch}
            >
              SUBMIT
            </button>
            <button
              className='bg-gray-600 dark:bg-gray-700 hover:bg-black dark:hover:bg-white dark:hover:text-black text-lg p-4 w-full text-white font-semibold rounded-xl cursor-pointer transform hover:scale-110 transition-transform duration-300'
              onClick={handleClearFilters}
            >
              CLEAR
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;