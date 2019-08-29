import React from 'react'
import { StyleSheet, View } from 'react-native'

import PageContainer from './PageContainer'

class AddBeer extends React.Component {
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
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  }
})

export default AddBeer