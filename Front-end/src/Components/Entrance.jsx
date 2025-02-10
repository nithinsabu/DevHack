import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import backArrow from "./../assets/BackArrow.png";
import { Scanner } from "@yudiel/react-qr-scanner";
import React from "react";
export default function EntrancePage() {
    const [entranceCode, setEntranceCode] = useState("");
    const [mode, setMode] = useState(null);
    const [entries, setEntries] = useState({});
    const [QR, setQR] = useState("");
    const [duration, setDuration] = useState("Today");
    useEffect(() => {
        // console.log(QR);
        if (QR === "" || !mode) return;
        const time = Date.now();
        axios
            .post(`${import.meta.env.VITE_API_URL}/api/scan?eid=${entranceCode}`, { mode, student: QR, time })
            .then(response => {
                const temp = { ...entries };
                let date = new Date();
                date.setHours(0, 0, 0, 0);
                date = date.toString()
                if (mode === "OUT") {
                    if (!Object.keys(temp).includes(date)) temp[date] = [];
                    temp[date].push({
                        student: QR,
                        checkInTime: null,
                        checkOutTime: time,
                    });
                } else if (mode === "IN") {
                    temp[date][temp[date].findIndex(e => e.student === QR && e.checkInTime === null)].checkInTime = time;
                }
                setEntries(temp);
            })
            .catch(err => {
                const errorMessage = err.response ? err.response.data : "An error occurred";
                alert(`Error: ${errorMessage}`);
            })
            .finally(() => {
                setQR("");
            });
    }, [QR]);
    const handleScan = async detectedCodes => {
        let qr = null;
        if (detectedCodes.length > 0) {
            setQR(detectedCodes[0].rawValue); // Store the first detected QR value
        }
        // console.log(qr)
    };

    const handleError = err => {
        console.error(err); // Handle scan errors
    };

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const param = searchParams.get("eid");
        setEntranceCode(param);
        if (param === "") {
            alert("Entrance does not exist!!");
            navigate("/");
        }
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/getentrance?eid=${param}&duration=${duration}`)
            .then(response => {
                setEntranceCode(param);
                setEntries(response.data.entries);
            })
            .catch(() => {
                alert("Entrance does not exist!!");
                navigate("/");
            });
    }, [duration]);

    return (
        <div>
            <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                    navigate(-1);
                }}>
                <img src={backArrow} height={"20px"} width={"20px"} />
                Go Back <br />
            </div>
            <h2>Welcome</h2>
            <h2>Entrance Code: {entranceCode}</h2>
            <button
                onClick={() => {
                    setMode("IN");
                }}>
                Check In
            </button>
            <button
                onClick={() => {
                    setMode("OUT");
                }}>
                Check Out
            </button>
            <button
                onClick={() => {
                    setMode(null);
                }}>
                Cancel
            </button>
            <div style={{ width: "20vw" }}>
                {mode !== null ? <>Current Mode: {mode}</> : <></>}
                {mode !== null ? <Scanner onScan={handleScan} onError={handleError} formats={["qr_code", "ean_13"]} scanDelay={500} allowMultiple={true} paused={false} /> : <></>}
            </div>

            <p>
                <select
                    value={duration}
                    onChange={e => {
                        setDuration(e.target.value);
                    }}>
                    <option>Today</option>
                    <option>Last 5 days</option>
                    <option>All time</option>
                </select>
            </p>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Check-Out Time</th>
                        <th>Check-In Time</th>

                    </tr>
                </thead>
                <tbody>
                    {Object.entries(entries).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, records]) => (
                        <React.Fragment key={date}>
                            <tr>
                                <td colSpan="3" style={{ fontWeight: "bold", textAlign: "center", background: "#f0f0f0" }}>
                                    {new Date(date).toLocaleDateString("en-GB")}
                                </td>
                            </tr>
                            {records.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.student}</td>
                                    <td>{entry.checkOutTime!==null? new Date(entry.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }): ""}</td>
                                    <td>{entry.checkInTime!==null? new Date(entry.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }): ""}</td>
                                
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
