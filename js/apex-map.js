/* 
  Nexus ERP + HRM - ApexMaps Global Location & Distribution Component Logic
*/

function initApexMap() {
  const container = document.getElementById("map") || document.getElementById("chartApexMap");
  if (!container) return;

  if (typeof ApexMaps === "undefined") {
    console.warn("ApexMaps library is not loaded.");
    return;
  }

  // Clear existing content to prevent duplicate rendering
  container.innerHTML = "";

  // Your data. `joinBy: 'name'` matches each row to a country by its name; any
  // country without a row is drawn in the null colour. A dozen rows here; pass
  // your full dataset the same way.
  const data = [
    { name: "United States of America", value: 63 },
    { name: "Canada", value: 41 },
    { name: "Brazil", value: 72 },
    { name: "Argentina", value: 38 },
    { name: "United Kingdom", value: 84 },
    { name: "France", value: 77 },
    { name: "Germany", value: 69 },
    { name: "Nigeria", value: 55 },
    { name: "Egypt", value: 48 },
    { name: "India", value: 66 },
    { name: "China", value: 71 },
    { name: "Japan", value: 80 },
    { name: "Australia", value: 59 },
    { name: "Russia", value: 44 },
  ];

  // Two keys in, a publishable map out: a geometry pack and a joined series are
  // the whole requirement. Everything after `series` is one editorial option.
  const map = new ApexMaps(container, {
    chart: { height: 560 },
    geo: {
      map: "world/countries@110m",
      // Crop to the inhabited world so the data is not stranded in the top third.
      view: { fit: [-180, -58, 180, 84], padding: 10 },
      // The faintest water plane, so land sits inside a map instead of floating.
      sphere: { show: true, fill: "#f6f9fc", stroke: "transparent" },
    },
    series: [{ name: "Index", joinBy: "name", data }],
    legend: {
      title: "Composite index",
      align: "center",
      style: "palette",
      marker: true,
    },
    dataLabels: {
      enabled: true,
      // Label only the larger features; at world scale, naming all 177 is texture.
      minFeatureArea: 700,
      formatter: ({ name }) => name,
      style: { fontSize: 11, fontWeight: 600, halo: true, haloWidth: 2.6 },
    },
  });

  map.render();
  window.apexGlobalMapInstance = map;
}

// Expose on window object
window.initApexMap = initApexMap;
