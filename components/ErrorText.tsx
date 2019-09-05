import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { FONT_REGULAR } from '../common/fonts'
import { BLACK } from '../common/colors'

const ErrorText = ({ text, color = BLACK }: { text: string, color: string }) => {
  if (!text) return null
  return <Text style={[styles.errorText, { color }]}>{text}</Text>
}

const styles = StyleSheet.create({
  errorText: {
    fontFamily: FONT_REGULAR,
    fontSize: 12,
    marginBottom: '2%'
  }
})

export default ErrorText