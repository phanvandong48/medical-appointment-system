import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
// Import các component khác

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Các routes */}
            </Routes>
          </main>
          {/* Footer */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 