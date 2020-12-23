import { state } from './state';

const bar = 'bar',
      line = 'line',
      graphPopup = '.graph__popup',
      graph = '.graph',
      dailyCases = 'Daily Confirmed',
      dailyDeaths = 'Daily Deaths',
      dailyRecovered = 'Daily Recovered',
      cumulativeCases = 'Cumulative Confirmed',
      cumulativeDeaths = 'Cumulative Deaths',
      cumulativeRecovered = 'Cumulative Recovered',
      chart = 'myChart',
      chartFullScreen = 'myChartFullScreen',
      colorBackgroundGraph = 'rgba(255, 159, 64, 0.2)',
      colorBackgroundOpacityZero = 'rgba(255, 159, 64, 0)',
      colorBorderGraph = 'rgba(255, 159, 64, 1)',
      urlHistoricalGlobal = 'https://disease.sh/v3/covid-19/historical/all?lastdays=366',
      urlHistoricalCountry = 'https://api.covid19api.com/total/country/';
 
const setWorldGraph = (url) => {
    fetch(url).then((response) => response.json()).then((res) => {
        const keys = Object.keys(res.cases),
              valuesCases = Object.values(res.cases),
              valuesDeaths = Object.values(res.deaths),
              valuesRecovered = Object.values(res.recovered),
              valuesCasesDaily = countDaily(valuesCases),
              valuesDeathsDaily = countDaily(valuesDeaths),
              valuesRecoveredDaily = countDaily(valuesRecovered);

        ultimate(keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
    });
}

const setCountryGraph = (url, country) => {
    fetch(url).then((response) => response.json()).then((res) => {
        let keys = [],
            valuesCases = [],
            valuesDeaths = [],
            valuesRecovered = [],
            valuesCasesDaily = [],
            valuesDeathsDaily = [],
            valuesRecoveredDaily = [];

        res.forEach(elem => {
            keys.push(elem.Date.slice(0, 10));
            valuesCases.push(elem.Confirmed);
            valuesDeaths.push(elem.Deaths);
            valuesRecovered.push(elem.Recovered);
        });

        valuesCasesDaily = countDaily(valuesCases),
        valuesDeathsDaily = countDaily(valuesDeaths),
        valuesRecoveredDaily = countDaily(valuesRecovered);

        choiceIndicator(checkBtn(), keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
        ultimate(keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country);
    });
}

const ultimate = (keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country) => {
    if (country) {
        choiceIndicator(checkBtn(), keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
    } else {
        createGraph(keys, valuesCases, cumulativeCases, line);
    }

    [... document.querySelectorAll('.map-rates__wrapper input')].forEach((input) => input.addEventListener('change', () => {
        choiceIndicator(checkBtn(), keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
    }));
}

const checkBtn = () => {
    let nameMetricsIndicator;
    if (state.rate.period === cumulativeCases.split(' ')[0].toLowerCase()) {
        if (state.rate.status === cumulativeCases.split(' ')[1].toLowerCase()) {
            nameMetricsIndicator = cumulativeCases;
        } else if (state.rate.status === cumulativeDeaths.split(' ')[1].toLowerCase()) {
            nameMetricsIndicator = cumulativeDeaths;
        } else {
            nameMetricsIndicator = cumulativeRecovered;
        }
    } else {
        if (state.rate.status === dailyCases.split(' ')[1].toLowerCase()) {
            nameMetricsIndicator = dailyCases;
        } else if (state.rate.status === dailyDeaths.split(' ')[1].toLowerCase()) {
            nameMetricsIndicator = dailyDeaths;
        } else {
            nameMetricsIndicator = dailyRecovered;
        }
    }
    return nameMetricsIndicator;
}

const choiceIndicator = (nameMetrics, keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, full) => {
    switch(nameMetrics) {
        case dailyCases:
            createGraph(keys, valuesCasesDaily, nameMetrics, bar);
            if (full) createGraph(keys, valuesCasesDaily, nameMetrics, bar, true);
            break;
        case dailyDeaths:
            createGraph(keys, valuesDeathsDaily, nameMetrics, bar);
            if (full) createGraph(keys, valuesDeathsDaily, nameMetrics, bar, true);
            break;
        case dailyRecovered:
            createGraph(keys, valuesRecoveredDaily, nameMetrics, bar);
            if (full) createGraph(keys, valuesRecoveredDaily, nameMetrics, bar, true);
            break;
        case cumulativeCases:
            createGraph(keys, valuesCases, nameMetrics, line);
            if (full) createGraph(keys, valuesCases, nameMetrics, line, true);
            break;
        case cumulativeDeaths:
            createGraph(keys, valuesDeaths, nameMetrics, line);
            if (full) createGraph(keys, valuesDeaths, nameMetrics, line, true);
            break;
        case cumulativeRecovered:
            createGraph(keys, valuesRecovered, nameMetrics, line);
            if (full) createGraph(keys, valuesRecovered, nameMetrics, line, true);
            break;
    }
}

const countDaily = (value) => {
    let valuesDaily = [];
    value.forEach((elem, index, arr) => {
        if (index != 0 || index != arr.length - 1) {
            valuesDaily.push(Math.abs(elem - arr[index - 1]));
        } else {
            valuesDaily.push(elem);
        }
    });
    return valuesDaily;
}

const createGraph = (key, value, title, type, full) => {
    let color;
    if (type === bar) {
        color = colorBackgroundGraph;
    } else {
        color = colorBackgroundOpacityZero;
    }

    let nameIdChart;
    if (full) {
        document.querySelector(graphPopup).innerHTML = `<canvas id=${chartFullScreen}></canvas>`;
        nameIdChart = chartFullScreen;
    } else {
        document.querySelector(graph).innerHTML = `<canvas id=${chart}></canvas>`;
        nameIdChart = chart;
    }
 
    var ctx = document.querySelectorAll(`#${nameIdChart}`);
    var myChart = new Chart(ctx, {
        type: type,
        data: {
            labels: key,
            datasets: [{
                label: title,
                data: value,
                backgroundColor: color,
                borderColor: colorBorderGraph,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

export const countryView = (country) => {
    if (country) {
        setCountryGraph(`${urlHistoricalCountry}${country}`, country);
    }
}

setWorldGraph(urlHistoricalGlobal);