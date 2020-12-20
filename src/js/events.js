import { utils } from './map_utils';
import { state } from './state';
import { createPointLayer, createGeoJson, selectPointerMove } from './map_layer';

const stats = document.querySelector('#map-stats');
const statsClose = stats.querySelector('#map-stats-close');
const legend = document.querySelector('#map-legend');
const legendOpen = document.querySelector('#map-legend-open');
const legendClose = legend.querySelector('#map-legend-close');
const statsCountry = stats.querySelector('#map-stats-country');
const statsCases = stats.querySelector('#map-stats-cases');
const statsDeaths = stats.querySelector('#map-stats-deaths');
const statsRecovered = stats.querySelector('#map-stats-recovered');
const inputs = document.querySelectorAll('input');

const ondRateClick = (evt) => {
  //  close popups
  utils.closeStats();
  utils.closeLegend();

  //  change type of rate
  state.rate[evt.target.name] = evt.target.value;
  // redraw map
  createPointLayer();
}

const onPointSelect = (evt) => {
  const arr = evt.target.getFeatures().getArray();
  if (!arr.length) return;

  const obj = arr[0].getProperties();

  statsCountry.textContent = obj.country;

  if (state.rate.period === 'cumulative') {
    statsCases.textContent = obj.cases;
    statsDeaths.textContent = obj.deaths;
    statsRecovered.textContent = obj.recovered;
  } else {
    statsCases.textContent = obj.todayCases;
    statsDeaths.textContent = obj.todayDeaths;
    statsRecovered.textContent = obj.todayRecovered;
  }

  utils.openStats(); // open statistics
}

window.addEventListener('load', () => {
  // create geo json for map
  createGeoJson();
  // radio toggle event handlers
  [... inputs].forEach((input) => input.addEventListener('change', ondRateClick));
  // points event handler
  selectPointerMove.on('select', onPointSelect);
  // map popups event handlers
  statsClose.addEventListener('click', utils.closeStats);
  legendOpen.addEventListener('click', utils.openLegend);
  legendClose.addEventListener('click', utils.closeLegend);
});
