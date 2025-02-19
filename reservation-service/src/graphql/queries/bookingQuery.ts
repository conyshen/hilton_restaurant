import { GraphQLString, GraphQLInt } from "graphql";
import Booking from "../../models/bookingModel";
import { bookingType } from "../types/bookingType";
export const bookingQuery = {
  type: bookingType,
  args: {
    id: { type: GraphQLString },
    guestName: { type: GraphQLString },
    tableSize: { type: GraphQLInt },
    arrivalTime: { type: GraphQLString },
    arrivalDate: { type: GraphQLString },
    status: { type: GraphQLString },
    contact: { type: GraphQLString },
  },
  resolve(args: { guestName: string; contact: string,status:string }) {
    const { guestName, contact, status } = args;
    return Booking.find({
      guestName: guestName,
      contact: contact,
      status
    });
  },
};
