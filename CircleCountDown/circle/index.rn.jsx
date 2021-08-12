/* eslint-disable prefer-destructuring */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Canvas from 'react-native-canvas'
import createCanvasContextOnRn from './mockCreateCanvasContext'
import { DEFAULT_PROPS, converDesignPxToRealPx, startCountdown, handleComponentWillUnmount, getDrawCircleMethods } from './base'
import './index.scss'

class Index extends Component {
  static defaultProps = DEFAULT_PROPS

  constructor(props) {
    super(props)

    this.state = {
      timeText: ''
    }
    this.innerCanvass = null
    this.outerCanvass = null
  }

  componentDidMount() {
    this.initBall()
  }

  componentWillUnmount() {
    handleComponentWillUnmount()
  }

  initCanvasBall = () => {
    // 使用 wx.createContext 获取绘图上下文 context
    const { totalSeconds, curSeconds, onCountDownEnd, isTimeCountDown, innerColor, outerColor, circleSize } = this.props

    const innerContext = createCanvasContextOnRn(this.innerCanvass)
    const outerContext = createCanvasContextOnRn(this.outerCanvass)
    this.setCanvasSize('innerCanvass', circleSize)
    this.setCanvasSize('outerCanvass', circleSize)
    const { drawInnerCircle, drawOutCircle } = getDrawCircleMethods({ innerContext, outerContext, innerColor, outerColor, circleSize })
    drawInnerCircle()
    drawOutCircle(totalSeconds, totalSeconds - curSeconds)

    startCountdown({
      totalSeconds,
      curSeconds,
      isTimeCountDown,
      setState: (...params) => this.setState(...params),
      everyCb: drawOutCircle,
      allCb: () => {
        onCountDownEnd && onCountDownEnd() // 调用倒计时结束回调
      }
    })
  }

  initBall = () => {
    this.initCanvasBall()
  }

  setCanvasSize = (canvasId, size) => {
    /** @type {HTMLCanvasElement} */
    const canvas = this[canvasId]
    canvas.width = converDesignPxToRealPx(size)
    canvas.height = converDesignPxToRealPx(size)
  }

  render() {
    const { timeText } = this.state
    const { textColor, circleSize, textSize } = this.props

    return (
      <View className='progress-ball-wrapper' style={{ width: Taro.pxTransform(circleSize * 2), height: Taro.pxTransform(circleSize * 2) }}>
        <Canvas
          ref={(el) => {
            if (el) this.innerCanvass = el
          }}
          className='progress-canvass-outer'
        />
        <Canvas
          ref={(el) => {
            if (el) this.outerCanvass = el
          }}
          className='progress-canvass'
        />

        <View className='progress-ball-second'>
          <Text className='progress-ball-second-text' style={{ color: textColor, fontSize: Taro.pxTransform(textSize * 2) }}>
            {timeText}
          </Text>
        </View>
      </View>
    )
  }
}
export default Index
