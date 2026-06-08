import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Monitoring from "./pages/Monitoring";
import ImageReview from "./pages/ImageReview";
import ChatAssistant from "./pages/ChatAssistant";
import Architecture from "./pages/Architecture";
import PatientDetail from "./pages/PatientDetail";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientDetail />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="image-review" element={<ImageReview />} />
        <Route path="chat" element={<ChatAssistant />} />
        <Route path="architecture" element={<Architecture />} />
      </Route>
    </Routes>
  );
}

export default App;
