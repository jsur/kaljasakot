export interface Team {
  id: string,
  admins: Array<string>,
  logo_url: string,
  name: string,
  penalties: {
    [uid: string]: number
  },
  players: Array<string>
}