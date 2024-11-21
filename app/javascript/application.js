// Entry point for the build script in your package.json
import '../stylesheets/application.css';
import Rails from "@rails/ujs";
import * as ActiveStorage from "@rails/activestorage";
import "@hotwired/turbo-rails";

// Start Rails UJS and ActiveStorage
Rails.start();
ActiveStorage.start();

// Start Mock Service Worker in development
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser');
  worker.start();
}

// Import your React components or other JavaScript files
import "./components/Login";
