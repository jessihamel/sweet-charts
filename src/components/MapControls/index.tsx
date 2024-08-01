import ColorScaleSelector from './ColorScale';
import Colors from './Colors';
import MapSelector from './MapSelector';
import ProjectionSelector from './ProjectionSelector';
import LegendStyles from './LegendStyles';
import Data from './Data';
import DomainSelector from './Domain';

const spacerClass = 'w-full h-[1px] bg-slate-200';

function MapControls() {
  return (
    <div className="md:relative controls w-full md:w-1/3 border-r border-slate-200 stretch">
      <div className="md:absolute h-full overflow-y-scroll p-4">
        <div className="flex flex-col gap-6">
          <div className={`${spacerClass} visible md:hidden`}></div>
          <MapSelector />
          <div className={spacerClass}></div>
          <Colors />
          <div className={spacerClass}></div>
          <ColorScaleSelector />
          <div className={spacerClass}></div>
          <Data />
          <div className={spacerClass}></div>
          <DomainSelector />
          <div className={spacerClass}></div>
          <LegendStyles />
          <div className={spacerClass}></div>
          <ProjectionSelector />
        </div>
      </div>
    </div>
  );
}

export default MapControls;
