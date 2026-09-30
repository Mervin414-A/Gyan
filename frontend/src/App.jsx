import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminEmployees from "./pages/AdminEmployees";
import AdminLayout from "./components/AdminLayout";
import AdminBookings from "./pages/AdminBookings";
import EmployeeBooking from "./pages/EmployeeBooking";
import MyBookings from "./pages/MyBookings";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import MyActivity from "./pages/MyActivity";
import ChangePassword from "./pages/ChangePassword";
import EmployeeLayout from "./components/EmployeeLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import AdminNotifications from "./pages/AdminNotifications";
import EmployeeRegister from "./pages/EmployeeRegister";

function AdminPage({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>This page is under development.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Employee Registration */}
        <Route
          path="/employee/register"
          element={<EmployeeRegister />}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="employees"
            element={<AdminEmployees />}
          />

          <Route
            path="bookings"
            element={<AdminBookings />}
          />

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />

          <Route
            path="reports"
            element={<AdminReports />}
          />

          <Route
            path="settings"
            element={<AdminSettings />}
          />
        </Route>

        {/* Employee */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="booking" element={<EmployeeBooking />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-activity" element={<MyActivity />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;