import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true, // ✅ Bypass strict certs in Codespaces
});

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("blog_summariser");
  }
  return db;
}
