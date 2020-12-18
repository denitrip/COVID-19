const displayNone = 'none',
      displayBlock = 'block';

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

        createGraph(keysCases, valuesCasesDaily, 'Daily Cases', 'bar', );

        document.querySelector('.graph__full-screen').addEventListener('click', () => {
            document.querySelector('.histogram__popup_content').innerHTML = '';
            document.querySelector('.histogram__popup').style.display = displayBlock;

            document.querySelector('.histogram__popup_content').innerHTML += `
                <div class="graph__popup"></div>
                <div class="graph__buttons">
                    <button class="graph__button">Daily Cases</button>
                    <button class="graph__button">Cumulative Cases</button>
                    <button class="graph__button">Daily Deaths</button>
                    <button class="graph__button">Cumulative Deaths</button>
                    <button class="graph__button">Daily Recovered</button>
                    <button class="graph__button">Cumulative Recovered</button>
                </div>
            `;

            choiceIndicator(document.querySelector('.graph__metrics').innerHTML, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, true);
            
            for (let i = 0; i < document.querySelectorAll('.graph__button').length; i++) {
                document.querySelectorAll('.graph__button')[i].addEventListener('click', () => {
                    choiceIndicator(document.querySelectorAll('.graph__button')[i].innerHTML, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, true);
                });
            }
        });

        document.querySelector('.graph__close').addEventListener('click', () => {
            document.querySelector('.histogram__popup').style.display = displayNone;
        });

        document.querySelector('.left-arrow').addEventListener('click', () => {
            let nameMetrics = leftMetrics(document.querySelector('.graph__metrics').innerHTML);
            choiceIndicator(nameMetrics, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
        });

        document.querySelector('.right-arrow').addEventListener('click', () => {
            let nameMetrics = rightMetrics(document.querySelector('.graph__metrics').innerHTML);
            choiceIndicator(nameMetrics, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily);
        });
    });
}

const choiceIndicator = (nameMetrics, keysCases, keysDeaths, keysRecovered, valuesCases, valuesDeaths, valuesRecovered, valuesCasesDaily, valuesDeathsDaily, valuesRecoveredDaily, full) => {
    document.querySelector('.graph__metrics').innerHTML = nameMetrics;
    switch(nameMetrics) {
        case 'Daily Cases':
            createGraph(keysCases, valuesCasesDaily, nameMetrics, 'bar');
            if (full) createGraph(keysCases, valuesCasesDaily, nameMetrics, 'bar', true);
            break;
        case 'Daily Deaths':
            createGraph(keysDeaths, valuesDeathsDaily, nameMetrics, 'bar');
            if (full) createGraph(keysDeaths, valuesDeathsDaily, nameMetrics, 'bar', true);
            break;
        case 'Daily Recovered':
            createGraph(keysRecovered, valuesRecoveredDaily, nameMetrics, 'bar');
            if (full) createGraph(keysRecovered, valuesRecoveredDaily, nameMetrics, 'bar', true);
            break;
        case 'Cumulative Cases':
            createGraph(keysCases, valuesCases, nameMetrics, 'line');
            if (full) createGraph(keysCases, valuesCases, nameMetrics, 'line', true);
            break;
        case 'Cumulative Deaths':
            createGraph(keysDeaths, valuesDeaths, nameMetrics, 'line');
            if (full) createGraph(keysDeaths, valuesDeaths, nameMetrics, 'line', true);
            break;
        case 'Cumulative Recovered':
            createGraph(keysRecovered, valuesRecovered, nameMetrics, 'line');
            if (full) createGraph(keysRecovered, valuesRecovered, nameMetrics, 'line', true);
            break;
    }
}

const countDaily = (value) => {
    let valuesDaily = [];
    for (let i = 0; i < value.length; i++) {
        if (i != 0 || i != value.length - 1) {
            valuesDaily.push(Math.abs(value[i] - value[i - 1]));
        } else {
            valuesDaily.push(value[i]);
        }
    }
    return valuesDaily;
}

const leftMetrics = (name) => {
    let arrayMentrics = ['Daily Cases', 'Cumulative Cases', 'Daily Deaths', 'Cumulative Deaths', 'Daily Recovered', 'Cumulative Recovered'];
    for (let i = 0; i < arrayMentrics.length; i++) {
        if (arrayMentrics[i] === name) {
            if (i !== 0) {
                return arrayMentrics[i - 1];
            } else {
                return arrayMentrics[arrayMentrics.length - 1];
            }
        }
    }
}

const rightMetrics = (name) => {
    let arrayMentrics = ['Daily Cases', 'Cumulative Cases', 'Daily Deaths', 'Cumulative Deaths', 'Daily Recovered', 'Cumulative Recovered'];
    for (let i = 0; i < arrayMentrics.length; i++) {
        if (arrayMentrics[i] === name) {
            if (i === arrayMentrics.length - 1) {
                return arrayMentrics[0];
            } else {
                return arrayMentrics[i + 1];
            }
        }
    }
}

const createGraph = (key, value, title, type, full) => {
    let color;
    if (type === 'bar') {
        color = 'rgba(255, 159, 64, 0.2)';
    } else {
        color = 'rgba(255, 159, 64, 0)';
    }

    let nameIdChart;
    if (full) {
        document.querySelector('.graph__popup').innerHTML = '<canvas id="myChartFullScreen"></canvas>';
        nameIdChart = 'myChartFullScreen';
    } else {
        document.querySelector('.graph').innerHTML = '<canvas id="myChart"></canvas>';
        nameIdChart = 'myChart';
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
                borderColor: 'rgba(255, 159, 64, 1)',
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

setWorldGraph('https://disease.sh/v3/covid-19/historical/all?lastdays=366');