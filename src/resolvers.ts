import { ApolloServerContext } from "./server";
import { GraphQLFieldResolver } from "graphql";

const resolvers: Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Record<string, GraphQLFieldResolver<any, ApolloServerContext>>
> = {
  MaybeDescription: {
    __resolveType: (obj) => {
      if (obj?.details) return "Error";
      if (obj?.id) return "Description";
      return null;
    },
  },
  Mutation: {
    createDescription: async (_, args, { Description }) => {
      const result = await Description.create({
        markdown: args["markdown"],
      });

      return {
        errOrResult: result.toObject(),
        success: true,
      };
    },
    deleteDescription: async (_, args, { Description }) => {
      const result = await Description.findOneAndRemove({ id: args["id"] });

      if (result) return { success: true };

      return {
        err: { details: "not found. (cannot find by id)" },
        success: false,
      };
    },
    updateDescription: async (_, args, { Description }) => {
      const data = await Description.findOne({ id: args["id"] });

      if (!data)
        return {
          errOrResult: { details: "not found. (cannot find by id)" },
          success: false,
        };

      data.updates.push({ markdown: data.markdown, timestamp: data.timestamp });

      const result = await data.update({
        markdown: args["markdown"],
        timestamp: new Date(),
        updates: data.updates,
      });

      const refreshedData = await Description.findOne({ id: data.id });

      if (!refreshedData)
        return {
          errOrResult: {
            details:
              "internal server error. (cannot re-fetch data, but succeed operation)",
          },
          success: true,
        };

      // eslint-disable-next-line no-magic-numbers
      if (result.ok === 1)
        return {
          errOrResult: refreshedData.toObject(),
          success: true,
        };

      return {
        errOrResult: {
          details: "internal server error. (operation uncompleted)",
        },
        success: false,
      };
    },
  },
  Query: {
    descriptions: async (_, __, { Description }) => ({
      descriptions: await Description.find(),
    }),
  },
};

export default resolvers;
