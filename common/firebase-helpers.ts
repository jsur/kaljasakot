import { db, auth } from '../config/firebase'
import { Team, Player } from './types'

export const getLoggedInPlayer = async (): Player | undefined => {
  try {
    const snapshot = await db.collection('player').where('auth_id', '==', auth.currentUser.uid).get()
    return snapshot.docs.length > 0 && { ...snapshot.docs[0].data(), id: snapshot.docs[0].id }
  } catch (error) {
    console.log(error)
  }
}

export const getOwnTeam = async (): Team => {
  const player = await getLoggedInPlayer()
  const snapshot = await db.collection('team').where('players', 'array-contains', player.id).get()
  // multiple teams later?
  const teams = []
  snapshot.forEach(doc => teams.push({ ...doc.data(), id: doc.id }))
  return teams[0]
}

export const getPlayerById = async (playerId: string): Player => {
  const snapshot = await db.collection('player').doc(playerId).get()

  return { ...snapshot.data(), id: snapshot.id }
}

export const getPlayers = async (playerIds: Array<string>): Array<Player> => {
  const promises = playerIds.map(id => getPlayerById(id))
  const players = await Promise.all(promises)
  return players
}

export const savePenalty = (penaltyAmount: number, teamId: string, player: Player) => {
  const newPlayer = {
    ...player,
    team_penalties: {
      ...player.team_penalties,
      [teamId]: penaltyAmount
    }
  }
  return db.collection('player').doc(player.id).set(newPlayer)
}