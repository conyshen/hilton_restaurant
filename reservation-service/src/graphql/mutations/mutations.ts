import { GraphQLObjectType } from "graphql/type/definition";
import { createBooking } from "./createBooking";
import { updateBookingById } from "./updateBooking";
export const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createBooking,
    updateBookingById
  },
});