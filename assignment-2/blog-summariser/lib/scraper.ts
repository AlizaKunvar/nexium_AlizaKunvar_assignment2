import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlog(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0', // Pretend to be a real browser
      }
    });

    const $ = cheerio.load(data);

    // Try to find main article content
    const article = $('article').text().trim() ||
                    $('main').text().trim() ||
                    $('body').text().trim();

    if (!article || article.length < 100) {
      throw new Error('Could not find meaningful content');
    }

    return article;
  } catch (err) {
    console.error('Scraper failed:', err.message);
    return 'Failed to scrape content..';
  }
}
