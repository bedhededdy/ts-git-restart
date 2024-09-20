import CommandFactory from "command-factory";

function main() {
  const command = CommandFactory.createCommand(process.argv);
  if (command === null)
    process.exit(1);
  process.exit(command.exec());
}

main();

