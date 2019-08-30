import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { FONT_REGULAR } from '../common/fonts'
import { ACTION_RED } from '../common/colors'

const ErrorText = ({ text }: { text: string }) => {
  if (!text) return null
  return <Text style={styles.errorText}>{text}</Text>
}

const styles = StyleSheet.create({
  errorText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    color: ACTION_RED,
    marginBottom: '2%'
  }
})

export default ErrorText