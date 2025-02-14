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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
  <h1 className="text-2xl font-bold mb-4">Welcome to Entrance Scanner</h1>

  <button 
    onClick={createEntrance} 
    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
  >
    Create Entrance
  </button>

  <div className="mt-4 flex items-center space-x-2">
    <input
      type="text"
      value={entranceCode}
      onChange={(e) => setEntranceCode(e.target.value.toUpperCase())}
      className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      placeholder="Enter Code"
    />
    
    <button 
      onClick={existingEntrance} 
      className="px-4 py-2 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
    >
      Submit
    </button>
  </div>
</div>
    );
}
