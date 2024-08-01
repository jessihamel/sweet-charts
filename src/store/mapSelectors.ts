import { createSelector } from '@reduxjs/toolkit';
import { extent } from 'd3-array';
import { ScaleLinear, ScaleQuantize } from 'd3-scale';

import {
  COLOR_INTERPOLATION_OPTIONS,
  COLOR_SCALE_OPTIONS,
  DOMAIN_TYPE_MANUAL,
  SCALE_TYPE_LINEAR,
} from '../consts';
import { RootState } from '.';

type ColorScaleFn = ScaleLinear<string, string> | ScaleQuantize<string, string>;

const dataInputSelector = (state: RootState) => state.map.dataInput;
const mapDataSelector = (state: RootState) => state.map.mapData;
const dataModeSelector = (state: RootState) => state.map.dataMode;
const dataKeySelector = (state: RootState) => state.map.dataKey;

export const featureDataSelector = createSelector(
  [mapDataSelector, dataModeSelector, dataInputSelector, dataKeySelector],
  (mapData, dataMode, dataInput, dataKey) => {
    if (!mapData?.features) {
      return [];
    }
    if (dataMode === 'RANDOM') {
      return mapData.features.map(Math.random);
    }

    let parsedInput: Record<string, number> = {};

    if (dataInput) {
      const parsed = dataInput.split('\n').map(row => row.split(','));

      parsedInput = parsed.reduce((acc, rowArr) => {
        acc[rowArr[0]] = +rowArr[1];
        return acc;
      }, {} as Record<string, number>);
    }

    return mapData.features.map(f => parsedInput[f.properties![dataKey!]]);
  }
);

export const colorScaleFnSelector = createSelector(
  [
    featureDataSelector,
    (state: RootState) => state.map.colorScale,
    (state: RootState) => state.map.colors,
    (state: RootState) => state.map.dataDomain,
    (state: RootState) => state.map.colorInterpolation,
    (state: RootState) => state.map.domainType,
  ],
  (featureData, colorScale, colors, dataDomain, colorInterpolation, domainType) => {
    const scaleFn = (COLOR_SCALE_OPTIONS[colorScale] as any).fn() as ColorScaleFn;

    let colorRange = colors;

    if (COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR) {
      (scaleFn as ScaleLinear<string, string>).interpolate(
        COLOR_INTERPOLATION_OPTIONS[colorInterpolation].fn
      );
      colorRange = [colors[0], colors[colors.length - 1]];
    }

    const domain = domainType === DOMAIN_TYPE_MANUAL ? dataDomain : extent(featureData);

    scaleFn.domain(domain);
    scaleFn.range(colorRange);

    return scaleFn;
  }
);

export const featureColorArrSelector = createSelector(
  [colorScaleFnSelector, featureDataSelector],
  (colorScaleFn, featureData) => {
    return featureData.map(colorScaleFn) as string[];
  }
);
