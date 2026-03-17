
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import PublicLayout from "./components/PublicLayout"; 


import Home from "./pages/Home";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Contact from "./pages/Contact";


import StudentDashboard from "./pages/student/StudentDashboard";
import MunshiDashboard from "./pages/munshi/MunshiDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard"; 

export default function App() {
  
  return (
    
    <Router>
      <Routes>
        
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/munshi/dashboard" element={<MunshiDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

