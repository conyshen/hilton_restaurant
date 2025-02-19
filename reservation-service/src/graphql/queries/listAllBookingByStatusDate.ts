import { GraphQLList, GraphQLString } from "graphql";
import { bookingType } from "../types/bookingType";
import { listAllbookingByStatusDateResolver } from "../resolvers/bookingResolvers";
export const listAllbookingByStatusDate = {
  type: new GraphQLList(bookingType),
  args: {
    status: { type: GraphQLString },
    arrivalDate: { type: GraphQLString },
  },
  resolve: listAllbookingByStatusDateResolver,
};
