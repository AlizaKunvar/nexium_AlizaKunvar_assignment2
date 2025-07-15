import * as cheerio from "cheerio";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import axios from "axios";

export async function scrapeBlog(url: string): Promise<string> {
  try {
    console.log("📌 Processing URL:", url);

    // 1️⃣ Try Axios first
    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      });

      const $ = cheerio.load(data);
      const article =
        $("article").text().trim() ||
        $("main").text().trim() ||
        $("body").text().trim();

      if (article.length > 100) {
        console.log("✅ Axios Scraper Worked");
        return article.slice(0, 5000);
      }
      throw new Error("Not enough content with Axios");
    } catch (err) {
      console.log("🔹 Axios failed, switching to Puppeteer...");
    }

    // 2️⃣ Fallback: Puppeteer
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const content = await page.content();
    await browser.close();

    const $ = cheerio.load(content);
    const article =
      $("article").text().trim() ||
      $("main").text().trim() ||
      $("body").text().trim();

    console.log("✅ Puppeteer Scraper Worked");
    return article.slice(0, 5000) || "Failed to scrape meaningful content";
  } catch (err: any) {
    console.error("Scraper failed completely:", err.message);
    return "Failed to scrape content..";
  }
}
