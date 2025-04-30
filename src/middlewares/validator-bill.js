import { check, param, query } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import mongoose from 'mongoose';

const isMongoIdValid = (value, { req, location, path }) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid MongoDB ID in field: ${path}`);
  }
  return true;
};

export const validateCreateBill = [
  check('details', 'Details field is required').notEmpty(),
  check('provider', 'Provider is required').notEmpty(),
  check('provider').custom(isMongoIdValid),
  check('reservation', 'Reservation is required').notEmpty(),
  check('reservation').custom(isMongoIdValid),
  check('total', 'Total must be a non-negative number').isFloat({ min: 0 }),
  validarCampos,
];

export const validateUpdateBill = [
  check('details').optional().notEmpty().withMessage('Details cannot be empty'),
  check('provider').optional().custom(isMongoIdValid),
  check('reservation').optional().custom(isMongoIdValid),
  check('total').optional().isFloat({ min: 0 }).withMessage('Total must be a non-negative number'),
  validarCampos,
];


export const validateDeleteBill = [
    param('id')
      .isMongoId()
      .withMessage('Invalid bill ID.'),
  
    query('confirm')
      .equals('true')
      .withMessage('You must confirm the deletion with ?confirm=true in the URL.'),
];
