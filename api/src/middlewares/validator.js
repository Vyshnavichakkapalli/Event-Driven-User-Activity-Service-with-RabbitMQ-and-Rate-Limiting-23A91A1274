const Joi = require('joi');

const activitySchema = Joi.object({
    userId: Joi.string().required(),
    eventType: Joi.string().required().min(1),
    timestamp: Joi.date().iso().required(),
    payload: Joi.object().required()
});

function validateActivity(req, res, next) {
    const { error, value } = activitySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    req.validatedActivity = value;
    next();
}

module.exports = { validateActivity };
