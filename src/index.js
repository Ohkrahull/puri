// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { AuthProvider } from './context/AuthContext';
// // import { app, auth } from './path/to/your/firebase/config';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <AuthProvider>
//     <App />
//     </AuthProvider>
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import './firebase/firebase';  // This should be the first import
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { StaffProvider } from './context/StaffContext';
import { HeaderProvider } from './context/HeaderContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <HeaderProvider>
    <StaffProvider>
      <App />
      </StaffProvider>
      </HeaderProvider>
    </AuthProvider>
    
  </React.StrictMode>
);

reportWebVitals();