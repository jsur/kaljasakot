import React from 'react'
import { Image } from 'react-native'

interface TabBarIcon {
  focused?: boolean,
  horizontal?: boolean,
  tintColor?: string,
  imgSrc: number
}

const TabBarIcon = (tabBarProps: TabBarIcon) => {
  return <Image source={tabBarProps.imgSrc} style={{ width: 25, height: 25 }} resizeMode='contain' />
}

export default TabBarIcon