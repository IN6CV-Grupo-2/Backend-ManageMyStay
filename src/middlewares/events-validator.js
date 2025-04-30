import { body} from "express-validator";

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