import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

import { updateData } from './service';
import { state } from './state';
import { selectCountryOnMap } from './map_layer';

export const globalStatsURL = 'https://disease.sh/v3/covid-19/countries?yesterday=true';
export const USstatsURL = 'https://disease.sh/v3/covid-19/states?yesterday=true';
const totalStatsUl = '.total_deaths_list ul';
const totalStatsUlList = '.total_cases_list ul';
const totalStatsLi = '.total_cases_list ul li';
const totalStatsHeading = '.total_deaths';
const USstatsUl = '.us_deaths_list ul';
const countrySpan = '.list_country';
const hiddenClass = 'hidden';

let currCountry;

const showTableBtn = document.querySelector('#table_show_radiobuttons');
let tableRadioButtons = document.querySelector('.table_radiobuttons');
tableRadioButtons.classList.add(hiddenClass);
showTableBtn.addEventListener('change', () => {
    if (showTableBtn.checked) {
        tableRadioButtons.classList.remove(hiddenClass);
    } else {
        tableRadioButtons.classList.add(hiddenClass);
    }
});

const showListBtn = document.querySelector('#list_show_radiobuttons');
let ListRadioButtons = document.querySelector('.list_radiobuttons');
ListRadioButtons.classList.add(hiddenClass);
showListBtn.addEventListener('change', () => {
    if (showListBtn.checked) {
        ListRadioButtons.classList.remove(hiddenClass);
    } else {
        ListRadioButtons.classList.add(hiddenClass);
    }
});

const inputBtnGlobal = document.querySelector('.input_btn_global');
inputBtnGlobal.addEventListener('click', () => {
    updateData();
});

const popupBtn = document.querySelectorAll('.popup_open');
popupBtn.forEach((item) => {
    item.addEventListener('click', (e) => {
        const currSection = e.target.closest('section');
        currSection.classList.toggle('fullscreen');
    });
});

const countryInput = document.querySelector('.country_input');
countryInput.onclick = () => {
    keyboardContainer.classList.remove(hiddenClass);
};

countryInput.addEventListener('input', function () {
    let value = this.value.trim();
    const totalStatsLiArr = document.querySelectorAll(totalStatsLi);
    if (value) {
        totalStatsLiArr.forEach((item) => {
            const countrySpanText = item.querySelector(countrySpan).innerText;
            if (countrySpanText.search(RegExp(value, 'gi')) == -1) {
                item.classList.add(hiddenClass);
            } else {
                item.classList.remove(hiddenClass);
            }
        });
    } else {
        totalStatsLiArr.forEach((item) => {
            item.classList.remove(hiddenClass);
        });
    }
});

const keyboard = new Keyboard({
    onChange: (input) => onChange(input),
});

const keyboardContainer = document.querySelector('.simple-keyboard');
keyboardContainer.classList.add(hiddenClass);

// virtual keyboard input
function onChange(input) {
    countryInput.value = input;
    const event = new Event('input');
    countryInput.dispatchEvent(event);
}

// click not on the virtual keyboard
document.addEventListener('click', (e) => {
    let keyboardDiv = e.target.closest('.simple-keyboard');
    if (keyboardDiv) return;
    let input = document.querySelector('.country_input');
    if (e.target !== input) {
        keyboardContainer.classList.add(hiddenClass);
    }
});
updateData(currCountry);

export function checkField() {
    let field;

    if (state.rate.period === 'cumulative') {
        if (state.rate.status === 'confirmed') {
            field = 'cases';
        } else {
            field = state.rate.status;
        }
    } else {
        if (state.rate.status === 'confirmed') {
            field = 'todayCases';
        } else {
            field = 'today' + state.rate.status[0].toUpperCase() + state.rate.status.slice(1);
        }
    }

    return field;
}

export function sortArr(result) {
    let field = checkField();

    if (state.rate.value === 'absolute') {
        result.sort((a, b) => {
            return b[`${field}`] - a[`${field}`];
        });
    } else {
        for (let i = 0; i < result.length; i += 1) {
            result[i][`${field}`] = (result[i][`${field}`] / result[i]['population']) * 100000;
            if (result[i]['population'] === 0) {
                result[i][`${field}`] = 1;
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
            let field = checkField();
            result.forEach((item) => {
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
                const statsHeading = document.querySelector('.stats_heading');
                // global stats
                if (!country || country === 'Global') {
                    globalStats.append(itemLi);
                    globalStatsList.append(itemLiList);
                    statsHeading.innerHTML = `Global ${field.replace('today', '')}`;
                    // if specific country clicked
                } else if (country == item.country) {
                    globalStats.append(itemLi);
                    globalStatsList.append(itemLiList);
                    statsHeading.innerHTML = `${item.country} ${field.replace('today', '')}`;
                }

                const totalStats = document.querySelector(`${totalStatsHeading}`);
                totalStats.innerHTML = `${sum.toLocaleString()}`;
            });

            const totalStatsList = document.querySelector(`${totalStatsUlList}`);
            totalStatsList.onclick = (e) => {
                let listItem = e.target.closest('.list_item');
                if (!listItem) return;
                currCountry = listItem.querySelector('.list_country').innerHTML;
                updateData(currCountry);
                selectCountryOnMap(currCountry);
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
            let field = checkField();

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
