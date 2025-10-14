import './App.css';
import ChatbotPage from './Chatbot';
import { HashRouter, Route, Routes, Link, useNavigate } from "react-router-dom";
import DashBoard from './dashboard';
import About from './About';
import TrackerPage from './Tracker';
import EditPage from './Edit';
import Login from './Login';
import './ProtectRoutes'
import { useEffect, useState } from 'react';
function App() {


  

  return (
    <div className="App">

      <HashRouter>
        <NavBar/>
        <Routes>
          
          <Route path="/" element={<ChatbotPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={< DashBoard />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/tracker/:uuid/*" element={<TrackerPage />} />
          <Route path="/edit/:uuid/*" element={<EditPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </HashRouter>
    </div>
  );
}
function NavBar(){
    const [isLoggedIn, setisLoggedIn] = useState(false);
  const [user_ID, setuser_ID] = useState("")
              const navigate = useNavigate();
  useEffect(() => {
    const CheckStatus = async () => {
      try {
        // 假設這裡是你的 API
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login/status`, { credentials: "include" });

        const data = await response.json();

        // 轉換成我們需要的格式
        setisLoggedIn(data.data)
        if (data.User_ID) setuser_ID(data.User_ID);
      } catch (error) {
        console.error("API error:", error);
      } finally {
      }
    }
    CheckStatus();
  })
  return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link className='text-light w-75 navbar-brand' to="/">LearningMap_Tracker</Link> 
            {isLoggedIn && <div><div className='text-light me-5' >welcome,{user_ID}</div></div>} 
            <Link className='navbar-nav nav-link text-light me-3' to="/about">About us</Link> | 
            <Link className='navbar-nav nav-link text-light me-3' to="/dashboard">DashBoard</Link> 
            |{isLoggedIn ? <Link className='border border-light rounded navbar-nav nav-link text-light' onClick={async () => {
              await fetch(`${process.env.REACT_APP_API_URL}/login/logout`, { method: 'POST', credentials: 'include' });
              setisLoggedIn(false);
              setuser_ID("")
              navigate("/login", { replace: true })
            }}><div className='mx-3'> Logout </div></Link> : <Link className='border border-light rounded navbar-nav nav-link text-light' to="/login"><div className='mx-3'> Login </div></Link>}
          </nav>
}
export default App;
