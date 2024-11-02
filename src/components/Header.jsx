import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FaXmark, FaBars } from 'react-icons/fa6';
import logo from '../assets/images/logo.png';
import { useDarkMode } from './DarkModeContext';
import { FaPhoneAlt, FaUserCircle } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuthContext } from './AuthContext';

const Header = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notification, setNotification] = useState(''); // State for notification message

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const { user, setUser } = useAuthContext();

  const handleSuccess = (response) => {
    const token = response.credential;
    const decodedUser = jwtDecode(token);
    setUser(decodedUser);
    setIsDropdownOpen(false);
    showNotification('You are logged in'); 
    console.log('User info:', decodedUser);
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  const handleLogout = () => {
    setUser(null);
    setIsDropdownOpen(false);
    showNotification('You are logged out');
    console.log('User logged out');
  };

  const navItems = [

    {
      Link: 'DreamDwell', path: 'home'
    },


  ]

  return (
    <nav className={`${darkMode ? 'dark bg-black' : 'light bg-[#f3f3f3]'} flex justify-between items-center
     gap-4 lg:px-20 px-4 py-3 sticky top-0 z-30`}>
      <div id='logo'>
        <img src={logo} className='lg:w-[150px] w-[120px] dark:invert' alt='Logo' />
      </div>

      <ul className='lg:flex justify-center items-center gap-8 hidden'>
        {navItems.map(({ Link, path }) => (

          <Link key={path} className='text-black text-[25px] uppercase font-semibold cursor-pointer
            px-3 py-2 dark:text-white rounded-lg hover:bg-blue-600 hover:text-white'
             to={path} spy={true} offset={-100} smooth={true}>
            {Link}

          </Link>
        ))}

      </ul>


      {/* mobile menu start */}
      
      <div className='flex justify-center items-center  lg:hidden' onClick={toggleMenu}>
        {isMenuOpen ? <FaXmark className='text-black dark:text-white text-2xl cursor-pointer' /> : <FaBars className='text-black dark:text-white text-2xl cursor-pointer' />}
      </div>

      <div className={`${isMenuOpen ? 'flex' : 'hidden'} w-full h-fit bg-slate-800 p-4 absolute top-[80px] left-0`} onClick={closeMenu}>
        <ul className='flex flex-col justify-center items-center gap-2 w-full'>
          {navItems.map(({ Link, path }) => (
            <Link key={path} className='text-white uppercase font-semibold cursor-pointer p-3 rounded-lg hover:bg-blue-600 hover:text-black w-full text-center' to={path} spy={true} offset={-100} smooth={true}>
              {Link}
            </Link>
          ))}
        </ul>
      </div>

      {/* User section */}
      <div className='flex justify-center items-center lg:gap-8 gap-2 relative'>
        <div className='flex justify-center items-center lg:gap-3 gap-1'>
          <FaPhoneAlt className='size-5 text-blue-600' />
          <h1 className='lg:text-xl text-sm text-black dark:text-white font-semibold'>
            0342-342135
          </h1>

          {!user ? (
            <>
              <FaUserCircle
                className='size-6 text-blue-600 cursor-pointer'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className=' right-0 mt-2 w-50 bg-white border border-gray-300 rounded-md shadow-lg'>
                  <div className='p-4 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                    <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className='relative'>
              <img
                src={user.picture}
                alt='User'
                className='w-8 h-8 rounded-full cursor-pointer'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className='absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg'>
                  <button className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification popup */}
      {notification && (
  <div className='fixed inset-0 flex items-center justify-center'>
    <div className='bg-green-500 flex items-center justify-center text-white px-8 py-4 rounded-md shadow-lg text-lg w-1/3 max-w-lg'>
      {notification}
    </div>
  </div>
)}
    </nav>
  );
};

export default Header;
