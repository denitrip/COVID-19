const setWorldGraph = (url) => {
    fetch(url).then((response) => response.json()).then((res) => {
        let keysCases = Object.keys(res.cases);
        let valuesCases = Object.values(res.cases);
        let keysDeaths = Object.keys(res.deaths);
        let valuesDeaths = Object.values(res.deaths);

        let valuesCasesDaily = [];
        for (let i = 0; i < valuesCases.length; i++) {
            if (i != 0 || i != valuesCases.length - 1) {
                valuesCasesDaily.push(valuesCases[i] - valuesCases[i - 1]);
            } else {
                valuesCasesDaily.push(valuesCases[i]);
            }
        }

        let valuesDeathsDaily = [];
        for (let i = 0; i < valuesDeaths.length; i++) {
            if (i != 0 || i != valuesDeaths.length - 1) {
                valuesDeathsDaily.push(valuesDeaths[i] - valuesDeaths[i - 1]);
            } else {
                valuesDeathsDaily.push(valuesDeaths[i]);
            }
        }

        let logCases = [];
        for (let i = 0; i < valuesCases.length; i++) {
            logCases.push(Math.log(valuesCases[i]));
        }

        createGraph(keysCases, valuesCasesDaily, 'Daily Cases', 'bar', true, true);

        document.querySelector('.left-arrow').addEventListener('click', () => {
            let nameMetrics = leftMetrics(document.querySelector('.graph__metrics').innerHTML);
            document.querySelector('.graph__metrics').innerHTML = nameMetrics;
            switch(nameMetrics) {
                case 'Daily Cases':
                    createGraph(keysCases, valuesCasesDaily, nameMetrics, 'bar', true, true);
                    break;
                case 'Daily Deaths':
                    createGraph(keysDeaths, valuesDeathsDaily, nameMetrics, 'bar', true, true);
                    break;
                case 'Cumulative Cases':
                    createGraph(keysCases, valuesCases, nameMetrics, 'line', false, true);
                    break;
                case 'Cumulative Deaths':
                    createGraph(keysDeaths, valuesDeaths, nameMetrics, 'line', false, true);
                    break;
                case 'Log Cases':
                    createGraph(keysCases, logCases, nameMetrics, 'line', false, false);
                    break;
            }
        });

        document.querySelector('.right-arrow').addEventListener('click', () => {
            let nameMetrics = rightMetrics(document.querySelector('.graph__metrics').innerHTML);
            document.querySelector('.graph__metrics').innerHTML = nameMetrics;
            switch(nameMetrics) {
                case 'Daily Cases':
                    createGraph(keysCases, valuesCasesDaily, nameMetrics, 'bar', true, true);
                    break;
                case 'Daily Deaths':
                    createGraph(keysDeaths, valuesDeathsDaily, nameMetrics, 'bar', true, true);
                    break;
                case 'Cumulative Cases':
                    createGraph(keysCases, valuesCases, nameMetrics, 'line', false, true);
                    break;
                case 'Cumulative Deaths':
                    createGraph(keysDeaths, valuesDeaths, nameMetrics, 'line', false, true);
                    break;
                case 'Log Cases':
                    createGraph(keysCases, logCases, nameMetrics, 'line', false, false);
                    break;
            }
        });
    });
}

setWorldGraph('https://disease.sh/v3/covid-19/historical/all?lastdays=366');

const leftMetrics = (name) => {
    let arrayMentrics = ['Daily Cases', 'Daily Deaths', 'Cumulative Cases', 'Cumulative Deaths', 'Log Cases'];
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
    let arrayMentrics = ['Daily Cases', 'Daily Deaths', 'Cumulative Cases', 'Cumulative Deaths', 'Log Cases'];
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

const createGraph = (key, value, title, type, background, zero) => {
    let color;
    if (background) {
        color = 'rgba(255, 159, 64, 0.2)';
    } else {
        color = 'rgba(255, 159, 64, 0)';
    }

    let options;
    if (zero) {
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    }

    document.querySelector('.graph').innerHTML = '<canvas id="myChart"></canvas>';
    var ctx = document.querySelector('#myChart');
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
        options
    });
}