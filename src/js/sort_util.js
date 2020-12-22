const populationField = 'population';
const multiplierPopulation = 100000;

export function sortAbsolute(result, field) {
    result.sort((a, b) => b[`${field}`] - a[`${field}`]);
}

export function rewritePerThousandPopulation(result, field) {
    for (let i = 0; i < result.length; i += 1) {
        result[i][`${field}`] = (result[i][`${field}`] / result[i][populationField]) * multiplierPopulation;
        if (!result[i][`${field}`] || result[i][`${field}`] === Infinity) {
            result[i][`${field}`] = 0;
        }
    }
}