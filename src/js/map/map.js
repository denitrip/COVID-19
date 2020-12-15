import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Circle as CircleStyle,Fill, Stroke, Style, Text} from 'ol/style';
import Select from 'ol/interaction/Select';
import {pointerMove} from 'ol/events/condition';

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

//  Статистика
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

//  Легенда
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

//  Обработчки
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

// создаем стиль для маркеров на карте:
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
    default:
      radius = 1;
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

// создаем слой маркеров:
const createPointLayer = () => {
  vectorPointsLayer.setSource(
    new VectorSource({
      features: new GeoJSON().readFeatures(state.geojson, {featureProjection: 'EPSG:3857'}),
    })
  );

  vectorPointsLayer.setStyle(createPointStyle); // добавляем стиль

  const selectPointerMove = new Select({
    condition: pointerMove,
    layers: [vectorPointsLayer]
  });

  // устанавливаем подзаголовок статистики и легенды
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
    if (arr.length === 0) return;

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
