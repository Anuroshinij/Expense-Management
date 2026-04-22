import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Home /> } />
        <Route path = "/auth" element = {<Login /> } />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
