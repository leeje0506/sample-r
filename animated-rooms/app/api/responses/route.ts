import { env } from 'cloudflare:workers';
import type { D1Database } from '@cloudflare/workers-types';
import { createResponsesTable, createVisitorIndex } from '../../../db/schema';

type Bindings = { DB: D1Database };

export async function POST(request: Request) {
  try {
    const body = await request.json() as { visitorId?: string; questionId?: string; answer?: string };
    const visitorId = body.visitorId?.trim();
    const questionId = body.questionId?.trim();
    const answer = body.answer?.trim();
    if (!visitorId || !questionId || !answer || answer.length > 300) {
      return Response.json({ error: 'Invalid response' }, { status: 400 });
    }

    const db = (env as unknown as Bindings).DB;
    await db.batch([db.prepare(createResponsesTable), db.prepare(createVisitorIndex)]);
    await db.prepare('INSERT INTO responses (id, visitor_id, question_id, answer) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), visitorId, questionId, answer).run();
    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to save response', error);
    return Response.json({ error: 'Failed to save response' }, { status: 500 });
  }
}
