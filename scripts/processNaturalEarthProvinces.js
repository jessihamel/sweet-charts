const fs = require('fs');

function processProvinces() {
  const fileData = fs.readFileSync(
    './sourceGeoJSONs/ne_50m_admin_1_states_provinces_lakes.json',
    'utf8'
  );
  const data = JSON.parse(fileData);
  console.log(data.features[0].properties);
  const isoCodes = Array.from(
    new Set(
      data.features.map(a => {
        return a.properties.iso_a2;
      })
    )
  );
  isoCodes.forEach(code => {
    const filteredFeatures = data.features.filter(f => f.properties.iso_a2 === code);
    const mapName = `ne_50m_admin_1_states_provinces_lakes_${code}`;
    fs.writeFileSync(
      `../public/maps/${mapName}.json`,
      JSON.stringify({ ...data, features: filteredFeatures })
    );
  });
}

processProvinces();
