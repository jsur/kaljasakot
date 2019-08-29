import React, { ReactNode } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { APP_BACKGROUND } from '../common/colors'

const PageContainer = ({ children }: { children: ReactNode }) => {
    return (
        <View style={styles.container}>
          { children }
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: APP_BACKGROUND,
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    position: 'relative',
    zIndex: 1
  }
})

export default PageContainer