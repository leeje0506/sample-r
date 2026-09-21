'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Question = { id: string; speaker: string; line: string; hint: string; room: string; character: string; kind: 'choice' | 'text'; options?: string[] };

const questions: Question[] = [
  { id: 'music-mood', speaker: '딸기 소다 베어', line: '오늘은 어떤 기분의 노래가 듣고 싶어?', hint: '지금 마음에 가장 가까운 걸 골라줘.', room: 'room-01-red-bear-empty.png', character: 'posed-character-01-red-bear.png', kind: 'choice', options: ['몽글몽글한 노래', '신나게 뛰는 노래', '조용히 듣는 노래', '다 같이 부를 노래'] },
  { id: 'music-pick', speaker: '푸딩 드리머', line: '그럼 어떤 장르부터 찾아볼까?', hint: '취향을 알면 더 좋은 선곡을 준비할 수 있어.', room: 'room-02-gray-dreamer-empty.png', character: 'posed-character-02-gray-dreamer.png', kind: 'choice', options: ['인디 / 밴드', 'K-POP', 'R&B / Soul', '재즈 / 연주곡'] },
  { id: 'idea-kind', speaker: '우드랜드 디어', line: '우리에게 어떤 아이디어를 건네고 싶어?', hint: '아직 완벽하지 않아도 괜찮아.', room: 'room-03-woodland-deer-empty.png', character: 'posed-character-03-woodland-deer.png', kind: 'choice', options: ['해보고 싶은 콘텐츠', '함께 듣고 싶은 노래', '캐릭터에게 바라는 것', '그냥 떠오른 재미있는 것'] },
  { id: 'idea-detail', speaker: '미드나잇 래빗', line: '좋아! 떠오른 생각을 조금만 더 들려줄래?', hint: '짧은 한 문장도 아주 좋은 아이디어야.', room: 'room-04-night-rabbit-empty.png', character: 'posed-character-04-night-rabbit.png', kind: 'text' },
  { id: 'visit-again', speaker: '클라우드 퍼피', line: '마지막 질문! 다음에도 우리 방에 놀러 올 거지?', hint: '네 답은 친구들이 소중하게 보관할게.', room: 'room-06-cloud-puppy-empty.png', character: 'posed-character-06-cloud-puppy.png', kind: 'choice', options: ['당연하지!', '새로운 질문이 있다면', '노래 들으러 올게', '친구랑 같이 올게'] },
];

const VISITOR_KEY = 'pixel-room-visitor';

export default function Home() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const complete = step >= questions.length;
  const question = questions[Math.min(step, questions.length - 1)];
  const progress = complete ? 100 : Math.round((step / questions.length) * 100);

  useEffect(() => {
    let id = window.localStorage.getItem(VISITOR_KEY);
    if (!id) { id = crypto.randomUUID(); window.localStorage.setItem(VISITOR_KEY, id); }
    setVisitorId(id);
  }, []);

  const scene = useMemo(() => complete ? {
    speaker: '로열 덕', line: '모두 도착했어! 네 답변은 안전하게 보관했어.', hint: '다음 퀘스트에서 또 만나자.',
    room: 'room-05-royal-duck-empty.png', character: 'posed-character-05-royal-duck.png', id: 'complete',
  } : question, [complete, question]);

  async function save(answer: string) {
    if (!answer.trim() || saving || !visitorId) return;
    setSaving(true); setError('');
    try {
      const response = await fetch('/api/responses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId, questionId: question.id, answer: answer.trim() }) });
      if (!response.ok) throw new Error('save failed');
      setDraft(''); setStep((current) => current + 1);
    } catch { setError('잠시 저장하지 못했어. 한 번만 다시 눌러줄래?'); }
    finally { setSaving(false); }
  }

  function submitText(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void save(draft); }
  function restart() { setStep(0); setDraft(''); setError(''); }

  return (
    <main className="desktop-shell">
      <div className="desktop-decor" aria-hidden="true"><span>♫</span><span>✦</span><span>♡</span></div>
      <section className="game-window" aria-label="픽셀 룸 대화 퀘스트">
        <header className="window-bar">
          <div className="window-title"><i /> PIXEL ROOM QUEST</div>
          <div className="window-controls" aria-hidden="true"><span>−</span><span>□</span><span>×</span></div>
        </header>
        <div className="quest-status">
          <span>{complete ? 'QUEST CLEAR!' : `QUEST ${String(step + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`}</span>
          <div className="progress-track"><i style={{ width: `${progress}%` }} /></div><b>{progress}%</b>
        </div>
        <div className={`scene scene-${scene.id}`}>
          <img className="room-background" src={`/assets/backgrounds/${scene.room}`} alt="" />
          <div className="character-wrap"><img src={`/assets/characters/posed/${scene.character}`} alt={`${scene.speaker} 캐릭터`} /></div>
          {complete && <div className="confetti" aria-hidden="true"><i /><i /><i /><i /><i /></div>}
        </div>
        <section className="dialog-area" aria-live="polite">
          <div className="speaker-tab"><span>♥</span>{scene.speaker}</div>
          <div className="speech-box"><p>{scene.line}</p><small>{scene.hint}</small></div>
          {!complete && question.kind === 'choice' && <div className="answer-grid">{question.options?.map((option, index) => <button key={option} type="button" onClick={() => void save(option)} disabled={saving || !visitorId}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>}
          {!complete && question.kind === 'text' && <form className="idea-form" onSubmit={submitText}>
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={300} placeholder="예: 비 오는 날 같이 듣는 플레이리스트를 만들어줘!" aria-label="아이디어 입력" />
            <div><span>{draft.length} / 300</span><button type="submit" disabled={!draft.trim() || saving || !visitorId}>{saving ? '저장 중...' : '아이디어 전하기 →'}</button></div>
          </form>}
          {error && <p className="error-message">{error}</p>}
          {complete && <button className="restart-button" type="button" onClick={restart}>처음부터 다시 만나기 ↻</button>}
        </section>
      </section>
      <p className="desktop-note">캐릭터의 질문에 답하고, 작은 취향을 남겨주세요.</p>
    </main>
  );
}
