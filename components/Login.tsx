import React from 'react'
import { Animated, StyleSheet, View, Dimensions } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Svg, { Path } from 'react-native-svg'

import PageContainer from './PageContainer'
import LoginForm from './LoginForm'
import SvgBubble from './SvgBubble'

import { BEER_YELLOW, WHITE } from '../common/colors'

const { width, height } = Dimensions.get('window')

class Login extends React.Component<NavigationInjectedProps> {
  bubbles = null
  bubbleInterval = null

  state = {
    errorMsg: ''
  }

  componentDidMount () {
    this.initBubbles()
    this.bubbleInterval = setInterval(() => this.initBubbles(), 12000)
  }

  componentWillUnmount () {
    clearInterval(this.bubbleInterval)
  }

  initBubbles = () => {
    this.setBubbles()
    this.animateAllBubbles()
  }

  setBubbles = () => {
    this.bubbles = [-100, 20, -70, 50, 0, 30, 40, 85].map(x => new Animated.ValueXY({ x, y: height }))
    this.forceUpdate()
  }

  animateAllBubbles = () => {
    Animated.parallel(this.bubbles.map(bubble => this.animateBubble(bubble, bubble.x))).start()
  }

  animateBubble = (animation: Animated.ValueXY, x: number) => {
    return Animated.timing(animation,
      {
        toValue: { x, y: -80 },
        duration: 6500,
        useNativeDriver: true,
        delay: Math.random() * 6000
      }).start()
  }
  render() {
    const { errorMsg } = this.state
    const ds = [
      `m-20 0 q${width / 6} 100 ${width / 2.2} 0`,
      `m${width / 3.5} 0 q${width / 4.2} 100 ${width / 2} 0`,
      `m${width - (width * 0.35)} 0 q${width / 5} 100 ${width / 1.8} 0`,
    ]
    return (
      <>
      <Svg width={width} height={60} style={{ backgroundColor: BEER_YELLOW }}>
        { ds.map(d => <Path key={d} d={d} stroke={WHITE} fill={WHITE} />) }
      </Svg>
      <PageContainer backgroundColor={BEER_YELLOW}>
        {
          this.bubbles && this.bubbles.map((item, i) => {
            const transform = item.getTranslateTransform()
            return (
              <Animated.View key={i} style={{ height: 0, transform }}>
                <SvgBubble width={20} height={20} />
              </Animated.View>
            )
          })
        }
        <View style={styles.main}>
          <View style={[styles.bubbleWrapper, { left: width / 1.8 }]}><SvgBubble width={30} height={30} /></View>
          <View style={[styles.bubbleWrapper, { top: height / 3, left: 20 }]}><SvgBubble width={35} height={35} /></View>
          <View style={[styles.bubbleWrapper, { top: height / 2, left: width / 3.2 }]}><SvgBubble width={35} height={35} /></View>
          <View style={[styles.bubbleWrapper, { top: height / 3, left: width / 1.3 }]}><SvgBubble width={25} height={25} /></View>
          <View style={styles.loginFormWrapper}>
            <LoginForm
              errorMsg={errorMsg}
              onSuccess={() => this.props.navigation.navigate('AddBeer')}
            />
          </View>
        </View>
      </PageContainer>
      </>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  loginFormWrapper: {
    width: '80%',
    height: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%'
  },
  bubbleWrapper: {
    position: 'absolute'
  }
})

export default Login