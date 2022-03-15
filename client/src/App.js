import "./App.css";
import { useState, useEffect } from "react";
import { format } from 'date-fns'

function App() {
  const [time, setTime] = useState();
  const [difference, setDifference] = useState()
  const [metrics, setMetrics] = useState();
  const [loading, setLoading] = useState(true);

  async function networkRequest() {
    setInterval(async () => {
      setLoading(true);
      await fetch("http://localhost:5001/api/v1/time", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer mysecrettoken",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setTime(res)
          console.log(res.properties.epoch)
          const epoch = format(new Date(res.properties.epoch * 1000), 'HH/mm/ss')
          const client = format(new Date(), 'HH/mm/ss')

          console.log(epoch, client)
        });

      // await fetch("http://localhost:5001/metrics", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: "Bearer mysecrettoken",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((res) => setMetrics(res));

      setLoading(false);
    }, 30000);
  }

  useEffect(() => {
    networkRequest();
  }, []);

  return (
    <div className="App">
      {loading && <div className="centre">Loading...</div>}
      {!loading && (
        <div className="row">
          <div className="left">
            <div>Server Epoch Time: {time.properties.epoch}</div>
            <div>Difference:   </div>
          </div>
          <div className="right">prom</div>
        </div>
      )}
    </div>
  );
}

export default App;
