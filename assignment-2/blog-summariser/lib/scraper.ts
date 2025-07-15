import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeBlog(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const $ = cheerio.load(data);
    let text =
      $("p").text().trim() ||
      $("article").text().trim() ||
      $("main").text().trim() ||
      $("body").text().trim();

    if (!text || text.length < 100) {
      console.warn("Scraper: No content found, returning dummy text");
      return "This is a fallback dummy blog text for testing purposes. It talks about AI, technology, and the future of machine learning.";
    }

    return text;
  } catch (err) {
    console.error("Scraper failed:", err);
    return "This is a fallback dummy blog text because scraping failed. It mentions software development, AI tools, and productivity hacks.";
  }
}
