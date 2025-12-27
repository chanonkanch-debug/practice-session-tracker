// Format seconds to MM:SS or HH:MM:SS
export const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// convert minutes to seconds
export const minutesToSeconds = (minutes) => {
    return minutes * 60;
};

// convert seconds to minuets
export const secondsToMinutes = (seconds) => {
    return Math.round(seconds / 60);
};

// calculate elsapsed time in seconds
export const calculateElapsed = (startTime, endTime = new Date()) => {
    return Math.floor((endTime - startTime) / 1000);
};

// calculate remaining time in seconds 
export const calculateRemaining = (goalSeconds, elapsedSeconds) => {
    return Math.max(0, goalSeconds - elapsedSeconds);
};

// get current timestammps
export const getCurrentTimestamp = () => {
    return new Date().toISOString();
};

// format timestamp for display
export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};


