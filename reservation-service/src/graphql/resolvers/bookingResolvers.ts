import Booking from "../../models/bookingModel";
import { v4 as uuidv4 } from "uuid";
import { BookingProps } from "../types/props";
import { bookingFindOne, bookingFind } from "../../dao/booking.dao";
import { format, parse } from "date-fns";
export const createBookingResolver = async (
  parent: any,
  args: Partial<BookingProps>
) => {
  const { guestName, tableSize, arrivalTime, arrivalDate, status, contact } = args;
  const existingBooking = await bookingFindOne(args);
  if (existingBooking) {
    throw new Error(
      "A booking with the same contact and arrival time already exists."
    );
  } 

  const booking = new Booking({
    id: uuidv4(),
    guestName: guestName,
    tableSize: tableSize,
    arrivalTime: arrivalTime,
    arrivalDate: arrivalDate,
    status: status,
    contact: contact,
  });
  return await booking.save();
};

export const updateBookingResolver = async (
  parent: any,
  args: Partial<any>
) => {
  const { id, bookingUpdate } = args;
  
  return Booking.findByIdAndUpdate(id, { $set: bookingUpdate }, { new: true });
};

export const listAllBookingResolver = async (
  parent: any,
  args: Partial<BookingProps>
) => {
  return await bookingFind();
};

export const listAllbookingByStatusDateResolver = async (
  parent: any,
  args: Partial<BookingProps>
) => {
  let { arrivalDate, status } = args;
  return await bookingFind({ status: status, arrivalDate: arrivalDate });
};

export const listAllBookingByContactNumberResolver = async (
  parent: any,
  args: Partial<BookingProps>
) => {
  const { contact, guestName } = args;
  return await bookingFind({ guestName: guestName, contact: contact });
};
