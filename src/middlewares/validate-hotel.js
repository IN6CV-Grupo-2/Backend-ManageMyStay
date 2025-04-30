import { body, param, query } from 'express-validator';
import Hotel from '../models/hotel.model.js';
import Category from '../models/category.model.js';
import User from '../models/user.model.js';
import Event from '../models/event.model.js';
import Room from '../models/room.model.js';

// Validación para la creación de un hotel
export const validateHotel = [
  body('name')
    .notEmpty().withMessage('Hotel name is required.')
    .isLength({ min: 3, max: 100 }).withMessage('Hotel name must be between 3 and 100 characters.')
    .custom(async (value) => {
      const hotelExists = await Hotel.findOne({ name: value });
      if (hotelExists) {
        throw new Error('Hotel name must be unique.');
      }
      return true;
    }),

  body('address')
    .notEmpty().withMessage('Address is required.')
    .isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters.')
    .trim(),

  body('amenities')
    .notEmpty().withMessage('Amenities are required.')
    .isArray().withMessage('Amenities must be an array.')
    .custom((value) => {
      const validAmenities = ["WiFi", "Gym", "Pool", "Restaurant", "Spa"];
      for (const amenity of value) {
        if (!validAmenities.includes(amenity)) {
          throw new Error(`${amenity} is not a valid amenity.`);
        }
      }
      return true;
    }),

  body('category')
    .notEmpty().withMessage('Category is required.')
    .isMongoId().withMessage('Invalid category ID.')
    .custom(async (value) => {
      const categoryExists = await Category.findById(value);
      if (!categoryExists) {
        throw new Error('Category does not exist.');
      }
      return true;
    }),

  body('user')
    .notEmpty().withMessage('User ID is required.')
    .isMongoId().withMessage('Invalid user ID.')
    .custom(async (value) => {
      const userExists = await User.findById(value);
      if (!userExists) {
        throw new Error('User does not exist.');
      }
      return true;
    }),

  body('event')
    .optional()
    .isMongoId().withMessage('Invalid event ID.')
    .custom(async (value) => {
      if (value) {
        const eventExists = await Event.findById(value);
        if (!eventExists) {
          throw new Error('Event does not exist.');
        }
      }
      return true;
    }),

  body('room')
    .notEmpty().withMessage('Room ID is required.')
    .isMongoId().withMessage('Invalid room ID.')
    .custom(async (value) => {
      const roomExists = await Room.findById(value);
      if (!roomExists) {
        throw new Error('Room does not exist.');
      }
      return true;
    }),
];

// Validación para la edición de un hotel
export const validateEditHotel = [
  body('name')
    .optional()
    .isLength({ min: 3, max: 100 }).withMessage('Hotel name must be between 3 and 100 characters.')
    .custom(async (value, { req }) => {
      if (value) {
        const hotelExists = await Hotel.findOne({ name: value, _id: { $ne: req.params.id } });
        if (hotelExists) {
          throw new Error('Hotel name must be unique.');
        }
      }
      return true;
    }),

  body('direccion')
    .optional()
    .isLength({ min: 10, max: 200 }).withMessage('Address must be between 10 and 200 characters.')
    .trim(),

  body('amenities')
    .optional()
    .isArray().withMessage('Amenities must be an array.')
    .custom((value) => {
      const validAmenities = ["WiFi", "Gym", "Pool", "Restaurant", "Spa"];
      for (const amenity of value) {
        if (!validAmenities.includes(amenity)) {
          throw new Error(`${amenity} is not a valid amenity.`);
        }
      }
      return true;
    }),

  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID.')
    .custom(async (value) => {
      if (value) {
        const categoryExists = await Category.findById(value);
        if (!categoryExists) {
          throw new Error('Category does not exist.');
        }
      }
      return true;
    }),

  body('user')
    .optional()
    .isMongoId().withMessage('Invalid user ID.')
    .custom(async (value) => {
      if (value) {
        const userExists = await User.findById(value);
        if (!userExists) {
          throw new Error('User does not exist.');
        }
      }
      return true;
    }),

  body('event')
    .optional()
    .isMongoId().withMessage('Invalid event ID.')
    .custom(async (value) => {
      if (value) {
        const eventExists = await Event.findById(value);
        if (!eventExists) {
          throw new Error('Event does not exist.');
        }
      }
      return true;
    }),

  body('room')
    .optional()
    .isMongoId().withMessage('Invalid room ID.')
    .custom(async (value) => {
      if (value) {
        const roomExists = await Room.findById(value);
        if (!roomExists) {
          throw new Error('Room does not exist.');
        }
      }
      return true;
    }),
];

// Validación para la eliminación de un hotel
export const validateDeleteHotel = [
  param('id').isMongoId().withMessage('Invalid hotel ID.'),
  query('confirm').equals('true').withMessage('You must confirm the deletion with ?confirm=true in the URL.'),
];
