require('normalize.css/normalize.css');
require('styles/App.scss');
//获取图片数据
let imageDatas = require('../data/imageDatas.json');
//利用自执行函数 把图片名转成图片URL
imageDatas = (function genImageURL(imageDatasArr){
  for(var i=0;i<imageDatasArr.length;i++){
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

import React from 'react';


class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec"></section>
        <nav className="control-nav"></nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
