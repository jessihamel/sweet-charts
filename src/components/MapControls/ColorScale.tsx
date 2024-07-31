import { useContext } from 'react';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';
import { AppContext } from '../../AppContext';
import {
  COLOR_INTERPOLATION_OPTIONS,
  COLOR_SCALE_OPTIONS,
  ColorInterpolation,
  ColorScale,
  SCALE_TYPE_LINEAR,
} from '../../consts';

function ColorScaleSelector() {
  const { colorInterpolation, colorScale, setColorInterpolation, setColorScale } =
    useContext(AppContext);

  return (
    <>
      <div>
        <Label>Select Color Scale Type</Label>
        <div className="ml-4">
          <select
            id="colorScale"
            className={SELECT_CLASS}
            onChange={event => setColorScale(event.target.value as ColorScale)}
            value={colorScale}
          >
            {Object.entries(COLOR_SCALE_OPTIONS).map(([k, v]) => (
              <option className="" key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <MoreInfo>{COLOR_SCALE_OPTIONS[colorScale].moreInfo}</MoreInfo>
        </div>
      </div>
      {COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR && (
        <div>
          <Label>Select Color Interpolation</Label>
          <div className="ml-4">
            <select
              id="colorInterpolation"
              className={SELECT_CLASS}
              onChange={event => setColorInterpolation(event.target.value as ColorInterpolation)}
              value={colorInterpolation}
            >
              {Object.entries(COLOR_INTERPOLATION_OPTIONS).map(([k, v]) => (
                <option className="" key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
            <MoreInfo>Source: {COLOR_INTERPOLATION_OPTIONS[colorInterpolation].moreInfo}</MoreInfo>
          </div>
        </div>
      )}
    </>
  );
}

export default ColorScaleSelector;
