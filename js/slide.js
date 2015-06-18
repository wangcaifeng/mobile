/**
* 滑屏效果
*by wangcaifeng
*@param {Object} outer     屏父级dom对象relative定位
*@param {string} section   屏tagName
*@param {string} direction 滑屏方向X,Y
*@param {string} way	   滑屏效果nocover:连续 cover:叠加
*@param {string} container 主题效果标签/spawiper组件实现其转场动画效果
*@param {Boolean} loop     是否自动播放
*@param {Number} looptime  转场时间设置looptrue有效
*@param {Object} stopmove  触摸或鼠标拖拽不产生动画效果的类名组成的数组["class1","class2"]
*@param {Function} callback转场后回调方法@param currIndex:当前场索引; n:
*/
define("spswiper",function(){
	var _default={
		outer : document.getElementById('wrapper'),
		section : "section",
		direction : "Y",
		way : "nocover",
		container : "ul",
		loop : false,
		looptime:5000,
		stopmove:[],
		callback:function(currIndex){}
	}

	var startTarget;
	//构造函数
	function Slider(opts){
		var o = $.extend(_default,opts);
		//构造函数需要的参数
		this.outer = o.outer;
		this.looptime = o.looptime;
		this.section = o.section;
		this.lis = document.getElementsByTagName(o.section); 
		this.direction = o.direction;
		this.way = o.way;
		this.container = o.container;
		this.callback = o.callback;
		this.loop = o.loop;
		this.stopmove = o.stopmove;
		this.time = 1;
		this.Switch;
		//构造三步奏
		this.init();
		this.bindDOM();
	}

	//第一步 -- 初始化
	Slider.prototype.init = function() {
		//窗口的宽度
		this.winW = this.outer.offsetWidth;
		//窗口的高度
		this.winH = this.outer.offsetHeight;
		if(this.direction == "X"){
			this.winPx = this.winW;
		}else if(this.direction == "Y"){
			this.winPx = this.winH;
		}
		//初始下标0
		this.way == "nocover" ? this.initIndex = 1 : this.initIndex = 0;
		if(this.way == "nocover"){
			var outer = this.outer,
				lis = this.lis,
				len = lis.length,
				container = this.container,
				i = 0;
			if(this.way == "nocover"){
				outer.appendChild(lis[0].cloneNode(true));
				outer.insertBefore(lis[len-1].cloneNode(true),lis[0]);
				lis[1].style.zIndex=3;
				lis[1].getElementsByTagName(this.container)[0].style.display="block";
				lis[1].getElementsByClassName("u-arrow-bottom")[0].style.display = "block";
			}
			//初始化li的位置
			for(var i = 0; i < len+2; i++){
				//让li水平排列 利用css3 GPU render
				if(this.direction == "X" && this.way == "nocover"){
					lis[i].style.webkitTransform = 'translate3d('+(i-1)*this.winW+'px, 0,  0)';
					lis[i].style.transform = 'translate3d('+(i-1)*this.winW+'px, 0,  0)';
				}else if (this.direction == "Y" && this.way == "nocover"){				
					lis[i].style.webkitTransform = 'translate3d(0, '+(i-1)*this.winH+'px, 0)';
					lis[i].style.transform = 'translate3d(0, '+(i-1)*this.winH+'px, 0)';
				}
			}
		}
		
		
		if(this.way == "cover"){
		}
		var _this = this;

		if(this.loop && this.way ==  "nocover"){
			var Timeoutfuc = function(){
	    		if(!_this.Switch){
	    			_this.time += 1;
	    				//改变过渡的方式，从无动画变为有动画
					lis[_this.time].style.webkitTransition = '-webkit-transform 0.6s ease-out';
					lis[_this.time].style.transition = 'transform 0.6s ease-out';
					lis[_this.time-1] && (lis[_this.time-1].style.webkitTransition = '-webkit-transform 0.6s ease-out');
					lis[_this.time-1] && (lis[_this.time-1].style.transition = 'transform 0.6s ease-out');
					lis[_this.time+1] && (lis[_this.time+1].style.webkitTransition = '-webkit-transform 0.6s ease-out');
					lis[_this.time+1] && (lis[_this.time+1].style.transition = 'transform 0.6s ease-out');

					//改变动画后所应该的位移值
					lis[_this.time].style.webkitTransform = 'translate3d(0, 0, 0)';
					lis[_this.time].style.transform = 'translate3d(0, 0, 0)';
					if(_this.direction == "Y"){
						lis[_this.time-1] && (lis[_this.time-1].style.webkitTransform = 'translate3d(0, '+-_this.winPx+'px, 0)');
						lis[_this.time-1] && (lis[_this.time-1].style.transform = 'translate3d(0, '+-_this.winPx+'px, 0)');
						lis[_this.time+1] && (lis[_this.time+1].style.webkitTransform = 'translate3d(0, '+_this.winPx+'px, 0)');
						lis[_this.time+1] && (lis[_this.time+1].style.transform = 'translate3d(0, '+_this.winPx+'px, 0)');
					}else if(_this.direction == "X"){
						lis[_this.time-1] && (lis[_this.time-1].style.webkitTransform = 'translate3d('+-_this.winPx+'px, 0, 0)');
						lis[_this.time-1] && (lis[_this.time-1].style.transform = 'translate3d('+-_this.winPx+'px, 0, 0)');
						lis[_this.time+1] && (lis[_this.time+1].style.webkitTransform = 'translate3d('+_this.winPx+'px, 0, 0)');
						lis[_this.time+1] && (lis[_this.time+1].style.transform = 'translate3d('+_this.winPx+'px, 0, 0)');
					}
					_this.initIndex = _this.time;
					_this.callback(_this.time)

				}

			};
			var timeindex = 1;
			window.requestAFrame = (function () {
				return  window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						function (fn) {
							return window.setTimeout(fn, 1000/60); 
						};
			})();
			var queuetimer = _this.looptime*60/1000;
			function queueTimeout(){
				if(_this.time == len){
					return;
				}
				if(timeindex % queuetimer === 0){
					Timeoutfuc()
				}
				requestAFrame(queueTimeout);
				timeindex = (1+timeindex) % (18000) //最高轮训5minute
			}
			queueTimeout();
		}
	};

	//第二步 -- 绑定 DOM 事件
	Slider.prototype.bindDOM = function(){
		var self = this, //缓存当前this指针
			winH = self.winH, //获得当前的频幕高度
			winW = self.winW, //获得当前的频幕宽度
			outer = self.outer, //获得ul
			lis = self.lis,
			stopmove = self.stopmove,
			len = lis.length; //获得li的长度
		var dragging = null;
		//手指按下的处理事件
		var startHandler = function(e){
			self.Switch = true;
			//e.preventDefault();
			//记录刚刚开始按下的时间 转化为mms
			self.startTime = new Date() * 1;
			//记录手指按下的坐标  touchs 是手指按住的区域点
			self.startY = e.touches ? e.touches[0].pageY : e.pageY;
			self.startX = e.touches ? e.touches[0].pageX : e.pageX;

			//清除偏移量 --> 手指滑动的距离
			self.offsetY = 0;
			startTarget =  e.touches ? e.touches[0].target : e.target;
			var startE = e.touches ? e.touches[0] : e;
			dragging = 1;
			for( var key in stopmove){
				$(startTarget).hasClass(stopmove[key]) ? dragging = null : dragging = 1;
			}
		};

		//手指移动的处理事件
		var moveHandler = function(e){
			//兼容chrome android，阻止浏览器默认行为
			e.preventDefault();
			if(dragging){
				//计算手指的偏移量 touches 和targetTouches 一样
				if(self.direction == "X"){
					e.targetTouches ? (self.offset = e.targetTouches[0].pageX - self.startX) : (self.offset = e.pageX - self.startX);
				}else if(self.direction == "Y"){
					e.targetTouches ? (self.offset = e.targetTouches[0].pageY - self.startY ): (self.offset = e.pageY - self.startY);
				}
				//起始索引
				var i = self.initIndex - 1;

				//结束索引
				var m = i + 3;
				if(self.way == "cover"){
					if (self.offset > 0) {
						//最小化改变DOM属性
						for(i; i < m; i++){
							//当前移动时不要动画
							lis[i] && (lis[i].style.webkitTransition = 'transform 0s ease');							
							lis[i] && (lis[i].style.transition = 'transform 0s ease');							
							if (i == self.initIndex + 1) {
								lis[i] && (lis[i].style.zIndex = 887);
							}
							if (i == self.initIndex) {
								lis[i] && (lis[i].style.zIndex = 888);
							}
							if (i == self.initIndex - 1) {
								lisNext = lis[i] || lis[len-1];
								lisNext && (lisNext.style.zIndex = 889);
								if(self.direction == "X"){
									lisNext && (lisNext.style.webkitTransform = 'translate3d('+(-2*self.winPx + self.offset)+'px, 0, 0)');
									lisNext && (lisNext.style.transform = 'translate3d('+(-2*self.winPx + self.offset)+'px, 0, 0)');
								}else if(self.direction == "Y"){
									lisNext && (lisNext.style.webkitTransform = 'translate3d(0, '+(-2*self.winPx + self.offset)+'px, 0)');
									lisNext && (lisNext.style.transform = 'translate3d(0, '+(-2*self.winPx + self.offset)+'px, 0)');
								}
							}
						}
						$(self.lis).find('img').hide();
						$(lis[self.initIndex + 1]).find('img').show();
					} else {//up
						//当前移动时不要动画
						for(i; i < m; i++){
							//当前移动时不要动画
							lis[i] && (lis[i].style.webkitTransition = 'transform 0s ease');
							lis[i] && (lis[i].style.transition = 'transform 0s ease');
							if (i == self.initIndex + 1) {
								lisNext = lis[i] || lis[0]
								lisNext && (lisNext.style.zIndex = 889);
								if(self.direction == "X"){
									lisNext && (lisNext.style.webkitTransform = 'translate3d('+(2*self.winPx + self.offset)+'px, 0, 0)');
									lisNext && (lisNext.style.transform = 'translate3d('+(2*self.winPx + self.offset)+'px, 0, 0)');
								}else if(self.direction == "Y"){
									lisNext && (lisNext.style.webkitTransform = 'translate3d(0, '+(2*self.winPx + self.offset)+'px, 0)');
									lisNext && (lisNext.style.transform = 'translate3d(0, '+(2*self.winPx + self.offset)+'px, 0)');
								}
							}
							if (i == self.initIndex) {
								if(i == len - 1){
									lis[i] && (lis[i].style.zIndex = 887);
								}else{
									lis[i] && (lis[i].style.zIndex = 888);
								}
							}
							if (i == self.initIndex - 1) {
								lis[i] && (lis[i].style.zIndex = 887);
							}
						}
					}
				}
			}
		};

		//手指抬起的处理事件
		var endHandler = function(e){
			if(self.offset){
				//边界就翻页值
				//var boundary = self.winPx/2;
				var boundary = 7;//保留上面，滑屏习惯
				//手指抬起的时间值
				var endTime = new Date() * 1;
				//当手指移动时间超过400ms 的时候，按位移算
				if(endTime - self.startTime > 400){
					if(self.offset >= boundary){
						self.goIndex('-1');
					}else if(self.offset < 0 && self.offset < -boundary){
						self.goIndex('+1');
					}
				}else{
					//优化
					//快速移动也能使得翻页
					if(self.offset > 6){
						self.goIndex('-1');
					}else if(self.offset < -6){
						self.goIndex('+1');
					}
				}
				self.offset= null;
				dragging = null;
			}
		};

		//绑定事件
		outer.addEventListener('touchstart', startHandler);
		outer.addEventListener('mousedown', startHandler);
		outer.addEventListener('touchmove', moveHandler);
		outer.addEventListener('mousemove', moveHandler);
		outer.addEventListener('touchend', endHandler);
		outer.addEventListener('mouseup', endHandler);
	};

	//第三步 -- 跳转显示函数
	Slider.prototype.goIndex = function(n){
		var _this = this,
			judgego,
			judgeback,
			initIndex = this.initIndex,
			lis = this.lis,
			outer = this.outer,
			len = lis.length,
			currIndex = initIndex + n*1;//索引的变化当前显示下标
			
		currIndex < 0 ? judgego = 0 : judgego = 1;
		currIndex > len - 1 ? judgeback = 0 : judgeback =1; 
		//当索引右超出
		if(currIndex > len-1){
			if(this.way == "cover" ){
				currIndex = 0
			}else{
				var lis= document.getElementsByTagName(this.section);
				outer.insertBefore(lis[len-1],lis[1]);
				var lis= document.getElementsByTagName(this.section);
				outer.appendChild(lis[2])
				lis[2].style.zIndex=3;
				lis[len-1].style.zIndex=1;
				lis[1].getElementsByTagName(this.container)[0].style.display="block";
				lis[1].getElementsByClassName("u-arrow-bottom")[0].style.display = "block";
				currIndex = 2;
			}

		//当索引左超出
		}else if(currIndex < 0){
			if(this.way == "cover" ){
				 currIndex = len-1 
			}else{	
				var lis= document.getElementsByTagName(this.section);
				outer.insertBefore(lis[0],lis[len-2]);
				var lis= document.getElementsByTagName(this.section);
				outer.insertBefore(lis[len-3],lis[0]);
				lis[len-2].style.zIndex=3;
				lis[1].style.zIndex=1;
				lis[len-2].getElementsByTagName(this.container)[0].style.display="block";
				lis[len-2].getElementsByClassName("u-arrow-bottom")[0].style.display = "block";
				currIndex = len-3;
			}
		}else if(currIndex < len-1){
			setTimeout(function(){
				_this.Switch = false;
				_this.time = currIndex;
			},500)
		}

		//保留当前索引值
		this.initIndex = currIndex;	
		//改变过渡的方式，从无动画变为有动画
		if(this.way == "nocover"){
			if(judgego && judgeback){
				for(var i = 0; i < len; i++){
				lis[i].style.webkitTransition = '';
					if(_this.direction == "Y"){
						if(i == currIndex - n*1){
							lis[i].style.zIndex = 3;
							lis[i].style.webkitTransform = 'translate3d(0, 0, 0)';
							lis[i].style.transform = 'translate3d(0, 0, 0)';
						}else{
							lis[i].style.zIndex = 1
						}
						if(i < currIndex- n*1){
							lis[i].style.webkitTransform = 'translate3d(0, '+-this.winPx+'px, 0)';
							lis[i].style.transform = 'translate3d(0, '+-this.winPx+'px, 0)';
						}else if(i > currIndex- n*1){
							lis[i].style.webkitTransform = 'translate3d(0, '+this.winPx+'px, 0)';
							lis[i].style.transform = 'translate3d(0, '+this.winPx+'px, 0)';
						}
					}else{
						if(i == currIndex - n*1){
							lis[i].style.zIndex = 3;
							lis[i].style.webkitTransform = 'translate3d(0, 0, 0)';
							lis[i].style.transform = 'translate3d(0, 0, 0)';
						}else{
							lis[i].style.zIndex = 1
						}
						if(i < currIndex- n*1){
							lis[i].style.webkitTransform = 'translate3d('+-this.winPx+'px, 0, 0)';
							lis[i].style.transform = 'translate3d('+-this.winPx+'px, 0, 0)';
						}else if(i > currIndex- n*1){
							lis[i].style.webkitTransform = 'translate3d('+this.winPx+'px, 0, 0)';
							lis[i].style.transform = 'translate3d('+this.winPx+'px, 0, 0)';
						}
					}
				}
			}else if(!judgego && judgeback){
				for(var i = 0; i < len; i++){
					lis[i].style.webkitTransition = '';
					lis[i].style.transition = '';
					if(_this.direction == "Y"){
						if(i == len -2){
							lis[i].style.webkitTransform = 'translate3d(0, 0, 0)';
							lis[i].style.transform = 'translate3d(0, 0, 0)';
						}else if(i < len-2){
							lis[i].style.webkitTransform = 'translate3d(0, '+-this.winPx+'px, 0)';
							lis[i].style.transform = 'translate3d(0, '+-this.winPx+'px, 0)';
						}else if(i > len-2){
							lis[i].style.webkitTransform = 'translate3d(0, '+this.winPx+'px, 0)';
							lis[i].style.transform = 'translate3d(0, '+this.winPx+'px, 0)';
						}
					}else{
						if(i == len -2){
							lis[i].style.webkitTransform = 'translate3d(0, 0, 0)';
							lis[i].style.transform = 'translate3d(0, 0, 0)';
						}else if(i < len-2){
							lis[i].style.webkitTransform = 'translate3d('+-_this.winPx+'px, 0, 0)';
							lis[i].style.transform = 'translate3d('+-_this.winPx+'px, 0, 0)';
						}else if(i > len-2){
							lis[i].style.webkitTransform = 'translate3d('+_this.winPx+'px, 0, 0)';
							lis[i].style.transform = 'translate3d('+_this.winPx+'px, 0, 0)';
						}
					}
				}
			}else if(judgego && !judgeback){
				for( var i = 0; i< len; i++){
					lis[i].style.webkitTransition = '';
					lis[i].style.transition = '';
					if(_this.direction == "Y"){
						if( i == 1){
							lis[i].style.webkitTransform = 'translate3d(0, 0, 0)';
							lis[i].style.transform = 'translate3d(0, 0, 0)';
						}else if(i < 1){
							lis[i].style.webkitTransform = 'translate3d(0, '+-this.winPx+'px, 0)';
							lis[i].style.transform = 'translate3d(0, '+-this.winPx+'px, 0)';
						}else if(i > 1){
							lis[i].style.webkitTransform = 'translate3d(0, '+this.winPx+'px, 0)';
							lis[i].style.transform = 'translate3d(0, '+this.winPx+'px, 0)';
						}
					}else{
						if( i == 1){
							lis[i].style.webkitTransform = 'translate3d(0, 0, 0)';
							lis[i].style.transform = 'translate3d(0, 0, 0)';
						}else if(i < 1){
							lis[i].style.webkitTransform = 'translate3d('+-this.winPx+'px, 0, 0)';
							lis[i].style.transform = 'translate3d('+-this.winPx+'px, 0, 0)';
						}else if(i > 1){
							lis[i].style.webkitTransform = 'translate3d('+this.winPx+'px, 0, 0)';
							lis[i].style.transform = 'translate3d('+this.winPx+'px, 0, 0)';
						}
					}
				}
			}
				
			setTimeout(function(){
				lis[currIndex].style.webkitTransition = '-webkit-transform 0.5s ease-out';
				lis[currIndex].style.transition = 'transform 0.5s ease-out';
				lis[currIndex-1] && (lis[currIndex-1].style.webkitTransition = '-webkit-transform 0.5s ease-out');
				lis[currIndex-1] && (lis[currIndex-1].style.transition = 'transform 0.5s ease-out');
				lis[currIndex+1] && (lis[currIndex+1].style.webkitTransition = '-webkit-transform 0.5s ease-out');
				lis[currIndex+1] && (lis[currIndex+1].style.transition = 'transform 0.5s ease-out');

				//改变动画后所应该的位移值
				lis[currIndex].style.webkitTransform = 'translate3d(0, 0, 0)';
				lis[currIndex].style.transform = 'translate3d(0, 0, 0)';
				if(_this.direction == "Y"){
					lis[currIndex-1] && (lis[currIndex-1].style.webkitTransform = 'translate3d(0, '+-_this.winPx+'px, 0)');
					lis[currIndex-1] && (lis[currIndex-1].style.transform = 'translate3d(0, '+-_this.winPx+'px, 0)');
					lis[currIndex+1] && (lis[currIndex+1].style.webkitTransform = 'translate3d(0, '+_this.winPx+'px, 0)');
					lis[currIndex+1] && (lis[currIndex+1].style.transform = 'translate3d(0, '+_this.winPx+'px, 0)');
				}else if(_this.direction == "X"){
					lis[currIndex-1] && (lis[currIndex-1].style.webkitTransform = 'translate3d('+-_this.winPx+'px, 0, 0)');
					lis[currIndex-1] && (lis[currIndex-1].style.transform = 'translate3d('+-_this.winPx+'px, 0, 0)');
					lis[currIndex+1] && (lis[currIndex+1].style.webkitTransform = 'translate3d('+_this.winPx+'px, 0, 0)');
					lis[currIndex+1] && (lis[currIndex+1].style.transform = 'translate3d('+_this.winPx+'px, 0, 0)');
				}
			},50)
			
		}else if(this.way == "cover"){
			lis[currIndex].style.webkitTransition = '-webkit-transform 0.7s ease-out';
			lis[currIndex].style.transition = 'transform 0.7s ease-out';
			lis[currIndex].style.webkitTransform = 'translate3d(0, 0, 0)';
			lis[currIndex].style.transform = 'translate3d(0, 0, 0)';
		}

		this.callback(currIndex)
	};

	//初始化Slider 实例
	return Slider;
})