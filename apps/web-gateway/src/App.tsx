import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Games from './pages/Games';
import TechMatrix from './pages/TechMatrix';
import About from './pages/About';
import Controller from './pages/Controller';
import Press from './pages/Press';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-obsidian text-white font-sans antialiased">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games" element={<Games />} />
              <Route path="/tech" element={<TechMatrix />} />
              <Route path="/about" element={<About />} />
              <Route path="/controller" element={<Controller />} />
              <Route path="/press" element={<Press />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
