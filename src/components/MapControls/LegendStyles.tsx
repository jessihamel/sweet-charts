import { useContext } from 'react';
import { Label } from './Shared';
import { AppContext } from '../../AppContext';

function LegendStyles() {
  const { legendUnits, setLegendUnits } = useContext(AppContext);

  return (
    <div>
      <Label>Set Legend Units (%, K, etc)</Label>
      <div className="ml-4 mt-4">
        <input
          className="border border-slate-800 rounded-sm w-16 px-1 text-right"
          onChange={e => setLegendUnits(e.target.value)}
          value={legendUnits}
          type="text"
        />
      </div>
    </div>
  );
}

export default LegendStyles;
