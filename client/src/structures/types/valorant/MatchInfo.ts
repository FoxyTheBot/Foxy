interface MatchMap {
  id: string;
  name: string;
}

interface MatchSeason {
  id: string;
  short: string;
}

interface MatchMeta {
  id: string;
  map: MatchMap;
  version: string;
  mode: string;
  started_at: string;
  season: MatchSeason;
  region: string;
  cluster: string;
}

interface MatchCharacter {
  id: string;
  name: string;
}

interface MatchStats {
  puuid: string;
  team: string;
  level: number;
  character: MatchCharacter;
  tier: number;
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  shots: {
      head: number;
      body: number;
      leg: number;
  };
  damage: {
      dealt: number;
      received: number;
  };
  teams: {
    red: number,
    blue: number
  }
}

interface MatchTeams {
  red: number;
  blue: number;
}

export interface MatchData {
  meta: MatchMeta;
  stats: MatchStats;
  teams: MatchTeams;
}

interface MatchResults {
  total: number;
  returned: number;
  before: number;
  after: number;
}

export interface MatchesResponse {
  status: number;
  name: string;
  tag: string;
  results: MatchResults;
  data: MatchData[];
}
