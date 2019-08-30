import React, { ReactNode } from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'

import { APP_BACKGROUND } from '../common/colors'

const PageContainer = ({ children }: { children: ReactNode }) => {
    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
          { children }
        </KeyboardAvoidingView>
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