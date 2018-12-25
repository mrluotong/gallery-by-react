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

console.log(imageDatas);

import React from 'react';
var ImgFigure=React.createClass({
  render(){
    return (
        <figure className="img-figure">
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
        </figure>
      );
  }
});

class AppComponent extends React.Component {
  render() {
    let controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach((value,i) => {
      imgFigures.push(<ImgFigure key={i} data={value}/>);
    });
    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="control-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
