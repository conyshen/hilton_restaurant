import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  tableSize: { type: Number, required: true },
  arrivalTime: { type: String, required: true },
  arrivalDate: { type: String, required: true },
  status: { type: String, required: true },
  contact: { type: String, required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
