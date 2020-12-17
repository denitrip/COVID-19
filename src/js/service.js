import { globalStatsURL, USstatsURL, setGlobalStats, setUSstats } from './global_stats';

export function updateData(country) {
    setGlobalStats(globalStatsURL, country);
    setUSstats(USstatsURL);
}
