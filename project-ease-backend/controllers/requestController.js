const Request = require('../models/Request');
const { sendEmail } = require('../utils/sendEmail');

// Helper to notify admin & user and track status changes
const notifyStatus = async (request, subject, message, updatedBy = null) => {
  try {
    // Add to status history
    if (updatedBy) {
      request.statusHistory.push({
        status: request.status,
        notes: request.adminNotes,
        updatedBy: updatedBy,
        updatedAt: new Date()
      });
      await request.save();
    }

    // Notify user (registered or guest)
    const userEmail = request.clientType === 'registered' 
      ? request.user.email 
      : request.guestInfo.email;
    await sendEmail({ email: userEmail, subject, message });

    // Notify admin(s) – in this demo we use one address
    await sendEmail({ 
      email: process.env.EMAIL_USER, 
      subject: `ADMIN: ${subject}`, 
      message: `Request ID: ${request._id}\n${message}` 
    });
  } catch (err) { 
    console.error('Notification email failed:', err); 
  }
};

// @desc   Create new project/custom request
// @route  POST /api/requests
// @access Public / Private
exports.createRequest = async (req, res, next) => {
  try {
    if (req.user) {
      req.body.clientType = 'registered';
      req.body.user = req.user._id;
    } else {
      req.body.clientType = 'guest';
    }

    const request = await Request.create(req.body);
    await notifyStatus(request, 'New Project Request', 'Your request is received and pending review.');
    
    res.status(201).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};

// @desc   Get user's own requests with full details
// @route  GET /api/requests/my
// @access Private (User)
exports.getUserRequests = async (req, res, next) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate('project', 'name price description technologies category')
      .populate('statusHistory.updatedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (err) { 
    next(err); 
  }
};

// @desc   Get all requests (admin)
// @route  GET /api/requests
// @access Private/Admin
exports.getAllRequests = async (req, res, next) => {
  try {
    const requests = await Request.find()
      .populate('user', 'username email')
      .populate('project', 'name')
      .populate('statusHistory.updatedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (err) {
    next(err);
  }
};

// @desc   Update request status / notes (admin)
// @route  PUT /api/requests/:id
// @access Private/Admin
exports.updateRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('user', 'email username');
      
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Store old status for comparison
    const oldStatus = request.status;

    // Update allowed fields
    const updatable = [
      'status', 'adminNotes', 'githubLink', 'currentModule',
      'expectedCompletion', 'estimatedPrice', 'actualPrice', 'paymentStatus'
    ];
    
    updatable.forEach((k) => {
      if (req.body[k] !== undefined) request[k] = req.body[k];
    });

    // Update timestamps based on status
    if (req.body.status === 'approved' && oldStatus !== 'approved') {
      request.approvedAt = new Date();
    } else if (req.body.status === 'completed' && oldStatus !== 'completed') {
      request.completedAt = new Date();
    }

    await request.save();

    // Send notification with status history tracking
    await notifyStatus(
      request,
      `Request ${request.status.toUpperCase()}`,
      `Your request is now ${request.status}. ${request.adminNotes || ''}`,
      req.user._id
    );

    res.status(200).json({ success: true, request });
  } catch (err) {
    next(err);
  }
};
