import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";


function CitasPage() {
    const { user, isLoggedIn } = useContext(AuthContext);
    const [citas, setCitas] = useState(null);

    useEffect(() => {
        if (!isLoggedIn || !user) return;

        const storedToken = localStorage.getItem('authToken');
        
        axios
            .get(`${API_URL}/citas/user/${user._id}`, {
                headers: { Authorization: `Bearer ${storedToken}` }
            })
            .then((response) => {
                setCitas(response.data);
            })
            .catch((error) => {
                console.log("Error getting Listado de Citas", error);
            })
    }, [user, isLoggedIn]);

    if (citas === null) {
        return <h1>Loading...</h1>;
    }

    return <h1>Número de Citas: {citas.length}</h1>
}

export default CitasPage;