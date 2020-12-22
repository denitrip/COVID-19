const stats = document.querySelector('#map-stats');
const legend = document.querySelector('#map-legend');

const onStatsEscPress = (evt) => {
  if (evt.keyCode === 27) {
    closeStats();
  }
};
const openStats = () => {
  stats.classList.add('active');
  document.addEventListener('keydown', onStatsEscPress);
};
const closeStats = () => {
  stats.classList.remove('active');
  document.removeEventListener('keydown', onStatsEscPress);
};
const onLegendEscPress = (evt) => {
  if (evt.keyCode === 27) {
    closeLegend();
  }
};

const openLegend = () => {
  legend.classList.add('active');
  document.addEventListener('keydown', onLegendEscPress);
};
const closeLegend = () => {
  legend.classList.remove('active');
  document.removeEventListener('keydown', onLegendEscPress);
};

const convertToRelative = (num) => {
  return (num / 100000).toFixed(2)
}

const utils = {
  openStats: openStats,
  closeStats: closeStats,
  closeLegend: closeLegend,
  openLegend: openLegend,
  convertToRelative: convertToRelative
}

export { utils };
