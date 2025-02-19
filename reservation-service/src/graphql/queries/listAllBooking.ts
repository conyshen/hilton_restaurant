import { GraphQLList, GraphQLString } from "graphql";
import { bookingType } from "../types/bookingType";
import { listAllBookingResolver } from "../resolvers/bookingResolvers";
export const listAllBooking = {
  type: new GraphQLList(bookingType),
  args: {
    status: { type: GraphQLString },
    arrivalDate: { type: GraphQLString },
  },
  resolve: listAllBookingResolver,
};
