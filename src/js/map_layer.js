import 'ol/ol.css';
import { Map, View } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Circle from 'ol/geom/Circle';
import Point from 'ol/geom/Point';
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import { pointerMove } from 'ol/events/condition';
import Select from 'ol/interaction/Select';

import { utils } from './map_utils';
import { state } from './state';
import { updateData } from './service';

const CUL_NUMBERS = [5000000, 1000000, 500000, 400000, 250000, 100000, 50000, 20000, 3000, 1000, 1];
const DAY_NUMBERS = [50000, 10000, 5000, 4000, 2500, 1000, 500, 200, 1];

const stats = document.querySelector('#map-stats');
const statsRate = stats.querySelector('#map-stats-rate');
const statsCountry = stats.querySelector('#map-stats-country');
const statsCases = stats.querySelector('#map-stats-cases');
const statsDeaths = stats.querySelector('#map-stats-deaths');
const statsRecovered = stats.querySelector('#map-stats-recovered');
const statsNotes = stats.querySelector('#map-stats-notes');

const legend = document.querySelector('#map-legend');
const legendRate = legend.querySelector('#map-legend-rate');
const legendList = legend.querySelector('#map-legend-list');
const legendItemTemplate = document.querySelector('#map-legend-item-template')
  .content
  .querySelector('.map-legend__item');

const map = {
  geojson: {},
  field: null,
  cases: null,
  bgcolor: null,
  brcolor: null,
  radius: null,
  numbers: null,
  coords: null
}

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

const vectorSelectLayer = new VectorLayer({
  source: new VectorSource({}),
  style: new Style({
    image: new CircleStyle({
      radius: 15,
      fill: new Fill({
        color: 'rgba(189, 178, 255, 0.3)',
      }),
    })
  })
});

const selectPointerHover = new Select({
  condition: pointerMove,
  layers: [vectorPointsLayer]
});

const selectPointerMove = new Select({
  layers: [vectorPointsLayer]
});

map.field = new Map({
  layers: [vectorMapLayer, vectorSelectLayer, vectorPointsLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});

const createGeoJson = () => {
  fetch(state.url)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    map.geojson = {
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

// create style of point layer
const createPointStyle = (feature) => {
  if (state.rate.period === 'cumulative') {
    if (state.rate.status === 'confirmed') {
      map.bgcolor = '#ffbe0b';
      map.cases = feature.getProperties().cases;
    } else if (state.rate.status === 'recovered') {
      map.bgcolor = '#8ac926';
      map.cases = feature.getProperties().recovered;
    } else if (state.rate.status === 'deaths') {
      map.bgcolor = '#db3a24';
      map.cases = feature.getProperties().deaths;
    }
  }

  if (state.rate.period === 'daily') {
    map.bgcolor = 'transparent';

    if (state.rate.status === 'confirmed') {
      map.cases = feature.getProperties().todayCases;
    } else if (state.rate.status === 'recovered') {
      map.cases = feature.getProperties().todayRecovered;
    } else if (state.rate.status === 'deaths') {
      map.cases = feature.getProperties().todayDeaths;
    }
  }


  if (state.rate.status === 'confirmed') {
    map.brcolor = '#ffbe0b';
  } else if (state.rate.status === 'recovered') {
    map.brcolor = '#8ac926';
  } else if (state.rate.status === 'deaths') {
    map.brcolor = '#db3a24';
  }

  switch (true) {
    case map.cases >= map.numbers[1]:
      map.radius = 5.5;
      break;
    case map.cases < map.numbers[1] && map.cases >= map.numbers[2]:
      map.radius = 5;
      break;
    case map.cases < map.numbers[2] && map.cases >= map.numbers[3]:
      map.radius = 4.5;
      break;
    case map.cases < map.numbers[3] && map.cases >= map.numbers[4]:
      map.radius = 4;
      break;
    case map.cases < map.numbers[4] && map.cases >= map.numbers[5]:
      map.radius = 3.5;
      break;
    case map.cases < map.numbers[5] && map.cases >= map.numbers[6]:
      map.radius = 3;
      break;
    case map.cases < map.numbers[6] && map.cases >= map.numbers[7]:
      map.radius = 2.5;
      break;
    case map.cases < map.numbers[7] && map.cases >= map.numbers[8]:
      map.radius = 2;
      break;
    case map.cases < map.numbers[8] && map.cases >= map.numbers[9]:
      map.radius = 1.5;
      break;
    case map.cases < map.numbers[9] && map.cases >= map.numbers[10]:
      map.radius = 1;
      break;
  }

  return new Style({
    image: new CircleStyle({
      radius: map.radius,
      fill: new Fill({
        color: map.bgcolor,
      }),
      stroke: new Stroke({
        color: map.brcolor,
        width: 1
      }),
    })
  })
};

const renderItem = (index) => {
  const itemElement = legendItemTemplate.cloneNode(true);
  itemElement.querySelector('.map-legend__number').textContent = `${map.numbers[index - 1]} - ${map.numbers[index]}`;

  return itemElement;
}

const createLegend = () => {
  const fragment = document.createDocumentFragment();

  legendList.innerHTML = '';

  for (let i = 1; i < map.numbers.length; i += 1 ) {
    fragment.appendChild(renderItem(i));
  }

  legendList.appendChild(fragment);
}

// create point layer
const createPointLayer = () => {
  map.numbers = state.rate.period === 'daily' ? DAY_NUMBERS : CUL_NUMBERS;

  vectorPointsLayer.setSource(
    new VectorSource({
      features: new GeoJSON().readFeatures(map.geojson, { featureProjection: 'EPSG:3857' }),
    })
  );

  vectorPointsLayer.setStyle(createPointStyle); // add style to layer

  statsRate.textContent = `${state.rate.period} ${state.rate.status} Cases:`
  legendRate.textContent = `${state.rate.period} ${state.rate.status} Cases:`

  createLegend();
  legend.dataset.status = state.rate.status;
  legend.dataset.period = state.rate.period;
}

const onPointHover = (evt) => {
  const arr = evt.target.getFeatures().getArray();
  if (!arr.length) return;

  const obj = arr[0].getProperties();

  statsCountry.textContent = obj.country;

  if (state.rate.value === 'absolute') {
    statsNotes.classList.add('visually-hidden');

    if (state.rate.period === 'cumulative') {
      statsCases.textContent = obj.cases;
      statsRecovered.textContent = obj.recovered;
      statsDeaths.textContent = obj.deaths;
    } else {
      statsCases.textContent = obj.todayCases;
      statsRecovered.textContent = obj.todayRecovered;
      statsDeaths.textContent = obj.todayDeaths;
    }
  } else {
    statsNotes.classList.remove('visually-hidden');

    if (state.rate.period === 'cumulative') {
      statsCases.textContent = utils.convertToRelative(obj.cases);
      statsRecovered.textContent = utils.convertToRelative(obj.recovered);
      statsDeaths.textContent = utils.convertToRelative(obj.deaths);
    } else {
      statsCases.textContent = utils.convertToRelative(obj.todayCases);
      statsRecovered.textContent = utils.convertToRelative(obj.todayRecovered);
      statsDeaths.textContent = utils.convertToRelative(obj.todayDeaths);
    }
  }

  utils.openStats(); // open statistics
}

const onPointClick = (evt) => {
  const arr = evt.target.getFeatures().getArray();
  if (!arr.length) return;

  const obj = arr[0].getProperties();

  updateData(obj.country);
}

map.field.addInteraction(selectPointerHover);
map.field.addInteraction(selectPointerMove);

const selectCountryonMap = (country) => {
  map.geojson.features.forEach((feature) => {
    if (feature.properties.country === country) {
      map.coords = feature.geometry.coordinates;
    }
  });

  const source = new VectorSource({
    features: [
      new Feature(new Point(fromLonLat(map.coords)))
    ],
  });

  vectorSelectLayer.setSource(source);
}

export {
  createPointLayer,
  createGeoJson,
  selectPointerHover,
  selectPointerMove,
  onPointClick,
  onPointHover,
  selectCountryonMap
};