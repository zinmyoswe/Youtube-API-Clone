import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';


const clientId = '438496435229-ui6c93ktemn6vuak8dg23j10tvmhd81e.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
  <React.StrictMode>
     
    <BrowserRouter>
   
      <App />
      
    </BrowserRouter>
    
  </React.StrictMode>
  </GoogleOAuthProvider>,
)
