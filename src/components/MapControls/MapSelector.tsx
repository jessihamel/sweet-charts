import { useContext } from 'react';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';
import { AppContext } from '../../AppContext';
import { BASE_MAP_OPTIONS } from '../../consts';

function MapSelector() {
  const { baseMap, setBaseMap } = useContext(AppContext);
  return (
    <div>
      <Label>Select Base Map</Label>
      <div className="ml-4">
        <select
          id="baseMap"
          className={SELECT_CLASS}
          onChange={event => setBaseMap(event.target.value)}
          value={baseMap}
        >
          {Object.entries(BASE_MAP_OPTIONS).map(([id, { label }]) => (
            <option className="" key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <MoreInfo>{BASE_MAP_OPTIONS[baseMap].moreInfo}</MoreInfo>
      </div>
    </div>
  );
}

export default MapSelector;
