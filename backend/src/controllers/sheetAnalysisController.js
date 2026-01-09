const Anthropic = require('@anthropic-ai/sdk');
const SheetAnalysis = require('../models/SheetAnalysis');

// Initialize Anthropic client with debugging
console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('ANTHROPIC_API_KEY starts with:', process.env.ANTHROPIC_API_KEY?.substring(0, 15));

//initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Helper function to detect image format from base64
function detectImageFormat(base64String) {
    // Get first few characters to detect format
    const signatures = {
        '/9j/': 'image/jpeg',
        'iVBORw0KGgo': 'image/png',
        'R0lGODlh': 'image/gif',
        'PHN2Zy': 'image/svg+xml',
        'PD94bWw': 'image/svg+xml',
        'Qk': 'image/bmp',
        'UklGR': 'image/webp'
    };

    for (const [signature, mimeType] of Object.entries(signatures)) {
        if (base64String.startsWith(signature)) {
            return mimeType;
        }
    }

    // Default to JPEG if unknown
    return 'image/jpeg';
}

// Analyze sheet music
exports.analyzeSheet = async (req, res) => {
    try {
        const userId = req.userId;
        let { image } = req.body; // Base64 image string

        if (!image) {
            return res.status(400).json({
                success: false,
                error: 'Image is required'
            });
        }

        // Remove data URI prefix if present
        if (image.includes('base64,')) {
            image = image.split('base64,')[1];
        }

        console.log('Analyzing sheet music for user:', userId);
        console.log('Image preview (first 50 chars):', image.substring(0, 50));

        // Detect image format
        const mediaType = detectImageFormat(image);
        console.log('Detected media type:', mediaType);

        // Call Claude Vision API
        const message = await anthropic.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            messages: [{
                role: "user",
                content: [
                    {
                        type: "image",
                        source: {
                            type: "base64",
                            media_type: mediaType,  // CHANGED: Now dynamic
                            data: image
                        }
                    },
                    {
                        type: "text",
                        text: `Analyze this sheet music image and provide a detailed analysis. 

Please identify:
1. Key signature (e.g., "C Major", "A Minor")
2. Tempo marking (if visible, provide BPM estimate)
3. Time signature (e.g., "4/4", "3/4")
4. Technical difficulty level (beginner/intermediate/advanced)
5. Musical techniques required (scales, arpeggios, specific patterns)
6. Recommended practice exercises to master this piece

Respond ONLY with a valid JSON object in this exact format:
{
  "key_signature": "string",
  "tempo": number or null,
  "time_signature": "string",
  "difficulty": "beginner" | "intermediate" | "advanced",
  "techniques": ["technique1", "technique2"],
  "recommendations": [
    {
      "type": "scale" | "arpeggio" | "exercise" | "technique",
      "name": "string",
      "description": "string",
      "suggested_tempo": number
    }
  ],
  "analysis_notes": "Brief explanation of the piece and why these exercises are recommended"
}

If you cannot clearly identify the sheet music, set all fields to null and explain in analysis_notes.`
                    }
                ]
            }]
        });

        console.log('Claude response:', message);

        // Parse Claude's response
        const responseText = message.content[0].text;
        console.log('Response text:', responseText);

        // Extract JSON from response (Claude might wrap it in markdown)
        let analysisData;
        try {
            // Try to find JSON in the response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0]);
            } else {
                analysisData = JSON.parse(responseText);
            }
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return res.status(500).json({
                success: false,
                error: 'Failed to parse analysis results',
                raw_response: responseText
            });
        }

        // Save analysis to database
        const savedAnalysis = await SheetAnalysis.create(userId, {
            key_signature: analysisData.key_signature,
            tempo: analysisData.tempo,
            time_signature: analysisData.time_signature,
            difficulty: analysisData.difficulty,
            techniques: analysisData.techniques,
            recommendations: analysisData.recommendations
        });

        // Return analysis with parsed fields
        res.status(200).json({
            success: true,
            message: 'Sheet music analyzed successfully',
            analysis: {
                id: savedAnalysis.id,
                key_signature: analysisData.key_signature,
                tempo: analysisData.tempo,
                time_signature: analysisData.time_signature,
                difficulty: analysisData.difficulty,
                techniques: analysisData.techniques,
                recommendations: analysisData.recommendations,
                analysis_notes: analysisData.analysis_notes,
                created_at: savedAnalysis.created_at
            }
        });

    } catch (error) {
        console.error('Analyze sheet error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while analyzing sheet music',
            details: error.message
        });
    }
};
// Get all analyses for user
exports.getUserAnalyses = async (req, res) => {
    try {
        const userId = req.userId;

        const analyses = await SheetAnalysis.findByUserId(userId);

        res.status(200).json({
            success: true,
            count: analyses.length,
            analyses
        });

    } catch (error) {
        console.error('Get analyses error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching analyses'
        });
    }
};

// Get single analysis
exports.getAnalysis = async (req, res) => {
    try {
        const userId = req.userId;
        const analysisId = req.params.id;

        const analysis = await SheetAnalysis.findById(analysisId);

        if (!analysis) {
            return res.status(404).json({
                success: false,
                error: 'Analysis not found'
            });
        }

        // Verify ownership
        if (analysis.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to access this analysis'
            });
        }

        res.status(200).json({
            success: true,
            analysis
        });

    } catch (error) {
        console.error('Get analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching analysis'
        });
    }
};

// Delete analysis
exports.deleteAnalysis = async (req, res) => {
    try {
        const userId = req.userId;
        const analysisId = req.params.id;

        const analysis = await SheetAnalysis.findById(analysisId);

        if (!analysis) {
            return res.status(404).json({
                success: false,
                error: 'Analysis not found'
            });
        }

        // Verify ownership
        if (analysis.user_id !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this analysis'
            });
        }

        await SheetAnalysis.delete(analysisId);

        res.status(200).json({
            success: true,
            message: 'Analysis deleted successfully'
        });

    } catch (error) {
        console.error('Delete analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while deleting analysis'
        });
    }
};