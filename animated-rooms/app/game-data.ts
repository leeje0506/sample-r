export type Mission = {
  id: string;
  order: number;
  character: string;
  member: string;
  role: string;
  room: string;
  characterImage: string;
  color: string;
  intro: string;
  question: string;
  hint: string;
  kind: 'choice' | 'text';
  options?: string[];
  reward: string;
  reaction: string;
};

export const missions: Mission[] = [
  { id: 'singalong-song', order: 1, character: '리즈코', member: 'SHOTARO', role: '퍼포먼스 연습실', room: 'room-01-red-bear-empty.png', characterImage: 'posed-character-01-red-bear.png', color: '#f17882', intro: '공연장에서 모두의 목소리가 하나가 되면 정말 멋질 것 같아!', question: '리라즈와 가장 크게 부르고 싶은 노래는 어떤 곡이야?', hint: '실제 이벤트가 열리면 운영진이 후보곡을 바꿀 수 있어요.', kind: 'choice', options: ['Memories', 'Love 119', 'Boom Boom Bass', 'Get A Guitar'], reward: '멜로디 조각', reaction: '좋아! 이 노래라면 공연장이 하나가 될 것 같아!' },
  { id: 'event-style', order: 2, character: '송용돌이', member: 'EUNSEOK', role: '아이디어 관제실', room: 'room-02-gray-dreamer-empty.png', characterImage: 'posed-character-02-gray-dreamer.png', color: '#9aa2ac', intro: '작전은 많지만 한 번에 전부 할 수는 없지. 가장 기대되는 걸 골라봐.', question: '이번 공연에서 가장 기대되는 팬 이벤트는 뭐야?', hint: '가장 먼저 준비했으면 하는 이벤트를 선택해주세요.', kind: 'choice', options: ['다 함께 떼창', '슬로건 이벤트', '카드섹션', '응원봉 연출'], reward: '작전 승인 도장', reaction: '확인 완료. 꽤 좋은 작전인데?' },
  { id: 'slogan-line', order: 3, character: '우락밤', member: 'SUNGCHAN', role: '메시지 기록실', room: 'room-03-woodland-deer-empty.png', characterImage: 'posed-character-03-woodland-deer.png', color: '#b9895d', intro: '짧은 문장이어도 진심은 오래 남잖아. 우리 마음을 잘 담아보자.', question: '라이즈에게 가장 전하고 싶은 마음은 어떤 문장이야?', hint: '아래 문구는 시연용이며 실제 이벤트마다 교체됩니다.', kind: 'choice', options: ['우리의 모든 순간은 함께 빛나', '꿈이란 여정에 우린 함께', '언제나 너희의 편이야', '계속 같이 성장하자'], reward: '마음의 문장', reaction: '이 문장은 오래 기억하고 싶다. 잘 적어둘게!' },
  { id: 'card-section', order: 4, character: '토냥덕', member: 'WONBIN', role: '무대 디자인실', room: 'room-04-night-rabbit-empty.png', characterImage: 'posed-character-04-night-rabbit.png', color: '#68617d', intro: '객석 전체가 하나의 그림이 되려면 색과 타이밍이 중요해.', question: '카드섹션을 만든다면 어떤 분위기가 좋을까?', hint: '색상과 연출 방향을 함께 선택해주세요.', kind: 'choice', options: ['푸른 별빛', '주황빛 파도', '여섯 색 그라데이션', '문구가 나타나는 연출'], reward: '빛의 픽셀', reaction: '디테일까지 확인했어. 무대에서 정말 예쁠 것 같아.' },
  { id: 'singalong-part', order: 5, character: '똘병', member: 'SOHEE', role: '보컬 체크룸', room: 'room-05-royal-duck-empty.png', characterImage: 'posed-character-05-royal-duck.png', color: '#e2bd55', intro: '목소리가 잘 모이는 구간을 찾고 있어. 직접 부르기 편한 곳이 좋겠지?', question: '어떤 방식으로 함께 부르면 가장 좋을까?', hint: '선택된 곡에 맞춰 실제 가사 구간으로 변경할 수 있어요.', kind: 'choice', options: ['후렴 전체', '마지막 후렴', '브리지 한 소절', '곡 시작 전 선창'], reward: '목소리 파동', reaction: '좋아. 이 부분은 내가 먼저 제대로 연습해둘게!' },
  { id: 'open-idea', order: 6, character: '멍룡이', member: 'ANTON', role: '최종 설계실', room: 'room-06-cloud-puppy-empty.png', characterImage: 'posed-character-06-cloud-puppy.png', color: '#82b7cf', intro: '지금까지 모은 선택은 전부 정리했어. 마지막으로 빠진 생각이 있을까?', question: '공연을 더 특별하게 만들 아이디어가 있다면 들려줄래?', hint: '짧은 한 문장도 좋아요. 최대 300자까지 작성할 수 있어요.', kind: 'text', reward: '공연 설계도', reaction: '빠진 건 없는지 꼼꼼히 확인해서 계획에 넣어볼게.' },
];
