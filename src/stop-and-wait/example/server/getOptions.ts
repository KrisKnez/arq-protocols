// CLI Options
import { Command } from "commander";

const program = new Command();
program
  .name("stop-and-wait server")
  .description("An example server using the stop-and-wait pipe")
  .option("--port <port>", "The port on which to listen on", parseInt)
  .option("--host <host>", "The IP or Domain on which to listen on", String)
  .parse();

import { z, ZodError } from "zod";
import validator from "validator";

const optionsSchema = z.object({
  port: z.number().min(1024).max(65535).optional(),
  host: z
    .custom<string>(
      (value) =>
        typeof value === "string" &&
        (validator.isIP(value) || validator.isFQDN(value)),
      {
        message: "Host is not a valid IP or Domain",
      }
    )
    .optional(),
});

const getOptions = async () => {
  try {
    return await optionsSchema.parseAsync(program.opts())
  } catch(e: unknown) {
    if (e instanceof ZodError) {
      console.log(e.message)
    }
  }
};

export default getOptions