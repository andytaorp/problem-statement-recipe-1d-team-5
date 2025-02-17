import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import AiScanner from "./pages/AiScanner";
// import WorkoutEdit from './pages/WorkoutEdit';

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/" // root path
              element={user ? <Home /> : <Navigate to="/login" />} // Home.js
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            {/* <Route path="/edit/:id" element={<WorkoutEdit />} /> */}
            <Route
              path="/ai-scanner"
              element={<AiScanner />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
