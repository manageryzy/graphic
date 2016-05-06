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
        this.entityList.forEach(entity => {
            entity.update();
        });
    }
    
    constructor(){
        setInterval(()=>{
            this.tick();
        },100);
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
    
    setSpeedX(x:number):Entity{
        this.speedX = x;
        return this;
    }
    
    setSpeedY(y:number):Entity{
        this.speedY = y;
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
        
        if(this.x<-1.0){
            this.setSpeedX(this.getSpeedX()+0.0001);
        }
        
        if(this.y<-1.0){
            this.setSpeedY(this.getSpeedY()+0.0001);
        }
        
        if(this.x>1.0){
            this.setSpeedX(this.getSpeedX()-0.0001);
        }
        
        if(this.y>1.0){
            this.setSpeedY(this.getSpeedY()-0.0001);
        }
        
        let forceX = 0;
        let forceY = 0;
        
        for (var index = 0; index < this.world.getEntityList().length; index++) {
            var element = this.world.getEntityList()[index];
            if(element.getX()==this.getX() && element.getY()==this.getY() ){
                continue;
            }
            
            forceX += (this.getX() - element.getX())/this.mass;
            forceY += (this.getY() - element.getY())/this.mass;
        }
        
        this.setSpeedX(this.getSpeedX() + forceX/10);
        this.setSpeedY(this.getSpeedY() + forceY/10);
        
        this.setX(this.getX() + this.getSpeedX()/10);
        this.setY(this.getY() + this.getSpeedY()/10);
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