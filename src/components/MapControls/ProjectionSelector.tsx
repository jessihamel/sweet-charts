import { useContext } from 'react';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';
import { AppContext } from '../../AppContext';
import { BASE_MAP_OPTIONS, PROJECTIONS, Projection } from '../../consts';

function ProjectionSelector() {
  const { baseMap, projection, setProjection } = useContext(AppContext);

  const PROJECTION_OPTIONS = BASE_MAP_OPTIONS[baseMap].projectionOptions;
  return (
    <div>
      <Label>Select Projection</Label>
      <div className="ml-4">
        <select
          id="projection"
          className={SELECT_CLASS}
          onChange={event => setProjection(event.target.value as Projection)}
          value={projection}
        >
          {PROJECTION_OPTIONS.map(p => (
            <option className="" key={p} value={p}>
              {PROJECTIONS[p].label}
            </option>
          ))}
        </select>
        <MoreInfo>{PROJECTIONS[projection].moreInfo}</MoreInfo>
      </div>
    </div>
  );
}

export default ProjectionSelector;
