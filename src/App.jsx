import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import CitasPage from "./pages/CitasPage";
import CreateCitasPage from "./pages/CreateCitasPage";
import EditCitasPage from "./pages/EditCitasPage";
import AboutUsPage from "./pages/AboutUsPage";
import CitaDetailsPage from "./pages/CitaDetailsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCitasPage from "./pages/AdminCitasPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>      
        <Route exact path="/" element={<HomePage />} />
 
        <Route path="/signup" element={<IsAnon> <SignupPage /> </IsAnon>} />
        <Route path="/login" element={<IsAnon> <LoginPage /> </IsAnon>} />
        <Route path="/citas" element={<IsPrivate> <CitasPage/> </IsPrivate>} />
        <Route path="/citas/:id" element={<IsPrivate> <CitaDetailsPage/> </IsPrivate>} />
        <Route path="/crear-cita" element={<IsPrivate> <CreateCitasPage /> </IsPrivate>} />
        <Route path="/editar-citas" element={<IsPrivate> <EditCitasPage /> </IsPrivate>} />
        <Route path="/about" element={<AboutUsPage />} />
        
        {/* Rutas de Admin */}
        <Route path="/admin/users" element={<IsPrivate> <AdminUsersPage /> </IsPrivate>} />
        <Route path="/admin/citas" element={<IsPrivate> <AdminCitasPage /> </IsPrivate>} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
