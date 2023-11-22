import './App.css';
import BarsChart from './comp/BarChart';
import LinesChart from './comp/LineChart';

function App() {
  return (
    <div className="App">
      <header className="graphs">
        <LinesChart />
        <BarsChart />
      </header>
    </div>
  );
}

export default App;
