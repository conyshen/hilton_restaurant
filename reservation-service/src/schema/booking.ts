import { GraphQLSchema } from "graphql";
import { RootQuery } from "../graphql/queries/rootQuery";
import { Mutation } from "../graphql/mutations/mutations";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
