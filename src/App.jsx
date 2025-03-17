import React, { useEffect, useState } from 'react'
import { DarkModeProvider } from './components/DarkModeContext'
import Header from './components/Header'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Clients from './sections/Clients'
import Contact from './sections/Contact'
import Footer from './components/Footer'
import Properties from './sections/Properties'
import { AuthProvider } from './components/AuthContext';
import axios from 'axios';



const App = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.post('http://localhost:1337/api/v1/en/property/list');
        setProperties(response.data.data);
        setFilteredProperties(response.data.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        alert("Error: " + error.response?.status);
      }
    };

    fetchProperties();
  }, []);

  return (
    <>
    <DarkModeProvider>
    <AuthProvider>
        <Header/>
 <Hero properties={properties} setFilteredProperties={setFilteredProperties} />        
 <About/>
 <Properties properties={filteredProperties} />
        <Services/>
        <Clients/>
        <Contact/>
        <Footer/>
    </AuthProvider>
    </DarkModeProvider>
    </>
  )
}

export default App
