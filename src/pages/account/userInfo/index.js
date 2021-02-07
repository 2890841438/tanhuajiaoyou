import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { pxToDp } from '../../../utils/styleKits';
import SvgUri from 'react-native-svg-uri';
import { male, female } from '../../../res/fonts/iconSvg';

class Index extends Component {
  render() {
    return (
      <View style={{ backgroundColor: "#fff", flex: 1, padding: pxToDp(20) }}>
        {/* 1.0 标题  开始 */}
        <Text style={{ fontSize: pxToDp(20), color: "#666", fontWeight: "bold" }}>提升我的魅力</Text>
        <Text style={{ fontSize: pxToDp(20), color: "#666", fontWeight: "bold" }}>填写资料</Text>
        {/* 1.0 标题  结束 */}
        {/* 2.0 性别 开始 */}
        <View style={{marginTop:pxToDp(20)}}>
          <SvgUri svgXmlData={male} width="30" height="30" />
          <SvgUri svgXmlData={female} width="30" height="30" />
        </View>
        {/* 2.0 性别 结束 */}
      </View>
    );
  }
}

export default Index;