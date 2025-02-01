import axios from "axios";
import "../css/home.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();

const [entranceCode, setEntranceCode] = useState('')
async function entrance(){
await axios.post(`${process.env.REACT_APP_API_URL}/createentrance`)
.then
}
  return (
    <div>
      <h1>Welcome to Home Page 🏠</h1>
      <button onClick={() => navigate("/about")}>Create Entrance</button>
      <input type="text" value={entranceCode} onChange={(e) => setInputValue(e.target.value)}/> <button onClick={() => entrance()}>Submit</button>


    </div>
  );
}
