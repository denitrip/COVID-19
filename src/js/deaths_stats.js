//const totalDeaths = require('../assets/json/total_deaths.json');
//const usDeaths = require('../assets/json/us_deaths.json');

//https://api.covid19api.com/summary
//https://api.covid19api.com/live/country/united-states // all recovered 0 ...
//https://api.covidtracking.com/v1/states/current.json

const globalDeathsURL = 'https://api.covid19api.com/summary';
const USdeathsURL = 'https://api.covidtracking.com/v1/states/current.json';
const totalDeathsUl = '.total_deaths_list ul';
const totalDeathsHeading = '.total_deaths';
const USdeathsUl = '.us_deaths_list ul';

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

            result.Countries.forEach((country) => {
                sum += country.TotalDeaths;
                const globalDeaths = document.querySelector(totalDeathsUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${country.TotalDeaths}</span> deaths
                                    </span>
                                    <span class='stats_value'>${country.Country}</span>`;
                globalDeaths.append(itemLi);

                const totalDeaths = document.querySelector(totalDeathsHeading);
                totalDeaths.innerHTML = `${sum}`;
            });
        });
}

function setUSstats(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.sort(function (a, b) {
                return b.death - a.death;
            });

            result.forEach((item) => {
                const USdeaths = document.querySelector(USdeathsUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                            <span class='stats_value'>${item.death} <span>deaths</span></span>
                                        </span>
                                        <span class='stats_value'>${item.recovered} <span>recovered</span></span>
                                        <span class='stats_value'>${item.state} US</span>`;
                USdeaths.append(itemLi);
            });
        });
}
