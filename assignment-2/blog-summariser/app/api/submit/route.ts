import { NextRequest, NextResponse } from "next/server";
import { scrapeBlog } from "@/lib/scraper";
import { fakeSummarise } from "@/lib/summarise";
import { translateToUrdu } from "@/lib/translate";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // ✅ 1. Scrape, Summarise & Translate
    const fullText = await scrapeBlog(url);
    const summary = fakeSummarise(fullText);
    const urduSummary = translateToUrdu(summary);

    // ✅ 2. Save summary in Supabase
    const { error: supabaseError } = await supabase.from("summaries").insert([
      {
        url,
        summary,
        urduSummary,
      },
    ]);

    if (supabaseError) {
      console.error("Supabase Insert Error:", supabaseError.message);
    } else {
      console.log("✅ Supabase Insert Success");
    }

    // ✅ 3. Return Response
    return NextResponse.json({ summary, urduSummary });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
