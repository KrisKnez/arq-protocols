// CLI Options
import { Command } from "commander";

const program = new Command();
program
  .name("stop-and-wait client")
  .description("An example client using the stop-and-wait pipe")
  .option("--port <port>", "The port to which to connect to", parseInt)
  .option("--host <host>", "The IP or Domain to which to connect to", String)
  .parse();

import { z, ZodError } from "zod";
import validator from "validator";

const optionsSchema = z.object({
  port: z.number().min(0).max(65535).default(3000),
  host: z
    .custom<string>(
      (value) =>
        typeof value === "string" &&
        (validator.isIP(value) || validator.isFQDN(value)),
      {
        message: "Host is not a valid IP or Domain",
      }
    )
    .default("127.0.0.1"),
});

const getOptions = async () => {
  try {
    const options = await optionsSchema.parseAsync(program.opts())
    return options
  } catch(e: unknown) {
    throw Error("Unknown Error")
  }
};

export default getOptions