import Header from './components/Header';
import Map from './components/Map';
import MapControls from './components/MapControls';
import { AppStateProvider } from './AppContext';

import './App.css';

function App() {
  return (
    <AppStateProvider>
      <div className="flex flex-col md:max-h-full md:h-screen">
        <Header />
        <main className="md:flex md:flex-row-reverse border border-slate-200 grow">
          <Map />
          <MapControls />
        </main>
      </div>
    </AppStateProvider>
  );
}

export default App;
