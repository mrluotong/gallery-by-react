require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom'
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
//获取区间内的一个随机值
function getRangeRandom(low,high){
  return Math.ceil(Math.random() * (high-low) + low);
}
class ImgFigure extends React.Component{
  render(){
    let styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    return (
        <figure className="img-figure"  style={styleObj}>
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
        </figure>
      );
  }
}


class AppComponent extends React.Component {
    Constent= {
      centerPos:{
        left:0,
        top:0
      },
      hPosRange:{//水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{//垂直方向的取值范围
        x:[0,0],
        topY:[0,0]
      }
    }
    //定义组件的状态
    state = {
      imgsArrangeArr:[{
        pos: {
          left: 0,
          top: 0
        }
      }]
    }
  /**
 * 随机重新布局所有图片
 * param centerIndex 指定居中排布哪个图片
 */
rearrang(centerIndex){
  let imgsArrangeArr = this.state.imgsArrangeArr,
      Constent = this.Constent,
      hPosRange = Constent.hPosRange,
      vPosRange = Constent.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeX = vPosRange.x,
      vPosRangeTopY = vPosRange.topY,

      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2),//取一个或者不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
      //首先居中 centerIndex 的图片
      imgsArrangeCenterArr[0].pos = this.Constent.centerPos;
      //取出要布局上侧的图片的状态信息
      topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
      //布局位于上侧的图片
      imgsArrangeTopArr.forEach((value,index) => {
        imgsArrangeTopArr[index].pos = {
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        }
      });
      //布局左右两侧的图片
      for(let i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
        let hPosRangeLORX = null;
        //前半部分布局左边 后半部分布局右边
        if(i<k){
          hPosRangeLORX = hPosRangeLeftSecX;
        }
        else
        {
          hPosRangeLORX = hPosRangeRightSecX;
        }
        imgsArrangeArr[i].pos = {
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        };
      }
    //如果上侧有图片则插入
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
    }
    //布局中间图片的位置信息
    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
    //设置组件状态属性值 当这个值改变的时候 会重新渲染页面
    // this.state.imgsArrangeArr = imgsArrangeArr;
    this.setState({
      imgsArrangeArr:imgsArrangeArr
    });
}
  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount(){
    //首先拿到舞台的大小
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //拿到一个imgFigure的大小 因为每个大小都一样 只要那第一个就可以了
    let imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW/2),
        halfImgH = Math.ceil(imgH/2);
    //计算中心图片的位置点
    this.Constent.centerPos = {
      left:halfStageW-halfImgW,
      top:halfStageH-halfImgH
    }
    //计算左侧，右侧区域图片排布位置点取值范围
    this.Constent.hPosRange.leftSecX[0] = -halfImgW;
    this.Constent.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    this.Constent.hPosRange.rightSecX[0] = halfStageW - halfImgW;
    this.Constent.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constent.hPosRange.y[0] = -halfImgH;
    this.Constent.hPosRange.y[1] = stageH - halfImgH;
    //计算上侧区域图片位置点取值范围
    this.Constent.vPosRange.topY[0] = -halfImgH;
    this.Constent.vPosRange.topY[1] = halfStageH - halfImgH*3;
    this.Constent.vPosRange.x[0] = halfImgW - imgW;
    this.Constent.vPosRange.x[1] = halfImgW;
    this.rearrang(0);
}

  render() {
    let controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach((value,i) => {
      //如果状态信息不存在则初始化
      if(!this.state.imgsArrangeArr[i]){
        this.state.imgsArrangeArr[i] = {
          pos:{
            left:0,
            top:0
          }
        };
      }
      
      imgFigures.push(<ImgFigure key={i} data={value} ref={'imgFigure' + i} arrange={this.state.imgsArrangeArr[i]} />);
    });
    console.log(this.state.imgsArrangeArr);
    return (
      <section className="stage" ref="stage">
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
