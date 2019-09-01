import React from 'react'
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

import { FONT_REGULAR } from '../common/fonts'
import { DISABLED_GRAY, WHITE } from '../common/colors'

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
        {
          backgroundColor: disabled ? DISABLED_GRAY : 'transparent'
        }
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      {
        loading
          ? <ActivityIndicator size='small' color={WHITE} />
          : <Text style={styles.text}>{text}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  touchable: {
    minWidth: 130,
    paddingLeft: 10,
    paddingRight: 10,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: WHITE,
    borderWidth: 2
  },
  text: {
    fontFamily: FONT_REGULAR,
    fontSize: 16,
    color: WHITE
  }
})

export default Button