interface IMatches {
  id?: number,
  homeTeam: number,
  homeTeamGoals: number,
  awayTeam: number,
  awayTeamGoals: number,
  inProgress: boolean,
  teamHome?: {
    teamName: string,
  },
  teamAway?: {
    teamName: string,
  }
}

export interface IMatchesSnake {
  id?: number,
  home_team: number,
  home_team_goals: number,
  away_team: number,
  away_team_goals: number,
  in_progress: boolean,
}

export default IMatches;
