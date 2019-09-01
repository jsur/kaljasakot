import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'
import { BEER_YELLOW, WHITE } from '../common/colors'

interface BubbleProps {
  width: number,
  height: number
}

const SvgBubble = ({ width = 100, height = 100 }: BubbleProps) => {
  const d = `M${width * 0.5} ${height * 0.3} C${width * 0.5} ${height * 0.3} ${width * 0.635} ${height * 0.275} ${width * 0.7} ${height * 0.475}`
  return (
    <Svg width={width} height={height}>
      <Circle
        cx={width / 2}
        cy={height / 2}
        r={width / 4}
        stroke={WHITE}
        strokeWidth='1.5'
        fill='transparent'
      /> 
      <Path
        d={d}
        fill='transparent'
        stroke={WHITE}
        strokeWidth={1.5}
      />
    </Svg>
  )
}

export default SvgBubble