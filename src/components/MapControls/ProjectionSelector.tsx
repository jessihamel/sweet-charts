import { BASE_MAP_OPTIONS, PROJECTIONS, Projection } from '../../consts/projections';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MapState, setProjection } from '../../store/mapSlice';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';

const useProjectionSelectorProps = () => {
  const dispatch = useAppDispatch();
  const dispatchSetProjection = (projection: MapState['projection']) => {
    dispatch(setProjection(projection));
  };

  const baseMap = useAppSelector(state => state.map.baseMap);
  const projection = useAppSelector(state => state.map.projection);

  return {
    baseMap,
    projection,
    setProjection: dispatchSetProjection,
  };
};

const ProjectionSelector = () => {
  const { baseMap, projection, setProjection } = useProjectionSelectorProps();

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
};

export default ProjectionSelector;
