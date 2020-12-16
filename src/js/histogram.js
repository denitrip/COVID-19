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
    });
}

setWorldGraph('https://disease.sh/v3/covid-19/historical/all?lastdays=366');

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