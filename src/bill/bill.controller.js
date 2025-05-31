import Bill from "./bill.model.js";
import Reservation from "../reservations/reservation.model.js";
import Room from "../room/room.model.js";

const calculateTotalReservations = async (reservations) => {
  let total = 0;

  for (const reservationId of reservations) {
    const reservation = await Reservation.findById(reservationId)
      .populate("rooms");

    if (!reservation) continue;

    const { checkIn, checkOut, rooms } = reservation;

    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const roomCost = rooms.reduce((sum, room) => sum + (room.priceNight * nights), 0);

    total += roomCost;
  }

  return total;
};

export const createBillFromReservation = async (req, res) => {
  try {
    const { reservationId } = req.body;

    const reservation = await Reservation.findById(reservationId)
      .populate("rooms");

    if (!reservation) {
      return res.status(404).json({ msg: "Reservation not found" });
    }

    const { checkIn, checkOut, rooms, guest } = reservation;

    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    const roomCost = rooms.reduce((sum, room) => sum + (room.priceNight * nights), 0);

    const total = roomCost;

    const bill = await Bill.create({
      costumer: guest,
      details: `Auto-generated bill for reservation ${reservationId}`,
      reservations: [reservationId],
      total,
    });

    res.status(201).json({
      msg: "Bill generated from reservation successfully",
      bill,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "Error generating bill from reservation",
      error: e.message,
    });
  }
};

export const createBill = async (req, res) => {
  try {
    const { reservations, details } = req.body;

    if (!reservations || reservations.length === 0) {
      return res.status(400).json({ msg: "At least one reservation is required" });
    }

    const total = await calculateTotalReservations(reservations);

    const reservation = await Reservation.findById(reservations[0]);
    const guestId = reservation?.guest;

    if (!guestId) {
      return res.status(400).json({ msg: "Could not retrieve guest from reservation" });
    }

    const bill = await Bill.create({
      costumer: guestId,
      details,
      reservations,
      total,
    });

    res.status(201).json({
      msg: "Bill created successfully",
      bill
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      msg: "Error while creating the bill",
      error: e.message
    });
  }
};

export const getBills = async (req, res) => {

  const { details, provider, reservation } = req.query;

  const query = {};
  if (details) query.details = { $regex: details, $options: "i" };
  if (provider) query.provider = provider;
  if (reservation) query.reservation = reservation;

  try {
    const bills = await Bill.find(query)
      .populate("costumer")
      .populate("reservations");

    res.status(200).json(bills);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error while retrieving bills" });
  }
};

export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findById(id)
      .populate("costumer")
      .populate("reservations");

    if (!bill)
      return res.status(404).json({
        msg: "Bill not found",
      });

    res.status(200).json({
      msg: "Bill retrieved successfully",
      bill,
    });
  } catch (e) {
    res.status(500).json({
      msg: "Error while retrieving the bill",
      error: e.message,
    });
  }
};

export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { details, reservations, total } = req.body;
    const data = { details, reservations, total };

    const bill = await Bill.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      costumer: bill.costumer,
      emitionDate: bill.emitionDate,
      details: bill.details,
      reservations: bill.reservations,
      total: bill.total,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error while updating the bill" });
  }
};

export const deleteBill = async (req, res) => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== "true") {
    return res.status(400).json({
      msg: 'Confirmation required to delete bill. Please add "?confirm=true" to the URL.',
    });
  }

  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ msg: "Bill not found" });
    }

    if (bill.status === false) {
      return res.status(400).json({ msg: "Bill is already deactivated" });
    }

    bill.status = false;
    await bill.save();

    res.status(200).json({ msg: "Bill deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error while deleting the bill" });
  }
};
