import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BarsChart = () => {
  const [fechas, setFechas] = useState([]);
  const [data, setData] = useState([]);
  const [meses, setMeses] = useState([]);
  const [mesSel, setMesSel] = useState('');
  const [temp, setTemp] = useState([]);
  const [dias, setDias] = useState([]);
  const [myData, setMyData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const res = await fetch('https://api.thingspeak.com/channels/2299191/fields/1.json?results=8000', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await res.json();
        setFechas([...new Set(json.feeds.map((e) => e.created_at.split('T')[0]))]);
        setData(json.feeds);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTemp();
  }, []);

  useEffect(() => {
    const mesesArray = [...new Set(data.map((e) => e.created_at.split('-')[1]))];
    setMeses(mesesArray);
  }, [data]);
//FUSIONAR ESTOS 2 USEEFFECT PARA QUE CALCULE LA MEDIA, VARIANZA, Y DESVIACION ESTANDAR POR DIA SEGUN SE VAYA POBLANDO DIASARRAY
  useEffect(() => {
    if (mesSel) {
      const tempArray = [];
      const diasArray = [];

      data.forEach((d) => {
        if (d.created_at.includes(`-${mesSel}-`)) {
          const temperatura = parseFloat(d.field1);
          tempArray.push(temperatura >= 0 ? temperatura : 0);
          diasArray.push(d.created_at.split('T')[0].split('-')[2]);
        }
      });

      setTemp(tempArray);
      setDias([...new Set(diasArray)]);
    }
  }, [data, mesSel]);

  useEffect(() => {
    if (temp.length > 0 && dias.length > 0) {
      const mean = temp.reduce((acc, val) => acc + val, 0) / temp.length;
      const variance = temp.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / temp.length;
      const stdDev = Math.sqrt(variance);

      const averageData = Array(dias.length).fill(mean);
      const varianceData = Array(dias.length).fill(variance);
      const stdDevData = Array(dias.length).fill(stdDev);

      setMyData({
        labels: dias.map((dia) => `Día ${dia}`),
        datasets: [
          {
            label: 'Media',
            data: averageData,
            backgroundColor: 'rgba(54, 162, 235, 0.4)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
          {
            label: 'Varianza',
            data: varianceData,
            backgroundColor: 'rgba(255, 206, 86, 0.4)',
            borderColor: 'rgb(255, 206, 86)',
            borderWidth: 1,
          },
          {
            label: 'Desviación Estándar',
            data: stdDevData,
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [temp, dias]);

  return (
    <div>
      <select value={mesSel} onChange={(e) => setMesSel(e.target.value)}>
        <option value="">Seleccione un mes</option>
        {meses.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <Bar data={myData} />
    </div>
  );
};

export default BarsChart;
