import { AsyncStorage } from 'react-native'

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (error) {
    console.log('AsyncStorage.setItem error', error)
  }
}

export const retrieveData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value
  } catch (error) {
    console.log('AsyncStorage.getItem error', error)
  }
};