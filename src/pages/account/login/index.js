import React, { Component } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import { pxToDp } from '../../../utils/styleKits';
import { Input } from 'react-native-elements';
import validate from '../../../utils/validate';
import request from '../../../utils/request';
import { ACCOUNT_LOGIN } from '../../../utils/pathMap';
import THButton from '../../../components/THButton';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import { Toast } from '../../../utils/Toast';
import { ACCOUNT_VALIDATEVCODE } from '../../../utils/pathMap';

class Index extends Component {

  state = {
    // 手机号码
    phoneNumber: "15573130221",
    // 手机号码是否合法
    phoneValid: true,
    // 是否登录显示登录页面
    showLogin: true,
    // 验证码的值
    vcodeText: "",
    // 倒计时按钮的文本
    btnText: "重新获取",
    // 是否在倒计时中
    isCountDowning: false,
  }
  // 登录框手机号码输入
  phoneNumberChangeText = (phoneNumber) => {
    this.setState({ phoneNumber });
    console.log(phoneNumber);
  }

  // 输入手机号码 点击完成
  phoneNumberSubmitEditing = async () => {
    const { phoneNumber } = this.state

    // 校验手机号码是否合法
    let phoneValid = validate.validatePhone(phoneNumber)
    if (!phoneValid) {
      // 未通过验证
      this.setState({ phoneValid });
      return
    }
    const res = await request.post(ACCOUNT_LOGIN, { phone: phoneNumber })
    console.log(res);
    if (res.code === '10000') {
      // 请求成功
      this.setState({ showLogin: false });
      // 开启定时器
      this.countDown()
    } else {

    }
  }

  // 开启获取验证码的定时器
  countDown = () => {
    if (this.state.isCountDowning) {
      return;
    }
    console.log("开启倒计时");
    this.setState({ isCountDowning: true });
    let seconnds = 5
    this.setState({ btnText: `重新获取(${seconnds}S)` });
    let timeId = setInterval(() => {
      seconnds--;
      this.setState({ btnText: `重新获取(${seconnds}S)` });
      if (seconnds === 0) {
        clearInterval(timeId)
        this.setState({ isCountDowning: false });
        this.setState({ btnText: "重新获取" });
      }
    }, 1000)
  }

  // 验证码输入完毕事件
  onVcodeSubmitEditing = async () => {
    const { vcodeText, phoneNumber } = this.state
    if (vcodeText.length != 6) {
      Toast.message("验证码不正确", 2000, "center")
      return;
    }

    const res = await request.post(ACCOUNT_VALIDATEVCODE, {
      phone: phoneNumber,
      vcode: vcodeText
    })
    if (res.code != "10000") {
      console.log(res);
      return;
    }
    if (res.data.isNew) {
      // 新用户 UserInfo
      this.props.navigation.navigate("UserInfo")
    } else {
      // 老用户
      alert("老用户")
    }
  }

  // 渲染登录界面
  renderLogin = () => {
    const { phoneNumber, phoneValid } = this.state
    return (
      <View>
        {/* 标题 */}
        <View><Text style={{ fontSize: pxToDp(25), color: "#888", fontWeight: "bold" }}>手机号登录注册</Text></View>
        {/* 输入框 */}
        <View style={{ marginTop: pxToDp(25) }}>
          <Input
            placeholder='请输入手机号码'
            maxLength={11}
            keyboardType="phone-pad"
            value={phoneNumber}
            inputStyle={{ color: "#333" }}
            onChangeText={this.phoneNumberChangeText}
            errorMessage={phoneValid ? "" : "手机号码格式不正确"}
            onSubmitEditing={this.phoneNumberSubmitEditing}
            leftIcon={{ type: 'font-awesome', name: 'phone', color: "#ccc", size: pxToDp(20) }}
          />
        </View>
        {/* 渐变按钮 开始 */}
        <View>
          <View style={{ width: "85%", height: pxToDp(40), alignSelf: "center" }}>
            <THButton onPress={this.phoneNumberSubmitEditing} style={{ borderRadius: pxToDp(20) }}>获取验证码</THButton>
          </View>
        </View>
        {/* 渐变按钮 结束 */}
      </View>
    )
  }

  // 重新获取按钮
  repGetVcode = () => {
    this.countDown();
  }

  // 渲染填写验证码
  renderVCode = () => {
    const CELL_COUNT = 6;
    const { phoneNumber, phoneValid, showLogin, vcodeText, btnText, isCountDowning } = this.state
    return (
      <View>
        <View><Text style={{ fontSize: pxToDp(25), color: "#888", fontWeight: "bold" }}>输入6位验证码</Text></View>
        <View style={{ marginTop: pxToDp(10) }}><Text style={{ color: "#888" }}>已发到:+86 {phoneNumber}</Text></View>
        <View>
          <CodeField
            value={vcodeText}
            onChangeText={this.onVcodeChangeText}
            onSubmitEditing={this.onVcodeSubmitEditing}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
        <View style={{ marginTop: pxToDp(10) }}>
          <THButton onPress={this.repGetVcode} disabled={isCountDowning} style={{ width: "85%", height: pxToDp(40), alignSelf: "center", borderRadius: pxToDp(20) }}>{btnText}</THButton>
        </View>
      </View>
    )
  }

  // 验证码输入框的值改变事件
  onVcodeChangeText = (vcodeText) => {
    this.setState({ vcodeText });
  }

  render() {
    const { phoneNumber, phoneValid, showLogin } = this.state
    return (
      <View>
        {/* 0.0 状态栏 开始 */}
        <StatusBar backgroundColor="transparent" translucent={true} />
        {/* 0.0 状态栏 结束 */}
        {/* 1.0 背景图片 开始 */}
        {/* 200 单位 dp 单位 px -> dp */}
        <Image style={{ width: "100%", height: pxToDp(220) }} source={require("../../../res/profileBackground.jpg")} />

        {/* 1.0 背景图片 结束 */}

        {/* 2.0 内容 开始 */}
        <View style={{ padding: pxToDp(20) }}>
          {/* 2.1 登录 开始 */}
          {
            showLogin ?
              this.renderLogin()
              :
              this.renderVCode()

          }

          {/* 2.1 登录 结束 */}


        </View>
        {/* 2.0 内容 结束 */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
    color: '#7d53ea',
  },
  focusCell: {
    borderColor: '#7d53ea',
  },
});

export default Index;