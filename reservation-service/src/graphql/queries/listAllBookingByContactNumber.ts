import { GraphQLList, GraphQLString } from "graphql";
import { bookingType } from "../types/bookingType";
import { listAllBookingByContactNumberResolver } from "../resolvers/bookingResolvers";
export const listAllBookingByContactNumber = {
  type: new GraphQLList(bookingType),
  args: {
    contact: { type: GraphQLString },
    guestName: { type: GraphQLString },
  },
  resolve: listAllBookingByContactNumberResolver,
};
