import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { JobsProvider } from './context/JobsContext'
import NavBar from './layout/NavBar.tsx'
import './index.css'
import App from './App.tsx'
import Footer from './layout/Footer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JobsProvider>
      <BrowserRouter>
        <NavBar />
        <App />
        <Footer />
      </BrowserRouter>
    </JobsProvider>
  </StrictMode>,
)
