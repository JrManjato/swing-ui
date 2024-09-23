import './App.css'
import React, { useState } from "react";
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
    agregat: false,
    tresorerie: false,
    immobilisations: false,
    obligations: false,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const dataFictives = {
    agregat: [20000, 15000, 18000, 30000],
    tresorerie: [50000, 40000, 45000, 47000],
    immobilisations: [10000, 12000, 14000, 11000],
    obligations: [-50000, -60000, -55000, -53000],
  };

  const generateGraphData = () => {
    const labels = ["2022-01", "2022-02", "2022-03", "2022-04"]; // À ajuster selon les dates
    const datasets = [];

    if (selectedCurves.agregat) {
      datasets.push({
        label: "Agrégat",
        data: dataFictives.agregat,
        borderColor: "blue",
      });
    }
    if (selectedCurves.tresorerie) {
      datasets.push({
        label: "Trésorerie",
        data: dataFictives.tresorerie,
        borderColor: "green",
      });
    }
    if (selectedCurves.immobilisations) {
      datasets.push({
        label: "Immobilisations",
        data: dataFictives.immobilisations,
        borderColor: "red",
      });
    }
    if (selectedCurves.obligations) {
      datasets.push({
        label: "Obligations",
        data: dataFictives.obligations,
        borderColor: "purple",
      });
    }

    return { labels, datasets };
  };

  return (
    <>
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
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
          <label>Date de fin :</label>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
        </div>
      </form>

      <Line data={generateGraphData()} />
    </div>
    </>
  )
}

export default App
