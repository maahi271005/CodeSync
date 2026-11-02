import dotenv from 'dotenv';

dotenv.config({quiet: true});

export const ENV = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    // comma-separated emails that are auto-promoted to admin
    ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
    // code execution: Piston if PISTON_API is set, otherwise Judge0
    PISTON_API: process.env.PISTON_API,
    JUDGE0_API_KEY: process.env.JUDGE0_API_KEY,
    JUDGE0_URL: process.env.JUDGE0_URL,
}