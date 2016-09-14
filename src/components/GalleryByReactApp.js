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



var GalleryByReactApp = React.createClass({
  render: function() {
    return (
      <section className="stage">
         <section className="image-sec">
         </section>
         <nav className="controller-nav">
         </nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
