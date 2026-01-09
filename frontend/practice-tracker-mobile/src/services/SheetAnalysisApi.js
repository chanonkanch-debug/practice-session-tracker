import { API_URL, getAuthToken } from './AuthApi';

export const SheetAnalysisApi = {
    // Analyze sheet music
    analyzeSheet: async (base64Image) => {
        try {
            console.log('Analyzing sheet music...');

            const response = await fetch(`${API_URL}api/sheet-analysis`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze sheet music');
            }

            return data;
        } catch (error) {
            console.log('Analyze sheet error:', error);
            throw error;
        }
    },

    // Get all analyses
    getAnalyses: async () => {
        try {
            console.log('Fetching sheet analyses');

            const response = await fetch(`${API_URL}api/sheet-analysis`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch analyses');
            }

            return data;
        } catch (error) {
            console.log('Get analyses error:', error);
            throw error;
        }
    },

    // Get single analysis
    getAnalysis: async (analysisId) => {
        try {
            console.log('Fetching analysis:', analysisId);

            const response = await fetch(`${API_URL}api/sheet-analysis/${analysisId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch analysis');
            }

            return data;
        } catch (error) {
            console.log('Get analysis error:', error);
            throw error;
        }
    },

    // Delete analysis
    deleteAnalysis: async (analysisId) => {
        try {
            console.log('Deleting analysis:', analysisId);

            const response = await fetch(`${API_URL}api/sheet-analysis/${analysisId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete analysis');
            }

            return data;
        } catch (error) {
            console.log('Delete analysis error:', error);
            throw error;
        }
    },


}