import { storage } from '../config/firebase'

const ERROR_PHOTO = 'Virhe tallennettaessa kuvaa'

export const uploadPhoto = async ({ logoUri, logoName }: { logoUri: string, logoName: string }) => {
  try {
    if (!logoUri) return
    const contentType = `image/${logoUri.slice(logoUri.lastIndexOf('.') + 1)}`
    const res = await fetch(logoUri)
    const blob = await res.blob()
    const snapshot = await storage.ref().child(logoName).put(blob, { contentType })
    const url: string = await snapshot.ref.getDownloadURL()
    return url
  } catch (error) {
    console.log(error)
    throw new Error(ERROR_PHOTO)
  }
}