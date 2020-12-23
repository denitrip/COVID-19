const populationField = 'population';
const multiplierPopulation = 100000;

export function sortAbsolute(result, field) {
    result.sort((a, b) => {
        return b[`${field}`] - a[`${field}`];
    });
}

export function rewritePerThousandPopulation(result, field) {
    for (let i = 0; i < result.length; i += 1) {
        result[i][`${field}`] = (result[i][`${field}`] / result[i]['population']) * 100000;
        if (result[i]['population'] === 0) {
            result[i][`${field}`] = 1;
        }
    }
}
