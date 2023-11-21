import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';





const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
    <GoogleOAuthProvider clientId="970452263124-4ddh3lfimhfkokipd0ph09phnc60n84p.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>
    
    
  </>,
  
    document.getElementById('root')
);
reportWebVitals();
