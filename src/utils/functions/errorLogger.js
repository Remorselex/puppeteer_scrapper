import chalk from "chalk";

function logError(err) {
  console.log(chalk.red.bold(`Error getting data from page#${index + 1}\n`));
  console.error('Error getting data from page#', index + 1);
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
}

export { logError };
