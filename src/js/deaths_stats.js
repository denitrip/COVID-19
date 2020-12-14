const globalDeathsURL = 'https://disease.sh/v3/covid-19/countries?sort=deaths';
const USdeathsURL = 'https://disease.sh/v3/covid-19/states?sort=deaths';
const totalDeathsUl = '.total_deaths_list ul';
const totalDeathsHeading = '.total_deaths';
const USdeathsUl = '.us_deaths_list ul';

setGlobalDeaths(globalDeathsURL);
setUSstats(USdeathsURL);

function setGlobalDeaths(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let sum = 0;

            result.forEach((item) => {
                sum += item.deaths;
                const globalDeaths = document.querySelector(totalDeathsUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${item.deaths.toLocaleString()}</span> deaths
                                    </span>
                                    <span class='stats_value'>${item.country}</span>`;
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
            result.forEach((item) => {
                const USdeaths = document.querySelector(USdeathsUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                            <span class='stats_value'>${item.deaths.toLocaleString()} <span>deaths</span></span>
                                        </span>
                                        <span class='stats_value'>${item.recovered.toLocaleString()} <span>recovered</span></span>
                                        <span class='stats_value'>${item.state} US</span>`;
                USdeaths.append(itemLi);
            });
        });
}
