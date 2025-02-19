import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";

export const bookingType = new GraphQLObjectType({
  name: "Booking",
  fields: () => ({
    id: { type: GraphQLString },
    guestName: { type: GraphQLString },
    tableSize: { type: GraphQLInt },
    arrivalTime: { type: GraphQLString },
    arrivalDate: { type: GraphQLString },
    status: { type: GraphQLString },
    contact: { type: GraphQLString },
  }),
});

