// MAIN API HUB

import { AuthApi } from './AuthApi';
import { SessionApi } from './SessionApi';
import { StatsApi } from './StatsApi';

// Re-export all APIs
export { AuthApi, SessionApi, StatsApi };

// Combined API functions that use multiple services
export const CombinedApi = {
    // Get today's summary (combination of stats for dashboard)
    getTodaySummary: async () => {
        try {
            console.log('Fetching today\'s summary');

            // Fetch data from different APIs in parallel
            const [totalTimeData, streakData, sessionsData] = await Promise.all([
                StatsApi.getTotalTime('today'),
                StatsApi.getStreak(),
                SessionApi.getSessions(),
            ]);

            // Get today's sessions only
            const today = new Date().toISOString().split('T')[0];
            const todaySessions = sessionsData.sessions.filter(session => {
                const sessionDate = new Date(session.practice_date).toISOString().split('T')[0];
                return sessionDate === today;
            });

            return {
                todayMinutes: totalTimeData.totalMinutes,
                todaySessionCount: todaySessions.length,
                currentStreak: streakData.currentStreak,
                recentSessions: sessionsData.sessions.slice(0, 3), // Last 3 sessions
            };

        } catch (error) {
            console.log('Get today summary error:', error);
            throw error;
        }
    },
};