# Taro 圆圈倒计时组件

## 支持 h5 Rn 微信小程序 支付宝小程序

## Demo

```javascript
import Circle from "./components";

<Circle
  isTimeCountDown // 是否显示分钟
  totalSeconds={leftTimeCount / 1000} // 倒计时 总时间 单位秒
  curSeconds={0} // 倒计时开始时间
  onCountDownEnd={() => {
    // 倒计时结事件
    onCountDownOver();
  }}
/>;
```
