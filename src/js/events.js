import { utils } from './map_utils';
import { state } from './state';
import { createPointLayer, createGeoJson, selectPointerHover, selectPointerMove, onPointHover, onPointClick } from './map_layer';
import { updateData } from './service';

const stats = document.querySelector('#map-stats');
const statsClose = stats.querySelector('#map-stats-close');
const legend = document.querySelector('#map-legend');
const legendOpen = document.querySelector('#map-legend-open');
const legendClose = legend.querySelector('#map-legend-close');
const inputs = document.querySelectorAll('.map-rates__wrapper input');

const onInputChanged = (evt) => {
  //  close popups
  utils.closeStats();
  utils.closeLegend();

    //  change type of rate
    state.rate[evt.target.name] = evt.target.value;

    document.querySelectorAll(`#${evt.target.value}`).forEach((item) => {
        item.checked = true;
    });
    updateData();

    // redraw map
    createPointLayer();
};

window.addEventListener('load', () => {
  // create geo json for map
  createGeoJson();
  // radio toggle event handlers
  [... inputs].forEach((input) => input.addEventListener('change', onInputChanged));
  // points event handler
  selectPointerHover.on('select', onPointHover);
  selectPointerMove.on('select', onPointClick);

  // map popups event handlers
  statsClose.addEventListener('click', utils.closeStats);
  legendOpen.addEventListener('click', utils.openLegend);
  legendClose.addEventListener('click', utils.closeLegend);
});
