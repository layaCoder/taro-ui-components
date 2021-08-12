import Taro from '@tarojs/taro'

const DEFAULT_TOTAL_SECONDS = 30 // 默认总的时间（秒）
const DEFAULT_CUR_SECONDS = 0 // 默认剩余的时间（秒）
const DEFAULT_is_Time_Count_Down = false // 默认是否有分钟倒计时
// const DEFAULT_INNER_COLOR = '#A6E7DC' // 默认内圈颜色
// const DEFAULT_OUTER_COLOR = '#4ecfba' // 默认外圈颜色
// const DEFAULT_TEXT_COLOR = '#00B899' // 默认文字颜色
// const DEFAULT_CIRCLE_SIZE = 86 // 默认的圆大小（px）
// const DEFAULT_TEXT_SIZE = 22 // 默认的字体大小（px）
const DEFAULT_INNER_COLOR = '#EEEEEE' // 默认内圈颜色
const DEFAULT_OUTER_COLOR = '#DB0025' // 默认外圈颜色
const DEFAULT_TEXT_COLOR = '#DB0025' // 默认文字颜色
const DEFAULT_CIRCLE_SIZE = 70 // 默认的圆大小（px）
const DEFAULT_TEXT_SIZE = 20 // 默认的字体大小（px）

let intervalT = null

const DEFAULT_PROPS = {
  totalSeconds: DEFAULT_TOTAL_SECONDS,
  curSeconds: DEFAULT_CUR_SECONDS,
  isTimeCountDown: DEFAULT_is_Time_Count_Down,
  innerColor: DEFAULT_INNER_COLOR,
  outerColor: DEFAULT_OUTER_COLOR,
  textColor: DEFAULT_TEXT_COLOR,
  circleSize: DEFAULT_CIRCLE_SIZE,
  textSize: DEFAULT_TEXT_SIZE,
  onCountDownEnd: () => {
    console.log('onCountDownEnd')
  }
}

const converDesignPxToRealPx = (designPx) => {
  let rootPx
  const res = Taro.getSystemInfoSync()
  if (res.windowWidth < 320) {
    rootPx = 20
  } else if (res.windowWidth > 640) {
    rootPx = 40
  } else {
    rootPx = res.windowWidth / 16
  }
  const designRootPx = 23.45
  return (designPx / designRootPx) * rootPx
}

const configInnerText = (number, isTimeCountDown, setState) => {
  let timeText = ''
  if (isTimeCountDown) {
    // 大于1分钟，显示分位
    let seconds = Math.floor(number % 60)
    let minutes = Math.floor(number / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    seconds = seconds < 10 ? `0${seconds}` : seconds
    timeText = `${minutes}:${seconds}`
  } else {
    timeText = number < 10 ? `0${number}` : number
  }
  setState({
    timeText: timeText
  })
}

/**
 * 开始倒计时
 * @param {Object} param0
 * @param {Number} param0.totalSeconds 总的时间（秒）
 * @param {Number} param0.curSeconds 剩余的时间（秒）
 * @param {Boolean} param0.isTimeCountDown 是否有分钟倒计时
 * @param {Function} param0.setState 设置方法
 * @param {Function} param0.everyCb 每一秒的回调
 * @param {Function} param0.allCb 倒计时结束的回调
 */
const startCountdown = ({
  totalSeconds = 30,
  curSeconds = 0,
  isTimeCountDown = false,
  setState = () => {},
  everyCb = () => {},
  allCb = () => {}
} = {}) => {
  let remaining = totalSeconds - curSeconds // 倒计时圈中的文字显示

  // 防止切入后台后倒计时不准确
  const startDate = Date.now()
  const startRemaining = remaining

  // 如果所剩时间小于0，直接结束
  if (remaining <= 0) {
    allCb && allCb()
    return
  }

  const rotate = () => {
    // 防止切入后台后倒计时不准确
    const nowDate = Date.now()
    remaining = startRemaining - ((nowDate - startDate) / 1000).toFixed(0)

    if (remaining <= 0) {
      clearInterval(intervalT) // 倒计时一次停止
      intervalT = null
      allCb && allCb()
    }
    everyCb && everyCb(totalSeconds, remaining < 0 ? 0 : remaining)
    configInnerText(remaining < 0 ? 0 : remaining, isTimeCountDown, setState)
    // remaining -= 1
  }

  intervalT = setInterval(rotate, 1000)
  rotate()
}

const handleComponentWillUnmount = () => {
  clearInterval(intervalT)
  intervalT = null
}

/**
 * 获取画圆的方法
 * @param {Object} param0
 * @param {Object} param0.innerContext 内圆canvas的Cantext
 * @param {Object} param0.outerContext 外圆canvas的Cantext
 * @param {Object} param0.innerColor 内圆的颜色
 * @param {Object} param0.outerColor 外圆的颜色
 */
const getDrawCircleMethods = ({ innerContext, outerContext, innerColor, outerColor, circleSize } = {}) => {
  const drawInnerCircle = () => {
    // 绘制固定内圈圆
    innerContext.setLineWidth(converDesignPxToRealPx(circleSize / 20)) // setLineWidth-设置线条宽度；参数-setLineWidth(线条宽度，单位px)
    innerContext.setStrokeStyle(innerColor)
    innerContext.setLineCap('round')
    // 开始一个新的路径
    innerContext.beginPath()
    // arc-创建一条弧线；参数-arc(圆心x坐标，圆心y坐标，圆半径，起始弧度，终止弧度，弧度方向是否是逆时针)
    innerContext.arc(
      converDesignPxToRealPx(circleSize / 2),
      converDesignPxToRealPx(circleSize / 2),
      converDesignPxToRealPx(circleSize / 2.26),
      0,
      2 * Math.PI,
      true
    )
    innerContext.stroke()
    innerContext.draw() // draw-将之前在绘图上下文中的描述(路径，变形，样式)画到canvas中
  }
  const drawOutCircle = (totalSeconds, remaining) => {
    // 绘制倒计时外圈圆
    outerContext.setLineWidth(converDesignPxToRealPx(circleSize / 20))
    outerContext.setStrokeStyle(outerColor)
    outerContext.setLineCap('round')
    // 开始一个新的路径
    outerContext.beginPath()
    outerContext.arc(
      converDesignPxToRealPx(circleSize / 2),
      converDesignPxToRealPx(circleSize / 2),
      converDesignPxToRealPx(circleSize / 2.26),
      1.5 * Math.PI,
      -Math.PI * 0.5 + (2 * Math.PI * (totalSeconds - remaining)) / totalSeconds,
      true
    )
    outerContext.stroke()
    outerContext.draw()
  }
  return { drawInnerCircle, drawOutCircle }
}

export { converDesignPxToRealPx, DEFAULT_PROPS, startCountdown, handleComponentWillUnmount, getDrawCircleMethods }
