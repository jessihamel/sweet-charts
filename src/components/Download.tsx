import { downloadPNG, downloadSVG } from '../utils';

const buttonClass = 'px-14 py-6 border border-gray-300 rounded-md hover:bg-slate-100';
function Download({ mapSvg }: { mapSvg: SVGElement | null }) {
  return (
    <div className="self-center md:mb-4">
      <div className="flex gap-4">
        <button className={buttonClass} onClick={() => (mapSvg ? downloadSVG(mapSvg) : false)}>
          Download Map SVG
        </button>
        <button className={buttonClass} onClick={() => (mapSvg ? downloadPNG(mapSvg) : false)}>
          Download Map PNG
        </button>
      </div>
    </div>
  );
}

export default Download;
