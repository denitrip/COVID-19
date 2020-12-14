//https://api.covid19api.com/summary
//https://api.covid19api.com/live/country/united-states // all recovered 0 ...
//https://api.covidtracking.com/v1/states/current.json

const globalCasesURL = 'https://api.covid19api.com/summary';
const totalCasesUl = '.total_cases_list ul';
const totalCasesHeading = '.total_cases';

setGlobalCases(globalCasesURL);

function setGlobalCases(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.Countries.sort((a, b) => {
                return b.TotalConfirmed - a.TotalConfirmed;
            });

            let sum = 0;

            result.Countries.forEach((country) => {
                sum += country.TotalConfirmed;
                const globalCases = document.querySelector(totalCasesUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${country.TotalConfirmed.toLocaleString()}</span>
                                    </span>
                                    <span>${country.Country}</span>`;
                globalCases.append(itemLi);

                const totalCases = document.querySelector(totalCasesHeading);
                totalCases.innerHTML = `${sum.toLocaleString()}`;
            });
        });
}
