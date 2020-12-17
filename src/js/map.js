import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle,Fill, Stroke, Style, Text} from 'ol/style';
import Select from 'ol/interaction/Select';
import {pointerMove} from 'ol/events/condition';

document.querySelector('.map').innerHTML =
  `<h2 class="visually-hidden">Map</h2>
  <div id="map"></div>
  <div id="map-stats" class="map-stats map__popup">
    <h3 id="map-stats-country" class="map__title"></h3>
    <p id="map-stats-rate" class="map__subtitle"></p>
    <ul class="map__list">
      <li>Cases: <span class="map__numbers" id="map-stats-cases"></span></li>
      <li>Death: <span class="map__numbers map__numbers--death" id="map-stats-death"></span></li>
    </ul>
    <button class="map__button-close" id="map-stats-close" title="close" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M284.286 256.002L506.143 34.144c7.811-7.811 7.811-20.475 0-28.285-7.811-7.81-20.475-7.811-28.285 0L256 227.717 34.143 5.859c-7.811-7.811-20.475-7.811-28.285 0-7.81 7.811-7.811 20.475 0 28.285l221.857 221.857L5.858 477.859c-7.811 7.811-7.811 20.475 0 28.285a19.938 19.938 0 0014.143 5.857 19.94 19.94 0 0014.143-5.857L256 284.287l221.857 221.857c3.905 3.905 9.024 5.857 14.143 5.857s10.237-1.952 14.143-5.857c7.811-7.811 7.811-20.475 0-28.285L284.286 256.002z"/></svg>
    </button>
  </div>
  <div id="map-legend" class="map-legend map__popup">
    <h3 class="map__title">Legend</h3>
    <p id="map-legend-rate" class="map__subtitle">Cumulative Cases</p>
    <ul class="map__list map-legend__list">
      <li>
        <span class="map-legend__point" data-index="1"></span>
        <span>1 000 000 – 5 000 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="2"></span>
        <span>500 000 – 1 000 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="3"></span>
        <span>400 000 – 500 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="4"></span>
        <span>250 000 – 400 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="5"></span>
        <span>100 000 – 250 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="6"></span>
        <span>50 000 – 100 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="7"></span>
        <span>20 000 – 50 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="8"></span>
        <span>3 000 – 20 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="9"></span>
        <span>1 000 – 3 000</span>
      </li>
      <li>
        <span class="map-legend__point" data-index="10"></span>
        <span>0 – 1 000</span>
      </li>
    </ul>
    <button class="map__button-close" id="map-legend-close" title="Close" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M284.286 256.002L506.143 34.144c7.811-7.811 7.811-20.475 0-28.285-7.811-7.81-20.475-7.811-28.285 0L256 227.717 34.143 5.859c-7.811-7.811-20.475-7.811-28.285 0-7.81 7.811-7.811 20.475 0 28.285l221.857 221.857L5.858 477.859c-7.811 7.811-7.811 20.475 0 28.285a19.938 19.938 0 0014.143 5.857 19.94 19.94 0 0014.143-5.857L256 284.287l221.857 221.857c3.905 3.905 9.024 5.857 14.143 5.857s10.237-1.952 14.143-5.857c7.811-7.811 7.811-20.475 0-28.285L284.286 256.002z"/></svg>
    </button>
  </div>
  <div class="map__control">
    <button id="map-legend-open" class="map__button-open" title="Open map legend" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 427.1 427.1"><path d="M93.55 156.5c-31.5 0-57 25.5-57 57s25.5 57 57 57 57-25.5 57-57c-.1-31.4-25.6-56.9-57-57zm0 94c-20.4 0-37-16.5-37-37 0-20.4 16.5-37 37-37 20.4 0 37 16.5 37 37-.1 20.4-16.6 36.9-37 37zM380.55 172.5h-203.5c-5.5 0-10 4.5-10 10s4.5 10 10 10h203.5c5.5 0 10-4.5 10-10s-4.5-10-10-10zM286.65 234.5h-109.6c-5.5 0-10 4.5-10 10s4.4 10 10 10h109.6c5.5 0 10-4.5 10-10s-4.5-10-10-10zM93.55 0c-31.5 0-57 25.5-57 57s25.5 57 57 57 57-25.5 57-57c-.1-31.5-25.6-57-57-57zm0 93.9c-20.4 0-37-16.5-37-37s16.5-37 37-37c20.4 0 37 16.5 37 37-.1 20.5-16.6 37-37 37zM380.55 15.5h-203.5c-5.5 0-10 4.5-10 10s4.5 10 10 10h203.5c5.5 0 10-4.5 10-10s-4.5-10-10-10zM286.65 78.5h-109.6c-5.5 0-10 4.5-10 10s4.4 10 10 10h109.6c5.5 0 10-4.5 10-10s-4.5-10-10-10zM93.55 313.1c-31.5 0-57 25.5-57 57s25.5 57 57 57 57-25.5 57-57c-.1-31.5-25.6-57-57-57zm0 93.9c-20.4 0-37-16.5-37-37 0-20.4 16.5-37 37-37 20.4 0 37 16.5 37 37-.1 20.5-16.6 37-37 37zM380.55 328.5h-203.5c-5.5 0-10 4.5-10 10s4.5 10 10 10h203.5c5.5 0 10-4.5 10-10s-4.5-10-10-10zM286.65 391.5h-109.6c-5.5 0-10 4.5-10 10s4.5 10 10 10h109.6c5.5 0 10-4.5 10-10s-4.5-10-10-10z"/></svg>
    </button>
  </div>
  <div id="map-rates" class="map-rates">
    <button class="map-rates__button active" name="cumul" type="button">Cumulative Cases</button>
    <button class="map-rates__button" name="daily" type="button">Daily Cases</button>
  </div>`;


const stats = document.querySelector('#map-stats');
const statsCountry = stats.querySelector('#map-stats-country');
const statsCases = stats.querySelector('#map-stats-cases');
const statsDeath = stats.querySelector('#map-stats-death');
const statsClose = stats.querySelector('#map-stats-close');
const statsRate = stats.querySelector('#map-stats-rate');
const legend = document.querySelector('#map-legend');
const legendOpen = document.querySelector('#map-legend-open');
const legendClose = legend.querySelector('#map-legend-close');
const legendRate = legend.querySelector('#map-legend-rate');

const state = {
  url: 'https://corona.lmao.ninja/v2/countries',
  geojson: {},
  rate: 'cumul',
  cases: null
}

//  stats
const onStatsEscPress = (evt) => {
  if (evt.keyCode === 27) {
    closeStats();
  }
}

const openStats = () => {
  stats.classList.add('active');

  document.addEventListener('keydown', onStatsEscPress);
}

const closeStats = () => {
  stats.classList.remove('active');

  document.removeEventListener('keydown', onStatsEscPress);
}

//  legend
const onLegendEscPress = (evt) => {
  if (evt.keyCode === 27) {
    closeLegend();
  }
}

const openLegend = () => {
  legend.classList.add('active');

  document.addEventListener('keydown', onLegendEscPress);
}

const closeLegend = () => {
  legend.classList.remove('active');

  document.removeEventListener('keydown', onLegendEscPress);
}

//  event handlers
statsClose.addEventListener('click', closeStats);
legendOpen.addEventListener('click', openLegend);
legendClose.addEventListener('click', closeLegend);

// map style
const style = new Style({
  fill: new Fill({
    color: '#222',
  }),
  stroke: new Stroke({
    color: '#000F1A',
    width: 1,
  }),
  text: new Text({
    fill: new Fill({
      color: '#bdbdbd',
    }),
  }),
});

const vectorMapLayer = new VectorLayer({
  source: new VectorSource({
    url: './data/countries.json',
    format: new GeoJSON(),
  }),
  style: (feature) => {
    style.getText().setText(feature.get('name'));
    return style;
  },
});

const vectorPointsLayer = new VectorLayer({
  source: new VectorSource({})
});

const map = new Map({
  layers: [vectorMapLayer, vectorPointsLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});

// create style of point layer
const createPointStyle = (feature) => {
  let radius = 0;

  if (state.rate === 'daily') {
    state.cases = feature.getProperties().todayCases;
  } else {
    state.cases = feature.getProperties().cases;
  }

  switch (true) {
    case state.cases >= 1000000:
      radius = 5.5;
      break;
    case state.cases < 1000000 && state.cases >= 500000:
      radius = 5;
      break;
    case state.cases < 500000 && state.cases >= 400000:
      radius = 4.5;
      break;
    case state.cases < 400000 && state.cases >= 250000:
      radius = 4;
      break;
    case state.cases < 250000 && state.cases >= 100000:
      radius = 3.5;
      break;
    case state.cases < 100000 && state.cases >= 50000:
      radius = 3;
      break;
    case state.cases < 50000 && state.cases >= 20000:
      radius = 2.5;
      break;
    case state.cases < 20000 && state.cases >= 3000:
      radius = 2;
      break;
    case state.cases < 3000 && state.cases >= 1000:
      radius = 1.5;
      break;
    case state.cases < 1000 && state.cases >= 1:
      radius = 1.5;
      break;
  }

  return new Style({
    image: new CircleStyle({
      radius: radius,
      fill: new Fill({
        color: 'rgba(219, 58, 52, 0.8)',
      }),
      stroke: new Stroke({
        color: 'rgb(219, 58, 52)',
        width: 1
      }),
    })
  })
};

// create point layer
const createPointLayer = () => {
  vectorPointsLayer.setSource(
    new VectorSource({
      features: new GeoJSON().readFeatures(state.geojson, {featureProjection: 'EPSG:3857'}),
    })
  );

  vectorPointsLayer.setStyle(createPointStyle); // add style to layer

  const selectPointerMove = new Select({
    condition: pointerMove,
    layers: [vectorPointsLayer]
  });

  // set subtitle fot legend and stats
  if (state.rate === 'daily') {
    statsRate.textContent = 'Daily Cases';
    legendRate.textContent = 'Daily Cases';
  } else {
    statsRate.textContent = 'Cumulative Cases';
    legendRate.textContent = 'Cumulative Cases';
  }

  map.addInteraction(selectPointerMove);

  selectPointerMove.on('select', (evt) => {
    const arr = evt.target.getFeatures().getArray();
    if (!arr.length) return;

    const obj = arr[0].getProperties();

    statsCountry.textContent = obj.country;

    if (state.rate === 'daily') {
      statsCases.textContent = obj.todayCases;
      statsDeath.textContent = obj.todayDeaths;
    } else {
      statsCases.textContent = obj.cases;
      statsDeath.textContent = obj.deaths;
    }

    openStats(); // open statistics
  });
}

const createGeoJson = () => {
  fetch(state.url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    state.geojson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long } = countryInfo;
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [long, lat]
          },
          properties: {
            ...country
          }
        }
      })
    };

    createPointLayer();
  });
}

const ratesPanel = document.querySelector('#map-rates');
const onRatesPanelClick = (evt) => {
  [... ratesPanel.children].forEach((button) => button.classList.remove('active'));
  closeStats();
  closeLegend();
  state.rate = evt.target.name;
  evt.target.classList.add('active');
  createPointLayer();
}

window.addEventListener('load', () => {
  createGeoJson();
  ratesPanel.addEventListener('click', onRatesPanelClick);
});
