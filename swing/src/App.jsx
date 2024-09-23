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
  const [selectedPatrimoine, setSelectedPatrimoine] = useState("");
  const [selectedCurves, setSelectedCurves] = useState({
    agregat: true,
    tresorerie: false,
    immobilisations: false,
    obligations: false,
  });
  const [startDate, setStartDate] = useState(new Date("2024-09-23"));
  const [endDate, setEndDate] = useState(new Date("2024-10-02"));
  const [error, setError] = useState(null);

  // Fonction pour générer les labels de l'axe X basés sur la plage de dates
  const generateDateLabels = (start, end) => {
    let dateArray = [];
    let currentDate = start;
    while (currentDate <= end) {
      dateArray.push(format(currentDate, "yyyy-MM-dd"));
      currentDate = addDays(currentDate, 1); // Incrémente par jour
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
    <div>
      <form>
        <label>Type de Patrimoine</label>
        <select onChange={(e) => setSelectedPatrimoine(e.target.value)}>
          <option value="">Choisir...</option>
          <option value="patrimoine1">Patrimoine 1</option>
          <option value="patrimoine2">Patrimoine 2</option>
        </select>

        <div>
          <label>Choisir les courbes à afficher :</label>
          {["agregat", "tresorerie", "immobilisations", "obligations"].map(
            (curve) => (
              <div key={curve}>
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
            )
          )}
        </div>

        <div>
          <label>Date de début :</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
          <label>Date de fin :</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <Line data={graphData} />
    </div>
  );
}

export default App;