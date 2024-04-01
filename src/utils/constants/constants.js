const LAUNCH_PUPPETEER_OPTIONS = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
    "--window-size=1920x1080",
  ],
};

const PAGE_PUPPETEER_OPTS = {
  networkIdle2Timeout: 5000,
  waitUntil: "networkidle2",
  timeout: 300000,
};

export { LAUNCH_PUPPETEER_OPTIONS, PAGE_PUPPETEER_OPTS };
