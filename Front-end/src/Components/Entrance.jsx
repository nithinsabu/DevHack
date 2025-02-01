import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EntrancePage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const createEntrance = async () => {
    const res = await axios.post("http://localhost:5000/api/entrance", {});
    setCode(res.data.entranceCode);
    navigate("/check", { state: { code: res.data.entranceCode } });
  };

  const loginEntrance = async () => {
    const res = await axios.post("http://localhost:5000/api/validate", { code });
    if (res.data.valid) {
      navigate("/check", { state: { code } });
    } else {
      alert("Invalid Entrance Code");
    }
  };

  return (
    <div>
      <h2>Welcome!</h2>
      <button onClick={createEntrance}>Create Entrance Code</button>
      <input
        type="text"
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={loginEntrance}>Login</button>
    </div>
  );
}
