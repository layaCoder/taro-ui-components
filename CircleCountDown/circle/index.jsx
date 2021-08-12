/* eslint-disable prefer-destructuring */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Canvas } from '@tarojs/components'
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

    const innerContext = Taro.createCanvasContext('innerCanvass', this)
    const outerContext = Taro.createCanvasContext('outerCanvass', this)
    this.setCanvasSize('innerCanvass', circleSize)
    this.setCanvasSize('outerCanvass', circleSize)
    console.log(innerContext)
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
    if (process.env.TARO_ENV === 'h5') {
      /** @type {HTMLCanvasElement} */
      const canvas = this.vnode.dom.querySelector(`[canvasId=${canvasId}]`)
      canvas.width = converDesignPxToRealPx(size)
      canvas.height = converDesignPxToRealPx(size)
    }
  }

  render() {
    const { timeText } = this.state
    const { textColor, circleSize, textSize } = this.props

    return (
      <View className='progress-ball-wrapper' style={{ width: Taro.pxTransform(circleSize * 2), height: Taro.pxTransform(circleSize * 2) }}>
        <Canvas canvasId='innerCanvass' className='progress-canvass-outer' />
        <Canvas canvasId='outerCanvass' className='progress-canvass' />

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
