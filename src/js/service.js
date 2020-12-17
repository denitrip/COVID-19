import { countriesSelect, globalStatsURL, USstatsURL, setGlobalStats, setUSstats } from './global_stats';

export function updateData(country) {
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

    if (country) {
        country = country;
    } else if (countriesSelect.childNodes[0]) {
        country = countriesSelect.childNodes[0].value;
    } else {
        country = 'Global';
    }

    setGlobalStats(globalStatsURL, currField, isAbsolute, isAll, country);
    setUSstats(USstatsURL, currField, isAbsolute, isAll, country);
}
