import React, { ReactNode } from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'

import { APP_BACKGROUND } from '../common/colors'

const PageContainer = ({ children, backgroundColor }: { children: ReactNode, backgroundColor: string }) => {
    return (
        <KeyboardAvoidingView
          style={[
            styles.container,
            { backgroundColor: backgroundColor || APP_BACKGROUND }
          ]}
          behavior='padding'
        >
          { children }
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1
  }
})

export default PageContainer