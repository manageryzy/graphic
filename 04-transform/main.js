define(function(require, exports, module) {
    
    var canvas = document.getElementById('mainCanvas');
    var gl = canvas.getContext("webgl");

    // vertex array for the star model
    var vertices = [];
    var color = [];
    
    // uniform vars in shader
    var shaderPM ,
    shaderMVM ,
    shaderTime ,
    shaderResolution ;

    function init(){
        initShaders();
        resize(canvas);
        initModel();
        
        gl.enable(gl.DEPTH_TEST);
    }

    function initModel() {
        vertices = [];
        color = [];
        
        var LONG_EDGE = 1.0;
        var SHORT_EDGE = 0.4;
        
        var scale = 1.0;
        var rotate = 0.0;
        var transX = 0.0;
        var transY = 0.0;
        
        var lastX = 0.0;
        var lastY = 0.0;
        for(var i=0;i<11;i++){
            var x = Math.cos(i*0.2*Math.PI + rotate);
            var y = Math.sin(i*0.2*Math.PI + rotate);
            
            if(i%2){
                x*=LONG_EDGE;
                y*=LONG_EDGE;
            }else{
                x*=SHORT_EDGE;
                y*=SHORT_EDGE;
            }
            
            x *= scale;
            y *= scale;
            
            x += transX;
            y += transY;
            
            vertices.push(0.0,0.0,0.0);
            vertices.push(lastX,lastY,0.0);
            vertices.push(x,y,0.0);
            lastX = x;
            lastY = y;
            
            if(i==0){
                vertices = [];
                continue;
            }
            
            color.push(Math.random(),Math.random(),Math.random());
            color.push(Math.random(),Math.random(),Math.random());
            color.push(Math.random(),Math.random(),Math.random());
        }
        
        starVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, starVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
        colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    }
    
    var time = 0.0;

    // draw the sence one time
    function doDraw(e) {
        var mv = mat4.create();
        var pv = mat4.create();
        
        mat4.translate(mv,mv,[e.getX(),e.getY(),0.0]);
        mat4.scale(mv,mv,[e.getSizeX(),e.getSizeY(),1.0]);
        mat4.rotateZ(mv,mv,e.getRotate());
        
        gl.uniformMatrix4fv(shaderMVM,false,mv);
        gl.uniformMatrix4fv(shaderPM,false,pv);
        
        gl.uniform1f(shaderTime,time);
       
        gl.bindBuffer(gl.ARRAY_BUFFER, starVerticesBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderColor, 3, gl.FLOAT, false, 0, 0);
        
        gl.drawArrays(gl.TRIANGLES, 0, 30);
        
    }
    
    function clear(){
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    }
    
    function finish(){
        gl.finish();
        time+=0.005;
    }


    //init shader program
    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        // Create the shader program

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        gl.useProgram(shaderProgram);

        vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        shaderColor = gl.getAttribLocation(shaderProgram, "shaderColor");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.enableVertexAttribArray(shaderColor);
        
        shaderPM = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderMVM = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderTime = gl.getUniformLocation(shaderProgram, "time");
        shaderResolution = gl.getUniformLocation(shaderProgram,"resolution");
    }

    //get shader from html dom
    function getShader(gl, id) {
        var shaderScript, theSource, currentChild, shader;

        shaderScript = document.getElementById(id);

        if (!shaderScript) {
            return null;
        }

        theSource = "";
        currentChild = shaderScript.firstChild;

        while (currentChild) {
            if (currentChild.nodeType == currentChild.TEXT_NODE) {
                theSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            // Unknown shader type
            return null;
        }

        gl.shaderSource(shader, theSource);

        // Compile the shader program
        gl.compileShader(shader);

        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    //init the canvas display size 
    function resize(canvas) {
        // Lookup the size the browser is displaying the canvas.
        var displayWidth  = canvas.clientWidth;
        var displayHeight = canvas.clientHeight;
        
        // Check if the canvas is not the same size.
        if (canvas.width  != displayWidth ||
            canvas.height != displayHeight) {
        
            // Make the canvas the same size
            canvas.width  = displayWidth;
            canvas.height = displayHeight;
        }
        
        len = displayWidth<displayHeight?displayWidth:displayHeight;
        
        gl.uniform2f(shaderResolution,len,len);
        
        gl.viewport(0, 0, len, len);
    }
    
    module.exports.init = init;
    module.exports.doDraw = doDraw;
    module.exports.finish = finish;
    module.exports.clear = clear;
});
