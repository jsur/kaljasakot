import React from 'react'
import { StyleSheet, TouchableOpacity, Text, Image, View } from 'react-native'

import { WHITE, BLACK, BEER_YELLOW_OPAQUE } from '../common/colors'

class ChoiceButton extends React.Component {

  render () {
    return (
      <TouchableOpacity style={styles.touchable}>
        <View style={styles.imgWrapper}>
          <Image source={require('../assets/images/jar-of-beer-white.png')} style={{ width: 50, height: 50 }} resizeMode='contain' />
        </View>
        <View style={styles.contentWrapper}>

        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  touchable: {
    width: '80%',
    flexDirection: 'row',
    aspectRatio: 3,
    borderColor: WHITE,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: '#f2af63',
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  imgWrapper: {
    flex: 1
  },
  contentWrapper: {
    flex: 2
  }
})

export default ChoiceButton