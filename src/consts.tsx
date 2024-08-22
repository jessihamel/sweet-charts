import { ReactNode } from 'react';
import {
  geoAlbersUsa,
  geoConicConformal,
  geoConicEqualArea,
  geoEquirectangular,
  geoMercator,
  geoNaturalEarth1,
} from 'd3-geo';
import { interpolateHsl, interpolateLab, interpolateRgb } from 'd3-interpolate';
import { scaleLinear, scaleQuantize } from 'd3-scale';

export const ALBERS = 'ALBERS';
export const ALBERS_USA = 'ALBERS_USA';
export const EQUIRECTANGULAR = 'EQUIRECTANGULAR';
export const MERCATOR = 'MERCATOR';
export const NATURAL_EARTH = 'NATURAL_EARTH';
export const LAMBERT_CONFORMAL_CONIC = 'LAMBERT_CONFORMAL_CONIC';
export const ALBERS_EQUAL_AREA_CONIC = ' ALBERS_EQUAL_AREA_CONIC';

export type Projection =
  // | typeof ALBERS
  | typeof ALBERS_USA
  | typeof EQUIRECTANGULAR
  | typeof MERCATOR
  | typeof NATURAL_EARTH
  | typeof LAMBERT_CONFORMAL_CONIC
  | typeof ALBERS_EQUAL_AREA_CONIC;

export const PROJECTION_TYPE_WORLD_ONLY = 'world';
export const PROJECTION_TYPE_CONIC = 'conic';
export const PROJECTION_TYPE_CYLINDRICAL = 'cylindrical';
export const PROJECTION_TYPE_US_ONLY = 'us';

export const PROJECTIONS = {
  // [ALBERS]: { fn: geoAlbers, label: 'Albers', type: PROJECTION_TYPE_US_ONLY },
  [ALBERS_USA]: {
    fn: geoAlbersUsa,
    label: 'Albers USA',
    moreInfo: (
      <>
        This is a U.S.-centric composite projection of three geoConicEqualArea projections:
        geoAlbers is used for the lower forty-eight states, and separate conic equal-area
        projections are used for Alaska and Hawaii. The scale for Alaska is diminished: it is
        projected at 0.35× its true relative area.{' '}
        <a href="https://d3js.org/d3-geo/conic#geoAlbersUsa" target="_blank" rel="noreferrer">
          Source
        </a>
      </>
    ),
    type: PROJECTION_TYPE_US_ONLY,
  },
  [NATURAL_EARTH]: {
    fn: geoNaturalEarth1,
    label: 'Natural Earth',
    moreInfo: (
      <>
        The Natural Earth projection is a pseudocylindrical projection designed by Tom Patterson. It
        is neither conformal nor equal-area, but appealing to the eye for small-scale maps of the
        whole world.{' '}
        <a
          href="https://d3js.org/d3-geo/cylindrical#geoNaturalEarth1"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </>
    ),
    type: PROJECTION_TYPE_WORLD_ONLY,
  },
  [MERCATOR]: {
    fn: geoMercator,
    label: 'Mercator',
    moreInfo: (
      <>
        The spherical Mercator projection.{' '}
        <a href="https://d3js.org/d3-geo/cylindrical#geoMercator" target="_blank" rel="noreferrer">
          Source
        </a>
      </>
    ),
    type: PROJECTION_TYPE_CYLINDRICAL,
  },
  [EQUIRECTANGULAR]: {
    fn: geoEquirectangular,
    label: 'Equirectangular',
    moreInfo: (
      <>
        The equirectangular (plate carrée) projection.{' '}
        <a
          href="https://d3js.org/d3-geo/cylindrical#geoEquirectangular"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </>
    ),
    type: PROJECTION_TYPE_CYLINDRICAL,
  },
  [LAMBERT_CONFORMAL_CONIC]: {
    fn: geoConicConformal,
    label: 'Lambert Conformal Conic',
    moreInfo: (
      <>
        The Lambert conformal conic projection.{' '}
        <a
          href="https://github.com/d3/d3-geo-projection?tab=readme-ov-file#geoConicConformal"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </>
    ),
    type: PROJECTION_TYPE_CONIC,
  },
  [ALBERS_EQUAL_AREA_CONIC]: {
    conic: true,
    fn: geoConicEqualArea,
    global: false,
    label: 'Albers Equal Area',
    moreInfo: (
      <>
        Albers’ conic equal-area projection.{' '}
        <a
          href="https://github.com/d3/d3-geo-projection?tab=readme-ov-file#geoConicEqualArea"
          target="_blank"
          rel="noreferrer"
        >
          Source
        </a>
      </>
    ),
    type: PROJECTION_TYPE_CONIC,
  },
};

const WORLD_ONLY_PROJECTION_OPTIONS = Object.entries(PROJECTIONS)
  .filter(([_, v]) => v.type === PROJECTION_TYPE_WORLD_ONLY)
  .map(([k]) => k);

const CYLINDRICAL_PROJECTION_OPTIONS = Object.entries(PROJECTIONS)
  .filter(([_, v]) => v.type === PROJECTION_TYPE_CYLINDRICAL)
  .map(([k]) => k);

const CONIC_PROJECTION_OPTIONS = Object.entries(PROJECTIONS)
  .filter(([_, v]) => v.type == PROJECTION_TYPE_CONIC)
  .map(([k]) => k);

const US_ONLY_PROJECTION_OPTIONS = Object.entries(PROJECTIONS)
  .filter(([_, v]) => v.type == PROJECTION_TYPE_US_ONLY)
  .map(([k]) => k);

const US_PROJECTION_OPTIONS = [...US_ONLY_PROJECTION_OPTIONS, ...CYLINDRICAL_PROJECTION_OPTIONS];

const CYLINDRICAL_AND_CONIC_PROJECTION_OPTIONS = [
  ...CYLINDRICAL_PROJECTION_OPTIONS,
  ...CONIC_PROJECTION_OPTIONS,
];

const WORLD_PROJECTION_OPTIONS = [
  ...WORLD_ONLY_PROJECTION_OPTIONS,
  ...CYLINDRICAL_PROJECTION_OPTIONS,
];

const STATE_FIPS = {
  '01': 'Alabama',
  '02': 'Alaska',
  '04': 'Arizona',
  '05': 'Arkansas',
  '06': 'California',
  '08': 'Colorado',
  '09': 'Connecticut',
  '10': 'Delaware',
  // 11: 'District of Columbia',
  12: 'Florida',
  13: 'Georgia',
  15: 'Hawaii',
  16: 'Idaho',
  17: 'Illinois',
  18: 'Indiana',
  19: 'Iowa',
  20: 'Kansas',
  21: 'Kentucky',
  22: 'Louisiana',
  23: 'Maine',
  24: 'Maryland',
  25: 'Massachusetts',
  26: 'Michigan',
  27: 'Minnesota',
  28: 'Mississippi',
  29: 'Missouri',
  30: 'Montana',
  31: 'Nebraska',
  32: 'Nevada',
  33: 'New Hampshire',
  34: 'New Jersey',
  35: 'New Mexico',
  36: 'New York',
  37: 'North Carolina',
  38: 'North Dakota',
  39: 'Ohio',
  40: 'Oklahoma',
  41: 'Oregon',
  42: 'Pennsylvania',
  44: 'Rhode Island',
  45: 'South Carolina',
  46: 'South Dakota',
  47: 'Tennessee',
  48: 'Texas',
  49: 'Utah',
  50: 'Vermont',
  51: 'Virginia',
  53: 'Washington',
  54: 'West Virginia',
  55: 'Wisconsin',
  56: 'Wyoming',
};

export type BaseMapOption = {
  dataKeys: string[];
  defaultProjection: Projection;
  label: string;
  parallels?: [number, number];
  rotate?: [number, number];
  moreInfo: ReactNode;
  projectionOptions: Projection[];
};

export const BASE_MAP_OPTIONS = {
  'world/ne_110m_admin_0_countries': {
    dataKeys: ['NAME', 'ISO_A2', 'ISO_A3', 'REGION_UN', 'REGION_WB'],
    defaultProjection: NATURAL_EARTH,
    label: 'World - Countries - Natural Earth 110m Cultural Vectors Admin 0',
    moreInfo: (
      <>
        Simple world map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/110m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: WORLD_PROJECTION_OPTIONS,
  },
  'world/ne_50m_admin_0_countries': {
    dataKeys: ['NAME', 'ISO_A2', 'ISO_A3', 'REGION_UN', 'REGION_WB'],
    defaultProjection: NATURAL_EARTH,
    label: 'World - Countries - Natural Earth 50m Cultural Vectors Admin 0',
    moreInfo: (
      <>
        Medium detail world map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: WORLD_PROJECTION_OPTIONS,
  },
  'au/ne_50m_admin_1_states_provinces_lakes_AU': {
    dataKeys: ['name'],
    defaultProjection: LAMBERT_CONFORMAL_CONIC,
    label: 'Australia - States - Natural Earth 50m Cultural Vectors Admin 1 States, Provinces',
    parallels: [-18, -36],
    rotate: [-132, 0],
    moreInfo: (
      <>
        Medium detail Australia States map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: CYLINDRICAL_AND_CONIC_PROJECTION_OPTIONS,
  },
  'br/ne_50m_admin_1_states_provinces_lakes_BR': {
    dataKeys: ['name'],
    defaultProjection: ALBERS_EQUAL_AREA_CONIC,
    label: 'Brazil - Natural Earth 50m Cultural Vectors Admin 1 States, Provinces',
    parallels: [-2, -22],
    rotate: [54, 0],
    moreInfo: (
      <>
        Medium detail Brazil map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: CYLINDRICAL_AND_CONIC_PROJECTION_OPTIONS,
  },
  'ca/ne_50m_admin_1_states_provinces_lakes_CA': {
    dataKeys: ['name'],
    defaultProjection: LAMBERT_CONFORMAL_CONIC,
    label: 'Canada - Natural Earth 50m Cultural Vectors Admin 1 States, Provinces',
    parallels: [49, 77],
    rotate: [91.867, 0],
    moreInfo: (
      <>
        Medium detail Canada map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: CYLINDRICAL_AND_CONIC_PROJECTION_OPTIONS,
  },
  'cn/ne_50m_admin_1_states_provinces_lakes_CN': {
    dataKeys: ['name', 'name_local'],
    defaultProjection: MERCATOR,
    label: 'China - Natural Earth 50m Cultural Vectors Admin 1 States, Provinces',
    moreInfo: (
      <>
        Medium detail China map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: CYLINDRICAL_PROJECTION_OPTIONS,
  },
  'us/ne_110m_admin_1_states_provinces_lakes_US': {
    dataKeys: ['name', 'fips', 'region'],
    defaultProjection: ALBERS_USA,
    label: 'US - States - Natural Earth 110m Cultural Vectors Admin 1',
    moreInfo: (
      <>
        Simple US States map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/110m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: US_PROJECTION_OPTIONS,
  },
  'us/ne_50m_admin_1_states_provinces_lakes_US': {
    dataKeys: ['name', 'fips', 'region'],
    defaultProjection: ALBERS_USA,
    label: 'US - States - Natural Earth 50m Cultural Vectors Admin 1',
    moreInfo: (
      <>
        Medium detail US States map from{' '}
        <a
          href="https://www.naturalearthdata.com/downloads/50m-cultural-vectors/"
          target="_blank"
          rel="noreferrer"
        >
          Natural Earth
        </a>
      </>
    ),
    projectionOptions: US_PROJECTION_OPTIONS,
  },
  ...Object.entries(STATE_FIPS)
    .sort((a, b) => +a[0] - +b[0])
    .reduce((a, [fips, state]) => {
      const fileName = `us/states/cb_2023_us_county_5m_${state.toLowerCase()}_${fips}`;
      a[fileName] = {
        dataKeys: ['NAME', 'COUNTYFP'],
        defaultProjection: ALBERS_USA,
        label: `US - ${state} - County - US Census 2023 Cartographic Boundary - 1 : 5,000,000`,
        moreInfo: (
          <>
            County map from{' '}
            <a
              href="https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html"
              target="_blank"
              rel="noreferrer"
            >
              US Census Cartographic Boundary Files 2023
            </a>
          </>
        ),
        projectionOptions: US_PROJECTION_OPTIONS,
      } as BaseMapOption;
      return a;
    }, {} as Record<string, BaseMapOption>),
} as Record<string, BaseMapOption>;

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
        map data values linearly between <b>two values</b> in the color scale.
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

export const DOMAIN_TYPE_EXTENT = 'DOMAIN_TYPE_EXTENT';
export const DOMAIN_TYPE_MANUAL = 'DOMAIN_TYPE_MANUAL';

export const DOMAIN_TYPE_OPTIONS = {
  [DOMAIN_TYPE_EXTENT]: {
    label: 'Data extent',
    moreInfo: 'The colors are assigned based on the min and max of the data',
  },
  [DOMAIN_TYPE_MANUAL]: {
    label: 'Manual',
    moreInfo: 'Manually set the min and the max of the dataset',
  },
};
