import * as server from "./server";
import { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
mongoose
  .connect(process.env["MONGO_URL"] ?? "", {
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected.");
  })
  .catch(console.error);

export const main = async (): Promise<void> => {
  const fastify = server.createFastify(false);
  const apollo = server.createFastifyApolloServer();

  await apollo.start();
  fastify.register(apollo.createHandler({ cors: true, path: "/graphql" }));

  await fastify.listen(
    parseInt(process.env["LISTEN_PORT"] ?? "3000", 10),
    "0.0.0.0"
  );
};

export const gcfMain = (req: Request, res: Response): void => {
  server.createGCFApolloServer().createHandler({
    cors: {
      origin: "*",
    },
  })(req, res);
};
