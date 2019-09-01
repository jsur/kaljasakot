import React, { ReactNode } from 'react'
import { StyleSheet, KeyboardAvoidingView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import { APP_BACKGROUND } from '../common/colors'

interface PageContainerProps {
  children: ReactNode,
  backgroundColor: string,
  gradientColors?: Array<string>
}

const PageContainer = ({ children, backgroundColor, gradientColors }: PageContainerProps) => {
    return (
        <KeyboardAvoidingView
          style={[
            styles.container,
            { backgroundColor: backgroundColor || APP_BACKGROUND }
          ]}
          behavior='padding'
        >
          {
            gradientColors
              ? <LinearGradient style={styles.gradient} colors={gradientColors}>{ children }</LinearGradient>
              : children
          }
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
  },
  gradient: {
    flex: 1,
    width: '100%',
    position: 'relative',
    zIndex: 2
  }
})

export default PageContainer