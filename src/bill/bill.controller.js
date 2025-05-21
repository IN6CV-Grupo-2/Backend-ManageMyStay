<<<<<<< HEAD
import Bill from "./bill.model.js";

export const createBill = async (req, res) => {
  try {
    const data = req.body;

    const bill = await create({
      costumer: data.reservation.guest._id,
      details: data.details,
      reservations: data.reservations,
    });

    res.status(201).json({ 
      msg: "Bill created successfully", 
      bill 
    });
  } catch (e) {
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
      .populate("provider")
      .populate("reservation");

    res.status(200).json(bills);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error while retrieving bills" });
  }
};

export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await Bill.findById(id).populate("reservation");

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
    const { billId } = req.params;
    const { details, reservations } = req.body;
    const data = { details, reservations };
    const bill = await Bill.findByIdAndUpdate(billId, data, { new: true });
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
=======
import Bill from './bill.model.js';

export const createBill = async (req, res) => {
  try {
    const bill = await Bill.create(req.body);
    res.status(201).json({ msg: 'Bill created successfully', bill });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while creating the bill' });
  }
};

export const getBills = async (req, res) => {
  const { details, provider, reservation } = req.query;

  const query = {};
  if (details) query.details = { $regex: details, $options: 'i' };
  if (provider) query.provider = provider;
  if (reservation) query.reservation = reservation;

  try {
    const bills = await Bill.find(query)
      .populate('provider')
      .populate('reservation');

    res.status(200).json(bills);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while retrieving bills' });
  }
};

export const getBillById = async (req, res) => {
  const { id } = req.params;
  try {
    const bill = await Bill.findById(id)
      .populate('provider')
      .populate('reservation');

    if (!bill) return res.status(404).json({ msg: 'Bill not found' });

    res.status(200).json(bill);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while retrieving the bill' });
  }
};

export const updateBill = async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await Bill.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: 'Bill updated successfully', bill: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Error while updating the bill' });
  }
};

export const deleteBill = async (req, res) => {
  const { id } = req.params;
  const { confirm } = req.query;

  if (confirm !== 'true') {
    return res.status(400).json({
      msg: 'Confirmation required to delete bill. Please add "?confirm=true" to the URL.'
    });
  }

  try {
    const bill = await Bill.findById(id);
    if (!bill) {
      return res.status(404).json({ msg: 'Bill not found' });
    }

    if (bill.status === false) {
      return res.status(400).json({ msg: 'Bill is already deactivated' });
    }

    bill.status = false;
    await bill.save();

    res.status(200).json({ msg: 'Bill deactivated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error while deleting the bill' });
  }
};
>>>>>>> 46266e33ef85ea5bb587e0c5b9246e466d4cdf91
