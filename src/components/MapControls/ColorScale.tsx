import {
  COLOR_INTERPOLATION_OPTIONS,
  COLOR_SCALE_OPTIONS,
  ColorInterpolation,
  ColorScale,
  SCALE_TYPE_LINEAR,
} from '../../consts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MapState, setColorInterpolation, setColorScale } from '../../store/mapSlice';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';

const useColorScaleProps = () => {
  const dispatch = useAppDispatch();
  const dispatchSetColorScale = (colorScale: MapState['colorScale']) => {
    dispatch(setColorScale(colorScale));
  };
  const dispatchSetColorInterpolation = (colorInterplation: MapState['colorInterpolation']) => {
    dispatch(setColorInterpolation(colorInterplation));
  };

  const colorScale = useAppSelector(state => state.map.colorScale);
  const colorInterpolation = useAppSelector(state => state.map.colorInterpolation);

  return {
    colorInterpolation,
    colorScale,
    setColorInterpolation: dispatchSetColorInterpolation,
    setColorScale: dispatchSetColorScale,
  };
};

const ColorScaleSelector = () => {
  const { colorInterpolation, colorScale, setColorScale, setColorInterpolation } =
    useColorScaleProps();

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
};

export default ColorScaleSelector;
