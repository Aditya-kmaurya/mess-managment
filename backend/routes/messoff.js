const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const MessOff = require('../models/MessOff');

// GET all requests
router.get('/all', async (req, res) => {
    try {
        const requests = await MessOff.find()
            .populate('studentId', 'name rollNo roomNo')
            .sort({ createdAt: -1 })
            .lean();

        const data = requests.map((r) => ({
            id: r._id.toString(),
            studentId: r.studentId?._id?.toString() || r.studentId,
            studentName: r.studentId?.name || 'Unknown',
            from: r.fromDate.toISOString().split('T')[0],
            to: r.toDate.toISOString().split('T')[0],
            status: r.status,
            reason: r.reason || '',
        }));

        res.json({ success: true, data });
    } catch (error) {
        console.error('Get all mess-off error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching mess-off requests',
        });
    }
});

// UPDATE status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
        }

        const messOff = await MessOff.findByIdAndUpdate(
            id,
            { status, approvedAt: new Date() },
            { new: true }
        ).lean();

        if (!messOff) {
            return res.status(404).json({
                success: false,
                message: 'Request not found',
            });
        }

        res.json({
            success: true,
            message: `Request ${status.toLowerCase()} successfully`,
            data: {
                id: messOff._id.toString(),
                status: messOff.status,
            },
        });
    } catch (error) {
        console.error('Update mess-off status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating request',
        });
    }
});

// APPLY mess off
router.post('/apply', authMiddleware, async (req, res) => {
    try {
        const { fromDate, toDate, meals, reason } = req.body;
        const studentId = req.student._id;

        if (!fromDate || !toDate || !meals?.length) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
            });
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);

        if (from > to) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date range',
            });
        }

        const overlapping = await MessOff.findOne({
            studentId,
            status: { $in: ['Pending', 'Approved'] },
            fromDate: { $lte: to },
            toDate: { $gte: from }
        });

        if (overlapping) {
            return res.status(400).json({
                success: false,
                message: 'Overlapping request exists',
            });
        }

        const messOff = new MessOff({
            studentId,
            fromDate: from,
            toDate: to,
            meals,
            reason: reason || ''
        });

        await messOff.save(); // ✅ FIXED

        res.status(201).json({
            success: true,
            message: 'Application submitted',
            data: {
                id: messOff._id,
                fromDate: messOff.fromDate.toISOString().split('T')[0],
                toDate: messOff.toDate.toISOString().split('T')[0],
                meals: messOff.meals,
                status: messOff.status,
                reason: messOff.reason
            }
        });
    } catch (error) {
        console.error('Apply mess-off error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error submitting application',
        });
    }
});

// GET my applications
router.get('/my-applications', authMiddleware, async (req, res) => {
    try {
        const studentId = req.student._id;

        const applications = await MessOff.find({ studentId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            data: applications.map(app => ({
                id: app._id,
                fromDate: app.fromDate.toISOString().split('T')[0],
                toDate: app.toDate.toISOString().split('T')[0],
                meals: app.meals,
                reason: app.reason,
                status: app.status,
                createdAt: app.createdAt
            }))
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching applications',
        });
    }
});

// DELETE request
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.student._id;

        const messOff = await MessOff.findOne({ _id: id, studentId });

        if (!messOff) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        if (messOff.status !== 'Pending') {
            return res.status(400).json({
                success: false,
                message: 'Only pending can be deleted',
            });
        }

        await MessOff.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Application cancelled',
        });
    } catch (error) {
        console.error('Cancel error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});

module.exports = router;