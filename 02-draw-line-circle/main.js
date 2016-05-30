var canvas =  document.getElementById('mainCanvas');

var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var buffer = ctx.createImageData(800,600);


function setPixel(x,y,r,g,b,a) {
    buffer.data[(x + y*800)*4]=r;
    buffer.data[(x + y*800)*4 + 1]=g;
    buffer.data[(x + y*800)*4 + 2]=b;
    buffer.data[(x + y*800)*4 + 3]=a;
}

function getPixel(x,y){
    var res = new Array();
    res[0] = buffer.data[(x + y*800)*4];
    res[1] = buffer.data[(x + y*800)*4 + 1];
    res[2] = buffer.data[(x + y*800)*4 + 2];
    res[3] = buffer.data[(x + y*800)*4 + 3];
    return res;
}

function clearBuffer(){
    buffer.data = new Uint8ClampedArray(800*600*4);
}

function updateScreen(){
    ctx.clearRect(0,0,800,600);
    ctx.putImageData(buffer,0,0);
}

//中点算法画线，我知道，这里有问题，斜率
function drawLine(x0,y0,x1,y1,r_,g_,b_,a_){
    var a,b,d1,d2,d,x,y; 
    
    a = y0-y1;
    b = x1-x0;
    d = 2*a + b; 
    d1=2*a,d2=2*(a+b); 
    x=x0,y=y0; 
    setPixel(x,y,r_,g_,b_,a_);
     
    while (x<x1) { 
        if (d<0) {    
            x++;
            y++;
            d+=d2;
        } 
        else {    
            x++;
            d+=d1;    
        } 
        setPixel(x,y,r_,g_,b_,a_); 
    } 
}

//中点算法画圆
function drawCircle(xc,yc,radius,r_,g_,b_,a_){
    var x, y, f;
 
     x = 0;
     y = radius;
     f = 0;
     while(x <= y)
     {
         setPixel(xc+x,xc+y,r_,g_,b_,a_);
         setPixel(xc+x,xc-y,r_,g_,b_,a_);
         setPixel(xc-x,xc+y,r_,g_,b_,a_);
         setPixel(xc-x,xc-y,r_,g_,b_,a_);
         setPixel(xc+y,xc+x,r_,g_,b_,a_);
         setPixel(xc+y,xc-x,r_,g_,b_,a_);
         setPixel(xc-y,xc+x,r_,g_,b_,a_);
         setPixel(xc-y,xc-x,r_,g_,b_,a_);
         if(f <= 0)
         {
             f = f + 2 * x + 1;
             x++;
         }
         else
         {
             f = f - 2 * y + 1;
             y--;
         }
     }
}

function init(){
    drawLine(10,20,100,200,255,0,0,255);
    drawCircle(50,50,20,0,255,0,255);
    updateScreen();
}


init();