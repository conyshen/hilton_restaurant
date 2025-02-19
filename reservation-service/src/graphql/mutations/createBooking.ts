import { GraphQLString, GraphQLInt } from "graphql";
import { bookingType } from "../types/bookingType";
import { createBookingResolver } from "../resolvers/bookingResolvers";
export const createBooking = {
  type: bookingType,
  args: {
    guestName: { type: GraphQLString },
    tableSize: { type: GraphQLInt },
    arrivalTime: { type: GraphQLString },
    arrivalDate: { type: GraphQLString },
    status: { type: GraphQLString },
    contact: { type: GraphQLString },
  },
  resolve: createBookingResolver,
};
