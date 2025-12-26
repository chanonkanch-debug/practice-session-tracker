import { API_URL, getAuthToken } from "./AuthApi";

export const StatsApi = {

    // get total practice time
    getTotalTime: async (timeframe = 'all') => {
        try {
            console.log('Fetching total time, timeframe:', timeframe);

            const response = await fetch(`${API_URL}api/stats/total-time?timeframe=${timeframe}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'applicatsion/json'
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get total time');
            }

            console.log('Total time response:', data);

            // Transform backend response to frontend format
            return {
                totalMinutes: data.stats.total_minutes,
                hours: data.stats.total_hours,
                minutes: data.stats.remaining_minutes,
                sessionCount: data.stats.session_count,
                averageMinutes: data.stats.avg_session_duration,
            };
        } catch (error) {
            console.log('Get total time error', error);
            throw error;
        }
    },

    // get practice time
    getStreak: async () => {
        try {
            console.log('Fetching practice streak');

            const response = await fetch(`${API_URL}api/stats/streak`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get streak');
            }

            console.log('Streak response:', data);

            // Transform backend response to frontend format
            return {
                currentStreak: data.streak.current_streak,
                message: data.streak.message,
            };

        } catch (error) {
            console.log('Get streak error:', error);
            throw error;
        }
    },

    // get consistency score
    getConsistency: async (days = 30) => {
        try {
            console.log('Fetching consistency, days:', days);

            const response = await fetch(`${API_URL}api/stats/consistency?days=${days}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get consistency');
            }

            console.log('Consistency response:', data);

            // Transform backend response to frontend format
            return {
                practiceDays: data.consistency.days_practiced,
                totalDays: data.consistency.total_days,
                percentage: data.consistency.consistency_percentage,
                grade: data.consistency.grade,
            };
        } catch (error) {
            console.log('Get consistency error:', error);
            throw error;
        }
    },

    // get top practiced items
    getTopItems: async (limit = 10) => {
        try {
            console.log('Fetching top items, limie:', limit);

            const response = await fetch(`${API_URL}api/stats/top-items?limit=${limit}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get top item');
            }

            console.log('Top items response:', data);

            // Transform backend response to frontend format
            return {
                topItems: data.items.map(item => ({
                    item_name: item.item_name,
                    item_type: item.item_type,
                    practice_count: item.practice_count,
                    average_tempo: item.avg_tempo,
                }))
            };
        } catch (error) {
            console.log('Get top items error:', error);
            throw error;
        }
    },

    // get tempo progression for an item
    getTempoProgression: async (itemName) => {
        try {
            console.log('Fetching tempo progression for:', itemName);

            const response = await fetch(`${API_URL}api/stats/tempo-progression/${encodeURIComponent(itemName)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get tempo progression');
            }

            return data;
        } catch (error) {
            console.log('Get tempo progression error:', error);
            throw error;
        }
    },

    // Get session trends
    getSessionTrends: async (weeks = 12) => {
        try {
            console.log('Fetching session trends, weeks:', weeks);

            const response = await fetch(`${API_URL}api/stats/session-trends?weeks=${weeks}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get session trends');
            }

            return data;
        } catch (error) {
            console.log('Get session trends error:', error);
            throw error;
        }
    },

    // Get instrument breakdown
    getInstruments: async () => {
        try {
            console.log('Fetching instrument breakdown');

            const response = await fetch(`${API_URL}api/stats/instruments`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get instruments');
            }

            console.log('Instruments response:', data);

            // Transform backend response to frontend format
            return {
                instruments: data.instruments.map(inst => ({
                    instrument: inst.instrument,
                    session_count: inst.session_count,
                    total_minutes: inst.total_minutes,
                    avg_duration: inst.avg_duration,
                    percentage: parseFloat(inst.percentage),
                }))
            };
        } catch (error) {
            console.log('Get instruments error:', error);
            throw error;
        }
    },

}