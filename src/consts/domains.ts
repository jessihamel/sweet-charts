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
