export interface Team {
  id: string,
  admins: Array<string>,
  logo_url: string,
  name: string,
  players: Array<string>,
  applicants: Array<string>
}

export interface Player {
  id: string,
  auth_id: string,
  team_penalties: {
    [teamId: string]: number
  },
  username: string,
  isApplicant: boolean,
  appliedTo: string
}

export interface TeamApplicant {
  playerId: string,
  playerName: string,
  teamId: string,
  teamName: string,
  docId: string
}