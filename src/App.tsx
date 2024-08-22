import Header from './components/Header';
import Map from './components/Map';
import MapControls from './components/MapControls';

import './App.css';

function App() {
  return (
    <div className="flex flex-col md:h-screen md:max-h-full">
      <Header />
      <main className="grow border border-slate-200 md:flex md:flex-row-reverse">
        <Map />
        <MapControls />
      </main>
    </div>
  );
}

export default App;
