const state = {
  rate: {
    period: 'cumulative', // 'cumulative' or 'daily'
    status: 'confirmed', //  'confirmed', 'recovered' or 'death'
    value: 'absolute', // 'absolute' or 'relative'
  },
  url: 'https://disease.sh/v3/covid-19/countries?yesterday=true',
}

export { state };