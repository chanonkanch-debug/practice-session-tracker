const { parse } = require('dotenv');
const Stats = require('../models/Stats');

// Get total practice time
exports.getTotalTime = async (req, res) => {
    try {
        const userId = req.userId;
        const { timeframe } = req.query; // 'today', 'week', 'month', 'all'

        let startDate = null;
        let endDate = null;

        // calculate date range based on timeframe
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (timeframe) {
            case 'today':
                startDate = today.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break;
            case 'week':
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                startDate = weekAgo.toISOString().split('T')[0];  
                endDate = today.toISOString().split('T')[0];      
                break;
            case 'month':
                const monthAgo = new Date(today);
                monthAgo.setDate(today.getDate() - 30);
                startDate = monthAgo.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break;
            case 'all':
                default:
                break;
        }

        const result = await Stats.getTotalPracticeTime(userId, startDate, endDate);

        // convert minutes to hours
        const hours = Math.floor(result.total_minutes / 60);
        const minutes = result.total_minutes % 60;

        res.status(200).json({
            success: true,
            timeframe: timeframe || 'all',
            stats: {
                total_minutes: parseInt(result.total_minutes),
                total_hours: hours,
                remaining_minutes: minutes,
                session_count: parseInt(result.session_count),
                avg_session_duration: result.session_count > 0
                    ? Math.round(result.total_minutes / result.session_count)
                    : 0
            }
        });

    } catch (error) {
        console.error('Get total time error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching total time'
        });
    }
};

// Get practice streak
exports.getStreak = async (req, res) => {
    try {
        const userId = req.userId;
        const streak = await Stats.getPracticeStreak(userId);

        res.status(200).json({
            success: true,
            streak: {
                current_streak: parseInt(streak),
                message: streak > 0
                    ? `You've practiced ${streak} day${streak > 1 ? 's' : ''} in a row!`
                    : "Start your streak today!"
            }
        });

    } catch (error) {
        console.error('Get streak error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while calculating streak'
        });
    }
};

// Get consistency score
exports.getConsistency = async (req, res) => {
    try {
        const userId = req.userId;
        const { days = 30 } = req.query;

        //validate
        const daysInt = parseInt(days);
        if (isNaN(daysInt) || daysInt <= 0 || daysInt > 365) {
            return res.status(400).json({
                success: false,
                error: 'Days must be between 1 and 365'
            });
        }

        const result = await Stats.getConsistencyScore(userId, daysInt);

        res.status(200).json({
            success: true,
            consistency: {
                days_practiced: parseInt(result.days_practiced) || 0,
                total_days: parseInt(result.total_days),
                consistency_percentage: parseFloat(result.consistency_percentage) || 0,
                grade: getConsistencyGrade(result.consistency_percentage || 0) 
            }
        });

    } catch (error) {
        console.error('Get consistency error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while calculating consistency'
        });
    }
};

// Get top practiced items
exports.getTopItems = async (req, res) => {
    try {
        const userId = req.userId;
        const { limit = 10 } = req.query;

        const limitInt = parseInt(limit);
        if (isNaN(limitInt) || limitInt <= 0 || limitInt > 50) {
            return res.status(400).json({
                success: false,
                error: 'Limit must be between 1 and 50'
            });
        }

        const items = await Stats.getTopItems(userId, limitInt);

        res.status(200).json({
            success: true,
            count: items.length,
            items: items.map(item => ({
                item_name: item.item_name,
                item_type: item.item_type,
                practice_count: parseInt(item.practice_count),
                avg_tempo: item.avg_tempo ? parseInt(item.avg_tempo) : null
            }))
        });

    } catch (error) {
        console.error('Get top items error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching top items'
        });
    }
};

// Get tempo progression for a specific item
exports.getTempoProgression = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemName } = req.params;

        if (!itemName) {
            return res.status(400).json({
                success: false,
                error: 'Item name is required'
            });
        }

        const progression = await Stats.getTempoProgression(userId, itemName);

        if (progression.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No tempo data found for this item'
            });
        }

        //calculate improvement
        const firstTempo = progression[0].tempo_bpm;
        const lastTempo = progression[progression.length - 1].tempo_bpm;
        const improvement = lastTempo - firstTempo;
        const improvementPercentage = ((improvement / firstTempo) * 100).toFixed(1);

        res.status(200).json({
            success: true,
            item_name: itemName,
            progression: progression.map(p => ({
                date: p.practice_date,
                tempo_bpm: parseInt(p.tempo_bpm),
                difficulty_level: p.difficulty_level
            })),
            summary: {
                first_tempo: firstTempo,
                latest_tempo: lastTempo,
                improvement_bpm: improvement,
                improvement_percentage: parseFloat(improvementPercentage),
                total_sessions: progression.length
            }
        });

    } catch (error) {
        console.error('Get tempo progression error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching tempo progression'
        });
    }
}

// Get session trends
exports.getSessionTrends = async (req, res) => {
    try {
        const userId = req.userId;
        const { weeks = 12 } = req.query;

        const weeksInt = parseInt(weeks);
        if (isNaN(weeksInt) || weeksInt <= 0 || weeksInt > 52) {
            return res.status(400).json({
                success: false,
                error: 'Weeks must be between 1 and 52'
            });
        }

        const trends = await Stats.getSessionTrends(userId, weeksInt);

        res.status(200).json({
            success: true,
            weeks: weeksInt,
            trends: trends.map(week => ({
                week_start: week.week_start,
                session_count: parseInt(week.session_count),
                avg_duration: parseFloat(week.avg_duration),
                total_minutes: parseInt(week.total_minutes)
            }))
        });

    } catch (error) {
        console.error('Get session trends error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching trends'
        });
    }
};

// Get instrument breakdown
exports.getInstrumentBreakdown = async (req, res) => {
    try {
        const userId = req.userId;
        const breakdown = await Stats.getInstrumentBreakdown(userId);

        // Calculate total minutes for percentages
        const totalMinutes = breakdown.reduce((sum, inst) => sum + parseInt(inst.total_minutes), 0);

        res.status(200).json({
            success: true,
            total_minutes: totalMinutes,
            instruments: breakdown.map(inst => ({
                instrument: inst.instrument,
                session_count: parseInt(inst.session_count),
                total_minutes: parseInt(inst.total_minutes),
                avg_duration: parseFloat(inst.avg_duration),
                percentage: totalMinutes > 0 
                ? ((parseInt(inst.total_minutes) / totalMinutes) * 100).toFixed(1)
                : 0
            }))
        });

    } catch (error) {
        console.error('Get instrument breakdown error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching instrument breakdown'
        });
    }
};

// Helper function to grade consistency
function getConsistencyGrade(percentage) {
    if (percentage >= 90) return 'Excellent 🌟';
    if (percentage >= 75) return 'Great 👍';
    if (percentage >= 50) return 'Good 👌';
    if (percentage >= 25) return 'Fair 🤔';
    return 'Needs Improvement 💪';
}