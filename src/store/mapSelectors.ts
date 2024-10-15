import { createSelector } from '@reduxjs/toolkit';
import { extent } from 'd3-array';
import { scaleLinear, ScaleLinear, ScaleQuantize, scaleSequential } from 'd3-scale';

import { RootState } from '.';
import {
  COLOR_INTERPOLATION_OPTIONS,
  COLOR_PALETTE_OPTIONS,
  COLOR_SCALE_OPTIONS,
  SCALE_TYPE_LINEAR,
} from '../consts/colors';
import { DOMAIN_TYPE_MANUAL } from '../consts/domains';

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

      parsedInput = parsed.reduce(
        (acc, rowArr) => {
          acc[rowArr[0]] = +rowArr[1];
          return acc;
        },
        {} as Record<string, number>,
      );
    }

    return mapData.features.map(f => parsedInput[f.properties![dataKey!]]);
  },
);

export const colorScaleFnSelector = createSelector(
  [
    featureDataSelector,
    (state: RootState) => state.map.colorMode,
    (state: RootState) => state.map.colors,
    (state: RootState) => state.map.colorPalette,
    (state: RootState) => state.map.colorScale,
    (state: RootState) => state.map.colorBuckets,
    (state: RootState) => state.map.dataDomain,
    (state: RootState) => state.map.colorInterpolation,
    (state: RootState) => state.map.domainType,
  ],
  (
    featureData,
    colorMode,
    colors,
    colorPalette,
    colorScale,
    colorBuckets,
    dataDomain,
    colorInterpolation,
    domainType,
  ) => {
    let scaleFn = (COLOR_SCALE_OPTIONS[colorScale] as any).fn() as ColorScaleFn;
    const domain =
      domainType === DOMAIN_TYPE_MANUAL ? dataDomain : (extent(featureData) as [number, number]);
    let range;

    if (colorMode === 'CUSTOM') {
      if (COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR) {
        (scaleFn as ScaleLinear<string, string>).interpolate(
          COLOR_INTERPOLATION_OPTIONS[colorInterpolation].fn,
        );
        range = [colors[0], colors[colors.length - 1]];
      } else {
        range = colors;
      }
    } else {
      const colorFn = COLOR_PALETTE_OPTIONS[colorPalette].fn;
      if (COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR) {
        if (COLOR_PALETTE_OPTIONS[colorPalette].reverse) {
          return scaleSequential(domain.map(d => d).reverse(), colorFn);
        }
        return scaleSequential(domain, colorFn);
      } else {
        const rangeFromBuckets = [...Array(colorBuckets)].map(
          (_, i) => (1 / (colorBuckets - 1)) * i,
        );
        if (COLOR_PALETTE_OPTIONS[colorPalette].reverse) {
          range = rangeFromBuckets.reverse().map(colorFn);
        } else {
          range = rangeFromBuckets.map(colorFn);
        }
      }
    }

    scaleFn.domain(domain);
    scaleFn.range(range);

    return scaleFn;
  },
);

export const featureColorArrSelector = createSelector(
  [colorScaleFnSelector, featureDataSelector],
  (colorScaleFn, featureData) => {
    return featureData.map(colorScaleFn) as string[];
  },
);
