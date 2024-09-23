import './App.css'
import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import addDays from "date-fns/addDays";
import format from "date-fns/format";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [selectedPatrimoine, setSelectedPatrimoine] = useState("Cresus");
  const [selectedCurves, setSelectedCurves] = useState({
    agregat: true,
    tresorerie: false,
    immobilisations: false,
    obligations: false,
  });
  const [startDate, setStartDate] = useState(new Date("2024-09-23"));
  const [endDate, setEndDate] = useState(new Date("2024-09-28"));
  const [error, setError] = useState(null);

  const generateDateLabels = (start, end) => {
    let dateArray = [];
    let currentDate = start;
    while (currentDate <= end) {
      dateArray.push(format(currentDate, "yyyy-MM-dd"));
      currentDate = addDays(currentDate, 1);
    }
    return dateArray;
  };

  // Vérifie si la plage de dates est valide
  const validateDates = () => {
    if (startDate > endDate) {
      setError("La date de fin doit être postérieure à la date de début.");
      return false;
    }
    setError(null);
    return true;
  };

  // Utilisation de useMemo pour générer les données du graphique
  const graphData = useMemo(() => {
    if (!validateDates()) return { labels: [], datasets: [] };

    const labels = generateDateLabels(startDate, endDate);
    const datasets = [];

    if (selectedCurves.agregat) {
      datasets.push({
        label: "Agrégat",
        data: Array(labels.length).fill().map(() => Math.floor(Math.random() * (100000 + 80000) - 80000)),
        borderColor: "blue",
      });
    }
    if (selectedCurves.tresorerie) {
      datasets.push({
        label: "Trésorerie",
        data: Array(labels.length).fill().map(() => Math.floor(Math.random() * (100000 + 80000) - 80000)),
        borderColor: "green",
      });
    }
    if (selectedCurves.immobilisations) {
      datasets.push({
        label: "Immobilisations",
        data: Array(labels.length).fill().map(() => Math.floor(Math.random() * (100000 + 80000) - 80000)),
        borderColor: "red",
      });
    }
    if (selectedCurves.obligations) {
      datasets.push({
        label: "Obligations",
        data: Array(labels.length).fill().map(() => Math.floor(Math.random() * (100000 + 80000) - 80000)),
        borderColor: "purple",
      });
    }

    return { labels, datasets };
  }, [startDate, endDate, selectedCurves]);

  return (
    <div style={{ display: "flex", justifyContent: "space-between", width: "90vw" }}>
      {/* Formulaire à gauche */}
      <div style={{ width: '40%', display: "flex", justifyContent: "start" }}>
        <form style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
          <div>
            <label>Patrimoine : </label>
            <select onChange={(e) => setSelectedPatrimoine(e.target.value)}>
              <option value="Cresus">Cresus</option>
              <option value="Cesar">Cesar</option>
            </select>
          </div>

          <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {["agregat", "tresorerie", "immobilisations", "obligations"].map((curve) => (
                <div key={curve} style={{ display: "flex", justifyContent: "start", marginRight: '5px' }}>
                  <input
                    type="checkbox"
                    id={curve}
                    checked={selectedCurves[curve]}
                    onChange={() =>
                      setSelectedCurves({
                        ...selectedCurves,
                        [curve]: !selectedCurves[curve],
                      })
                    }
                  />
                  <label htmlFor={curve}>{curve}</label>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "230px" }}>
              <label>De : </label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div style={{ width: "230px" }}>
              <label>À : </label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <div style={{border: "1px solid gray", width: '100%', paddingInline: '15px'}}>
            <h4 style={{textTransform: "capitalize"}}>!! Flux impossible !!</h4>
            {generateDateLabels(startDate, endDate).slice(0, 1).map((date, index) => (
              <div key={index} style={{ display: "flex", width: "100%" }}>
                <span>[{date}]</span>
                <span>[{selectedPatrimoine}] Flux : {Math.floor(Math.random() * (1000 - (-1000)) + (-1000))} €</span>
              </div>
            ))}
          </div>

          <div style={{border: "1px solid gray", width: '100%', paddingInline: '15px'}}>
            <h4>!! Flux journalier !!</h4>
            {generateDateLabels(startDate, endDate).map((date, index) => (
              <div key={index} style={{ display: "flex", width: "100%" }}>
                <span>[{date}]</span>
                <span>[{selectedPatrimoine}] Flux : {Math.floor(Math.random() * (1000 - (-1000)) + (-1000))} €</span>
              </div>
            ))}
          </div>

        </form>
      </div>

      {/* Graphique à droite */}
      <div style={{ width: "55%" }}>
        <span>Patrimoine : possesseur : <b>{selectedPatrimoine}</b></span>
        <Line
          style={{ width: '50vw', height: '50vh' }}
          data={graphData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              title: {
                display: true,
                text: 'Évolution du patrimoine',
              },
            },
          }}
        />
      </div>
    </div>

  );
}

export default App;