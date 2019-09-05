import React from 'react'
import { StyleSheet, View, Keyboard, Text } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import * as DocumentPicker from 'expo-document-picker'

import PageContainer from './PageContainer'
import Button from './Button'
import InputField from './InputField'
import ErrorText from './ErrorText'

import { LOGGEDIN_BACKGROUND, WHITE, BEER_YELLOW } from '../common/colors'
import { auth, db, storage } from '../config/firebase'
import { getPlayer } from '../common/firebase-helpers'
import { FONT_REGULAR } from '../common/fonts'

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
      this.setState({ loading: true })
      const { logoUri, logoName } = this.state
      const contentType = `image/${logoUri.slice(logoUri.lastIndexOf('.') + 1)}`
      const res = await fetch(logoUri)
      const blob = await res.blob()
      storage.ref().child(logoName).put(blob, { contentType })
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
            .then(url => this.createTeam(url))
            .catch(error => this.showError('Virhe tallennettaessa kuvaa'))
        })
        .catch(error => this.showError('Virhe tallennettaessa kuvaa'))
    } catch (error) {
      console.log(error)
      this.showError('Virhe tallennettaessa kuvaa')
    }
  }

  createTeam = async (url: string) => {
    try {
      const { teamName } = this.state
      const playerId = await getPlayer()
      await db.collection('team').add({
        logo_url: url,
        name: teamName,
        admins: [ playerId ],
        players: [ playerId ]
      })
      this.setState({ loading: false })
      this.props.navigation.navigate('AddBeer')
    } catch (error) {
      console.log(error)
      this.showError('Virhe luodessa joukkuetta')
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
                onPress={this.createTeam}
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
    color: BEER_YELLOW
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%'
  }
})

export default NewTeam