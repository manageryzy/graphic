import world = require('./world');

export function init() {
    var es1 = new world.EntityStatic().setPos(0.0,0.0).setSize(0.4,0.4);
    
    var e1 = new world.Entity()
        .setMass(1)
        .setPos(0,0.1)
        .setSize(0.05,0.05)
        .setSpeed(1,1);
        
        
    world.world.addEntity(es1);
    world.world.addEntity(e1);
    
    
    for(var i:number=1;i<40;i++){
        var e = new world.Entity()
            .setMass(1)
            .setPos(Math.random()*2-1,Math.random()*2-1)
            .setSize(0.1,0.1)
            .setRotate(Math.random()*Math.PI)
            .setSpeed(Math.random()*2-1,Math.random()*2-1);
       
        world.world.addEntity(e);
    }
    
    for(var i:number=1;i<100;i++){
        var e = new world.Entity()
            .setMass(1)
            .setPos(Math.random()*2-1,Math.random()*2-1)
            .setSize(0.05,0.05)
            .setRotate(Math.random()*Math.PI)
            .setSpeed(Math.random()*2-1,Math.random()*2-1);
       
        world.world.addEntity(e);
    }
}
