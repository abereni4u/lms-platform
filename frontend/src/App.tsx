import { Routes, Route } from "react-router";
import "./App.css";
import Login from "./components/Login";
import InstructorDashboard from "./components/InstructorDashboard";
import StudentDashboard from "./components/StudentDashboard";
import CoursePage from "./components/CoursePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/instructor" element={<InstructorDashboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/instructor/course:id" element={<CoursePage />} />
    </Routes>
  );
}

export default App;