'use strict';

var React = require('react/addons');
// var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../styles/main.less');

//获取图片数据
var imageDatas = require('../data/imageDatas.json');
imageDatas = (function genImageURL(imageDatasArr){
   for(var i = 0, j = imageDatasArr.length; i < j; i++){
       var singleImageData = imageDatasArr[i];
      singleImageData.imageURL = require('../images/' + singleImageData.fileName);
      imageDatasArr[i] = singleImageData;
   }
   return imageDatasArr;
})(imageDatas);

var ImagFigure = React.createClass({
   handleClick: function(e){
      if(this.props.arrange.isCenter){
         this.props.inverse();
      }else{
         this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
   },
   render: function(){
      var styleObj = {};
      if(this.props.arrange.pos){
         styleObj = this.props.arrange.pos;
      }
      if(this.props.arrange.rotate){
         (['MozTransform', 'MsTransform', 'WebkitTransform', 'transform']).forEach(function(value){
            styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
         }.bind(this));

      }
      var imagFigureClassName = 'img-figure';
      imagFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
      var imgSize = {
         height: '240px',
         width: '300px'
      };
      if(this.props.arrange.isCenter){
         styleObj.zIndex = 10000;
      }
      return (
            <figure className={imagFigureClassName} style={styleObj} onClick={this.handleClick}>
               <img src={this.props.data.imageURL} style={imgSize} alt={this.props.data.title}/>
               <figcaption className="figcaption">
                  <h2 className="img-title">{this.props.data.title}</h2>
                  <div className="img-back" onClick={this.handleClick}>
                     <p>{this.props.data.desc}</p>
                  </div>
               </figcaption>
            </figure>
         );
   }
});

function getRangeRandom(low, high){
   return Math.floor(Math.random() * (high - low) + low);
}

function getDegRandom(){
   return getRangeRandom(-45, 45);
}

var ControllerUnit = React.createClass({
   handleClick: function(e){
      if(this.props.arrange.isCenter){
         this.props.inverse();
      }else{
         this.props.center();
      }
      e.stopPropagation();
      e.preventDefault();
   },
   render: function(){
      var controllerUnitClassName = 'controller-unit';
      if(this.props.arrange.isCenter){
         controllerUnitClassName += ' is-center';
         if(this.props.arrange.isInverse){
            controllerUnitClassName += ' is-inverse';
         }
      }


      return (
         <span className={controllerUnitClassName} onClick={this.handleClick}>
         </span>
      );
   }
});

var GalleryByReactApp = React.createClass({
   Constant: {
      centerPos: {
         top: 0,
         left: 0
      },
      hPosRange: {
         leftScreenX: [0, 0],
         rightScreenX: [0, 0],
         y: [0, 0]
      },
      vPosRange: {
         x: [0, 0],
         topY: [0, 0]
      }
   },
   getInitialState: function(){
      return {
         imgsArrangeArr: [
         ]
      };
   },
   inverse: function(index){
      return function(){
         var imgsArrangeArr = this.state.imgsArrangeArr;
         imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
         this.setState({
            imgsArrangeArr: imgsArrangeArr
         });
      }.bind(this);
   },
   reArrange: function(centerIndex){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      var Constant = this.Constant;
      var centerPos = Constant.centerPos;
      var hPosRange = Constant.hPosRange;
      var vPosRange = Constant.vPosRange;
      var hPosRangeLeftScreenX = hPosRange.leftScreenX;
      var hPosRangeRightScreenX = hPosRange.rightScreenX;
      var hPosRangeY = hPosRange.y;
      var vPosRangeX = vPosRange.x;
      var vPosRangeTopY = vPosRange.topY;
      var topNum = Math.floor(Math.random() * 4);
      var topArr = [];
      for(var i = 0, j = topNum; i < j; i++){
         var num;
         num = Math.floor(Math.random() * imgsArrangeArr.length);
         if(num === centerIndex){
            num = (num + 1) % imgsArrangeArr.length;
         }
         topArr.push(num);
      }
      var k;
      for(i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
         if(i === centerIndex){
            imgsArrangeArr[i].pos = centerPos;
            imgsArrangeArr[i].rotate = 0;
            imgsArrangeArr[i].isCenter = true;
            continue;
         }
         if(topArr.indexOf(i) !== -1){
            imgsArrangeArr[i] = {
               pos: {
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
               },
               rotate: getDegRandom(),
               isCenter: false
            };
            continue;
         }
         var hPosRangeLORX = null;
         if(i < k){
            hPosRangeLORX = hPosRangeLeftScreenX;
         }else{
            hPosRangeLORX = hPosRangeRightScreenX;
         }
         imgsArrangeArr[i] = {
            pos: {
               top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
               left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
            },
            rotate: getDegRandom(),
            isCenter: false
         };
      }

      this.setState({
         imgsArrangeArr: imgsArrangeArr
      });
   },
   center: function(index){
      return function(){
         this.reArrange(index);
      }.bind(this);
   },
   componentDidMount: function(){
      var stageDom = React.findDOMNode(this.refs.stage);
      var stageW = stageDom.clientWidth;
      var stageH = stageDom.clientHeight;
      var halfStageW = Math.ceil(stageW / 2);
      var halfStageH = Math.ceil(stageH / 2);
      var imgFigureDom = React.findDOMNode(this.refs.imgFigure0);
      var imgW = imgFigureDom.clientWidth;
      var imgH = imgFigureDom.clientHeight;
      var halfImgW = Math.ceil(imgW / 2);
      var halfImgH = Math.ceil(imgH / 2);
      this.Constant.centerPos = {
         top: halfStageH - halfImgH,
         left: halfStageW - halfImgW
      };
      this.Constant.hPosRange.leftScreenX[0] = -halfImgW;
      this.Constant.hPosRange.leftScreenX[1] = halfStageW - halfImgW * 3;
      this.Constant.hPosRange.rightScreenX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightScreenX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;

      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
      this.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.Constant.vPosRange.x[1] = halfStageW;
      this.reArrange(0);

   },
   render: function(){
      var controllerUnits = [],
          imageFigures = [];
      imageDatas.forEach(function(value, index){
         if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
               pos: {
                  left: 0,
                  top: 0
               },
               rotate: 0,
               isInverse: false,
               isCenter: false
            };
         }
      controllerUnits.push(<ControllerUnit arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}></ControllerUnit>);
      imageFigures.push(<ImagFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);
      }.bind(this));

      return (
         <section className="stage" ref="stage">
            <section className="img-sec">
               {imageFigures}
            </section>
            <nav className="controller-nav">
               {controllerUnits}
            </nav>
         </section>
      );
   }
});
React.render(<GalleryByReactApp />, document.getElementById('content'));
module.exports = GalleryByReactApp;
