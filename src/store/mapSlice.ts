import { createSlice } from '@reduxjs/toolkit';
import { FeatureCollection } from 'geojson';
import {
  COLOR_SCALE_QUANTIZE,
  ColorInterpolation,
  ColorPaletteKey,
  ColorScale,
  INTERPOLATE_RGB,
} from '../consts/colors';
import { DOMAIN_TYPE_MANUAL, DOMAIN_TYPE_OPTIONS } from '../consts/domains';
import { BASE_MAP_OPTIONS, Projection } from '../consts/projections';

export interface MapState {
  baseMap: string;
  colorBuckets: number;
  colorInterpolation: ColorInterpolation;
  colorMode: 'CUSTOM' | 'PALETTE';
  colorPalette: ColorPaletteKey;
  colors: string[];
  colorScale: ColorScale;
  dataDomain: number[];
  dataInput: string;
  dataKey: string | null;
  dataMode: 'RANDOM' | 'CUSTOM';
  domainType: keyof typeof DOMAIN_TYPE_OPTIONS;
  legendFormatError: boolean;
  legendFormat: string;
  legendUnits: string;
  mapData: FeatureCollection | null;
  mapLoading: boolean;
  projection: Projection;
}

const initialBaseMap = Object.keys(BASE_MAP_OPTIONS)[0];

const initialState: MapState = {
  baseMap: initialBaseMap,
  colorBuckets: 5,
  colorInterpolation: INTERPOLATE_RGB,
  colorMode: 'CUSTOM',
  colorPalette: 'BLUES',
  colors: ['#d7e1e8', '#b0c5d2', '#88a8bc', '#608da6', '#327391'],
  colorScale: COLOR_SCALE_QUANTIZE,
  dataDomain: [0, 1],
  dataInput: '',
  dataKey: null,
  dataMode: 'RANDOM',
  domainType: DOMAIN_TYPE_MANUAL,
  legendFormatError: false,
  legendFormat: '.1f',
  legendUnits: '',
  mapData: null,
  mapLoading: false,
  projection: BASE_MAP_OPTIONS[initialBaseMap].defaultProjection,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setBaseMap: (state, action) => {
      const baseMap = action.payload;
      state.baseMap = baseMap;
      state.projection = BASE_MAP_OPTIONS[baseMap].defaultProjection;
    },
    setColorBuckets: (state, action) => {
      const bucketsRaw = action.payload;
      const bucketsRound = Math.round(bucketsRaw);
      const clampedValue = Math.min(20, Math.max(1, bucketsRound));
      state.colorBuckets = clampedValue;
    },
    setColorInterpolation: (state, action) => {
      state.colorInterpolation = action.payload;
    },
    setColorMode: (state, action) => {
      state.colorMode = action.payload;
    },
    setColorPalette: (state, action) => {
      state.colorPalette = action.payload;
    },
    setColors: (state, action) => {
      state.colors = action.payload;
    },
    setColorScale: (state, action) => {
      state.colorScale = action.payload;
    },
    setDataInput: (state, action) => {
      state.dataInput = action.payload;
    },
    setDataKey: (state, action) => {
      state.dataKey = action.payload;
    },
    setDataMode: (state, action) => {
      state.dataMode = action.payload;
    },
    setDomain: (state, action) => {
      state.dataDomain = action.payload;
    },
    setDomainType: (state, action) => {
      state.domainType = action.payload;
    },
    setLegendFormat: (state, action) => {
      state.legendFormat = action.payload;
    },
    setLegendFormatError: (state, action) => {
      state.legendFormatError = action.payload;
    },
    setLegendUnits: (state, action) => {
      state.legendUnits = action.payload;
    },
    setMapData: (state, action) => {
      state.mapData = action.payload;
      state.dataKey = BASE_MAP_OPTIONS[state.baseMap].dataKeys[0];
    },
    setMapLoading: (state, action) => {
      state.mapLoading = action.payload;
    },
    setProjection: (state, action) => {
      state.projection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setBaseMap,
  setColorBuckets,
  setColorInterpolation,
  setColorMode,
  setColorPalette,
  setColors,
  setColorScale,
  setDataInput,
  setDataKey,
  setDataMode,
  setDomain,
  setDomainType,
  setLegendFormat,
  setLegendFormatError,
  setLegendUnits,
  setMapData,
  setMapLoading,
  setProjection,
} = mapSlice.actions;

export default mapSlice.reducer;
