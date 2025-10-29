import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

if (!document.documentElement.classList.contains('dark')) {
  document.documentElement.classList.add('dark')
}
if (!document.body.classList.contains('dark')) {
  document.body.classList.add('dark')
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
