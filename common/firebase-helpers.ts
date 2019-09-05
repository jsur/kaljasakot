import { db, auth } from '../config/firebase'

export const getPlayer = async (): string | undefined => {
  try {
    const snapshot = await db.collection('player').where('auth_id', '==', auth.currentUser.uid).get()
    return snapshot.docs.length > 0 && snapshot.docs[0].id
  } catch (error) {
    console.log(error)
  }
}