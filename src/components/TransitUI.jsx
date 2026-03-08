import { useState } from "react"

const API_URL =
    "https://6bgj5h4ds5ijnd5ja52riuars40khvxt.lambda-url.ap-south-1.on.aws/"

export default function TransitUI() {

    const [origin, setOrigin] = useState("")
    const [destination, setDestination] = useState("")
    const [result, setResult] = useState(null)

    const findRoutes = async () => {

        try {

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    origin: origin,
                    destination: destination
                })
            })

            const data = await response.json()

            setResult(data)

        } catch (err) {

            alert("Error connecting to backend")

        }

    }

    return (

        <div style={{ width: "350px", margin: "40px auto" }}>

            <h2>Bharat Transit AI</h2>

            <input
                placeholder="Enter Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
            />

            <br /><br />

            <input
                placeholder="Enter Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            />

            <br /><br />

            <button onClick={findRoutes}>
                Find Routes
            </button>

            {result && (

                <div>

                    <p>Fastest: {result.fastest_route}</p>

                    <p>Safest: {result.safest_route}</p>

                    <p>Safety Score: {result.safety_score}</p>

                    <p>{result.reason}</p>

                </div>

            )}

        </div>

    )

}