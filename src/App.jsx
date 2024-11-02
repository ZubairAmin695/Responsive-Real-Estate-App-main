import React from 'react'
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



const App = () => {
  return (
    <>
    <DarkModeProvider>
    <AuthProvider>
        <Header/>
        <Hero/>
        <About/>
        <Properties/>
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
