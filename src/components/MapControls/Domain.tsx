import { DOMAIN_TYPE_MANUAL, DOMAIN_TYPE_OPTIONS } from '../../consts/domains';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { MapState, setDomain, setDomainType } from '../../store/mapSlice';
import { Label, MoreInfo, NUMERIC_INPUT_CLASS, SELECT_CLASS } from './Shared';

const useDomainProps = () => {
  const dispatch = useAppDispatch();
  const dispatchSetDomainType = (domainType: MapState['domainType']) => {
    dispatch(setDomainType(domainType));
  };
  const dispatchSetDomain = (domain: MapState['dataDomain']) => {
    dispatch(setDomain(domain));
  };

  const domain = useAppSelector(state => state.map.dataDomain);
  const domainType = useAppSelector(state => state.map.domainType);

  return {
    domain,
    domainType,
    setDomain: dispatchSetDomain,
    setDomainType: dispatchSetDomainType,
  };
};

const DomainSelector = () => {
  const { domain, domainType, setDomain, setDomainType } = useDomainProps();

  return (
    <div>
      <Label>Select Domain Type</Label>
      <div className="flex flex-col gap-4">
        <div className="ml-4">
          <select
            id="domain-type"
            className={SELECT_CLASS}
            onChange={event => setDomainType(event.target.value as MapState['domainType'])}
            value={domainType}
          >
            {Object.entries(DOMAIN_TYPE_OPTIONS).map(([k, v]) => (
              <option className="" key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <MoreInfo>{DOMAIN_TYPE_OPTIONS[domainType].moreInfo}</MoreInfo>
        </div>
        {domainType === DOMAIN_TYPE_MANUAL && (
          <div>
            <Label>Domain Min/Max</Label>
            <div className="ml-4 mt-2 flex gap-6">
              <div className="flex flex-col gap-1">
                <div className="text-sm font-light uppercase">Min</div>
                <input
                  className={NUMERIC_INPUT_CLASS}
                  onChange={event => setDomain([+event.target.value, domain[1]])}
                  type="number"
                  value={domain[0]}
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="text-sm font-light uppercase">Max</div>
                <input
                  className={NUMERIC_INPUT_CLASS}
                  onChange={event => setDomain([domain[0], +event.target.value])}
                  type="number"
                  value={domain[1]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainSelector;
