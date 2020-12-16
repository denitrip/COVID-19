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

setGlobalDeaths(globalDeathsURL);
setUSstats(USdeathsURL);

function setGlobalDeaths(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.Countries.sort((a, b) => {
                return b.TotalDeaths - a.TotalDeaths;
            });

            let sum = 0;

            result.Countries.forEach((country) => {
                sum += country.TotalDeaths;
                const globalDeaths = document.querySelector(totalDeathsUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${country.TotalDeaths.toLocaleString()}</span> deaths
                                    </span>
                                    <span class='stats_value'>${country.Country}</span>`;
                globalDeaths.append(itemLi);

                const totalDeaths = document.querySelector(totalDeathsHeading);
                totalDeaths.innerHTML = `${sum.toLocaleString()}`;
            });
        });
}

function setUSstats(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.sort((a, b) => {
                return b.death - a.death;
            });

            result.forEach((item) => {
                const USdeaths = document.querySelector(USdeathsUl);
                let itemLi = document.createElement('li');
                if (!item.recovered) {
                    item.recovered = 'no data';
                }
                itemLi.innerHTML = `<span>
                                            <span class='stats_value'>${item.death.toLocaleString()} <span>deaths</span></span>
                                        </span>
                                        <span class='stats_value'>${item.recovered.toLocaleString()} <span>recovered</span></span>
                                        <span class='stats_value'>${item.state} US</span>`;
                USdeaths.append(itemLi);
            });
        });
}
