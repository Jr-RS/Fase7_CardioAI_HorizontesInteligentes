import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Monitoring from "./pages/Monitoring";
import ImageReview from "./pages/ImageReview";
import ChatAssistant from "./pages/ChatAssistant";
import Architecture from "./pages/Architecture";

function App() {
  return (
    <>
      <nav style={{ padding: "16px", background: "#0f172a", color: "white", display: "flex", gap: "16px" }}>
        <Link to="/">Dashboard</Link>
        <Link to="/patients">Pacientes</Link>
        <Link to="/monitoring">Monitoreo</Link>
        <Link to="/image-review">Imágenes</Link>
        <Link to="/chat">Chat</Link>
        <Link to="/architecture">Arquitectura</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/image-review" element={<ImageReview />} />
        <Route path="/chat" element={<ChatAssistant />} />
        <Route path="/architecture" element={<Architecture />} />
      </Routes>
    </>
  );
}

export default App;