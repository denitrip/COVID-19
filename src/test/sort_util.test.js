import { sortAbsolute } from '../js/sort_util';
import { rewritePerThousandPopulation } from '../js/sort_util';

const multiplierPopulation = 100000;

test('sortAbsolute', () => {
    const array = [
        { city: 'Tokyo',
          cases: 1000 },
        { city: 'Berlin',
          cases: 2500},
        {city: 'Minsk',
          cases: 10 }];
    sortAbsolute(array, 'cases');
    expect(array).toEqual([
        { city: 'Berlin',
          cases: 2500},
        { city: 'Tokyo',
           cases: 1000 },
        { city: 'Minsk',
           cases: 10 },
        ]);
});

test('rewritePerThousandPopulation', () => {
    const array = [
        { city: 'Tokyo',
          cases: 1000,
          population: 14000000 },
        { city: 'Berlin',
          cases: 2500,
          population: 4000000},
        {city: 'Minsk',
          cases: 10,
          population: 2000000 }
        ];
    rewritePerThousandPopulation(array, 'cases');
    expect(array).toEqual([
        { city: 'Tokyo',
        cases: 1000 / 14000000 * multiplierPopulation,
        population: 14000000 },
      { city: 'Berlin',
        cases: 2500 / 4000000 * multiplierPopulation,
        population: 4000000},
      {city: 'Minsk',
        cases: 10 / 2000000 * multiplierPopulation,
        population: 2000000 }
        ]);
});

test('rewritePerThousandPopulation with no population', () => {
    const array = [
        {city: 'Minsk',
          cases: 10,
          population: 0 }
        ];
    rewritePerThousandPopulation(array, 'cases');
    expect(array).toEqual([
      {city: 'Minsk',
        cases: 0,
        population: 0 }
        ]);
});

test('rewritePerThousandPopulation with no cases', () => {
    const array = [
        {city: 'Minsk',
          cases: 0,
          population: 2000000 }
        ];
    rewritePerThousandPopulation(array, 'cases');
    expect(array).toEqual([
      {city: 'Minsk',
        cases: 0,
        population: 2000000 }
        ]);
});