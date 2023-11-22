import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LinesChart = () => {
  const [fechas, setFecha] = useState([]);
  const [data, setData] = useState([]);
  const [fechaSel, setFechaSel] = useState('');
  const [temp, setTemp] = useState([]);
  const [horas, setHoras] = useState([]);
  const [myData, setMyData] = useState({
    labels: ['lava', 'ctmre', 'chupalo'],
    datasets: [
      {
        label: 'temperatura',
        data: [24.5, 22.4, 19.3],
        tension: 0.5,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132, 0.4)',
        pointRadius: 5,
      },
    ],
  });

  const baseURL =
    'https://api.thingspeak.com/channels/2299191/fields/1.json?results=8000';

  useEffect(() => {
    const fetchTemp = async () => {
      try {
        const res = await fetch(baseURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const json = await res.json();
        setFecha([...new Set(json.feeds.map((e) => e.created_at.split('T')[0]))]);
        setData(json.feeds);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTemp();
  }, [baseURL]);

  useEffect(() => {
    if (fechaSel) {
      const tempArray = [];
      const horasArray = [];

      data.forEach((d) => {
        if (d.created_at.includes(fechaSel)) {
          tempArray.push(parseFloat(d.field1));
          horasArray.push(d.created_at.split('T')[1].replace('Z', ''));
        }
      });

      setTemp(tempArray);
      setHoras(horasArray);
      console.log(tempArray)
      console.log(horasArray)
    }
  }, [data, fechaSel]);

  useEffect(() => {
    if (temp.length > 0 && horas.length > 0) {
      setMyData({
        labels: horas,
        datasets: [
          {
            label: 'temperatura',
            data: temp,
            tension: 0.3,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132, 0.4)',
            pointRadius: 5,
          },
        ],
      });
    } else {
      setMyData({
        labels: ['lava', 'ctmre', 'chupalo'],
        datasets: [
          {
            label: 'temperatura',
            data: [24.5, 22.4, 19.3],
            tension: 0.5,
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(255, 99, 132, 0.4)',
            pointRadius: 5,
          },
        ],
      });
    }
  }, [temp, horas]);

  var myOptions = {};

  return (
    <div>
      <select value={fechaSel} onChange={(e) => setFechaSel(e.target.value)}>
        {fechas.map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>
      <Line data={myData} options={myOptions} />
    </div>
  );
};

export default LinesChart;