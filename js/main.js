(function(){
	$(".swiper-wrapper,.pagination").remove();
	var tempHtml,
		contentSting;
	if(window.data.storyMusic && window.Audio){
		var audio = new Audio();
		audio.src = window.data.storyMusic;
		audio.id = "media";
		// audio.autoplay= "true";
		audio.preload=true;
		audio.loop=10000;
		var music = '<div id="audio_btn" class="video_exist play_yinfu off" style="display: block;">'+
			    		'<div id="yinfu" class=""></div>'+
			    	'</div>';
		$("#wrapper").before(music);
		$('#audio_btn').append(audio);
		
		$("#audio_btn").on("click",function(){
			if( audio.paused ){
				audio.play();
				$(this).removeClass("off");
				$("#yinfu").addClass("rotate");
			}else{
				audio.pause();
				$(this).addClass("off");
				$("#yinfu").removeClass("rotate");
			};
		}).trigger("click");
	}
	if(window.data.comment&&!$(".phoneContent").length){
		var alertsHtml ='<div class="popup popup-alert" style="display: block;">' +
						 '<div class="ui-confirm clearfix">'+
						 '   <h1 class="ui-confirm-title">温馨提示</h1>'+
						 '  <p class="ui-input popup-dialog"></p>'+
						 '</div>'+
					'</div>';
		function alerts(cont){
			//var orientation = window.orientation;
			var show=function(){
				$(".popup").remove();
				if(!$("body .popup").length){$("body").append(alertsHtml)};
				$(".popup-dialog").html(cont);
				$(".ui-confirm-submit");
				$(alertsHtml).remove();
				$("html").addClass("popup-overflow");
				$(window).height()>$(".ui-confirm").height() ? $(".ui-confirm").css("top", ($(window).height()-$(".ui-confirm").height())/2) : $(".ui-confirm").css("top",0);
				$(".ui-confirm-submit").on("click",function(){
					$(".popup").remove();
					clearInterval(showInterval);
				});
		 	}
			show();
			var showInterval = setInterval(function(){
				 $(window).height()>$(".ui-confirm").height() ? $(".ui-confirm").css("top", ($(window).height()-$(".ui-confirm").height())/2) : $(".ui-confirm").css("top",0);
			},200);
		}	
		var talkHtml = '<div id="talk_btn"></div>',
			talkContent = 	'<div class=" talkContent">'+
								'<div class="dumb" id="dumb"></div>'+
								'<div class="commentTitle">评论(0)</div>'+
								'<div class="commentWrap"></div>'+
								'<div class="commentBtm">'+
									'<input type="text" class="commentInput" id="commentInput" placeholder="发表自己的看法">'+
									'<div class="commentSubmit" id="commentSubmit">提交</div>'+
								'</div>'+
							'<div>';

		$("#wrapper").before(talkHtml);
		$("#wrapper").before(talkContent);
		if($('#audio_btn').length){
			$('#audio_btn').addClass("rightKm")
		}
		$("#talk_btn").on("click", function(){
			$(".talkContent").addClass("rightShow");
		});
		$("#dumb").on("click",function(){
			$(".talkContent").removeClass("rightShow");
		});


		//加载评论
		var toPage = 1,
			fileuuid = $("#fileuuid").val();
		var loadComment=function(){
			$.ajax({
				url:"http://comment.home.news.cn/a/newsCommAll.do?callback=?&newsId="+fileuuid+"&pgSize=10&pid="+toPage,
				dataType:"jsonp",
				success:function(data){
					var commentHtml='';
					if(!data.contentAll.length){
						$(".commentWrap").unbind("scroll")
						return;
					}
					for (var i=0; i<data.contentAll.length; i++) {
						commentHtml+='<div class="comment-list clearfix">'+
									'	<img src="'+data.contentAll[i].userImgUrl+'">'+
									'	<div class="comment-word">'+
									'		<p class="user-name">'+data.contentAll[i].nickName+'</p>'+
									'		<p class="words">'+data.contentAll[i].content+'</p>'+
									'	</div>'+
									'</div>';
					};
					$(".commentWrap").append(commentHtml);
					$(".commentTitle").html("评论("+data.totalRows+")")
					toPage++;
				}
			})
		}
		loadComment();
		$(".commentWrap").bind("scroll",function(){
			var scrollTop = $(".commentWrap")[0].scrollTop,
				scrollHeight = $(".commentWrap")[0].scrollHeight,
				offsetHeight = $(".commentWrap")[0].offsetHeight;
			if(scrollTop&&scrollTop == scrollHeight - offsetHeight){
				loadComment();
			}
		});

		//发表评论
		$(".commentSubmit").on("click",function(){
			var textareaValue=commentInput.value;
			if(textareaValue){
				var formData={
					newsId:fileuuid.length==32 ? "2-"+fileuuid : "1-"+fileuuid,
					content:textareaValue
				}
				$.ajax({
					url:"http://xuan.news.cn/a/adComment.do",
					type:"post",
					data:formData,
					success:function(data){
						alerts("发表成功");
						commentInput.value="";
					}
				})
			}
		})
	}


	for(var i = 0; i<window.data.content.length; i++){
		for(var key in models){
			if(key == window.data.content[i].modelType){
				var temp = models[key].temp,
					tempData = window.data.content[i];
				if(tempData.content.match("/n")){
					var contentArr = tempData.content.split("/n");
						contentArrP = [];
					for(var j = 0; j< contentArr.length; j++){
						contentArrP.push("<p>"+contentArr[j]+"</p>");
					}
					contentSting = contentArrP.join("");
				}else{
					contentSting = tempData.content;
				}
			    tempHtml = temp.replace(/[{]{2,3}(\w+)[}]{2,3}/g, function(mat, key){
			    	return key === "content" ? contentSting : tempData[key];
			    });
			}
		}
		$(tempHtml).appendTo("#wrapper");
		var container=$("section");
		container.addClass('swiper-slide');
	}
	
	(function(){
		//图集
		var scripts = document.getElementsByTagName('script'),
			_src = scripts[scripts.length-1].src;
		require.baseUrl = _src.replace(/\/[^\/]*$/, '');
		var paths = {
			Imgstack : "imgstack",
			atlas_canvas1 :'atlas_canvas1'
		};
		require.config({
			baseUrl : require.baseUrl,
			urlArgs: 'v=1.3',
			paths: paths
		});

		//算法图集
		require(['Imgstack'],function(Imgstack){
			if($('.atlas1Cont').length){
				$('.atlas1Cont').each(function(){
					var loaded = 0;
					var _this = this;
					var alertsData = [
							"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M06/A9/77/wKhTglUTv4oEAAAAAAAAAAAAAAA925.jpg",
							"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M08/A9/28/wKhTglUToQgEAAAAAAAAAAAAAAA837.jpg",
							"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M01/A9/A0/wKhTg1UTq-EEAAAAAAAAAAAAAAA373.jpg"
						];
					var atlas1Html="";
					for(var key in alertsData){
						atlas1Html += '<img class="alertsImg" src = "'+alertsData[key]+'">';
					}
					$(this).html("");
					$(this).append(atlas1Html);
			        
			        if($(this).parents().index() == 1){
				        // 效果加载回调
				        var imgs = $(this).children("img");
				        	length = imgs.length;
				       	imgs.on("load",function(e){
				            loaded++;
				            if( loaded == length ){
				               Imgstack({
						            holder: $(_this),
						            imgs: imgs
						        });
				            }
				        })
				    }
			        window.onload=function(){}
				})
			}
	 	});
		//canvas 图集
		require(['atlas_canvas1'],function(atlas_canvas1){
			if($('.atlas2Cont').length){
				$('section').each(function(i){
					if($('.atlas2Cont',$(this)).length){
						var id = 'animation_canvas'+i;
						$('.atlas2Cont canvas',$(this)).attr('id','animation_canvas'+i);
						var atlasData = [
							"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M06/A9/77/wKhTglUTv4oEAAAAAAAAAAAAAAA925.jpg",
							"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M08/A9/28/wKhTglUToQgEAAAAAAAAAAAAAAA837.jpg",
							"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M01/A9/A0/wKhTg1UTq-EEAAAAAAAAAAAAAAA373.jpg"
						];
						$('.atlas2Cont',$(this))[0].setAttribute('data',atlasData)
						console.log($('.atlas2Cont',$(this))[0].getAttribute('data'))
						$('.atlas2Cont img',$(this)).remove();
						if($('.atlas2Cont').parents().index() == 1){
							var animation_canvas = document.getElementById(id);
							atlas_canvas1(animation_canvas,atlasData)
						}
					}
				})
			}
		})
	})();
	

	if(!$(".phoneContent").length){
		$(".wrapper").on("click",'section ul img, .atlas1Cont img, .atlasList img',function(event){
			if(!$(this).hasClass("bgimg")){
				event.stopPropagation();
				if(!$(".mark").length){
					$('<div class="mark">'+'<img src='+this.src+'>'+'</div>').appendTo("body");
				}else{
					$(".mark").html("").show();
					$(".mark").append('<img src='+this.src+'>'+'</div>');
					
				}
				if($(this).height()/$(this).width() > $(window).height()/$(window).width()){
					$(".mark").addClass("stretch");
				}else{
					$(".mark").removeClass("stretch");
				}
			}
		});
	}

	$(document).on("click",".mark",function(event){
		event.stopPropagation();
		$(this).hide();
	})
	var Yhover= '<div class="u-arrow-bottom"></div>';
	$("section").each(function(){
		$(this).append(Yhover);
	})


	if(window.data.Thumb.match("X")){
		window.data.direction = "X";
		$(".u-arrow-bottom").addClass("l-arrow-bottom")
	}
	if(window.data.Thumb.match("Y")){
		window.data.direction = "Y";
	}
	if(window.data.Thumb.match("nocover") || $(".phoneContent").length){
		window.data.way = "nocover";
	}
	if(window.data.Thumb.match("cover") && !window.data.Thumb.match("nocover") && !$(".phoneContent").length){
		window.data.way = "cover";
	}
	if(window.data.autoplay==true){
		window.data.autoTime = 4000;
		window.data.speed = 600;
	}else{
		window.data.speed = 300;
	}
	$(".qrcode").attr("src",'http://xuan.news.cn/cloudapi/qrcode/pull.htm?content='+window.location.href.replace('pc','')+'&size=220')
	typeof(Worker) != "undefined" ? $(".pctip").html("强烈建议使用手机扫描右侧二维码，观看最佳效果。"):$(".pctip").html("您的浏览器版本太低，无法正常浏览，建议使用IE10以上浏览器观看。或使用手机扫描右侧二维码浏览。")	
	if(typeof(Worker)!= "undefined"&&navigator.appVersion.match(/10./i)!="10."){
		require(['spswiper'],function(spswiper){
			var obj = {
				outer : document.getElementById('wrapper'),
				section : 'section',
				direction : window.data.direction || "Y",
				way : window.data.way || "nocover",
				loop :window.autoplay||false,
				stopmove : ["alertsImg","animation_canvas"],
				container : "ul",
				looptime : window.data.autoTime || 5000,
				callback:function(currIndex){
					var _this = this,
						interval;
					_this.way == "cover" ? interval = 600 : interval = 200;
					setTimeout(function(){
							$('ul', $(_this.lis[currIndex]).siblings()).hide();
							$('.u-arrow-bottom', $(_this.lis[currIndex]).siblings()).hide();
							$('ul', $(_this.lis[currIndex])).show();
							$('.u-arrow-bottom', $(_this.lis[currIndex])).show();
							$(".atlas1Cont img").css({"left" :"100%",'top' :"100%","transform": "rotate(0deg)",
                    "-webkit-transform": "rotate(0deg)"});
							for(var i = 0; i < $('section').length; i++){
								if($('animation_canvas'+i, $('section').eq(i)).length){
									var animation_canvas = document.getElementById('animation_canvas'+i);
									var ctx = animation_canvas.getContext("2d"); 
									ctx.clearRect(-200, -200, 5000, 5000) ;
								}
							}
							
							var judge = $((_this).lis[currIndex]).children(".atlas1Cont");
							if(judge.length){
								require(["Imgstack"],function(Imgstack){
									var imgs = $((_this).lis[currIndex]).children(".atlas1Cont").children("img");
									 Imgstack({
							            holder: judge,
							            imgs: imgs
							        });
								})
							}
							var judge2 = $((_this).lis[currIndex]).children(".atlas2Cont");
							if(judge2.length){
								require(['atlas_canvas1'],function(atlas_canvas1){
									if($('.atlas2Cont').length){
										$('.atlas2Cont').each(function(){
											var loaded = 0;
											var _this = this;
											var atlasData = [
												"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M06/A9/77/wKhTglUTv4oEAAAAAAAAAAAAAAA925.jpg",
												"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M08/A9/28/wKhTglUToQgEAAAAAAAAAAAAAAA837.jpg",
												"http://tpic.home.news.cn/xhCloudNewsPic/xhpic001/M01/A9/A0/wKhTg1UTq-EEAAAAAAAAAAAAAAA373.jpg"
											];
											$('img',$(this)).remove();
											var animation_canvas = document.getElementById('animation_canvas'+currIndex);
											atlas_canvas1(animation_canvas,this.getAttribute('data').split(','))
										})
									}
								})
							}
					},interval)
				}
			} 
			var SPswiper = new spswiper(obj);
			$(".arrow-up").on("click",function(){
				SPswiper.goIndex('-1')
			});
			$(".arrow-down").on("click",function(){
				SPswiper.goIndex('+1')
			});
		})
	}else{
		$("section")[0].style.zIndex=100;
		$("#wrapper").append('<img id="ietip" src="images/ietip.png">')
	}
})();
	


