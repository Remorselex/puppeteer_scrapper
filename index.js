import { setPagesCountArray } from "./src/helpers/paginator.js";
import { PuppeteerHandler } from "./src/helpers/page.js";
// eslint-disable-next-line import/namespace
import { saveData } from "./src/handlers/saver.js";
import chalk from "chalk";
import { handleItems } from "./src/handlers/itemHandler.js";

const baseUrl = "https://calorizator.ru/recipes/category";

const pagesMap = {
  SNACKS_PAGE: 10,
  SALADS_PAGE: 14,
  SANDWICHES_PAGE: 6,
  SOUPS_PAGE: 7,
  GARNISH_PAGE: 23,
  SAUCES_PAGE: 4,
  DESSERTS_PAGE: 12,
  CAKES_PAGE: 13,
  DRINKS_PAGE: 5,
  USERS_RECEPIEC_PAGE: 173,
};
const pagesKeys = Object.keys(pagesMap);


const urlsMap = {
  SNAСKS_URL: `${baseUrl}к/snacks?page=`,
  SALADS_URL: `${baseUrl}/salads?page=`,
  SANDWICHES_URL: `${baseUrl}/sandwiches?page=`,
  SOUPS_PAGE: `${baseUrl}/soups?page=`,
  GARNISH_PAGE: `${baseUrl}/garnish?page=`,
  SAUCES_PAGE: `${baseUrl}/sauces?page=`,
  DESSERTS_PAGE: `${baseUrl}/desserts?page=`,
  CAKES_PAGE: `${baseUrl}/cakes?page=`,
  DRINKS_PAGE: `${baseUrl}/drinks?page=`,
  USERS_RECEPIEC_PAGE: `https://calorizator.ru/recipe?page=`,
};
const urlsValues = Object.values(urlsMap);

export const pageHandler = new PuppeteerHandler();

async function* processPages(urls, currentIndex = 0, retryCount = 0, saveFileName) {

  const maxRetries = 50;

  for (let index = currentIndex; index < urls.length; index++) {
    const url = urls[index];
    try {
      const pageData = await handleItems(url, index);

      await saveData(pageData, saveFileName);
      console.log(chalk.green.bold(`Completed getting data from page#${index + 1}\n`));

      yield;
    } catch (err) {
      console.log(chalk.red.bold(`Error getting data from page#${index + 1}\n`));
      console.error('Error getting data from page#', index + 1);
      console.error('Error:', err);
      console.error('Error stack:', err.stack);

      if (retryCount < maxRetries) {
        console.log(chalk.yellow.bold(`Retrying page#${index + 1} (attempt ${retryCount + 1})\n`));
        yield* processPages(urls, index, retryCount + 1, saveFileName);
      } else {
        console.log(chalk.red.bold(`Max retries reached for page#${index + 1}. Skipping...\n`));
      }
      return;
    }
  }
}

(async function main() {
  try {
    for (let i = 0; i < urlsValues.length; i++) {
      const pageIndexes = setPagesCountArray(pagesMap[pagesKeys[i]]);
      const urls = pageIndexes.map(page => `${urlsValues[i]}${page}`);

      const parts = [urls, , , pagesKeys[i]];
      for await (const _ of processPages(...parts)) { }

      console.log(chalk.bold.greenBright('\tFile writing ended successfully',
        chalk.bold.blue(pagesKeys[i])));
    }

    await pageHandler.closeBrowser();
  } catch (err) {
    throw new Error(err);
  } finally {
    process.exit();
  }
})();