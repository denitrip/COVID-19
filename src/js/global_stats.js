import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';

import { updateData } from './service';

export const globalStatsURL = 'https://disease.sh/v3/covid-19/countries?yesterday=true';
export const USstatsURL = 'https://disease.sh/v3/covid-19/states?yesterday=true';
const totalStatsUl = '.total_deaths_list ul';
const totalStatsUlList = '.total_cases_list ul';
const totalStatsHeading = '.total_deaths';
const USstatsUl = '.us_deaths_list ul';

let countriesArr = [];
let currCountry;
countriesArr[0] = { value: 'Global' };

// selected country click
const countriesSelect = document.querySelector('#countries');
countriesSelect.addEventListener('change', () => {
    currCountry = countriesSelect.childNodes[0].value;
    updateData(currCountry);
});

let tabButtons = document.querySelectorAll('.categories .tablinks');
tabButtons.forEach((item) => {
    item.addEventListener('click', () => {
        // remove "_btn" from id's
        let correctId = item.id.substring(0, item.id.indexOf('_btn'));
        showTabContent(event, correctId);
        updateData(currCountry);
    });
});

// default opened tab "Deaths"
tabButtons[0].click();

let thousandBtn = document.querySelector('#per_100_thousand_btn');
thousandBtn.addEventListener('click', () => {
    thousandBtn.classList.add('active');
    absoluteBtn.classList.remove('active');
    updateData(currCountry);
});

let absoluteBtn = document.querySelector('#absolute_btn');
absoluteBtn.addEventListener('click', () => {
    absoluteBtn.classList.add('active');
    thousandBtn.classList.remove('active');
    updateData(currCountry);
});

let allBtn = document.querySelector('#all_btn');
allBtn.addEventListener('click', () => {
    allBtn.classList.add('active');
    lastDayBtn.classList.remove('active');
    updateData(currCountry);
});

let lastDayBtn = document.querySelector('#last_day_btn');
lastDayBtn.addEventListener('click', () => {
    lastDayBtn.classList.add('active');
    allBtn.classList.remove('active');
    updateData(currCountry);
});

function showTabContent(e, field) {
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
}

export function checkField() {
    let tablinks = document.querySelectorAll('.categories .tablinks');
    let field;
    tablinks.forEach((item) => {
        if (item.classList.contains('active')) {
            field = item.id.substring(0, item.id.indexOf('_btn'));
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

    let res = {};
    if (isAll) {
        res.field = field;
    } else {
        res.field = 'today' + field[0].toUpperCase() + field.slice(1);
    }
    res.isAll = isAll;

    return res;
}

export function sortArr(result) {
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

    let field = checkField().field;

    if (isAbsolute) {
        result.sort((a, b) => {
            return b[`${field}`] - a[`${field}`];
        });
    } else {
        for (let i = 0; i < result.length; i += 1) {
            result[i][`${field}`] = (result[i][`${field}`] / result[i]['population']) * 100000;
            if (!result[i][`${field}`] || result[i][`${field}`] == Infinity) {
                result[i][`${field}`] = 0;
            }
        }
        result.sort((a, b) => {
            if (a[`${field}`] && b[`${field}`]) {
                return b[`${field}`] - a[`${field}`];
            }
        });
    }
}

export function setGlobalStats(url, country) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            let sum = 0;

            const globalStats = document.querySelector(`${totalStatsUl}`);
            const globalStatsList = document.querySelector(`${totalStatsUlList}`);
            globalStats.innerHTML = '';
            globalStatsList.innerHTML = '';

            sortArr(result);
            let field = checkField().field;

            result.forEach((item, index) => {
                let value = item[`${field}`];
                if (!value) {
                    value = 0;
                }
                sum += value;

                let itemLi = document.createElement('li');
                let itemLiList = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${value.toLocaleString()}</span> ${field.replace('today', '')}
                                    </span>
                                    <span class='stats_value'>${item.country}</span>`;
                itemLiList.innerHTML = `<span class="list_item">
                                            <span class='stats_value stats_value_red'>${value.toLocaleString()}</span> <span class="list_country">${item.country}</span> 
                                            <img src=${item.countryInfo.flag} alt='flag'>
                                        </span>`;
                // global stats
                if (!country || country=='Global') {
                    globalStats.append(itemLi);
                    globalStatsList.append(itemLiList);
                    // if specific country clicked
                } else if (country == item.country) {
                    globalStats.append(itemLi);
                    globalStatsList.append(itemLiList);
                }

                countriesArr[index + 1] = {};
                countriesArr[index + 1]['value'] = item.country;

                const totalStats = document.querySelector(`${totalStatsHeading}`);
                totalStats.innerHTML = `${sum.toLocaleString()}`;
            });

            const choices = new Choices(countriesSelect, {
                choices: countriesArr,
                silent: true,
                shouldSort: false,
            });

            const totalStatsList = document.querySelector(`${totalStatsUlList}`);
            totalStatsList.onclick = (e) => {
                let listItem = e.target.closest('.list_item');
                if (!listItem) return;
                currCountry = listItem.querySelector('.list_country').innerHTML;
                updateData(currCountry);
            };
        });
}

export function setUSstats(url) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            const USstats = document.querySelector(USstatsUl);
            USstats.innerHTML = '';

            sortArr(result);
            let field = checkField().field;

            result.forEach((item) => {
                let value = item[`${field}`];
                if (!value) {
                    value = 0;
                }
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                        <span class='stats_value'>${value.toLocaleString()} <span>${field.replace('today', '')}</span></span>
                                    </span>
                                    <span class='stats_value'>${item.state} US</span>`;
                USstats.append(itemLi);
            });
        });
}