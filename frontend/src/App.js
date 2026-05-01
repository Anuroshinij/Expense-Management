import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';

import { Toaster } from "react-hot-toast";
import "./styles/toast.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Finance from "./pages/Finance";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "toast-default",
          success: {
            className: "toast-success",
          },
          error: {
            className: "toast-error",
          },
        }}
      />

      <Routes>
        <Route path = "/" element = {<Home /> } />
        {/* Public */}
        <Route path="/auth" element={<Login />} />

        {/* User + Admin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Admin Only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <h2>Admin Panel</h2>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/finance"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <Finance />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
