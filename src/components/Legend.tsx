import { useContext } from 'react';

import { COLOR_SCALE_OPTIONS, SCALE_TYPE_DISCRETE, SCALE_TYPE_LINEAR } from '../consts';
import { AppContext } from '../AppContext';
import { scaleLinear, scaleQuantize } from 'd3-scale';

function Legend({ mapHeight }: { mapHeight: number }) {
  const { colorScale, colorScaleFn, legendUnits } = useContext(AppContext);

  const legendPadding = mapHeight * 0.02;

  if (COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_DISCRETE) {
    const rectWidth = mapHeight * 0.05;
    const rectPadding = rectWidth * 0.4;
    const domain = colorScaleFn.domain();
    const scaleValues = [domain[0], ...colorScaleFn.thresholds(), domain[1]];
    const fontSize = Math.round(rectWidth * 0.8);
    const fullLegendHeight =
      colorScaleFn.range().length * rectWidth +
      (colorScaleFn.range().length - 2) * rectPadding +
      legendPadding * 2;
    const legendY = mapHeight - fullLegendHeight;
    return (
      <g id="legend" transform={`translate(${legendPadding},${legendY})`}>
        {colorScaleFn.range().map((color, i) => {
          const translateY = i * (rectWidth + rectPadding);
          const text = `${scaleValues[i]}${legendUnits} – ${scaleValues[i + 1]}${legendUnits}`;
          return (
            <g key={color} transform={`translate(0,${translateY})`}>
              <rect width={rectWidth} height={rectWidth} fill={color} />
              <text
                x={rectWidth + legendPadding}
                y={rectWidth * 0.75}
                fontFamily='"Ubuntu Mono", mono'
                fontSize={`${fontSize}px`}
              >
                {text}
              </text>
            </g>
          );
        })}
      </g>
    );
  }
  if (COLOR_SCALE_OPTIONS[colorScale].type === SCALE_TYPE_LINEAR) {
    const scaleHeight = mapHeight * 0.4;
    const scaleWidth = mapHeight * 0.05;
    const fontSize = Math.round(scaleWidth * 0.75);

    const domain = colorScaleFn.domain();

    const stopScale = scaleQuantize()
      .domain(domain)
      .range(new Array(10).fill(() => null).map((_, i) => i));

    const stops = [domain[0], ...stopScale.thresholds(), domain[1]].reverse();

    const numberScale = scaleQuantize()
      .domain(domain)
      .range(new Array(4).fill(() => null).map((_, i) => i));

    const numbers = [domain[0], ...numberScale.thresholds(), domain[1]];

    const numberYScale = scaleLinear()
      .domain(domain)
      .range([scaleHeight - 2, 0]);
    return (
      <>
        <defs>
          <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
            {stops.map((b, i) => {
              const color = colorScaleFn(b);
              const step = 100 / (stops.length - 1);
              const offset = step * i;
              return <stop key={color} offset={offset + '%'} stopColor={color} />;
            })}
          </linearGradient>
        </defs>
        <g transform={`translate(${legendPadding},${mapHeight - scaleHeight - legendPadding})`}>
          <rect height={scaleHeight} width={scaleWidth} fill="url(#grad1)" />
          {numbers.map(number => (
            <g key={number} transform={`translate(${scaleWidth},${numberYScale(number) + 1})`}>
              <line x1={0} x2={legendPadding * 0.4} stroke={'black'} />
              <text
                x={legendPadding}
                y={fontSize * 0.3}
                fontFamily='"Ubuntu Mono", mono'
                fontSize={`${fontSize}px`}
              >
                {number}
                {legendUnits}
              </text>
            </g>
          ))}
        </g>
      </>
    );
  }
  return null;
}

export default Legend;
