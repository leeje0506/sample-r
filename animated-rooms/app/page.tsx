'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Mission, missions } from './game-data';

type Screen = 'invite' | 'briefing' | 'boot' | 'home' | 'room' | 'reward' | 'finale' | 'ticket';
type Progress = { completed: string[]; answers: Record<string, string> };
const VISITOR_KEY = 'little-riize-visitor';
const PROGRESS_KEY = 'little-riize-progress-v1';
const emptyProgress: Progress = { completed: [], answers: {} };

export default function Home() {
  const [screen, setScreen] = useState<Screen>('invite');
  const [selectedId, setSelectedId] = useState(missions[0].id);
  const [dialogStep, setDialogStep] = useState(0);
  const [draft, setDraft] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const mission = useMemo(() => missions.find((item) => item.id === selectedId) ?? missions[0], [selectedId]);
  const completedCount = progress.completed.length;
  const allComplete = completedCount === missions.length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      let id = localStorage.getItem(VISITOR_KEY);
      if (!id) { id = crypto.randomUUID(); localStorage.setItem(VISITOR_KEY, id); }
      setVisitorId(id);
      try { const saved = localStorage.getItem(PROGRESS_KEY); if (saved) setProgress(JSON.parse(saved) as Progress); }
      catch { localStorage.removeItem(PROGRESS_KEY); }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }, [hydrated, progress]);

  function openMission(item: Mission) {
    if (item.order > completedCount + 1 && !progress.completed.includes(item.id)) return;
    setSelectedId(item.id); setDialogStep(0); setDraft(progress.answers[item.id] ?? ''); setError(''); setScreen('room');
  }
  async function saveAnswer(answer: string) {
    if (!answer.trim() || saving || !visitorId) return;
    setSaving(true); setError('');
    try {
      const response = await fetch('/api/responses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId, questionId: mission.id, answer: answer.trim() }) });
      if (!response.ok) throw new Error('save failed');
      setProgress((current) => ({ completed: current.completed.includes(mission.id) ? current.completed : [...current.completed, mission.id], answers: { ...current.answers, [mission.id]: answer.trim() } }));
      setScreen('reward');
    } catch { setError('잠시 저장하지 못했어. 한 번만 다시 눌러줄래?'); }
    finally { setSaving(false); }
  }
  function submitText(event: FormEvent<HTMLFormElement>) { event.preventDefault(); void saveAnswer(draft); }
  function beginBoot() { setScreen('boot'); window.setTimeout(() => setScreen('home'), 900); }
  function continueAfterReward() { setScreen(completedCount >= missions.length ? 'finale' : 'home'); }
  function resetDemo() { setProgress(emptyProgress); setSelectedId(missions[0].id); setDraft(''); setScreen('invite'); localStorage.removeItem(PROGRESS_KEY); }

  return <main className="app-shell">
    <div className="sky-decor" aria-hidden="true"><i>✦</i><i>♫</i><i>♡</i><i>✧</i></div>
    <section className="device" aria-label="리라즈 공연 준비 대작전">
      <header className="status-bar"><span>▮▮▮</span><strong>RIIZE</strong><span>♫</span><div className="mini-battery"><i style={{ width: `${completedCount / 6 * 100}%` }} /></div></header>
      {screen === 'invite' && <Invite onOpen={() => setScreen('briefing')} />}
      {screen === 'briefing' && <Briefing onAccept={beginBoot} />}
      {screen === 'boot' && <BootScreen />}
      {screen === 'home' && <HomeScreen completed={progress.completed} onOpen={openMission} onFinale={() => setScreen('finale')} />}
      {screen === 'room' && <RoomScreen mission={mission} dialogStep={dialogStep} setDialogStep={setDialogStep} draft={draft} setDraft={setDraft} saving={saving} error={error} onSave={saveAnswer} onSubmit={submitText} onBack={() => setScreen('home')} />}
      {screen === 'reward' && <RewardScreen mission={mission} completedCount={completedCount} onContinue={continueAfterReward} />}
      {screen === 'finale' && <Finale onTicket={() => setScreen('ticket')} />}
      {screen === 'ticket' && <Ticket progress={progress} onReset={resetDemo} />}
      {!['invite', 'briefing', 'boot'].includes(screen) && <nav className="dock"><button type="button" onClick={() => setScreen('home')}>⌂</button><span>{completedCount}/6 LIGHTS</span><button type="button" onClick={() => allComplete && setScreen('ticket')} disabled={!allComplete}>▱</button></nav>}
    </section>
    <p className="prototype-note">FAN EVENT QUEST · WIREFRAME 01</p>
  </main>;
}

function Invite({ onOpen }: { onOpen: () => void }) {
  return <section className="panel invite-panel"><div className="pixel-sprinkles" aria-hidden="true"><i>♫</i><i>✦</i><i>♥</i><i>★</i><i>♪</i></div><p className="eyebrow">NEW MESSAGE · 01</p><div className="envelope-visual"><img src="/assets/invitation-envelope.png" alt="하트 봉인이 붙은 닫힌 픽셀 초대장" /></div><h1>BRIIZE에게<br />새로운 메시지가 도착했어요.</h1><p>발신자 · LITTLE RIIZE</p><div className="invite-cta"><button className="primary-button" type="button" onClick={onOpen}>초대장 열기</button><span aria-hidden="true">CLICK!</span></div></section>;
}
function Briefing({ onAccept }: { onAccept: () => void }) {
  return <section className="panel briefing-panel"><div className="open-envelope" aria-hidden="true"><i /><i /></div><div className="letter-friends" aria-hidden="true">{missions.map((item, index) => <img key={item.id} className={`letter-friend friend-${index + 1}`} src={`/assets/characters/${item.characterImage.replace('posed-', '')}`} alt="" />)}<span className="sticker sticker-note">♫</span><span className="sticker sticker-star">★</span><span className="sticker sticker-light">LIGHT<br />UP!</span><span className="sticker sticker-heart">♥</span></div><div className="letter-card"><p className="eyebrow">FROM. LIZCO</p><div className="letter-stamp">L</div><div className="letter-title-icons"><span>✦</span><span>♫</span><span>♥</span></div><h1>공연 준비를<br />도와줄래?</h1><p>공연까지 시간이 얼마 남지 않았어! 친구들의 방을 찾아가 브리즈의 마음을 들려줘.</p><div className="mission-doodles" aria-hidden="true"><span>MIC</span><span>SONG</span><span>LIGHT</span><span>LETTER</span></div><ul><li>예상 시간 약 3분</li><li>총 6개의 준비 미션</li><li>선택은 이벤트 준비에 활용돼요</li></ul><button className="primary-button" type="button" onClick={onAccept}>초대 수락! 아지트로 →</button></div></section>;
}
function BootScreen() {
  return <section className="panel boot-panel"><div className="travel-stars" aria-hidden="true"><i>✦</i><i>·</i><i>★</i><i>·</i><i>✧</i><i>·</i></div><div className="paper-plane" aria-hidden="true"><span>♥</span></div><div className="travel-path" aria-hidden="true" /><div className="boot-lineup">{missions.map((item) => <img key={item.id} src={`/assets/characters/${item.characterImage.replace('posed-', '')}`} alt="" />)}</div><h1>아지트로<br />이동 중...</h1><div className="loading-track"><i /></div><p>초대장의 안내를 따라가고 있어요</p></section>;
}
function HomeScreen({ completed, onOpen, onFinale }: { completed: string[]; onOpen: (mission: Mission) => void; onFinale: () => void }) {
  return <section className="panel home-panel"><div className="screen-heading"><div><p className="eyebrow">SECRET HEADQUARTERS</p><h1>리라즈 아지트</h1></div><div className="fanlight"><i style={{ height: `${Math.max(8, completed.length / 6 * 100)}%` }} /></div></div><p className="home-copy">빛나는 길을 따라 다음 방으로 이동해 주세요.</p><div className="map-legend"><span><i className="legend-ready" />입장 가능</span><span><i className="legend-clear" />완료</span><span><i className="legend-lock" />미공개</span></div><div className="mission-grid">{missions.map((item) => { const done = completed.includes(item.id); const locked = item.order > completed.length + 1 && !done; return <button key={item.id} type="button" aria-label={locked ? `잠긴 미션 ${String(item.order).padStart(2, '0')}` : `${item.character} ${item.role}`} className={`mission-card ${done ? 'done' : ''} ${locked ? 'locked' : ''}`} onClick={() => onOpen(item)} disabled={locked}>{locked ? <><span className="portrait mystery-portrait"><b className="pixel-lock"><i /></b><em>?</em></span><strong>???</strong><small>NEXT AREA UNKNOWN</small><i>{String(item.order).padStart(2, '0')}</i></> : <><span className="portrait" style={{ background: item.color }}><img src={`/assets/characters/${item.characterImage.replace('posed-', '')}`} alt="" /></span><strong>{item.character}</strong><small>{done ? 'MISSION CLEAR' : item.role}</small><i>{done ? '✓' : String(item.order).padStart(2, '0')}</i></>}</button>; })}</div>{completed.length === 6 && <button className="primary-button finale-link" type="button" onClick={onFinale}>완성된 공연장으로 →</button>}</section>;
}
function RoomScreen({ mission, dialogStep, setDialogStep, draft, setDraft, saving, error, onSave, onSubmit, onBack }: { mission: Mission; dialogStep: number; setDialogStep: (value: number) => void; draft: string; setDraft: (value: string) => void; saving: boolean; error: string; onSave: (answer: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onBack: () => void }) {
  return <section className="panel room-panel"><div className="room-top"><button type="button" onClick={onBack}>← 아지트</button><span>MISSION {String(mission.order).padStart(2, '0')}</span></div><div className={`room-scene room-${mission.order}`}><img className="room-bg" src={`/assets/backgrounds/${mission.room}`} alt="" /><img className="room-character" src={`/assets/characters/posed/${mission.characterImage}`} alt={`${mission.character} 캐릭터`} /><span className="room-label">{mission.role}</span></div><div className="dialog-card"><div className="nameplate" style={{ background: mission.color }}><strong>{mission.character}</strong><span>{mission.member}</span></div>{dialogStep === 0 ? <><p className="dialog-line">{mission.intro}</p><button className="next-dialog" type="button" onClick={() => setDialogStep(1)}>다음 ▸</button></> : <><p className="dialog-line question-line">{mission.question}</p><small className="hint">{mission.hint}</small>{mission.kind === 'choice' ? <div className="choices">{mission.options?.map((option, index) => <button type="button" key={option} disabled={saving} onClick={() => void onSave(option)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div> : <form className="idea-form" onSubmit={onSubmit}><textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={300} placeholder="브리즈의 아이디어를 적어주세요." /><div><span>{draft.length}/300</span><button type="submit" disabled={!draft.trim() || saving}>{saving ? '전송 중...' : '아이디어 전하기'}</button></div></form>}{error && <p className="error">{error}</p>}</>}</div></section>;
}
function RewardScreen({ mission, completedCount, onContinue }: { mission: Mission; completedCount: number; onContinue: () => void }) {
  return <section className="panel reward-panel"><p className="eyebrow">MISSION CLEAR!</p><div className="reward-orb"><span>✦</span></div><h1>{mission.reward}을<br />획득했어요!</h1><blockquote>“{mission.reaction}”<cite>— {mission.character}</cite></blockquote><div className="charge"><span>FANLIGHT CHARGE</span><div>{Array.from({ length: 6 }).map((_, index) => <i className={index < completedCount ? 'filled' : ''} key={index} />)}</div></div><button className="primary-button" type="button" onClick={onContinue}>{completedCount === 6 ? '공연장 열기 →' : '다음 방으로 →'}</button></section>;
}
function Finale({ onTicket }: { onTicket: () => void }) {
  return <section className="panel finale-panel"><div className="stage"><div className="stage-lights"><i /><i /><i /></div><div className="final-characters">{missions.map((item) => <img key={item.id} src={`/assets/characters/${item.characterImage.replace('posed-', '')}`} alt="" />)}</div><div className="audience">{Array.from({ length: 30 }).map((_, index) => <i key={index} />)}</div></div><div className="final-copy"><p className="eyebrow">ALL MISSIONS COMPLETE</p><h1>여섯 개의 마음이<br />모두 모였어!</h1><p>브리즈의 선택으로 공연 준비가 완성됐어요.</p><button className="primary-button" type="button" onClick={onTicket}>완료 티켓 확인하기</button></div></section>;
}
function Ticket({ progress, onReset }: { progress: Progress; onReset: () => void }) {
  const date = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date());
  return <section className="panel ticket-panel"><p className="eyebrow">QUEST REWARD</p><div className="ticket-card"><div className="ticket-top"><span>RIIZE</span><strong>BRIIZE PASS</strong><span>06/06</span></div><div className="ticket-art"><div className="ticket-lineup">{missions.map((item) => <img key={item.id} src={`/assets/characters/${item.characterImage.replace('posed-', '')}`} alt="" />)}</div><span className="clear-stamp">CLEAR!</span></div><div className="ticket-info"><div><small>MISSION</small><strong>공연 준비 대작전</strong></div><div><small>DATE</small><strong>{date}</strong></div><div><small>LIGHTS</small><strong>{progress.completed.length} / 6</strong></div></div><div className="answer-record"><div className="answer-title"><span>MY QUEST LOG</span><small>내가 남긴 마음</small></div>{missions.map((item) => <div className={`answer-row ${item.kind === 'text' ? 'answer-row-text' : ''}`} key={item.id}><span className="answer-number">{String(item.order).padStart(2, '0')}</span><div><small>{item.character} · {item.role}</small><strong>{progress.answers[item.id] || '기록 없음'}</strong></div></div>)}</div><div className="barcode">▮▯▮▮▯▮▯▯▮▮▮▯▮▯▮▮</div></div><p>이 티켓 한 장에 브리즈가 남긴 선택과 아이디어를 모두 담았어요.</p><button className="secondary-button" type="button" onClick={onReset}>처음부터 다시 보기 ↻</button></section>;
}
