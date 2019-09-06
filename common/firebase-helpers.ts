import { db, auth } from '../config/firebase'

export const getPlayer = async (): string | undefined => {
  try {
    const snapshot = await db.collection('player').where('auth_id', '==', auth.currentUser.uid).get()
    return snapshot.docs.length > 0 && snapshot.docs[0].id
  } catch (error) {
    console.log(error)
  }
}

export const getOwnTeam = async () => {
  const playerId = await getPlayer()
  const snapshot = await db.collection('team').where('players', 'array-contains', playerId).get()
  // multiple teams later?
  const teams = []
  snapshot.forEach(doc => teams.push({ ...doc.data(), id: doc.id }))
  return teams[0]
}