export const TEXT_CHANNELS = ['general', 'introductions', 'job-leads', 'off-topic'];
export const VOICE_CHANNELS = ['Lounge', 'Interview Prep', 'Game Night'];

export const LEVELS_PER_BADGE = [
  { xp: 0, badge: 'Recruit' },
  { xp: 50, badge: 'Squad Member' },
  { xp: 150, badge: 'Guild Veteran' },
  { xp: 300, badge: 'Server Legend' },
  { xp: 500, badge: 'Mythic' },
];

export function levelFor(xp) {
  return Math.floor(xp / 100) + 1;
}

export function levelProgress(xp) {
  return xp % 100;
}

export function badgesFor(xp) {
  return LEVELS_PER_BADGE.filter((b) => xp >= b.xp).map((b) => b.badge);
}

export const QUICK_REACTIONS = ['👍', '🔥', '😂', '❤️', '🎯', '🎮'];
