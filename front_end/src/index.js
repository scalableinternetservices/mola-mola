import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CommentsProvider } from './context/CommentsContext';
import { EventsProvider } from './context/EventsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <EventsProvider>
      <CommentsProvider>
        <App />
      </CommentsProvider>
      </EventsProvider>
    </AuthProvider>
  </React.StrictMode>
);

