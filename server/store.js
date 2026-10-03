import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

const SEED_JOBS = [
  { id: 'j1', title: 'Senior Software Engineer', company: 'Google', location: 'Remote', type: 'Full-time', remote: true, salary: '$180k–$240k', tags: ['react', 'python', 'cloud'], source: 'Google Jobs', description: 'Build player-facing tools used by millions of gamers. You will own features end to end across our gaming platform.' },
  { id: 'j2', title: 'Cybersecurity Analyst', company: 'DefenseTech', location: 'Washington D.C.', type: 'Full-time', remote: false, salary: '$120k–$160k', tags: ['security', 'soc', 'clearance'], source: 'USAJobs', description: 'Monitor and respond to threats in mission-critical systems. Active clearance required; gaming-adjacent infra experience a plus.' },
  { id: 'j3', title: 'Full Stack Developer', company: 'Twitch', location: 'San Francisco, CA', type: 'Full-time', remote: true, salary: '$150k–$210k', tags: ['typescript', 'node', 'streaming'], source: 'LinkedIn', description: 'Ship features for live streaming experiences. Strong TypeScript and real-time systems background preferred.' },
  { id: 'j4', title: 'Backend Engineer', company: 'Epic Games', location: 'Cary, NC', type: 'Full-time', remote: true, salary: '$140k–$200k', tags: ['c++', 'golang', 'unreal'], source: 'Arbeitnow', description: 'Scale online services behind Fortnite and Unreal Engine. Experience with high-throughput matchmaking a plus.' },
  { id: 'j5', title: 'Community Manager', company: 'Riot Games', location: 'Los Angeles, CA', type: 'Full-time', remote: false, salary: '$85k–$110k', tags: ['community', 'social', 'esports'], source: 'LinkedIn', description: 'Own the voice of our player communities across Discord, X, and Reddit. Deep gaming culture fluency required.' },
  { id: 'j6', title: 'Game Producer Intern', company: 'Xbox Game Studios', location: 'Redmond, WA', type: 'Internship', remote: false, salary: '$40/hr', tags: ['production', 'internship'], source: 'USAJobs', description: 'Support production of an unannounced title. Great entry point for gamers who want to break into the industry.' },
  { id: 'j7', title: 'DevOps Engineer', company: 'Discord', location: 'Remote', type: 'Full-time', remote: true, salary: '$160k–$220k', tags: ['kubernetes', 'rust', 'sre'], source: 'Google Jobs', description: 'Keep the infrastructure behind 200M+ users online. On-call rotation with a strong blameless culture.' },
  { id: 'j8', title: 'QA Tester (Contract)', company: 'Activision', location: 'Remote', type: 'Contract', remote: true, salary: '$25–$35/hr', tags: ['qa', 'testing', 'contract'], source: 'Arbeitnow', description: 'Playtest builds and file detailed bug reports across consoles and PC. Flexible hours, 6-month contract.' },
];

const SEED_USERS = [
  { gamertag: 'PixelWarden', accent: '#5865f2', bio: 'Recruiter hunting for game devs. DM me your portfolio!', status: 'online', xp: 420, joinedAt: '2025-11-02' },
  { gamertag: 'NovaQueen', accent: '#eb459e', bio: 'Full-stack dev by day, speedrunner by night.', status: 'idle', xp: 260, joinedAt: '2025-12-14' },
  { gamertag: 'ByteRanger', accent: '#3ba55d', bio: 'QA lead. I break things so you do not have to.', status: 'online', xp: 180, joinedAt: '2026-01-20' },
];

let db = null;

export function init() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_PATH)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      return;
    } catch {
      // corrupted file: reseed
    }
  }
  db = { users: SEED_USERS, messages: [], jobs: SEED_JOBS, applications: [] };
  save();
}

export function get() {
  return db;
}

export function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export default { init, get, save };
