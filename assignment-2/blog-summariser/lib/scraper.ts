import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

/**
 * Universal Scraper:
 * 1. Try Axios + Cheerio (fast)
 * 2. If fails or small content -> Fallback to Puppeteer (renders JavaScript-heavy pages)
 */
export async function scrapeBlog(url: string): Promise<string> {
  try {
    console.log("🔹 Trying Axios Scraper...");

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
    });

    const $ = cheerio.load(data);

    let content =
      $("article").text().trim() ||
      $("main").text().trim() ||
      $("div").text().trim() ||
      $("p").text().trim();

    // Meta fallback
    if (!content || content.length < 100) {
      content =
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        $("title").text();
    }

    if (content && content.length > 100) {
      console.log("✅ Axios Scraper Success");
      return content.slice(0, 15000);
    }

    console.warn("⚠️ Axios content too small, switching to Puppeteer...");
  } catch (err: any) {
    console.warn("Axios scraper failed, switching to Puppeteer:", err.message);
  }

  // ---- Puppeteer Fallback ----
  try {
    console.log("🔹 Running Puppeteer Scraper...");
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const content = await page.evaluate(() => {
      const text =
        document.querySelector("article")?.innerText ||
        document.body.innerText;
      return text || "Failed to scrape content.";
    });

    await browser.close();
    console.log("✅ Puppeteer Scraper Success");

    return content.slice(0, 15000);
  } catch (err: any) {
    console.error("Scraper failed completely:", err.message);
    return "Failed to scrape content.";
  }
}
