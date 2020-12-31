# Taro 底部滑出Popup


## Samplle
```jsx
import { FloatLayout } from '../components/floatLayout/index.js'



render(){
 <FloatLayout isOpened={this.state.modelShow} 
                title='test' 
                onClose={this.closeFloatLayout}>
        <View>
            <Text>test String</Text>
        </View>
</FloatLayout>

// 接收3个参数
// 1. isOpned
// 2. title
// 3. onClose
}
   ```
