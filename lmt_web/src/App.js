import './App.css';
import ChatbotPage from './Chatbot';
import { HashRouter, Route,Routes,Link } from "react-router-dom";
import DashBoard  from './dashboard';
import About from './About';
import TrackerPage from './Tracker';
import EditPage  from './Edit';
function App() {
  return (
    <div className="App">
      
      <HashRouter>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <Link className='text-light w-75' to="/">LearningMap_Tracker</Link><Link className='navbar-brand mx-3' to="/">Home</Link> | <Link className='nav-link text-light me-3' to="/about">About us</Link> | <Link className='nav-link text-light' to="/dashboard">DashBoard</Link> |<Link className='nav-link text-light' to="/Edit/b96ec0ae-1c95-4a62-a9cf-6e5069eb2f61">Edit</Link>
        </nav>

        <Routes>
          <Route path="/" element={<ChatbotPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<DashBoard />}/>
          <Route path="/tracker" element={<TrackerPage />}/>
          <Route path="/tracker/:uuid/*" element={<TrackerPage />}/>
          <Route path="/edit/:uuid/*" element={<EditPage />}/>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
