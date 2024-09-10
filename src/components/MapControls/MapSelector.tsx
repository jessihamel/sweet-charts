import { useEffect } from 'react';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';
import { BASE_MAP_OPTIONS } from '../../consts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MapState, setBaseMap, setMapData, setMapLoading } from '../../store/mapSlice';
import { FeatureCollection } from 'geojson';

const useMapSelectorProps = () => {
  const dispatch = useAppDispatch();
  const dispatchSetBaseMap = (baseMap: MapState['baseMap']) => {
    dispatch(setBaseMap(baseMap));
  };
  const dispatchSetMapData = (mapData: MapState['mapData']) => {
    dispatch(setMapData(mapData));
  };
  const dispatchSetMapLoading = (mapLoading: MapState['mapLoading']) => {
    dispatch(setMapLoading(mapLoading));
  };

  const baseMap = useAppSelector(state => state.map.baseMap);
  const mapLoading = useAppSelector(state => state.map.mapLoading);

  return {
    baseMap,
    mapLoading,
    setBaseMap: dispatchSetBaseMap,
    setMapData: dispatchSetMapData,
    setMapLoading: dispatchSetMapLoading,
  };
};

const MapSelector = () => {
  const { baseMap, setBaseMap, setMapData, setMapLoading } = useMapSelectorProps();

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setMapLoading(true);
        const response = await fetch(`${process.env.PUBLIC_URL}/maps/${baseMap}.json`);
        const data = (await response.json()) as FeatureCollection;
        setMapData(data);
        setMapLoading(false);
      } catch (error) {
        setMapLoading(false);
      }
    };
    fetchMapData();
  }, [baseMap]);

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
};

export default MapSelector;
