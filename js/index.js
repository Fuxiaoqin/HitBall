var progress = 0;
var batteryImg = new Image();
var balloonImgs = [new Image(),new Image(),new Image(),new Image(),new Image()];
var bullImg = new Image();
var bombBallImg = [new Image(),new Image(),new Image(),new Image(),new Image()];
var towerImgs = [new Image(),new Image()];

downloadImg()//加载canvas动画所需图片
function downloadImg(){
    batteryImg.src = 'images/battery.png';
    batteryImg.onload = function(){
        progress += 6;
        preLoading('stressing')
    };
    towerImgs[0].src = 'images/tower1.png';
    towerImgs[0].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    towerImgs[1].src = 'images/tower2.png';
    towerImgs[1].src.onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    bombBallImg[0].src = 'images/explosionBubble1.png';
    bombBallImg[0].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    bombBallImg[1].src = 'images/explosionBubble2.png';
    bombBallImg[1].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    bombBallImg[2].src = 'images/explosionBubble3.png';
    bombBallImg[2].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    bombBallImg[3].src = 'images/explosionBubble4.png';
    bombBallImg[3].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    bombBallImg[4].src = 'images/explosionBubble5.png';
    bombBallImg[4].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    bullImg.src = 'images/bullet.png';
    bullImg.onload = function(){
        progress +=  6;
        preLoading('stressing')
    };
    
    balloonImgs[0].src = 'images/Bubble1.png';
    balloonImgs[0].onload = function(){
        progress+6; 
        preLoading('stressing')
    };
    balloonImgs[1].src = 'images/Bubble2.png';
    balloonImgs[1].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    balloonImgs[2].src = 'images/Bubble3.png';
    balloonImgs[2].onload = function(){
        progress += 6; 
        preLoading('stressing')
    };
    balloonImgs[3].src = 'images/Bubble4.png';
    balloonImgs[3].onload = function(){
        progress += 6; 
        preLoading('stressing')
        
    };
    balloonImgs[4].src = 'images/Bubble5.png';
        balloonImgs[4].onload = function(){
            progress += 16; 
            preLoading('stressing')
            
        };
    }      

//判断页面是否加载完毕
function preLoading(id, fn){
    if (progress==100) {finish(fn);};
    document.onreadystatechange = function(){
        if(document.readyState == 'complete'|| document.readyState == 'loaded'){
            finish(fn);
        }
    }
    function finish(fn){
      setTimeout(function(){
        document.getElementById(id).style.display = 'none'; 
        $('html,body').css({
          height: 'auto',
          overflow: 'auto'
        });
        if( fn ){
          fn();
        }
      },1000);
    }

  $('#' + id).on('touchstart', function(){
    return false;
  });
}

var cavs = $('#canvas').get(0);
var ctx = cavs.getContext('2d'); 
var canvasW = 0;
var canvasH = 0;
$(window).resize(function(){
    hitBallGame.init();
    hitBallGame.getActData();
})
var hitBallGame = {
    timer:null,//动画引擎的计数器
    bulls:null,//子弹集合
    bull:null,//单颗子弹
    battery:null,//炮台
    ball:null,//单个气球
    balls:null,//气球集合
    tower1:null,
    tower2:null,
    ballList:0,
    residueDegree:2,
    bIndex:0,
    //获取活动相关信息//跳转分享页面
    getActData:function(){  
        $.getJSON(_ACTHOST+'/challenge/Draw/actInfo?callback=?',json,function(data){
            if(data.code!=200){//活动未开始、不存在、参数异常
                msgTip('.common_tip',data.msg);
            }
            if(data.data&&data.data.state == -1){//活动已结束，页面底部提示
                $('.page_1_foot').css('display', 'block'); 
            }
            if(data.data){
                $('title').text(data.data.title);
            }
            // shareFun(data.data);
        })
    },
    getParticipant:function(){
        //获取后台接口 获取参与人数
        getParticipant('/challenge/Draw/pv', json,'.peopleCount');
    },
    init:function(){
        canvasW = document.documentElement.clientWidth * 2;
        canvasH = canvasW * 1.02;
        cavs.width = canvasW;
        cavs.height = canvasH;
        cavs.style.width = canvasW/2+'px'; 
        cavs.style.height = canvasH/2+'px'; 
        var me = this;
        me.battery = new me.Battery(batteryImg);
        me.tower1 = new me.Towers(towerImgs[0],0);
        me.tower2 = new me.Towers(towerImgs[1],1);
        me.balls = new me.ballList();
        me.bulls = new me.bullList();
        me.startEngine();  
    },
    startEngine:function(){
        var me = this;
        me.battery = new me.Battery(batteryImg);
        this.timer = setInterval(function(){
            me.timerFun();  
        },15)  
    },
    timerFun:function(){ 
        var me = this;
        ctx.clearRect(0,0,canvasW,canvasH);            
        me.tower2.draw();
        me.balls.draw();
        me.battery.draw();
        me.bulls.draw();
        me.bulls.move();
        me.tower1.draw();
        me.balls.move();  
    },
    Battery:function(img){//炮台的构造方法
        var me = hitBallGame;
        this.width = canvasW/25 * 4;
        this.height = canvasW/25 * 5.4
        this.x = canvasW/2-this.width/2;
        this.y = canvasH-this.height * 1.6;
        this.draw = function(){
            ctx.drawImage(img,this.x,this.y,this.width,this.height); 
        }
        cavs.addEventListener('click', me.batteryClickFun);
    },
    batteryClickFun:function(e){
        var me = hitBallGame;
        var e = event || window.event;
        var canvX = Math.floor(e.pageX - cavs.offsetLeft) * 2;
        var canvY = Math.floor(e.pageY - cavs.offsetTop) * 2;
        if(   canvX >= me.battery.x
            &&canvX <= me.battery.x + me.battery.width
            &&canvY >= me.battery.y
            &&canvY <= me.battery.y + me.battery.height ){
            // if($_GET('shareType') == 1){
            //     msgTip('.common_tip','需要下载登录');
            //     window.location.href = href;
            //     return true;
            // }
            $.getJSON(_ACTHOST + '/challenge/Draw/times?callback=?', json, function(data){
                data.code = 200;//测试
                if(data.code == 401){
                    window.location.href = 'https://hxsapp_showloginpage';
                    return;
                }
                $('.hint').css({
                    'display':'none'
                });
                if(data.code == 200){
                    // hitBallGame.residueDegree = data.data.times;
                    me.residueDegree = 3;//测试
                    if( me.residueDegree == 0){
                        msgTip('.common_tip','今日机会已用完'); 
                        return;
                    }
                    me.bull = new me.Bull(bullImg, me.battery.x, me.battery.y);
                    me.bulls.add(me.bull);
                    cavs.removeEventListener('click',me.batteryClickFun);
                }
                else{
                   msgTip('.common_tip', data.msg); 
                   return;
                }
            })     
        }
    },
    Towers:function(img,n){//基台的构造方法
        var me = hitBallGame;
        this.width = canvasW/25 * 4;
        this.height = canvasH/25 * 1;
        this.x = canvasW/2 - this.width/2;
        this.y = 
                n == 0 ? canvasW - this.height * 3.4
                :canvasW - this.height  *  3.5;
        this.draw = function(){
            ctx.drawImage(img,this.x,this.y,this.width,this.height);
        }
    },
    Bull:function(img, x, y){//每一颗子弹的构造方法
        var me = hitBallGame;
        this.width = canvasW/25;
        this.height = canvasW/25;
        this.x = canvasW/2 - this.width/2.2;
        this.y = canvasH - canvasH * .14 - canvasW/25 * 5.4;
        this.speed = 10;
        this.removable = false; //子弹可用从画布上移除了吗 
        this.draw = function(){
            ctx.drawImage(img, this.x, this.y, this.width, this.height); 
        }
        this.move = function(){
            this.y -= this.speed;
            if(this.y < -this.height){ //子弹已经飞出了画布
                this.removable = true; //可以删除了
                clearInterval(me.timer);
                me.timer = null;
                me.balls.removable = true;
                $('.can_frame h1').html('很遗憾')
                $('.can_frame p:eq(0)').html('未戳中');
                if(me.residueDegree == 2){
                    $('.can_frame p:eq(1)').html('再接再厉')
                }
                if(me.residueDegree == 1){
                    $('.can_frame p:eq(1)').html('明天继续加油')
                }
                $('.cannot_backbtn').css('display','none')
                setTimeout(function(){
                    hitBallGame.popClose('.can_frame');
                }, 100);
                return;
            }  
         
                   
        }
    },
    bullList:function(){//子弹集合
        this.list = [];//保存当前需要绘制的所有子弹
        var me = hitBallGame;
        this.add = function(){//向列表中添加子弹
            this.list.push( me.bull );
        }
        this.draw = function(){
            for(var i = 0; i < this.list.length; i++){
                this.list[i].draw(); //绘制每一个子弹
            }
        }
        this.move = function(){
            for(var i = 0;i < this.list.length; i++){
                if(this.list[i].removable){//某颗子弹可被删除
                    this.list.splice(i,1); //删除数组中移出的子弹
                    i--;  //删除一个，后续下标就是当前元素的下标
                    return;
                }
                var bull = this.list[i];  //一颗子弹
                for(var j = 0;j < hitBallGame.balls.list.length;j++){
                    var ball = hitBallGame.balls.list[j]; //一个气球
                    if( //碰撞条件
                        ball.x + ball.width >= bull.x * 1.2
                        &&
                        bull.x + bull.width >= ball.x
                        &&
                        ball.y + ball.height * .5 >= bull.y
                        &&
                        bull.y + bull.height >= ball.y
                    ){
                        clearInterval(me.timer);
                        me.timer = null;
                        me.bIndex = j;
                        bull.removable = true;
                        var x = ball.x * .95;
                        var y = ball.y;
                        var w = j == 3 ? canvasW/25 * 8
                               :j == 4 || j == 2 ? canvasW/25 * 6
                               :j == 0 || j == 1 ? canvasW/25 * 7
                               :canvasW/25 * 5;
                        var h = canvasW/25 * 9.5;
                        if(me.residueDegree == 2 ){
                            var bombList1 = me.deepClone(me.balls);
                            bombList1.list.splice(me.bIndex, 1, new me.Ball(bombBallImg[me.bIndex], w, h, x, y, true, 1))
                            ctx.clearRect(0, 0, canvasW, canvasH);
                            me.tower2.draw();
                            me.battery.draw();
                            me.tower1.draw();
                            for(var k = 0;k < bombList1.list.length;k++){
                                    bombList1.list[k].draw();
                            }
                        }
                        else if(me.residueDegree == 1 ){
                            var bombList2 = me.deepClone(me.balls);
                            bombList2.list.splice(me.bIndex,1,new me.Ball(bombBallImg[me.bIndex],w,h,x,y,true,1));
                            ctx.clearRect(0,0,canvasW,canvasH);
                            me.tower2.draw();
                            me.battery.draw();
                            me.tower1.draw();
                            for(var k = 0;k<bombList2.list.length;k++){
                                bombList2.list[k].draw();
                            }
                        }
                        me.balls.removable = true;
                        //请求后台接口获取 获取中奖名单
                        $.getJSON(_ACTHOST + '/challenge/Draw/shoot?callback=?',json,function(data){
                            $('.can_frame h1').html(data.msg.head)
                            $('.can_frame p:eq(0)').html(data.msg.title);
                            $('.can_frame p:eq(1)').html(data.msg.tip)
                            if(data.code == 608){
                                $('.cannot_backbtn').css('display','none')
                            }
                            else{
                                $('.cannot_backbtn').css('display','block')
                            }
                            setTimeout(function(){
                                me.popClose('.can_frame');
                            },100);
                            return;
                        })  
                    }
                }
                this.list[i].move(); 
            }
        }   
    },
    deepClone:function(obj){
        var result,oClass=hitBallGame.isClass(obj);
            //确定result的类型
        if(oClass === "Object"){
            result={};
        }else if(oClass === "Array"){
            result=[];
        }else{
            return obj;
        }
        for(key in obj){
            var copy = obj[key];
            if(hitBallGame.isClass(copy) == "Object"){
                result[key] = arguments.callee(copy);//递归调用
            }else if(hitBallGame.isClass(copy) == "Array"){
                result[key] = arguments.callee(copy);
            }else{
                result[key] = obj[key];
            }
        }
        return result;
    },
    isClass:function(o){
        if(o === null) return "Null";
        if(o === undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8,-1);
    },
    Ball:function(img,w,h,x,y,remove,n){//每一个气球的构造方法
        var me = hitBallGame;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.moveN = n;
        this.stepX = 1;
        this.stepY = .5;
        this.removable = remove;
        this.movecount = 0;
        this.draw = function(){
            ctx.drawImage(img,this.x,this.y,this.width,this.height);  
        }
        this.move = function(){  
            if(this.removable){
                return;
            }  
            this.movecount++;
            this.moveN++;
            // if(this.movecount%3==0){
                this.stepX = 
                    this.x > canvasW - this.width || this.x < 0 || this.moveN<50 
                    ? -this.stepX
                    :this.stepX;
                this.stepY = 
                    this.y > canvasH/25 * 4 || this.y < 0
                    ? -this.stepY 
                    : this.stepY;
                this.x += this.stepX;
                this.y += this.stepY; 
                this.movecount = 0;
            // }
        }
    },
    ballList:function(){//气球集合
        var me=hitBallGame;
        this.list = [
            new me.Ball(balloonImgs[0],canvasW/25 * 4,canvasW/25 * 8,canvasW/25 * 2,canvasW/50 * 2,false,10),
            new me.Ball(balloonImgs[1],canvasW/25 * 4,canvasW/25 * 8,canvasW/25 * 10,canvasW/50 * 1,false,1),
            new me.Ball(balloonImgs[2],canvasW/25 * 4,canvasW/25 * 8,canvasW/25 * 19,canvasW/50 * 2,false,1),
            new me.Ball(balloonImgs[3],canvasW/25 * 4,canvasW/25 * 8,canvasW/25 * 6,canvasW/50 * 8,false,10),
            new me.Ball(balloonImgs[4],canvasW/25 * 4,canvasW/25 * 8,canvasW/25 * 14,canvasW/50 * 8,false,1),
        ]; 
        this.draw = function(){
            for(var i = 0; i < this.list.length; i++){
                this.list[i].draw();
                if(this.list[i].removable){//某一个气球可被删除
                    return;
                }
            }   
        }
        this.move = function(){
            // //移动每一个气球消失
            for(var i=0;i<this.list.length;i++){
                var e =this.list[i];
                if(e.removable){//某一个气球可被删除
                    return;
                }
                e.move();//移动每一个气球 
            }
        }
    },
    //弹出框公用方法
    popupFun:function(sel){
        $('.frame').fadeIn(0);
        $(sel).fadeIn(0);
        $(sel).css('animation','bounceIn .8s 1 linear');
        $('body').on('touchmove', prevent);
    },
    //按钮关闭方法 
    closeBtn:function(sel){
        $('.frame').fadeOut(200);
        $('.child_frame').fadeOut(200);
        $('body').off('touchmove', prevent);   
    },
    bindClose:function(sel){
        $(sel).on('click',function(){
            hitBallGame.closeBtn();
            hitBallGame.startEngine();
            cavs.addEventListener('click',hitBallGame.batteryClickFun);
        });
    },
    bindCloseBtn:function(){
        hitBallGame.bindClose('.close_btn');
        hitBallGame.bindClose('.cannot_backbtn');
    },
    //复用弹出框和关闭框方法
    popClose:function(sel){
        hitBallGame.popupFun(sel);
        hitBallGame.bindCloseBtn();
    },
    hintFun:function(){
        $('.hint').css({
            'animation':'scale 2.1s infinite'
        });
    }
}
window.onload = function(){
    if(UA.indexOf('OPPO R9') != -1){
        $('.index_warp').css('height','64rem')
    };
    if(UA.indexOf('M5') != -1){
        $('.index_warp').css('height','62rem')
    };
    init();
    hitBallGame.getActData();
    hitBallGame.getParticipant();
    hitBallGame.init();
    hitBallGame.hintFun();
}
function prevent (e) {
　　e.preventDefault();
}