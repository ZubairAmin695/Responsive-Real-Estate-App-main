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



const App = () => {
  return (
    <>
    <DarkModeProvider>

        <Header/>
        <Hero/>
        <About/>
        <Properties/>
        <Services/>
        <Clients/>
        <Contact/>
        <Footer/>

    </DarkModeProvider>
    </>
  )
}

export default App
