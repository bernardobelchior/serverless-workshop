const { PNG } = require("pngjs");
const CDP = require("chrome-remote-interface");

module.exports = class Chrome {
  /**
   * Initializes chrome remote interface. Must be called before any other function.
   * @return {Promise<void>}
   */
  async init () {
    this.client = await CDP();

    const { Page, DOM } = this.client;

    await Promise.all([
      DOM.enable(),
      Page.enable()
    ]);

    return DOM.getDocument()
  }

  /**
   * Sets the page HTML
   * @param html
   * @return {Promise<void>}
   */
  setHTML (html) {
    const { DOM } = this.client;

    return DOM.setOuterHTML({ nodeId: 1, outerHTML: html });
  }

  /**
   * Captures screenshot and returns a Promise that resolves to a PNG image.
   * @return {Promise<PNG>}
   */
  async captureScreenshot () {
    const { Page } = this.client;

    const screenshot = await Page.captureScreenshot({ format: "png" });

    return PNG.sync.read(Buffer.from(screenshot.data, "base64"));
  }

  close () {
    return this.client.close();
  }
}
