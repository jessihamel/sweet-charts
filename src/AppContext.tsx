import { ScaleLinear, ScaleQuantize } from 'd3-scale';
import { FeatureCollection } from 'geojson';
import debounce from 'lodash.debounce';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  BASE_MAP_OPTIONS,
  COLOR_INTERPOLATION_OPTIONS,
  COLOR_SCALE_OPTIONS,
  COLOR_SCALE_QUANTIZE,
  ColorInterpolation,
  ColorScale,
  INTERPOLATE_RGB,
  Projection,
  SCALE_TYPE_LINEAR,
} from './consts';

type ColorScaleFn = ScaleLinear<string, string> | ScaleQuantize<string, string>;

type AppState = {
  baseMap: string;
  colorDomain: number[];
  colorInterpolation: ColorInterpolation;
  colors: string[];
  colorScale: ColorScale;
  colorScaleFn: ColorScaleFn;
  dataInput: string;
  dataKey: string | null;
  dataMode: 'RANDOM' | 'CUSTOM';
  headerHeight: number;
  headerRef: React.MutableRefObject<HTMLDivElement | undefined>;
  featureColorArr: string[];
  legendUnits: string;
  mapData: FeatureCollection | null;
  mapLoading: boolean;
  projection: Projection;
  setBaseMap: React.Dispatch<React.SetStateAction<string>>;
  setColorInterpolation: React.Dispatch<React.SetStateAction<ColorInterpolation>>;
  setColors: React.Dispatch<React.SetStateAction<string[]>>;
  setColorScale: React.Dispatch<React.SetStateAction<ColorScale>>;
  setDataInput: React.Dispatch<React.SetStateAction<string>>;
  setDataKey: React.Dispatch<React.SetStateAction<string | null>>;
  setDataMode: React.Dispatch<React.SetStateAction<'RANDOM' | 'CUSTOM'>>;
  setLegendUnits: React.Dispatch<React.SetStateAction<string>>;
  setMapData: React.Dispatch<React.SetStateAction<FeatureCollection | null>>;
  setProjection: React.Dispatch<React.SetStateAction<Projection | null>>;
};

const AppContext = createContext<AppState>(undefined as any as AppState);

function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [mapLoading, setMapLoading] = useState(false);
  const [baseMap, setBaseMap] = useState(Object.keys(BASE_MAP_OPTIONS)[0]);
  const [mapData, setMapData] = useState<AppState['mapData']>(null);
  const [projection, setProjection] = useState<Projection | null>(null);

  const [colors, setColors] = useState(['#d1c4e9', '#9575cd', '#673ab7', '#512da8', '#311b92']);
  const [colorScale, setColorScale] = useState<ColorScale>(COLOR_SCALE_QUANTIZE);
  const [colorDomain, setColorDomain] = useState([0, 1]);
  const [colorInterpolation, setColorInterpolation] = useState<ColorInterpolation>(INTERPOLATE_RGB);

  const [dataInput, setDataInput] = useState('');
  const [dataMode, setDataMode] = useState<AppState['dataMode']>('CUSTOM');
  const [dataKey, setDataKey] = useState<string | null>(null);

  const [legendUnits, setLegendUnits] = useState('');
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>();

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

  const parsedInputHash = useMemo(() => {
    if (!dataInput) {
      return {};
    }
    const parsed = dataInput.split('\n').map(row => row.split(','));

    const parsedHash = parsed.reduce((acc, rowArr) => {
      acc[rowArr[0]] = +rowArr[1];
      return acc;
    }, {} as Record<string, number>);

    return parsedHash;
  }, [dataInput]);

  const featureData = useMemo(() => {
    if (!mapData?.features) {
      return [];
    }
    if (dataMode === 'RANDOM') {
      return mapData.features.map(_ => Math.random());
    }
    return mapData.features.map(f => parsedInputHash[f.properties![dataKey!]]);
  }, [dataKey, dataMode, mapData, parsedInputHash]);

  const colorScaleFn = useMemo(() => {
    const scaleFn = (COLOR_SCALE_OPTIONS[colorScale].fn as any)() as ColorScaleFn;

    let colorRange = colors;

    if (COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR) {
      (scaleFn as ScaleLinear<string, string>).interpolate(
        COLOR_INTERPOLATION_OPTIONS[colorInterpolation].fn
      );
      colorRange = [colors[0], colors[colors.length - 1]];
    }

    scaleFn.domain(colorDomain);
    scaleFn.range(colorRange);

    return scaleFn;
  }, [colorDomain, colorInterpolation, colors, colorScale]);

  const featureColorArr = useMemo(() => {
    return featureData.map(colorScaleFn) as string[];
  }, [colorScaleFn, featureData]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setMapLoading(true);
        const response = await fetch(`${process.env.PUBLIC_URL}/maps/${baseMap}.json`);
        const data = (await response.json()) as FeatureCollection;
        setMapData(data);
        setDataKey(BASE_MAP_OPTIONS[baseMap].dataKeys[0]);
        setMapLoading(false);
      } catch (error) {
        setMapLoading(false);
      }
    };
    fetchMapData();
  }, [baseMap]);

  useEffect(() => {
    setProjection(null);
  }, [baseMap]);

  return (
    <AppContext.Provider
      value={{
        baseMap,
        colorDomain,
        colorInterpolation,
        colors,
        colorScale,
        colorScaleFn,
        dataInput,
        dataKey,
        dataMode,
        headerHeight,
        headerRef,
        featureColorArr,
        legendUnits,
        mapData,
        mapLoading,
        projection: projection || BASE_MAP_OPTIONS[baseMap].defaultProjection,
        setBaseMap,
        setColorInterpolation,
        setColorScale,
        setColors,
        setDataInput,
        setDataKey,
        setDataMode,
        setLegendUnits,
        setMapData,
        setProjection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext, AppStateProvider };
