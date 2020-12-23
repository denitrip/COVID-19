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
      urlHistoricalCountry = 'https://api.covid19api.com/total/country/',
      urlGlobal = 'https://disease.sh/v3/covid-19/countries?yesterday=true',
      relative = 'relative',
      inputButton = '.map-rates__wrapper input';
 
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

        ultimate(keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country);
    });
}

const ultimate = (keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country) => {
    if (country) {
        choiceIndicator(checkBtn(), keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country);

        [... document.querySelectorAll(inputButton)].forEach((input) => input.addEventListener('change', () => {
            choiceIndicator(checkBtn(), keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country);
        }));
    } else {
        createGraph(keys, valuesCases, cumulativeCases, line);

        [... document.querySelectorAll(inputButton)].forEach((input) => input.addEventListener('change', () => {
            choiceIndicator(checkBtn(), keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, false);
        }));
    }
}

const setPopulationCountry = (url, country, keys, value, nameMetrics, type) => {
    let numberPopulation;
    let arr = [];
    fetch(url).then((response) => response.json()).then((res) => {
        res.forEach(elem => {
            if (elem.country === country) {
                numberPopulation = elem.population;
            }
        });
        value.forEach(elem => {
            arr.push((elem / numberPopulation) * 100000);
        });

        createGraph(keys, arr, nameMetrics, type);
    });
}

const setPopulationGlobal = (url, keys, value, nameMetrics, type) => {
    let numberPopulation = 0;
    let arr = [];
    fetch(url).then((response) => response.json()).then((res) => {
        res.forEach(elem => {
            numberPopulation += elem.population;
        });
        value.forEach(elem => {
            arr.push((elem / numberPopulation) * 100000);
        });
        
        createGraph(keys, arr, nameMetrics, type);
    });
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

const choiceIndicator = (nameMetrics, keys, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, country) => {
    switch(nameMetrics) {
        case dailyCases:
            if (state.rate.value === relative) {
                if (country) {
                    setPopulationCountry(urlGlobal, country, keys, valuesCasesDaily, nameMetrics, bar);
                } else {
                    setPopulationGlobal(urlGlobal, keys, valuesCasesDaily, nameMetrics, bar);
                }
            } else {
                createGraph(keys, valuesCasesDaily, nameMetrics, bar);
            }
            break;
        case dailyDeaths:
            if (state.rate.value === relative) {
                if (country) {
                    setPopulationCountry(urlGlobal, country, keys, valuesDeathsDaily, nameMetrics, bar);
                } else {
                    setPopulationGlobal(urlGlobal, keys, valuesDeathsDaily, nameMetrics, bar);
                }
            } else {
                createGraph(keys, valuesDeathsDaily, nameMetrics, bar);
            }
            break;
        case dailyRecovered:
            if (state.rate.value === relative) {
                if (country) {
                    setPopulationCountry(urlGlobal, country, keys, valuesRecoveredDaily, nameMetrics, bar);
                } else {
                    setPopulationGlobal(urlGlobal, keys, valuesRecoveredDaily, nameMetrics, bar);
                }
            } else {
                createGraph(keys, valuesRecoveredDaily, nameMetrics, bar);
            }
            break;
        case cumulativeCases:
            if (state.rate.value === relative) {
                if (country) {
                    setPopulationCountry(urlGlobal, country, keys, valuesCases, nameMetrics, line);
                } else {
                    setPopulationGlobal(urlGlobal, keys, valuesCases, nameMetrics, line);
                }
            } else {
                createGraph(keys, valuesCases, nameMetrics, line);
            }
            break;
        case cumulativeDeaths:
            if (state.rate.value === relative) {
                if (country) {
                    setPopulationCountry(urlGlobal, country, keys, valuesDeaths, nameMetrics, line);
                } else {
                    setPopulationGlobal(urlGlobal, keys, valuesDeaths, nameMetrics, line);
                }
            } else {
                createGraph(keys, valuesDeaths, nameMetrics, line);
            }
            break;
        case cumulativeRecovered:
            if (state.rate.value === relative) {
                if (country) {
                    setPopulationCountry(urlGlobal, country, keys, valuesRecovered, nameMetrics, line);
                } else {
                    setPopulationGlobal(urlGlobal, keys, valuesRecovered, nameMetrics, line);
                }
            } else {
                createGraph(keys, valuesRecovered, nameMetrics, line);
            }
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