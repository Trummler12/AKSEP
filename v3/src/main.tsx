import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

if (typeof window !== 'undefined' && window.location.pathname === '/') {
  window.history.replaceState(null, '', '/.start')
}

// KEIN import './index.css' mehr – Styles leben unter src/styles/**
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
