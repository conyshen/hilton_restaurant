import Booking from "../models/bookingModel";
import { BookingProps } from "../graphql/types/props";

export const bookingFindOne = async (args: Partial<BookingProps>) => {
  console.log("asafs", {
    contact: args.contact,
    arrivalTime: args.arrivalTime,
    arrivalDate: args.arrivalDate,
    status: args.status,
  });
  return await Booking.findOne({
    contact: args.contact,
    arrivalTime: args.arrivalTime,
    arrivalDate: args.arrivalDate,
    status: args.status,
  });
};

export const bookingFind = async (args?: Partial<BookingProps>) => {
  return args ? await Booking.find(args) : await Booking.find();
};
