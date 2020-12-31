import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import closeImg from './img/close_grey.png'
import './FloatLayout.scss'



class FloatLayout extends Component {

    state = {
    }

    handleClose() {
        this.props.onClose()
    }

    render() {
        const { isOpened, title } = this.props
        return (
            <View className={isOpened ? "float-layout active" : "float-layout"}>
                <View className='float-layout__overlay' onClick={this.handleClose.bind(this)}></View>
                <View className='float-layout__container layout'>
                    <View className='layout-header  xmg-border-b'>
                        {title}
                        <Image src={closeImg} className='close-img' onClick={this.handleClose.bind(this)} />
                    </View>
                    <View className='layout-body'>
                        {this.props.children}
                    </View>
                </View>
            </View>
        )
    }
}

export { FloatLayout }