
import React from 'react'
import { TextInput,
  StyleSheet } from 'react-native'

import { FONT_REGULAR } from '../common/fonts'
import { BLACK } from '../common/colors'

interface InputFieldProps {
  placeholder: string,
  returnKeyType: string,
  autoFocus: boolean,
  value: string,
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  givenRef?: React.RefObject,
  onChange: () => void,
  onSubmitEditing: () => void
}

const InputField = ({
  placeholder,
  returnKeyType,
  autoFocus,
  value,
  autoCapitalize,
  givenRef,
  onChangeText,
  onSubmitEditing
}: InputFieldProps) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      returnKeyType={returnKeyType}
      autoCapitalize={autoCapitalize}
      autoCorrect={false}
      ref={givenRef}
      onSubmitEditing={onSubmitEditing}
      onChangeText={text => onChangeText(text)}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 45,
    paddingLeft: 10,
    fontFamily: FONT_REGULAR,
    fontSize: 16,
    borderRadius: 5,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    
    elevation: 3
  }
})

export default InputField