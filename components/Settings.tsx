import React from 'react'
import { StyleSheet, View } from 'react-native'

import PageContainer from './PageContainer'

class Settings extends React.Component {
  render() {
    return (
      <PageContainer>
        <View style={styles.container}></View>
      </PageContainer>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default Settings