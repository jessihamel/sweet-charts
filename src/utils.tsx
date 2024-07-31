export function downloadSVG(svg: SVGElement) {
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const downloadLink = document.createElement('a');

  const svgData = svg.outerHTML;
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const dataUrl = URL.createObjectURL(svgBlob);

  downloadLink.href = dataUrl;
  downloadLink.download = 'choropleth.svg';

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function downloadPNG(svg: SVGElement) {
  const svgString = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  const width = svg.getBoundingClientRect().width;
  const height = svg.getBoundingClientRect().height;

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx!.fillStyle = '#FFF';
    ctx!.fillRect(0, 0, +(width || 0), +(height || 0));
    ctx!.drawImage(image, 0, 0, +(width || 0), +(height || 0));
    const imageURI = canvas.toDataURL('image/png');

    URL.revokeObjectURL(imageURI);

    const downloadLink = document.createElement('a');
    downloadLink.href = imageURI;
    downloadLink.download = 'choropleth.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  image.src = svgUrl;
}
