/**
 * 多图片效果
**/

define(function(require, exports, module){
    return function (opt) {
        var holder =opt.holder, 
            W = holder.width(),
            H = holder.height(),
            X = Math.max(W, H),
            imgs = opt.imgs;
        if( !imgs.length ){
            throw new Error("imgstack cannot run with no imgs");
        }
        for (var i = 0,len = imgs.length; i < len; i++) {
            (function(i, t){
                var d = Math.random(),
                    r = d * Math.PI * 2,
                    R = (d-.5) * 90 + 360 - (i%2) * 360, 
                    x1 = W * Math.sin(r) + W / 2,
                    y1 = H * Math.cos(r) + H / 2,
                    x2 = W * (.7*i/len) * Math.sin(r) / -2 + W / 3;
                    
                setTimeout( function(){
                    $(imgs[i]).css({
                        left: x1,
                        top: y1
                    }).show();
                    var y2 = imgs.eq(i).height() * (i/len) * Math.cos(r) / -2 + imgs.eq(i).height() ;
                    $(imgs[i]).css({
                        "transform": "rotate("+R+"deg)",
                        "-webkit-transform": "rotate("+R+"deg)",
                        left: x2,
                        top: y2,
                        'transition':'0.7s ease-out',
                        '-webkit-transition':'0.7s ease-out'
                    })
                    if(i==len-1){
                       setTimeout( function(){                                
                             $(".index-words").css("display","block");
                             $(".tukan-shade").css("display","block");
                       },1500)
                    }
                },400*t);
            })(i, i > 6 ? 6 : i);
        };

    }
})



