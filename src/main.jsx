import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProviderWrapper } from "./context/auth.context"; // <== IMPORT

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProviderWrapper>      {/*  <== ADD  */}
        <App />
      </AuthProviderWrapper>     {/*  <== ADD  */}
  </StrictMode>,
)
