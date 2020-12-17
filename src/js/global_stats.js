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
countriesArr[0] = { value: 'Global' };

// selected country click
export const countriesSelect = document.querySelector('#countries');
countriesSelect.addEventListener('change', () => {
    updateData();
});

let tabButtons = document.querySelectorAll('.categories .tablinks');
tabButtons.forEach((item) => {
    item.addEventListener('click', () => {
        // remove "_btn" from id's
        let correctId = item.id.substring(0, item.id.indexOf('_btn'));
        showTabContent(event, correctId);
        updateData();
    });
});

// default opened tab "Deaths"
tabButtons[0].click();

let thousandBtn = document.querySelector('#per_100_thousand_btn');
thousandBtn.addEventListener('click', () => {
    thousandBtn.classList.add('active');
    absoluteBtn.classList.remove('active');
    updateData();
});

let absoluteBtn = document.querySelector('#absolute_btn');
absoluteBtn.addEventListener('click', () => {
    absoluteBtn.classList.add('active');
    thousandBtn.classList.remove('active');
    updateData();
});

let allBtn = document.querySelector('#all_btn');
allBtn.addEventListener('click', () => {
    allBtn.classList.add('active');
    lastDayBtn.classList.remove('active');
    updateData();
});

let lastDayBtn = document.querySelector('#last_day_btn');
lastDayBtn.addEventListener('click', () => {
    lastDayBtn.classList.add('active');
    allBtn.classList.remove('active');
    updateData();
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
    let allDays;
    let lastDay;

    if (field == 'deaths') {
        allDays = item['deaths'];
        lastDay = item['todayDeaths'];
    } else if (field == 'cases') {
        allDays = item['cases'];
        lastDay = item['todayCases'];
    } else if (field == 'recovered') {
        allDays = item['recovered'];
        lastDay = item['todayRecovered'];
    }

    // all days
    if (isAll) {
        if (isAbsolute) {
            value = allDays;
        } else {
            if (item.population) {
                value = (allDays / item.population) * 100000;
            }
        }
        // only last day
    } else {
        if (isAbsolute) {
            value = lastDay;
        } else {
            if (item.population) {
                value = (lastDay / item.population) * 100000;
            }
        }
    }

    if (!value) {
        value = 0;
    }

    return value;
}

export function setGlobalStats(url, field, isAbsolute, isAll, country) {
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
                itemLiList.innerHTML = `<span class="list_item">
                                    <span class='stats_value'>${value.toLocaleString()}</span> <span class="list_country">${item.country}</span> <img src=${item.countryInfo.flag} alt='flag'>
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

                countriesArr[index + 1] = {};
                countriesArr[index + 1]['value'] = item.country;

                const totalStats = document.querySelector(`#${field} ${totalStatsHeading}`);
                totalStats.innerHTML = `${sum.toLocaleString()}`;
            });

            const choices = new Choices(countriesSelect, {
                choices: countriesArr,
                silent: true,
                shouldSort: false,
            });
            country = countriesSelect.childNodes[0].value;

            const totalStatsList = document.querySelector(`#${field} ${totalStatsUlList}`);
            totalStatsList.onclick = (e) => {
                let listItem = e.target.closest('.list_item');
                if (!listItem) return;
                let countryName = listItem.querySelector('.list_country').innerHTML;
                updateData(countryName);
            };
        });
}

export function setUSstats(url, field, isAbsolute, isAll) {
    fetch(url)
        .then((response) => response.json())
        .then((result) => {
            const USstats = document.querySelector(USstatsUl);
            USstats.innerHTML = '';

            result.forEach((item) => {
                let value = checkField(field, item, isAll, isAbsolute);
                let itemLi = document.createElement('li');
                itemLi.innerHTML = `<span>
                                            <span class='stats_value'>${value.toLocaleString()} <span>${field}</span></span>
                                        </span>
                                        <span class='stats_value'>${item.state} US</span>`;
                USstats.append(itemLi);
            });
        });
}
