import Header from './components/Header';
import Map from './components/Map';
import MapControls from './components/MapControls';

import './App.css';
import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';

function App() {
  // TODO: Can probably get rid of this
  const headerRef = useRef<HTMLDivElement>();
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    function measureHeader() {
      if (!headerRef.current) {
        return;
      }
      const headerHeight = headerRef.current.getBoundingClientRect().height + 2;
      setHeaderHeight(headerHeight);
    }
    measureHeader();
    const debouncedMeasure = debounce(measureHeader, 100, {
      leading: true,
      trailing: true,
    });
    window.addEventListener('resize', debouncedMeasure);
    return function cleanup() {
      window.removeEventListener('resize', debouncedMeasure);
    };
  }, []);

  return (
    <div className="flex flex-col md:max-h-full md:h-screen">
      <Header headerRef={headerRef} />
      <main className="md:flex md:flex-row-reverse border border-slate-200 grow">
        <Map />
        <MapControls />
      </main>
    </div>
  );
}

export default App;
