import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Modal from 'react-modal';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

Modal.setAppElement('#root');
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <GoogleOAuthProvider clientId="303634397971-3gmuor4jtgv5qtmsla56kkp2e7p0l4ic.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
