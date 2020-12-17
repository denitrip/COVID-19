const globalStatsURL = 'https://disease.sh/v3/covid-19/countries';
const totalStatsHeading = '.total_cases';

setGlobalCasesHeading(globalStatsURL);

function setGlobalCasesHeading(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let sum = 0;

            result.forEach((item) => {
                sum += item.cases;
                const totalStats = document.querySelector(totalStatsHeading);
                totalStats.innerHTML = `${sum.toLocaleString()}`;
            });
        });
}
