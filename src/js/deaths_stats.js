import './libs/choices.min';
import { totalStatsUlList } from './global_cases';

const globalStatsURL = 'https://disease.sh/v3/covid-19/countries?yesterday=true';
const USstatsURL = 'https://disease.sh/v3/covid-19/states?sort=deaths';
const totalStatsUl = '.total_deaths_list ul';
const totalStatsHeading = '.total_deaths';
const USstatsUl = '.us_deaths_list ul';

let country;
let countriesArr = [];
countriesArr[0] = { value: 'Global' };

setUSstats(USstatsURL);

const countriesSelect = document.querySelector('#countries');
countriesSelect.addEventListener('change', () => {
    checkButtonsState();
});

let tabButtons = document.querySelectorAll('.categories .tablinks');
tabButtons.forEach((item) => {
    item.addEventListener('click', () => {
        // remove "_btn" from id's
        let correctId = item.id.substring(0, item.id.indexOf('_btn'));
        showTabContent(event, correctId);
        checkButtonsState();
    });
});

// default opened tab "Deaths"
tabButtons[0].click();

function checkButtonsState() {
    let tablinks = document.querySelectorAll('.categories .tablinks');
    let currField;
    tablinks.forEach((item) => {
        if (item.classList.contains('active')) {
            currField = item.id.substring(0, item.id.indexOf('_btn'));
        }
    });

    let isAbsoluteBtns = document.querySelectorAll('.isAbsolute .tablinks');
    let isAbsolute;
    isAbsoluteBtns.forEach((item) => {
        if (item.classList.contains('active')) {
            if (item.id === 'absolute_btn') {
                isAbsolute = true;
            } else {
                isAbsolute = false;
            }
        }
    });

    let isAllBtns = document.querySelectorAll('.isAll .tablinks');
    let isAll;
    isAllBtns.forEach((item) => {
        if (item.classList.contains('active')) {
            if (item.id === 'all_btn') {
                isAll = true;
            } else {
                isAll = false;
            }
        }
    });

    if (countriesSelect.childNodes[0]) {
        country = countriesSelect.childNodes[0].value;
    } else {
        country = 'Global';
    }

    setGlobalStats(globalStatsURL, currField, isAbsolute, isAll, country);
}

let thousandBtn = document.querySelector('#per_100_thousand_btn');
thousandBtn.addEventListener('click', () => {
    thousandBtn.classList.add('active');
    absoluteBtn.classList.remove('active');
    checkButtonsState();
});

let absoluteBtn = document.querySelector('#absolute_btn');
absoluteBtn.addEventListener('click', () => {
    absoluteBtn.classList.add('active');
    thousandBtn.classList.remove('active');
    checkButtonsState();
});

let allBtn = document.querySelector('#all_btn');
allBtn.addEventListener('click', () => {
    allBtn.classList.add('active');
    lastDayBtn.classList.remove('active');
    checkButtonsState();
});

let lastDayBtn = document.querySelector('#last_day_btn');
lastDayBtn.addEventListener('click', () => {
    lastDayBtn.classList.add('active');
    allBtn.classList.remove('active');
    checkButtonsState();
});

function showTabContent(e, field) {
    //hide all elements with "tabcontent" class
    let tabcontent = document.querySelectorAll('.tabcontent');
    tabcontent.forEach((item) => {
        item.style.display = 'none';
    });

    // remove "active" class from all elements
    let tablinks = document.querySelectorAll('.categories .tablinks');
    tablinks.forEach((item) => {
        if (item.id !== field + '_btn') {
            item.className = item.className.replace('active', '');
        }
    });

    // add "active" class for clicked element
    tablinks.forEach((item) => {
        if (item.id == field + '_btn') {
            item.classList.add('active');
        }
    });

    let currContent = document.querySelectorAll(`#${field}`);
    // show the current tab, and add an "active" class
    currContent.forEach((item) => {
        item.style.display = 'block';
    });
}

function checkField(field, item, isAll, isAbsolute) {
    let value;
    if (field == 'deaths') {
        if (isAll) {
            if (isAbsolute) {
                value = item.deaths;
            } else {
                if (item.population) {
                    value = (item.deaths / item.population) * 100000;
                }
            }
        } else {
            if (isAbsolute) {
                value = item.todayDeaths;
            } else {
                if (item.population) {
                    value = (item.todayDeaths / item.population) * 100000;
                }
            }
        }
    } else if (field == 'cases') {
        if (isAll) {
            if (isAbsolute) {
                value = item.cases;
            } else {
                if (item.population) {
                    value = (item.cases / item.population) * 100000;
                }
            }
        } else {
            if (isAbsolute) {
                value = item.todayCases;
            } else {
                if (item.population) {
                    value = (item.todayCases / item.population) * 100000;
                }
            }
        }
    } else if (field == 'recovered') {
        if (isAll) {
            if (isAbsolute) {
                value = item.recovered;
            } else {
                if (item.population) {
                    value = (item.recovered / item.population) * 100000;
                }
            }
        } else {
            if (isAbsolute) {
                value = item.todayRecovered;
            } else {
                if (item.population) {
                    value = (item.todayRecovered / item.population) * 100000;
                }
            }
        }
    }
    if (!value) {
        value = 0;
    }

    return value;
}

function setGlobalStats(url, field, isAbsolute, isAll, country) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let sum = 0;
            result.sort((a, b) => {
                return b[`${field}`] - a[`${field}`];
            });

            const globalStats = document.querySelector(`#${field} ${totalStatsUl}`);
            const globalStatsList = document.querySelector(`#${field} ${totalStatsUlList}`);
            globalStats.innerHTML = '';
            globalStatsList.innerHTML = '';

            result.forEach((item, index) => {
                let value = checkField(field, item, isAll, isAbsolute);

                sum += value;
                let itemLi = document.createElement('li');
                let itemLiList = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${value.toLocaleString()}</span> ${field}
                                    </span>
                                    <span class='stats_value'>${item.country}</span>`;
                itemLiList.innerHTML = `<span>
                                    <span class='stats_value'>${value.toLocaleString()}</span> ${item.country} <img src=${item.countryInfo.flag} alt='flag'>
                                </span>`;
                // global stats
                if (country == 'Global') {
                    globalStats.append(itemLi);
                    globalStatsList.append(itemLiList);
                    // if specific country clicked
                } else if (country == item.country) {
                    globalStats.append(itemLi);
                    globalStatsList.append(itemLiList);
                }

                countriesArr[index] = {};
                countriesArr[index]['value'] = item.country;

                const totalStats = document.querySelector(`#${field} ${totalStatsHeading}`);
                totalStats.innerHTML = `${sum.toLocaleString()}`;
            });

            const choices = new Choices(countriesSelect, {
                choices: countriesArr,
                silent: true,
                shouldSort: false,
            });
            country = countriesSelect.childNodes[0].value;
        });
}

function setUSstats(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            result.forEach((item) => {
                const USstats = document.querySelector(USstatsUl);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                            <span class='stats_value'>${item.deaths.toLocaleString()} <span>deaths</span></span>
                                        </span>
                                        <span class='stats_value'>${item.recovered.toLocaleString()} <span>recovered</span></span>
                                        <span class='stats_value'>${item.state} US</span>`;
                USstats.append(itemLi);
            });
        });
}
