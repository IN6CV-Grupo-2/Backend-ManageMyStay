import { body} from "express-validator";
import Event from '../event/event.model.js';

export const validateEventDates = [
    body("startDate")
    .notEmpty().withMessage("Start date is required")
    .isISO8601().withMessage("Start date must be a valid date")
    // ex. 2025-04-29
    .custom((value) => {
      const date = new Date(value);
      if (date <= new Date()) {
        throw new Error("Start date must be in the future");
      }
      return true;
    }),

  body("finishDate")
    .notEmpty().withMessage("Finish date is required")
    .isISO8601().withMessage("Finish date must be a valid date")
    // ex. 2025-04-29
    .custom((value, { req }) => {
      const start = new Date(req.body.startDate);
      const end = new Date(value);
      if (end <= start) {
        throw new Error("Finish date must be after start date");
      }
      return true;
    }),
];

export const validateRole = (...role) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(500).json({
                success: false,
                msg: 'You want to verify a role without validating the token first.'
            })
        }
        if (!role.includes(req.user.role)){
            return res.status(401).json({
                success: false,
                msg: `Unauthorized user, has a role ${req.user.role}, the authorized roles are ${role}`
            })
        }
    }
}

export const fieldsValidator = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(errors);
    }

    next();
}

export const validateCancelEvent = async (req, res, next) => {
  try {
    const user = req.user;
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if(!event){
      return res.status(404).json({
        msg: 'Event not found'
      })
    }

    if(!user.role !== 'ADMIN_HOTEL_ROLE' || user.role !== 'ADMIN_ROLE'){
      return res.status(404).json({
        msg: 'Only an administrator can cancel the event'
      })
    }

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      sucess: false,
      msg: 'Error to validate cancel the event'
    })
  }
}