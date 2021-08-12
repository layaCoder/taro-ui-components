/* eslint-disable prefer-destructuring */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import getSvg from './svg'
import { DEFAULT_PROPS, startCountdown, handleComponentWillUnmount } from './base'
import './index.scss'

class Index extends Component {
  static defaultProps = DEFAULT_PROPS

  constructor(props) {
    super(props)

    this.state = {
      timeText: '',
      svgUrl: ''
    }
  }

  componentDidMount() {
    this.initBall()
  }

  componentWillUnmount() {
    handleComponentWillUnmount()
  }

  initSvgBall = () => {
    const { totalSeconds, curSeconds, onCountDownEnd, isTimeCountDown, innerColor, outerColor } = this.props

    this.setState({ svgUrl: getSvg({ totalSeconds, curSeconds, innerColor, outerColor }) })

    startCountdown({
      totalSeconds,
      curSeconds,
      isTimeCountDown,
      setState: (...params) => this.setState(...params),
      allCb: () => {
        onCountDownEnd && onCountDownEnd() // 调用倒计时结束回调
      }
    })
  }

  initBall = () => {
    this.initSvgBall()
  }

  render() {
    const { timeText, svgUrl } = this.state
    const { textColor, circleSize, textSize } = this.props

    return (
      <View className='progress-ball-wrapper' style={{ width: Taro.pxTransform(circleSize * 2), height: Taro.pxTransform(circleSize * 2) }}>
        <Image src={svgUrl} className='progress-image' />
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
