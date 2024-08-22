import { useAppDispatch, useAppSelector } from '../../hooks';
import { MapState, setLegendFormat, setLegendUnits } from '../../store/mapSlice';
import { Label, MoreInfo } from './Shared';

const useLegendStylesProps = () => {
  const dispatch = useAppDispatch();
  const dispatchSetLegendUnits = (legendUnits: MapState['legendUnits']) => {
    dispatch(setLegendUnits(legendUnits));
  };
  const dispatchSetLegendFormat = (legendFormat: MapState['legendFormat']) => {
    dispatch(setLegendFormat(legendFormat));
  };

  const legendFormat = useAppSelector(state => state.map.legendFormat);
  const legendUnits = useAppSelector(state => state.map.legendUnits);

  return {
    legendFormat,
    legendUnits,
    setLegendFormat: dispatchSetLegendFormat,
    setLegendUnits: dispatchSetLegendUnits,
  };
};

const LegendStyles = () => {
  const { legendFormat, legendUnits, setLegendFormat, setLegendUnits } = useLegendStylesProps();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>
          Set Legend Units <span className="normal-case">(%, K, etc)</span>
        </Label>
        <div className="ml-4 mt-4">
          <input
            className="w-16 rounded-sm border border-brand px-1 text-right"
            onChange={e => setLegendUnits(e.target.value)}
            value={legendUnits}
            type="text"
          />
        </div>
      </div>
      <div>
        <Label>
          Set Legend Formatting <span className="normal-case">(~s, %, $.2f, etc)</span>
        </Label>
        <div className="ml-4 mt-4">
          <input
            className="w-16 rounded-sm border border-brand px-1 text-right"
            onChange={e => setLegendFormat(e.target.value)}
            value={legendFormat}
            type="text"
          />
          <MoreInfo>
            Format your legend by using{' '}
            <a href="https://d3js.org/d3-format" target="_blank" rel="noreferrer">
              d3-format strings
            </a>
            . For example an input of ".0%" will round to whole numbers and add a percent sign, or
            ",.2r" will group the numbers by thousands with two significant digits.
          </MoreInfo>
        </div>
      </div>
    </div>
  );
};

export default LegendStyles;
