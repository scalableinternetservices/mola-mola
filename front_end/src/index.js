import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <EventsProvider>
        <App />
      </EventsProvider>
    </AuthProvider>
  </React.StrictMode>
);

