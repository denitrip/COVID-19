document.querySelector('.map').innerHTML =
  `        <h2 class="visually-hidden">Map</h2>
  <span class="popup_open"><img src="../assets/img/open.svg" alt=""></span>
  <div id="map"></div>
  <div id="map-stats" class="map-stats map__popup">
    <h3 id="map-stats-country" class="map__title"></h3>
    <p id="map-stats-rate" class="map__subtitle"></p>
    <ul class="map__list">
      <li>Cases: <span class="map__numbers" id="map-stats-cases"></span></li>
      <li>Recovered: <span class="map__numbers--recovered" id="map-stats-recovered"></span></li>
      <li>Deaths: <span class="map__numbers map__numbers--deaths" id="map-stats-deaths"></span></li>
    </ul>
    <span id="map-stats-notes">* per 100 000 population</span>
    <button class="map__button-close" id="map-stats-close" title="close" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M284.286 256.002L506.143 34.144c7.811-7.811 7.811-20.475 0-28.285-7.811-7.81-20.475-7.811-28.285 0L256 227.717 34.143 5.859c-7.811-7.811-20.475-7.811-28.285 0-7.81 7.811-7.811 20.475 0 28.285l221.857 221.857L5.858 477.859c-7.811 7.811-7.811 20.475 0 28.285a19.938 19.938 0 0014.143 5.857 19.94 19.94 0 0014.143-5.857L256 284.287l221.857 221.857c3.905 3.905 9.024 5.857 14.143 5.857s10.237-1.952 14.143-5.857c7.811-7.811 7.811-20.475 0-28.285L284.286 256.002z"/></svg>
    </button>
  </div>
  <div id="map-legend" class="map-legend map__popup" data-rate="">
    <h3 class="map__title">Legend</h3>
    <p id="map-legend-rate" class="map__subtitle"></p>
    <ul id="map-legend-list" class="map__list map-legend__list"></ul>
    <button class="map__button-close" id="map-legend-close" title="Close" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001"><path d="M284.286 256.002L506.143 34.144c7.811-7.811 7.811-20.475 0-28.285-7.811-7.81-20.475-7.811-28.285 0L256 227.717 34.143 5.859c-7.811-7.811-20.475-7.811-28.285 0-7.81 7.811-7.811 20.475 0 28.285l221.857 221.857L5.858 477.859c-7.811 7.811-7.811 20.475 0 28.285a19.938 19.938 0 0014.143 5.857 19.94 19.94 0 0014.143-5.857L256 284.287l221.857 221.857c3.905 3.905 9.024 5.857 14.143 5.857s10.237-1.952 14.143-5.857c7.811-7.811 7.811-20.475 0-28.285L284.286 256.002z"/></svg>
    </button>
  </div>
  <div class="map__control">
    <button id="map-legend-open" class="map__button-open" title="Open map legend" type="button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 427.1 427.1"><path d="M93.55 156.5c-31.5 0-57 25.5-57 57s25.5 57 57 57 57-25.5 57-57c-.1-31.4-25.6-56.9-57-57zm0 94c-20.4 0-37-16.5-37-37 0-20.4 16.5-37 37-37 20.4 0 37 16.5 37 37-.1 20.4-16.6 36.9-37 37zM380.55 172.5h-203.5c-5.5 0-10 4.5-10 10s4.5 10 10 10h203.5c5.5 0 10-4.5 10-10s-4.5-10-10-10zM286.65 234.5h-109.6c-5.5 0-10 4.5-10 10s4.4 10 10 10h109.6c5.5 0 10-4.5 10-10s-4.5-10-10-10zM93.55 0c-31.5 0-57 25.5-57 57s25.5 57 57 57 57-25.5 57-57c-.1-31.5-25.6-57-57-57zm0 93.9c-20.4 0-37-16.5-37-37s16.5-37 37-37c20.4 0 37 16.5 37 37-.1 20.5-16.6 37-37 37zM380.55 15.5h-203.5c-5.5 0-10 4.5-10 10s4.5 10 10 10h203.5c5.5 0 10-4.5 10-10s-4.5-10-10-10zM286.65 78.5h-109.6c-5.5 0-10 4.5-10 10s4.4 10 10 10h109.6c5.5 0 10-4.5 10-10s-4.5-10-10-10zM93.55 313.1c-31.5 0-57 25.5-57 57s25.5 57 57 57 57-25.5 57-57c-.1-31.5-25.6-57-57-57zm0 93.9c-20.4 0-37-16.5-37-37 0-20.4 16.5-37 37-37 20.4 0 37 16.5 37 37-.1 20.5-16.6 37-37 37zM380.55 328.5h-203.5c-5.5 0-10 4.5-10 10s4.5 10 10 10h203.5c5.5 0 10-4.5 10-10s-4.5-10-10-10zM286.65 391.5h-109.6c-5.5 0-10 4.5-10 10s4.5 10 10 10h109.6c5.5 0 10-4.5 10-10s-4.5-10-10-10z"/></svg>
    </button>
  </div>
  <div class="map-rates__container">
    <div class="map-rates">
      <div class="map-rates__wrapper">
        <input id="cumulative" type="radio" name="period" value="cumulative" checked="checked">
        <label for="cumulative">Cumulative Cases</label>
      </div>
      <div class="map-rates__wrapper">
        <input id="daily" type="radio" name="period" value="daily">
        <label for="daily">Daily Cases</label>
      </div>
    </div>
    <div class="map-rates">
      <div class="map-rates__wrapper">
        <input id="confirmed" type="radio" name="status" value="confirmed" checked="checked">
        <label for="confirmed">Confirmed Cases</label>
      </div>
      <div class="map-rates__wrapper">
        <input id="recovered" type="radio" name="status" value="recovered">
        <label for="recovered">Recovered Cases</label>
      </div>
      <div class="map-rates__wrapper">
        <input id="deaths" type="radio" name="status" value="deaths">
        <label for="deaths">Death Cases</label>
      </div>
    </div>
    <div class="map-rates">
      <div class="map-rates__wrapper">
        <input id="absolute" type="radio" name="value" value="absolute" checked="checked">
        <label for="absolute">absolute Cases</label>
      </div>
      <div class="map-rates__wrapper">
        <input id="relative" type="radio" name="value" value="relative">
        <label for="relative">Relative Cases</label>
      </div>
    </div>
  </div>`;
