import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'

import PageContainer from './PageContainer'
import ChoiceButton from './ChoiceButton'

import { APP_BACKGROUND, BEER_YELLOW } from '../common/colors'

class CreateChoice extends React.Component {

  render () {
    return (
      <PageContainer backgroundColor={BEER_YELLOW}>
        <View style={styles.main}>
          <ChoiceButton />
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
    paddingTop: '10%'
  }
})

export default CreateChoice