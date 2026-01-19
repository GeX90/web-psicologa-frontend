import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";
import CitasPage from "./pages/CitasPage";
import CreateCitasPage from "./pages/CreateCitasPage";
import EditCitasPage from "./pages/EditCitasPage";

function App() {
  return (
    <div className="App">
      <Navbar />

      <Routes>      
        <Route exact path="/" element={<HomePage />} />
 
        <Route path="/signup" element={<IsAnon> <SignupPage /> </IsAnon>} />
        <Route path="/login" element={<IsAnon> <LoginPage /> </IsAnon>} />
        <Route path="/citas" element={<IsPrivate> <CitasPage/> </IsPrivate>} />
        <Route path="/crear-cita" element={<IsPrivate> <CreateCitasPage /> </IsPrivate>} />
        <Route path="/editar-citas" element={<IsPrivate> <EditCitasPage /> </IsPrivate>} />
      </Routes>
    </div>
  );
}

export default App;
