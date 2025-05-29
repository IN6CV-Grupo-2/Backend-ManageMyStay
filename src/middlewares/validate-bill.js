import Bill from '../bill/bill.model.js';
import Reservation from '../reservations/reservation.model.js';

export const validateCreateBill = async (req, res, next) => {
  try {
    const { reservations } = req.body;

    for (const reservationId of reservations) {
      const existReservation = await Reservation.findById(
        reservationId._id || reservationId
      );
      if (!existReservation) {
        return res.status(404).json({
          msg: 'One or more reservation not found'
        })
      }
    }
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      msg: 'Error to validate creating bill'
    })
  }
}

export const validateUpdateBill = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);
    const data = req.body;

    if (!bill) {
      return res.status(404).json({
        msg: 'Bill not found'
      })
    }

    if (Array.isArray(data.reservations)) {
      for (const reservation of data.reservations) {
        const existReservation = await Reservation.findById(reservation._id);
        if (!existReservation) {
          return res.status(404).json({
            msg: 'One or more reservation not found'
          })
        }
      }
    }

    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      sucess: false,
      msg: 'Error to validate updating the bill'
    })
  }
}


export const validateDeleteBill = async (req, res, next) => {
  try {
    const { billId } = req.params;
    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(404).json({
        msg: 'Bill not found'
      })
    }

    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      msg: 'Error to validate deleting bill'
    })
  }
}
