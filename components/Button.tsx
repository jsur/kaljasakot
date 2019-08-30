import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

import { FONT_REGULAR } from '../common/fonts'
import { ACTION_RED, BLACK, DISABLED_GRAY, WHITE } from '../common/colors'

interface ButtonProps {
  text: string,
  loading: boolean,
  disabled: boolean,
  onPress: () => any
}

const Button = ({ text, loading, disabled, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.touchable,
        { backgroundColor: disabled ? DISABLED_GRAY : ACTION_RED }
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={[
        styles.text,
        { color: disabled ? WHITE : BLACK }
      ]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    minWidth: 130,
    height: 50,
    borderRadius: 30,
    backgroundColor: ACTION_RED,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: FONT_REGULAR,
    fontSize: 16
  }
})

export default Button