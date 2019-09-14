import { AppStateType } from '../AppState'

export const playerIsAdmin = (appState: AppStateType) => {
  const { currentPlayer, currentTeam } = appState
  return currentTeam && currentTeam.admins.includes(currentPlayer.id)
}

export const usernameIsValid = (username: string) => username && username.length >= 3 && username.length < 15