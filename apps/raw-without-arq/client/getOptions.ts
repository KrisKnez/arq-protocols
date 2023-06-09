// CLI Options
import { Command } from "commander";

const program = new Command();
program
  .name("stop-and-wait server")
  .description("An example UDP server using the stop-and-wait pipe")
  .option("--udp-port <udp-port>", "The port on which UDP server will listen", parseInt)
  .option("--udp-host <udp-host>", "The host on which UDP server will listen", String)
  .option("--arq-port <arq-port>", "The port on which ARQ server is listening", String)
  .option("--arq-host <arq-host>", "The host on which ARQ server is listening", String)
  .parse();

import { z, ZodError } from "zod";
import validator from "validator";

const portSchema = z.number().min(1024).max(65535);
const hostSchema = z
.custom<string>(
  (value) =>
    typeof value === "string" &&
    (validator.isIP(value) || validator.isFQDN(value)),
  {
    message: "Host is not a valid IP or Domain",
  }
)

const optionsSchema = z.object({
  ['arq-port']: portSchema.default(3000),
  ['arq-host']: hostSchema.default("127.0.0.1"),
  ['udp-port']: portSchema.default(4000),
  ['udp-host']: hostSchema.default("127.0.0.1"),
});

const getOptions = () => {
  return optionsSchema.parseAsync(program.opts())
};

export default getOptions