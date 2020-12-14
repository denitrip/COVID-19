const globalCasesURL = 'https://disease.sh/v3/covid-19/countries?sort=cases';
const totalCasesUl = '.total_cases_list ul';
const totalCasesHeading = '.total_cases';

setGlobalCases(globalCasesURL);

function setGlobalCases(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let sum = 0;

            result.forEach((item) => {
                sum += item.cases;
                const globalCases = document.querySelector(totalCasesUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${item.cases.toLocaleString()}</span>
                                    </span>
                                    <span>${item.country}</span>`;
                globalCases.append(itemLi);

                const totalCases = document.querySelector(totalCasesHeading);
                totalCases.innerHTML = `${sum.toLocaleString()}`;
            });
        });
}
