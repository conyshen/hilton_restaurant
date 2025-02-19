import { GraphQLString, GraphQLInputObjectType, GraphQLInt } from "graphql";
import { bookingType } from "../types/bookingType";
import { updateBookingResolver } from "../resolvers/bookingResolvers";
export const updateBookingById = {
  type: bookingType,
  args: {
    id: { type: GraphQLString },
    bookingUpdate: {
      type: new GraphQLInputObjectType({
        name: "BookingUpdateInput",
        fields: {
          id: { type: GraphQLString },
          guestName: { type: GraphQLString },
          tableSize: { type: GraphQLInt },
          arrivalTime: { type: GraphQLString },
          arrivalDate: { type: GraphQLString },
          status: { type: GraphQLString },
          contact: { type: GraphQLString },
        },
      }),
    },
  },
  resolve: updateBookingResolver
};
