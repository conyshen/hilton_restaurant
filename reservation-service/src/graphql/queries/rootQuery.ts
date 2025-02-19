import {
  GraphQLObjectType,
} from "graphql";
import { bookingQuery } from "./bookingQuery";
import { listAllBooking } from "./listAllBooking";
import { listAllBookingByContactNumber } from "./listAllBookingByContactNumber";
import { listAllbookingByStatusDate } from "./listAllBookingByStatusDate";

export const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    bookingQuery,
    listAllBooking,
    listAllbookingByStatusDate,
    listAllBookingByContactNumber
  },
});
