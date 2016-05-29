// this is the file for the world and entity of the world.
// NOTICE:this simulation may have the diffuse issue. 
//I'm don't know the coverge condition

///<reference path="main.d.ts"/>

import main = require('main');// import the draw func

export class World{
    protected entityList:Array<Entity> = new Array<Entity>();
    
    addEntity(entity:Entity){
        this.entityList.push(entity);
        entity.setWorld(this);
        entity.enable(true);
    }
    
    getEntityList():Array<Entity>{
        return this.entityList;
    }
    
    tick(){
        //update the world
        for (var index = 0; index < this.entityList.length; index++) {
            var element = this.entityList[index];
            element.update();
        }
        
        main.clear();
        //draw the sence
        for (var index = 0; index < this.entityList.length; index++) {
            var element = this.entityList[index];
            main.doDraw(element);
        }
        
        main.finish();
    }
    
    constructor(){
        //start the game looper
        setInterval(()=>{
            this.tick();
        },50);
    }
}

export class Entity{
    protected x:number = 0;
    protected y:number = 0;
    protected speedX:number = 0;
    protected speedY:number = 0;
    protected world:World = null;
    protected mass:number = 1.0;
    protected rotate:number = 0.0;
    protected sizeX:number = 0;
    protected sizeY:number = 0;
    
    protected enabled = false;
    
    enable(enable:boolean) {
        this.enabled = enable;
    }
    
    setX(x:number):Entity{
        this.x = x;
        return this;
    }
    
    setY(y:number):Entity{
        this.y = y;
        return this;
    }
    
    setPos(x:number,y:number):Entity{
        this.setX(x);
        this.setY(y);
        return this;
    }
    
    setSpeedX(x:number):Entity{
        this.speedX = x;
        return this;
    }
    
    setSpeedY(y:number):Entity{
        this.speedY = y;
        return this;
    }
    
    setSpeed(x:number,y:number):Entity{
        this.setSpeedX(x);
        this.setSpeedY(y);
        return this;
    }
    
    setWorld(world:World):Entity{
        this.world = world;
        return this;
    }
    
    setRotate(rotate:number):Entity{
        this.rotate = rotate;
        return this;
    }
    
    setMass(mass:number):Entity{
        this.mass = mass;
        return this;
    }
    
    setSizeX(x:number):Entity{
        this.sizeX = x;
        return this;
    }
    
    setSizeY(y:number):Entity{
        this.sizeY = y;
        return this;
    }
    
    setSize(x:number,y:number):Entity{
        this.setSizeX(x);
        this.setSizeY(y)
        return this;
    }
    
    getX():number{
        return this.x;
    }
    
    getY():number{
        return this.y;
    }
    
    getSpeedX():number{
        return this.speedX;
    }
    
    getSpeedY():number{
        return this.speedY;
    }
    
    getRotate():number{
        return this.rotate;
    }
    
    getSizeX():number{
        return this.sizeX;
    }
    
    getSizeY():number{
        return this.sizeY;
    }
    
    update(){
        if(!this.enabled){
            return;
        }
        
        //check for the world bound
        if(this.x<-1.0){
            this.setSpeedX(this.getSpeedX()+1.0);
        }
        
        if(this.y<-1.0){
            this.setSpeedY(this.getSpeedY()+1.0);
        }
        
        if(this.x>1.0){
            this.setSpeedX(this.getSpeedX()-1.0);
        }
        
        if(this.y>1.0){
            this.setSpeedY(this.getSpeedY()-1.0);
        }
        
        // chenck force of every entity
        let forceX = 0;
        let forceY = 0;
        
        for (var index = 0; index < this.world.getEntityList().length; index++) {
            var element = this.world.getEntityList()[index];
            
            //if same position or same object , continue
            if(element.getX()==this.getX() && element.getY()==this.getY() ){
                continue;
            }
            
            //AABB box test,ok this is not exactly the accrually AABB test
            if(element.AABB(this.getX(),this.getY())||this.AABB(element.getX(),element.getY())){
                // update the force. i know the rule is pretty strange
                forceX += (this.getX() - element.getX())*10/this.mass;
                forceY += (this.getY() - element.getY())*10/this.mass;
            }
        }
        
        //change the speed 
        this.setSpeedX(this.getSpeedX() + forceX/20);
        this.setSpeedY(this.getSpeedY() + forceY/20);
        
        //change the position
        this.setX(this.getX() + this.getSpeedX()/20);
        this.setY(this.getY() + this.getSpeedY()/20);
    }
    
    AABB(x:number,y:number):boolean{
        var ax = this.x - this.sizeX/2;
        var bx = this.x + this.sizeX/2;
        var ay = this.y - this.sizeY/2;
        var by = this.y + this.sizeY/2;
        
        if((ax<x && x<bx)&&
            (ay<y && y<by)){
            return true;
        }
        
        return false;
    }
}

export class EntityStatic extends Entity{
    setSpeedX():Entity{
        this.speedX = 0;
        return this;
    }
    
    setSpeedY():Entity{
        this.speedY = 0;
        return this;
    }
}


export var world = new World();