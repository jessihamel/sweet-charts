import { geoPath } from 'd3-geo';
import debounce from 'lodash.debounce';
import { useContext, useEffect, useRef, useState } from 'react';

import { BASE_MAP_OPTIONS, PROJECTIONS, PROJECTION_TYPE_CONIC } from '../consts';
import { AppContext } from '../AppContext';
import Legend from './Legend';
import Download from './Download';

function Map() {
  const { baseMap, featureColorArr, mapData, projection, mapLoading } = useContext(AppContext);
  const [mapWidth, setMapWidth] = useState(0);
  const mapHeight = mapWidth * 0.5;

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
    projectionFn.fitSize([mapWidth, mapHeight], mapData);
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
              {mapData.features.map((featureData, i) => (
                <path
                  d={path(featureData)}
                  fill={featureColorArr[i] || 'none'}
                  key={`${baseMap}-${i}`}
                  stroke="black"
                />
              ))}
              <Legend mapHeight={mapHeight} />
            </svg>
          </div>
          <Download mapSvg={mapRef.current} />
        </>
      )}
    </div>
  );
}

export default Map;
