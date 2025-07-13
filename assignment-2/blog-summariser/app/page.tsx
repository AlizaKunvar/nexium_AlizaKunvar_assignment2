'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [urdu, setUrdu] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({ url }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    setSummary(data.summary);
    setUrdu(data.urduSummary);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-indigo-100 via-white to-pink-100">
      <Card className="w-full max-w-xl shadow-2xl border border-gray-300 rounded-2xl bg-white/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">📝 Blog Summariser</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Input
            placeholder="Paste blog URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border-gray-300 focus:ring-2 focus:ring-indigo-400"
          />
          <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white" onClick={handleSubmit}>
            🔍 Summarise Blog
          </Button>

          {summary && (
            <div className="mt-6 space-y-4">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">📘 Summary (English):</h2>
                <p className="text-gray-700">{summary}</p>
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 text-lg mt-4">📙 Summary (Urdu):</h2>
                <p className="text-right text-gray-800 font-urdu">{urdu}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
