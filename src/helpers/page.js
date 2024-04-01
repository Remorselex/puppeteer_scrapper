import puppeteer from 'puppeteer';
import { logError } from '../utils/functions/errorLogger.js';
import chalk from "chalk";

export const LAUNCH_PUPPETEER_OPTS = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--window-size=1920x1080'
  ]
};

export const PAGE_PUPPETEER_OPTS = {
  networkIdle2Timeout: 5000,
  waitUntil: 'networkidle2',
  timeout: 30000
};

export class PuppeteerHandler {
  constructor() {
    this.browser = null;
  }

  async initBrowser() {
    try {
      this.browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS);
    } catch (err) {
      logError(err);
      throw new Error('Failed to initialize browser');
    }
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async getPageContent(url, retryCount = 0) {
    const maxRetries = 10;

    if (!this.browser) {
      await this.initBrowser();
    }

    try {
      const page = await this.browser.newPage();
      await page.goto(url, PAGE_PUPPETEER_OPTS);
      const content = await page.content();
      await page.waitForSelector('.views-table tbody tr', { timeout: 5000 });
      await page.close();
      return content;
    } catch (err) {
      if (retryCount < maxRetries) {
        console.log(chalk.green.bold(`Retrying ${url} (attempt ${retryCount + 1})`));
        return this.getPageContent(url, retryCount + 1);
      } else {
        throw new Error(`Failed to get page content for URL: ${url} after ${maxRetries} retries`);
      }
    }
  }
}