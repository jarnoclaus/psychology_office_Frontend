import './App.css';
import { useState } from 'react';
import Header from './Header.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login.js';
import Register from './Register.js';
import AccountPage from './Account.js';
import Home from './Home.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Router>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main>
          <Routes>
            <Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />
            <Route path='/login' element={isLoggedIn ? <Navigate to='/account' replace /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={isLoggedIn ? <AccountPage /> : <Navigate to='/login' replace />} />
            {/* All undefined routes navigate to home */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
