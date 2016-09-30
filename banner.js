/**
 * Created by jiangyh on 2016/9/29.
 */
var bannerScroll = function() {};
bannerScroll.prototype = {
    /**
     * 相关组件内部的全局属性配置
     */
    iParam:{
        containerId : '',   //父级容器的id，必选
        listId : '',        //下级容器的id，必选
        buttonsId : '',     //圆点Id
        prevId : '',        //prevId
        nextId : '',        //nextId
        isNext : true,      //是否需要有左右按钮
        isCircle : true,    //是否需要小圆点
        animated : false,   //是否在运动中
        index : 1,          //
        len : 5,            //图片的数量
        interval : 3000,    //自动滚动的时间间隔
        time : 300,         //一张图片运动的时间
        inter : 10 ,        //每次运动的时间
        timer : ''
    },

    init:function(){
        var banner = this;
        var buttonsId = banner.iParam.buttonsId;
        var buttons = document.getElementById(buttonsId).getElementsByTagName('span');
        var next = document.getElementById(banner.iParam.nextId);
        var prev = document.getElementById(banner.iParam.prevId);
        var container = document.getElementById(banner.iParam.containerId);
        var list = document.getElementById(banner.iParam.listId);

        //复制第一个和最后一个图片
        var d11 = list.getElementsByClassName('i1')[0];
        var d12 = d11.cloneNode();
        list.appendChild(d12);
        var d21 = list.getElementsByClassName('i5')[0];
        var d22 = d21.cloneNode();
        list.insertBefore(d22,d11);

        //计算高宽
        var leftWidth = banner.leftWidth();
        var imgPic = list.getElementsByTagName('img');
        list.style.left = -leftWidth + 'px';
        list.style.width =  (banner.iParam.len + 2)*leftWidth + 'px';
        for(var i =0; i < imgPic.length; i++){
            imgPic[i].style.width =  container.offsetWidth + 'px';
        }


        //生成小圆点html;
        if(banner.iParam.isCircle){
            var button = document.getElementById(buttonsId);
            var html = '';
            for(var i =0; i < banner.iParam.len; i++ ){
                html += '<span index='+ (i+1) +'></span>';
            }
            button.innerHTML = html;
            buttons[banner.iParam.index -1].className = 'on';
        }

        if(!banner.iParam.isNext){
            next.style.display = prev.style.display = 'none';
        }

        next.onclick = function(){
            banner.nextClick();
        };
        prev.onclick = function(){
            banner.prevClick();
        };

        for(var i = 0; i < buttons.length; i++){
            buttons[i].onclick = function(){
                if(banner.iParam.animated){
                    return;
                }
                if(this.className == 'on'){
                    return;
                }
                var myIndex = this.getAttribute('index');
                banner.animate(-(myIndex-banner.iParam.index)*leftWidth);
                banner.iParam.index = myIndex;
                if(banner.iParam.isCircle){
                    banner.showBtn();
                }
            }
        }

        banner.play();

        container.onmouseover = function(){
            banner.stop();
        };
        container.onmouseout = function(){
            banner.play();
        };

    },

    //计算高宽
    leftWidth:function(){
        var banner = this;
        var container = document.getElementById(banner.iParam.containerId);
//        var sWidth = document.documentElement.scrollWidth;   //页面的宽度
        var containerWidth = container.offsetWidth;
        return containerWidth;
    },

    showBtn: function(){
        var banner = this;
        var buttonsId = banner.iParam.buttonsId;
        var buttons = document.getElementById(buttonsId).getElementsByTagName('span');
        for(var i=0;i < banner.iParam.len;i++){
            buttons[i].className = '';
        }
        buttons[banner.iParam.index-1].className = 'on';
    },

    animate: function(offset){
        var banner = this;
        var list = document.getElementById(banner.iParam.listId);
        var leftWidth = banner.leftWidth();
        if(offset == 0){
            return;
        }
        banner.iParam.animated = true;
        var speed = offset/(banner.iParam.time/banner.iParam.inter);
        var left = parseInt(list.style.left) + offset;

        var go = function(){
            if((speed > 0 && parseInt(list.style.left) < left) || (speed < 0 && parseInt(list.style.left) > left)){
                list.style.left = parseInt(list.style.left) + speed + 'px';
                setTimeout(go,banner.iParam.inter);
            }else{
                list.style.left =  left + 'px';
                if(left < -leftWidth * (banner.iParam.len)){
                    list.style.left = -leftWidth + 'px';
                }
                if(left > -leftWidth){
                    list.style.left = -leftWidth * banner.iParam.len + 'px';
                }
                banner.iParam.animated = false;
            }
        };
        go();
    },

    nextClick: function(){
        var banner = this;
        var leftWidth = banner.leftWidth();
        if(banner.iParam.animated){
            return;
        }
        if(banner.iParam.index==5){
            banner.iParam.index=1;
        }else{
            banner.iParam.index++;
        }
        banner.animate(-leftWidth);
        if(banner.iParam.isCircle){
            banner.showBtn();
        }
    },

    prevClick: function(){
        var banner = this;
        var leftWidth = banner.leftWidth();
        if(banner.iParam.animated){
            return;
        }
        if(banner.iParam.index==1){
            banner.iParam.index=5;
        }else{
            banner.iParam.index--;
        }
        banner.animate(leftWidth);
        if(banner.iParam.isCircle){
            banner.showBtn();
        }
    },

    play: function(){
        var banner = this;
        banner.iParam.timer = setInterval(function(){
            banner.nextClick();
        },banner.iParam.interval);
    },

    stop: function(){
        var banner = this;
        clearInterval(banner.iParam.timer);
    }
};
