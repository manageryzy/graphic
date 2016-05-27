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
    function doDraw(Element) {
        
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


    // Returns a transformation matrix as a flat array with 16 components, given:
    // ox, oy, oz: new origin (translation)
    // rx, ry, rz: rotation angles (radians)
    // s: scaling factor
    // d: distance between camera and origin after translation,
    //     if d &lt;= -n skips projection completely
    // f: z coordinate of far plane (normally positive)
    // n: z coordinate of near plane (normally negative)
    // ar: aspect ratio of the viewport (e.g. 16/9)
    // exz: if true exchanges X and Z coords after projection
    function getTransformationMatrix(ox, oy, oz, rx, ry, rz, s, d, f, n, ar, exz)
    {
    // Pre-computes trigonometric values
    var cx = Math.cos(rx), sx = Math.sin(rx);
    var cy = Math.cos(ry), sy = Math.sin(ry);
    var cz = Math.cos(rz), sz = Math.sin(rz);
    
    // Tests if d is too small, hence making perspective projection not possible
    if (d != -n)
    {
        // Transformation matrix without projection
        return new Float32Array([
        (cy*cz*s)/ar,cy*s*sz,-s*sy,0,
        (s*(cz*sx*sy-cx*sz))/ar,s*(sx*sy*sz+cx*cz),cy*s*sx,0,
        (s*(sx*sz+cx*cz*sy))/ar,s*(cx*sy*sz-cz*sx),cx*cy*s,0,
        (s*(cz*((-oy*sx-cx*oz)*sy-cy*ox)-(oz*sx-cx*oy)*sz))/ar,
        s*(((-oy*sx-cx*oz)*sy-cy*ox)*sz+cz*(oz*sx-cx*oy)),
        s*(ox*sy+cy*(-oy*sx-cx*oz)),1    
        ]);
    }
    else
    {
        // Pre-computes values determined with wxMaxima
        var A=d;
        var B=(n+f+2*d)/(f-n);
        var C=-(d*(2*n+2*f)+2*f*n+2*d*d)/(f-n);
        
        // Tests if X and Z must be exchanged
        if(!exz)
        {
        // Full transformation matrix
        return new Float32Array([
            (cy*cz*s*A)/ar,cy*s*sz*A,-s*sy*B,-s*sy,
            (s*(cz*sx*sy-cx*sz)*A)/ar,s*(sx*sy*sz+cx*cz)*A,cy*s*sx*B,cy*s*sx,
            (s*(sx*sz+cx*cz*sy)*A)/ar,s*(cx*sy*sz-cz*sx)*A,cx*cy*s*B,cx*cy*s,
            (s*(cz*((-oy*sx-cx*oz)*sy-cy*ox)-(oz*sx-cx*oy)*sz)*A)/ar,
            s*(((-oy*sx-cx*oz)*sy-cy*ox)*sz+cz*(oz*sx-cx*oy))*A,
            C+(s*(ox*sy+cy*(-oy*sx-cx*oz))+d)*B,s*(ox*sy+cy*(-oy*sx-cx*oz))+d
        ]);
        }
        else
        {
        // Full transformation matrix with XZ exchange
        return new Float32Array([
            -s*sy*B,cy*s*sz*A,(cy*cz*s*A)/ar,-s*sy,
            cy*s*sx*B,s*(sx*sy*sz+cx*cz)*A,(s*(cz*sx*sy-cx*sz)*A)/ar,cy*s*sx,
            cx*cy*s*B,s*(cx*sy*sz-cz*sx)*A,(s*(sx*sz+cx*cz*sy)*A)/ar,cx*cy*s,
            C+(s*(ox*sy+cy*(-oy*sx-cx*oz))+d)*B,s*(((-oy*sx-cx*oz)*sy-cy*ox)*sz+cz*(oz*sx-cx*oy))*A,
            (s*(cz*((-oy*sx-cx*oz)*sy-cy*ox)-(oz*sx-cx*oy)*sz)*A)/ar,s*(ox*sy+cy*(-oy*sx-cx*oz))+d
        ]);
        }
    }
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
