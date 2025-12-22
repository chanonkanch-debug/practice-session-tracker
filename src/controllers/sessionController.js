const PracticeSession = require('../models/PracticeSession');

// create a new practice session
exports.createSession = async (req, res) => {
    try {
        //extract data from request body
        const { practice_date, total_duration, instrument, session_notes } = req.body;

        //validate required fields (non-nullable)
        if (!practice_date || !total_duration) {
            return res.status(400).json({
                success: false,
                error: 'Practice date and duration are required'
            });
        }

        //validate duration is a positive number
        if (total_duration <= 0 || isNaN(total_duration)) {
            return res.status(400).json({
                success: false,
                error: 'Duration must be a positive number'
            })
        }

        //validate date format (basic check)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(practice_date)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        //validate instrument (optional field, but if provided, should be from allowed list)
        const allowedInstrument = ['piano', 'guitar', 'drums', 'bass', 'violin', 'other']
        if (instrument && !allowedInstrument.includes(instrument.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: `Instrument must be one of: ${allowedInstruments.join(', ')}`
            });
        }

        // CREATE session data object
        const sessionData = {
            practice_date,
            total_duration: parseInt(total_duration),
            instrument: instrument ? instrument.toLowerCase() : null,
            session_notes: session_notes || null
        }

        // create session into the database (req.userId -> comes from middleware 'protected')
        const newSession = await PracticeSession.create(req.userId, sessionData);

        // return success response
        res.status(201).json({
            success: true,
            message: 'Practice session created successfully',
            session: newSession
        });

    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while creating session'
        });
    }
}

// get all sessions for the logged-in user
exports.getAllsessions = async (req, res) => {
    try {
        const sessions = await PracticeSession.findAllUserId(req.userId); // req.userId comes from middleware

        // return sessions
        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions: sessions
        });

    } catch (error) {
        console.error('Get all sessions error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching sessions'
        });
    }
}

// get a single session by session ID 
exports.getSessionById = async (req, res) => {
    try {
        //get sessionId from URL parameter
        const sessionId = req.params.id;

        //validate sessionid is a number
        if (isNaN(sessionId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid session ID'
            });
        }

        //find session in db
        const session = await PracticeSession.findByIdWithItems(sessionId);

        //check if session exists
        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        //verify ownership (AUTHORIZATION)
        if (session.user_id !== req.userId) {
            return res.status(403).json({ // forbidden
                success: false,
                error: 'Not authorized to access this session ',
            }); 
        }

        // return session
        res.status(200).json({
            success: true,
            session: session
        });


    } catch (error) {
        console.error('Get session by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching session'
        });
    }
}

//update controller
exports.updateSession = async (req, res) => {
    try {
        //get session id
        const sessionId = req.params.id;
        //validate
        if (isNaN(sessionId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid sessionID'
            });
        }

        //check if session exist
        const existingSession = await PracticeSession.findById(sessionId);

        if (!existingSession) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        //verify ownership (AUTHORIZATION)
        if (existingSession.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this session'
            });
        }

        //extract update data from request body
        const { practice_date, total_duration, instrument, session_notes } = req.body;

        //use existing values if fields not provided (partial update)
        const updatedData = {
            practice_date: practice_date || existingSession.practice_date,
            total_duration: total_duration !== undefined ? total_duration : existingSession.total_duration,
            instrument: instrument !== undefined ? instrument : existingSession.instrument,
            session_notes: session_notes !== undefined ? session_notes : existingSession.session_notes
        }

        // validate duration
        if (updatedData.total_duration <= 0 || isNaN(updatedData.total_duration)) {
            return res.status(400).json({
                success: false,
                error: 'Duration must be positive number'
            });
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const dateToValidate = typeof updatedData.practice_date === 'string' 
            ? updatedData.practice_date 
            : updatedData.practice_date.toISOString().split('T')[0];
        
        if (!dateRegex.test(dateToValidate)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        // Validate instrument
        const allowedInstruments = ['piano', 'guitar', 'drums', 'violin', 'bass', 'other'];
            if (updatedData.instrument && !allowedInstruments.includes(updatedData.instrument.toLowerCase())) {
            return res.status(400).json({
                success: false,
                error: `Instrument must be one of: ${allowedInstruments.join(', ')}`
            });
        }

        // Normalize instrument
        if (updatedData.instrument) {
            updatedData.instrument = updatedData.instrument.toLowerCase();
        }

        // Update session in database
        const updatedSession = await PracticeSession.update(sessionId, updatedData);

        // Return success response
        res.status(200).json({
            success: true,
            message: 'Session updated successfully',
            session: updatedSession
        });


    } catch (error) {
        console.error('Update session error:', error);
        res.status(500).json({
            success:  false,
            error: 'Server error while updating session'
        });
    }
}

//delete controller
exports.deleteSession = async (req, res) => {
    try {
        //get sessionid
        const sessionId = req.params.id;
        //validate
        if (isNaN(sessionId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid sessionID'
            });
        }

        //check if session exist
        const existingSession = await PracticeSession.findById(sessionId);

        if (!existingSession) {
            return res.status(404).json({
                success: false,
                error: 'Session not found'
            });
        }

        // Verify ownership (AUTHORIZATION)
        if (existingSession.user_id !== req.userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this session'
            });
        }

        //delete session from the db
        await PracticeSession.delete(sessionId);

        res.status(200).json({
            success: true,
            message: 'Session deleted successfully'
        });

    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while deleting session'
        });
    }
}