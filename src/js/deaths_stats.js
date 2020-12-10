//const totalDeaths = require('../assets/json/total_deaths.json');
//const usDeaths = require('../assets/json/us_deaths.json');

//https://api.covid19api.com/summary
//https://api.covid19api.com/live/country/united-states // all recovered 0 ...
//https://api.covidtracking.com/v1/states/current.json

const globalDeathsURL = 'https://api.covid19api.com/summary';
const USdeathsURL = 'https://api.covidtracking.com/v1/states/current.json';

setGlobalStats(globalDeathsURL);
setUSstats(USdeathsURL);

function setGlobalStats(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.Countries.sort(function (a, b) {
                return b.TotalDeaths - a.TotalDeaths;
            });

            let sum = 0;

            for (let i = 0; i < result.Countries.length; i += 1) {
                sum += result.Countries[i].TotalDeaths;
                const globalDeathsUl = document.querySelector('.total_deaths_list ul');
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${result.Countries[i].TotalDeaths}</span> deaths
                                    </span>
                                    <span class='stats_value'>${result.Countries[i].Country}</span>`;
                globalDeathsUl.append(itemLi);

                const totalDeathsHeading = document.querySelector('.total_deaths');
                totalDeathsHeading.innerHTML = `${sum}`;
            }
        });
}

function setUSstats(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.sort(function (a, b) {
                return b.death - a.death;
            });

            for (let i = 0; i < result.length; i += 1) {
                const USdeathsUl = document.querySelector('.us_deaths_list ul');
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${result[i].death} <span>deaths</span></span>
                                    </span>
                                    <span class='stats_value'>${result[i].recovered} <span>recovered</span></span>
                                    <span class='stats_value'>${result[i].state} US</span>`;
                USdeathsUl.append(itemLi);
            }
        });
}
