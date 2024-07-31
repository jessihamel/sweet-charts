import { useContext } from 'react';
import { Label, MoreInfo, SELECT_CLASS } from './Shared';
import { AppContext } from '../../AppContext';
import { COLOR_SCALE_OPTIONS, ColorScale, DOMAIN_TYPE_OPTIONS } from '../../consts';

function DomainSelector() {
  const { colorScale, setColorScale } = useContext(AppContext);

  return (
    <div>
      <Label>Select Domain</Label>
      <select
        id="colorScale"
        className={SELECT_CLASS}
        onChange={event => setColorScale(event.target.value as ColorScale)}
        value={colorScale}
      >
        {Object.entries(DOMAIN_TYPE_OPTIONS).map(([k, v]) => (
          <option className="" key={k} value={k}>
            {v.label}
          </option>
        ))}
      </select>
      <MoreInfo>{DOMAIN_TYPE_OPTIONS[colorScale].moreInfo}</MoreInfo>
    </div>
  );
}

export default DomainSelector;
