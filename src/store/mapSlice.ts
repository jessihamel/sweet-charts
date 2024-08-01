import { createSlice } from '@reduxjs/toolkit';
import { FeatureCollection } from 'geojson';

import {
  BASE_MAP_OPTIONS,
  COLOR_SCALE_QUANTIZE,
  ColorInterpolation,
  ColorScale,
  DOMAIN_TYPE_MANUAL,
  DOMAIN_TYPE_OPTIONS,
  INTERPOLATE_RGB,
  Projection,
} from '../consts';

export interface MapState {
  baseMap: string;
  colorInterpolation: ColorInterpolation;
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
  colorInterpolation: INTERPOLATE_RGB,
  colors: ['#d1c4e9', '#9575cd', '#673ab7', '#512da8', '#311b92'],
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
    setColorInterpolation: (state, action) => {
      state.colorInterpolation = action.payload;
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
  setColorInterpolation,
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
