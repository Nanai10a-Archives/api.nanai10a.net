export {};

console.log(
  "Hi, ts-node.",
  `now running in ${process.env["NODE_ENV"] ?? "development"} mode.`
);
