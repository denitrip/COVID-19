const displayNone = 'none',
      displayBlock = 'block',
      bar = 'bar',
      line = 'line',
      graphFullScreen = '.graph__full-screen',
      popupContent = '.histogram__popup_content',
      popup = '.histogram__popup',
      graphPopup = '.graph__popup',
      graphButtons = '.graph__buttons',
      graphButton = '.graph__button',
      graphMetrics = '.graph__metrics',
      graphClose = '.graph__close',
      graph = '.graph',
      arrowLeft = '.left-arrow',
      arrowRight = '.right-arrow',
      dailyCases = 'Daily Cases',
      dailyDeaths = 'Daily Deaths',
      dailyRecovered = 'Daily Recovered',
      cumulativeCases = 'Cumulative Cases',
      cumulativeDeaths = 'Cumulative Deaths',
      cumulativeRecovered = 'Cumulative Recovered',
      arrayMetrics = [dailyCases, cumulativeCases, dailyDeaths, cumulativeDeaths, dailyRecovered, cumulativeRecovered],
      chart = 'myChart',
      chartFullScreen = 'myChartFullScreen',
      colorBackgroundGraph = 'rgba(255, 159, 64, 0.2)',
      colorBackgroundOpacityZero = 'rgba(255, 159, 64, 0)',
      colorBorderGraph = 'rgba(255, 159, 64, 1)';
      urlHistoricalGlobal = 'https://disease.sh/v3/covid-19/historical/all?lastdays=366';

const setWorldGraph = (url) => {
    fetch(url).then((response) => response.json()).then((res) => {
        const keysCases = Object.keys(res.cases),
              keysDeaths = Object.keys(res.deaths),
              keysRecovered = Object.keys(res.recovered),
              valuesCases = Object.values(res.cases),
              valuesDeaths = Object.values(res.deaths),
              valuesRecovered = Object.values(res.recovered),
              valuesCasesDaily = countDaily(valuesCases),
              valuesDeathsDaily = countDaily(valuesDeaths),
              valuesRecoveredDaily = countDaily(valuesRecovered);

        createGraph(keysCases, valuesCasesDaily, dailyCases, bar, );

        document.querySelector(graphFullScreen).addEventListener('click', () => {
            document.querySelector(popupContent).innerHTML = '';
            document.querySelector(popup).style.display = displayBlock;

            document.querySelector(popupContent).innerHTML += `
                <div class=${graphPopup.slice(1)}></div>
                <div class=${graphButtons}>
                    <button class=${graphButton.slice(1)}>${dailyCases}</button>
                    <button class=${graphButton.slice(1)}>${cumulativeCases}</button>
                    <button class=${graphButton.slice(1)}>${dailyDeaths}</button>
                    <button class=${graphButton.slice(1)}>${cumulativeDeaths}</button>
                    <button class=${graphButton.slice(1)}>${dailyRecovered}</button>
                    <button class=${graphButton.slice(1)}>${cumulativeRecovered}</button>
                </div>
            `;

            choiceIndicator(document.querySelector(graphMetrics).innerHTML, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, true);
            
            document.querySelectorAll(graphButton).forEach(elem => {
                elem.addEventListener('click', () => {
                    choiceIndicator(elem.innerHTML, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, true);
                })
            });
        });

        document.querySelector(graphClose).addEventListener('click', () => {
            document.querySelector(popup).style.display = displayNone;
        });

        document.querySelector(arrowLeft).addEventListener('click', () => {
            let nameMetrics = leftMetrics(document.querySelector(graphMetrics).innerHTML);
            choiceIndicator(nameMetrics, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
        });

        document.querySelector(arrowRight).addEventListener('click', () => {
            let nameMetrics = rightMetrics(document.querySelector(graphMetrics).innerHTML);
            choiceIndicator(nameMetrics, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
        });
    });
}

const choiceIndicator = (nameMetrics, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, full) => {
    document.querySelector(graphMetrics).innerHTML = nameMetrics;
    switch(nameMetrics) {
        case dailyCases:
            createGraph(keysCases, valuesCasesDaily, nameMetrics, bar);
            if (full) createGraph(keysCases, valuesCasesDaily, nameMetrics, bar, true);
            break;
        case dailyDeaths:
            createGraph(keysDeaths, valuesDeathsDaily, nameMetrics, bar);
            if (full) createGraph(keysDeaths, valuesDeathsDaily, nameMetrics, bar, true);
            break;
        case dailyRecovered:
            createGraph(keysRecovered, valuesRecoveredDaily, nameMetrics, bar);
            if (full) createGraph(keysRecovered, valuesRecoveredDaily, nameMetrics, bar, true);
            break;
        case cumulativeCases:
            createGraph(keysCases, valuesCases, nameMetrics, line);
            if (full) createGraph(keysCases, valuesCases, nameMetrics, line, true);
            break;
        case cumulativeDeaths:
            createGraph(keysDeaths, valuesDeaths, nameMetrics, line);
            if (full) createGraph(keysDeaths, valuesDeaths, nameMetrics, line, true);
            break;
        case cumulativeRecovered:
            createGraph(keysRecovered, valuesRecovered, nameMetrics, line);
            if (full) createGraph(keysRecovered, valuesRecovered, nameMetrics, line, true);
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

const leftMetrics = (name) => {
    let metric;
    arrayMetrics.forEach((elem, index, arr) => {
        if (elem === name) {
            if (index !== 0) {
                metric = arr[index - 1];
            } else {
                metric = arr[arr.length - 1];
            }
        }
    });
    return metric;
}

const rightMetrics = (name) => {
    let metric;
    arrayMetrics.forEach((elem, index, arr) => {
        if (elem === name) {
            if (index === arr.length - 1) {
                metric = arr[0];
            } else {
                metric = arr[index + 1];
            }
        }
    });
    return metric;
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

setWorldGraph(urlHistoricalGlobal);