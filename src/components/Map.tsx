import { geoPath } from 'd3-geo';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';

import { BASE_MAP_OPTIONS, PROJECTIONS, PROJECTION_TYPE_CONIC } from '../consts';
import { useAppSelector } from '../hooks';
import { featureColorArrSelector } from '../store/mapSelectors';
import Download from './Download';
import Legend from './Legend';

const useMapProps = () => {
  const baseMap = useAppSelector(state => state.map.baseMap);
  const mapData = useAppSelector(state => state.map.mapData);
  const mapLoading = useAppSelector(state => state.map.mapLoading);
  const projection = useAppSelector(state => state.map.projection);

  const featureColorArr = useAppSelector(featureColorArrSelector);

  return {
    baseMap,
    featureColorArr,
    mapData,
    mapLoading,
    projection,
  };
};

const Map = () => {
  const { baseMap, featureColorArr, mapData, projection, mapLoading } = useMapProps();

  const [mapWidth, setMapWidth] = useState(0);
  const mapHeight = mapWidth * 0.5;
  const padding = 0.05;
  const innerWidth = mapWidth * (1 - padding);
  const innerHeight = mapHeight * (1 - padding);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGAElement>(null);

  useEffect(() => {
    function _measure() {
      if (!wrapperRef.current) {
        return;
      }
      const width = wrapperRef.current.getBoundingClientRect().width;
      setMapWidth(width);
    }
    _measure();
    const debouncedMeasure = debounce(_measure, 100, {
      leading: true,
      trailing: true,
    });
    window.addEventListener('resize', debouncedMeasure);
    return function cleanup() {
      window.removeEventListener('resize', debouncedMeasure);
    };
  }, []);

  const projectionFn = PROJECTIONS[projection].fn();

  if (PROJECTIONS[projection].type === PROJECTION_TYPE_CONIC) {
    projectionFn.parallels(BASE_MAP_OPTIONS[baseMap].parallels);
  }

  if (PROJECTIONS[projection].type === PROJECTION_TYPE_CONIC) {
    projectionFn.rotate(BASE_MAP_OPTIONS[baseMap].rotate);
  }

  if (mapData) {
    projectionFn.fitSize([innerWidth, innerHeight], mapData);
  }

  const path = geoPath().projection(projectionFn);

  return (
    <div className="relative grow mx-4 flex flex-col gap-8" ref={wrapperRef}>
      {mapLoading && (
        <div className="absolute flex items-center w-full h-full justify-center">
          <div>Loading...</div>
        </div>
      )}
      {!mapLoading && mapWidth && mapData && (
        <>
          <div style={{ height: mapHeight + 'px' }}>
            <svg
              className="absolute"
              ref={mapRef}
              style={{
                height: mapHeight + 'px',
                width: mapWidth + 'px',
              }}
            >
              <g transform={`translate(${(mapWidth * padding) / 2},${(mapWidth * padding) / 2})`}>
                <g id="map-layer">
                  {mapData.features.map((featureData, i) => (
                    <path
                      d={path(featureData)}
                      fill={featureColorArr[i] || 'none'}
                      key={`${baseMap}-${i}`}
                      stroke="black"
                    />
                  ))}
                </g>
                <Legend mapHeight={innerHeight} />
              </g>
            </svg>
          </div>
          <Download mapSvg={mapRef.current} />
        </>
      )}
    </div>
  );
};

export default Map;
