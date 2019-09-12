import React from 'react'
import { StyleSheet, View, Keyboard, Text } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import * as DocumentPicker from 'expo-document-picker'

import PageContainer from './PageContainer'
import Button from './Button'
import InputField from './InputField'
import ErrorText from './ErrorText'

import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { db, storage } from '../config/firebase'
import { getLoggedInPlayer } from '../common/firebase-helpers'
import { FONT_REGULAR } from '../common/fonts'

const ERROR_PHOTO = 'Virhe tallennettaessa kuvaa'

interface State {
  loading: boolean,
  teamName: string,
  errorMsg: string,
  logoUri: string,
  logoName: string
}

class NewTeam extends React.Component<NavigationInjectedProps, State> {
  static navigationOptions = {
    title: 'Uusi joukkue'
  }

  state = {
    loading: false,
    teamName: '',
    errorMsg: '',
    logoUri: '',
    logoName: ''
  }

  showError = (errorMsg: string) => this.setState({ errorMsg, loading: false })

  uploadPhoto = async () => {
    try {
      const { logoUri, logoName } = this.state
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

  createTeam = async (logoUrl: string | undefined) => {
    try {
      const { teamName } = this.state
      const playerId = await getLoggedInPlayer()
      await db.collection('team').add({
        logo_url: logoUrl || 'https://firebasestorage.googleapis.com/v0/b/kaljasakot.appspot.com/o/questions-circular-button.png?alt=media&token=0fcb0852-cc21-4e82-bc0c-af6969e3f5df',
        name: teamName,
        admins: [ playerId ],
        players: [ playerId ]
      })
    } catch (error) {
      console.log(error)
      throw new Error('Virhe luodessa joukkuetta')
    }
  }

  onSubmit = async () => {
    try {
      this.setState({ loading: true })
      const url = await this.uploadPhoto()
      await this.createTeam(url)
      this.setState({ loading: false }, () => {
        this.props.navigation.navigate('Landing')
      })
    } catch (error) {
      this.setState({ errorMsg: error.message, loading: false })
    }
  }

  addLogo = async () => {
    try {
      this.setState({ errorMsg: '', logoName: '', logoUri: '' })
      const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' })
      if (result.type === 'success') {
        this.setState({ logoUri: result.uri, logoName: result.name })
      }
    } catch (error) {
      this.setState({ errorMsg: 'Virhe kuvan valinnassa! Voit luoda joukkueen myös ilman kuvaa.' })
    }
  }

  render() {
    const { loading, teamName, errorMsg, logoName } = this.state
    return (
      <PageContainer>
        <View style={styles.main}>
          <View style={styles.form}>
            <ErrorText color={WHITE} text={errorMsg} />
            <InputField
              placeholder='Joukkueen nimi'
              returnKeyType='next'
              value={teamName}
              autoFocus
              autoCapitalize='none'
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={text => this.setState({ errorMsg: '', teamName: text })}
            />
            <View style={styles.logoUploadWrapper}>
              <Button
                text='Valitse joukkueen logo'
                disabled={false}
                onPress={this.addLogo}
              />
              { logoName !== '' && <Text style={styles.logoNameText}>{`Valittu tiedosto: ${logoName}`}</Text> }
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                disabled={!teamName}
                text='Perusta joukkue'
                loading={loading}
                onPress={this.onSubmit}
              />
            </View>
          </View>
        </View>
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LOGGEDIN_BACKGROUND,
    paddingTop: '10%'
  },
  form: {
    width: '80%',
    flex: 1,
  },
  logoUploadWrapper: {
    width: '100%',
    marginTop: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoNameText: {
    marginTop: '5%',
    fontFamily: FONT_REGULAR,
    fontSize: 16,
    color: BEER_YELLOW,
    textAlign: 'center'
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%'
  }
})

export default NewTeam