import axios from "axios";
import "../css/home.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
    const navigate = useNavigate();

    const [entranceCode, setEntranceCode] = useState("");
    async function createEntrance() {
        // console.log(process.env)
        await axios
            .post(`${import.meta.env.VITE_API_URL}/api/createentrance`)
            .then((response) => {
                navigate(`/entrance?eid=${response.data.entranceCode}`);
            })
            .catch((err) => {
                alert("Error");
            });
    }
    async function existingEntrance() {
        await axios
            .get(
                `${
                    import.meta.env.VITE_API_URL
                }/api/existentrance?eid=${entranceCode}`
            )
            .then(() => {
                navigate(`/entrance?eid=${entranceCode}`);
            })
            .catch(() => {
                alert("Entrance not found");
            });
    }
    return (
        <div>
            <h1>Welcome to Home Page 🏠</h1>
            <button onClick={createEntrance}>Create Entrance</button> <br />
            <input
                type="text"
                value={entranceCode}
                onChange={(e) => setEntranceCode(e.target.value.toUpperCase())}
            />{" "}
            <button onClick={existingEntrance}>Submit</button>
        </div>
    );
}
