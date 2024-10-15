import { interpolateHsl, interpolateLab, interpolateRgb } from 'd3-interpolate';
import { scaleLinear, scaleQuantize } from 'd3-scale';
import {
  interpolateBlues,
  interpolateGreens,
  interpolateGreys,
  interpolateInferno,
  interpolateMagma,
  interpolateOranges,
  interpolateReds,
  interpolateViridis,
} from 'd3-scale-chromatic';

export const COLOR_SCALE_QUANTIZE = 'COLOR_SCALE_QUANTIZE';
export const COLOR_SCALE_LINEAR = 'COLOR_SCALE_LINEAR';

export const SCALE_TYPE_LINEAR = 'SCALE_TYPE_LINEAR';
export const SCALE_TYPE_DISCRETE = 'SCALE_TYPE_DISCRETE';

export type ColorScale = typeof COLOR_SCALE_QUANTIZE | typeof COLOR_SCALE_LINEAR;

export const COLOR_SCALE_OPTIONS = {
  [COLOR_SCALE_QUANTIZE]: {
    fn: scaleQuantize,
    label: 'Quantize',
    moreInfo: (
      <>
        <a href="https://d3js.org/d3-scale/quantize#scaleQuantize" target="_blank" rel="noreferrer">
          Quantize scales
        </a>{' '}
        map data values to discrete values in the color scale. The input domain is divided uniformly
        into buckets based on the number of colors selected.
      </>
    ),
    type: SCALE_TYPE_DISCRETE,
  },
  [COLOR_SCALE_LINEAR]: {
    fn: scaleLinear,
    label: 'Linear',
    moreInfo: (
      <>
        <a href="https://d3js.org/d3-scale/linear" target="_blank" rel="noreferrer">
          Linear scales
        </a>{' '}
        map data values to a linear scale. In custom color mode, data is mapped between{' '}
        <b>two values</b> in the color scale. In palette color mode, data is mapped across the
        extent of palette.
      </>
    ),
    type: SCALE_TYPE_LINEAR,
  },
};

export const INTERPOLATE_RGB = 'INTERPOLATE_RGB';
export const INTERPOLATE_HSL = 'INTERPOLATE_HSL';
export const INTERPOLATE_LAB = 'INTERPOLATE_LAB';

export type ColorInterpolation =
  | typeof INTERPOLATE_RGB
  | typeof INTERPOLATE_HSL
  | typeof INTERPOLATE_LAB;

export const COLOR_INTERPOLATION_OPTIONS = {
  [INTERPOLATE_RGB]: {
    label: 'Inerpolate RGB',
    fn: interpolateRgb,
    moreInfo: (
      <a
        href="https://d3js.org/d3-interpolate/color#interpolateRgb"
        target="_blank"
        rel="noreferrer"
      >
        interpolateRgb
      </a>
    ),
  },
  [INTERPOLATE_HSL]: {
    label: 'Inerpolate HSL',
    fn: interpolateHsl,
    moreInfo: (
      <a
        href="https://d3js.org/d3-interpolate/color#interpolateHsl"
        target="_blank"
        rel="noreferrer"
      >
        interpolateHsl
      </a>
    ),
  },
  [INTERPOLATE_LAB]: {
    label: 'Inerpolate LAB',
    fn: interpolateLab,
    moreInfo: (
      <a
        href="https://d3js.org/d3-interpolate/color#interpolateLab"
        target="_blank"
        rel="noreferrer"
      >
        interpolateLab
      </a>
    ),
  },
};

const BLUES = 'BLUES';
const GREENS = 'GREENS';
const GREYS = 'GREYS';
const INFERNO = 'INFERNO';
const MAGMA = 'MAGMA';
const ORANGES = 'ORANGES';
const REDS = 'REDS';
const VIRIDIS = 'VIRIDIS';

export type ColorPaletteKey =
  | typeof BLUES
  | typeof GREENS
  | typeof GREYS
  | typeof INFERNO
  | typeof MAGMA
  | typeof ORANGES
  | typeof REDS
  | typeof VIRIDIS;

export const COLOR_PALETTE_OPTIONS = {
  [BLUES]: {
    label: 'Blues',
    fn: interpolateBlues,
    reverse: false,
  },
  [GREENS]: {
    label: 'Greens',
    fn: interpolateGreens,
    reverse: false,
  },
  [GREYS]: {
    label: 'Greys',
    fn: interpolateGreys,
    reverse: false,
  },
  [INFERNO]: {
    label: 'Inferno',
    fn: interpolateInferno,
    reverse: true,
  },
  [MAGMA]: {
    label: 'Magma',
    fn: interpolateMagma,
    reverse: true,
  },
  [ORANGES]: {
    label: 'Oranges',
    fn: interpolateOranges,
    reverse: false,
  },
  [REDS]: {
    label: 'Reds',
    fn: interpolateReds,
    reverse: false,
  },
  [VIRIDIS]: {
    label: 'Viridis',
    fn: interpolateViridis,
    reverse: true,
  },
};
