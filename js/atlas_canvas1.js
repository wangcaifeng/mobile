define(function(){
	return	function canvas(canvas,atlas) {
		canvas.width = canvas.parentNode.clientWidth; 
		canvas.height = canvas.parentNode.clientHeight; 
		if (!canvas.getContext) { 
			console.log("Canvas not supported. Please install a HTML5 compatible browser."); 
			return;
		} 
		var x = canvas.width*1.5,
			y = -canvas.width*0.5;
		var clear;
		var judge = 0;
		var moveOrder = 0;
		var ctx = canvas.getContext("2d"); 
		ctx.fillStyle="#f4ebd8"; 
		ctx.fillRect(0, 0, canvas.width, canvas.height); 
		var intactatlas=atlas.slice(0);
		var imgArray=[];
		function atlasCount(){
			imgArray=[];
			for(var key in atlas){
				if(navigator.appName.indexOf("Microsoft Internet Explorer")==-1){
					var myImage = document.createElement('img'); 
					myImage.src = atlas[key];
					myImage.data = key; 
					myImage.rotate = -(atlas.length-1)/5+key/5;
				}else{
					var myImage = document.createElement('<img src='+atlas[key]+' rotate='+(-(atlas.length-1)/5+key/5)+' data='+atlas[key]+'>'); 
				}
				imgArray.push(myImage);
				
			}
		}
		atlasCount()
		for (var i = 0; i < imgArray.length; i++) {
			imgArray[i].onload=function(){
				judge++;
				if(judge == imgArray.length){
					loadedmove();
				}
			}
		};
		window.requestAFrame = (function () {
			return  window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					function (fn) {
						return window.setTimeout(fn, 1000/60); 
					};
		})();
		function loadedmove(){
			redraw();
			if(clear){
				return false;
			}
			requestAFrame(loadedmove);
			// setTimeout( loadedmove, 5); 
		}
		function fixation(i){
			ctx.stroke();
			ctx.save();
			ctx.translate(canvas.width/2, canvas.height/2);
			//alert(imgArray[i].rotate)
			ctx.rotate(imgArray[i].rotate);
			ctx.scale(1, 1);
		    ctx.translate(-canvas.width/2*.8, -canvas.height/2*.8);
			ctx.drawImage(imgArray[i], 0, 0,imgArray[i].width,imgArray[i].height,0,0,canvas.width*.8,canvas.height*.8); 
			ctx.restore();
		}
		function redraw(){
			ctx.clearRect(-200, -200, 5000, 5000) ;
			for (var i = 0; i < moveOrder; i++) {
				fixation(i)
			};
			ctx.stroke();
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(imgArray[moveOrder].rotate);
			ctx.scale(1, 1);
		    ctx.translate(-canvas.width/2*.8, -canvas.height/2*.8);
			ctx.drawImage(imgArray[moveOrder], 0, 0,imgArray[moveOrder].width,imgArray[moveOrder].height,0,0,canvas.width*.8,canvas.height*.8); 
			ctx.restore();
			if(x > canvas.width/2){
			 	x = x-30;
			 	y = y+30;
			}else{
				if(moveOrder < imgArray.length-1){
					moveOrder++;
					x = canvas.width*1.5,
					y = -canvas.height*0.5;
				 	arguments.callee();
				}else{
					ctx.clearRect(-200, -200, 5000, 5000) ;
					for (var i = 0; i < imgArray.length; i++) {
						fixation(i)
					};
					clear=1;
					canvas.addEventListener('mousedown', altasstartHandler);
					canvas.addEventListener('touchstart', altasstartHandler);
					canvas.addEventListener('mousemove', altasmoveHandler);
					canvas.addEventListener('touchmove', altasmoveHandler);
					canvas.addEventListener('mouseup', altasendHandler);
					canvas.addEventListener('touchend', altasendHandler);
				}
			}
		}
		var altasstartHandler = function(e){
			window.startY = e.touches ? e.touches[0].pageY : e.pageY;
			window.startX = e.touches ? e.touches[0].pageX : e.pageX;
		}
		var altasmoveHandler = function(e){
			e.stopPropagation();
			e.preventDefault();
			window.offsetX =e.touches?(e.targetTouches[0].pageX - window.startX):(e.pageX-window.startX);
		}
		var altasendHandler = function(e){
			if(Math.abs(window.offsetX) > 10 && imgArray[0]){
				ctx.clearRect(-200, -200, 5000, 5000);
				if(imgArray.length < 2){
					atlas = intactatlas.slice(0);
				} else{
					atlas.unshift(atlas.pop(1))
				}
				atlasCount();
				var thejudge = 0;
				for (var i = 0; i < imgArray.length; i++) {
					imgArray[i].onload=function(){
						thejudge++;
						if(thejudge == imgArray.length){
							for (var i = 0;  i < imgArray.length; i++) {
								fixation(i)
							};
						}
					};
				};
			}else{

			}
		}
	}
}) 