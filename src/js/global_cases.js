const globalStatsURL = 'https://disease.sh/v3/covid-19/countries';
const totalStatsHeading = '.total_cases';
const updateTimeHeading = '.update_time';

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

                const updateTime = document.querySelector(updateTimeHeading);
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                updateTime.innerHTML = `Data from:<br><span class="time">${new Date(item.updated).toLocaleDateString('en-US', options)}</span>`;
            });
        });
}
