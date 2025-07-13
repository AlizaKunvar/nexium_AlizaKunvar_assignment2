// app/api/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { scrapeBlog } from '@/lib/scraper';
import { fakeSummarise } from '@/lib/summarise';
import { translateToUrdu } from '@/lib/translate';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }

    const fullText = await scrapeBlog(url);
    const summary = fakeSummarise(fullText);
    const urduSummary = translateToUrdu(summary);

    return NextResponse.json({ summary, urduSummary });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
