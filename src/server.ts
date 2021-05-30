import * as fs from "fs";
import { Description, DescriptionType } from "./mongosee";
import { FastifyInstance, fastify } from "fastify";
import { ApolloServer as FastifyApolloServer } from "apollo-server-fastify";
import { ApolloServer as GCFApolloServer } from "apollo-server-cloud-functions";
import path from "path";
import resolvers from "./resolvers";

const fastifyTemplateConstructor = (append: unknown): FastifyInstance => {
  const defaultOpt = { logger: { prettyPrint: { colorize: true } } };
  const opt = Object.assign(defaultOpt, append);
  return fastify(opt);
};

export const createFastify = (isHttp: boolean): FastifyInstance =>
  fastifyTemplateConstructor(
    isHttp
      ? { http2: true }
      : {
          https: {
            cert: fs.readFileSync(path.join(__dirname, "../private/cert.pem")),
            key: fs.readFileSync(path.join(__dirname, "../private/key.pem")),
          },
        }
  );

export const settingRedirectServer = (
  fastify: FastifyInstance,
  code: number,
  dest: string
): void => {
  fastify.all("*", (_, res) => {
    res.code(code);
    res.headers({ Location: dest });
    res.send();
  });
};

export type ApolloServerContext = { Description: DescriptionType };

export const apolloOpts = {
  context: { Description },
  debug: false,
  introspection: true,
  resolvers,
  typeDefs: fs
    .readFileSync(path.join(__dirname, "graphql/typeDefs.graphql"))
    .toString("utf-8"),
};

export const createFastifyApolloServer = (): FastifyApolloServer =>
  new FastifyApolloServer(apolloOpts);

export const createGCFApolloServer = (): GCFApolloServer =>
  new GCFApolloServer(apolloOpts);
