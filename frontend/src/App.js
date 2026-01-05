import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Rides from './pages/Rides';
import RideDetail from './pages/RideDetail';
import CreateRide from './pages/CreateRide';
import History from './pages/History';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rides" element={<Rides />} />
          <Route path="/ride/:id" element={<RideDetail />} />
          <Route path="/create-ride" element={<CreateRide />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
