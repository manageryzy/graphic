define(["require", "exports", './world'], function (require, exports, world) {
    "use strict";
    function init() {
        var es1 = new world.EntityStatic().setPos(0.5, 0.5).setSize(0.2, 0.2);
        var e1 = new world.Entity()
            .setMass(1)
            .setPos(0.5, 0.5)
            .setSize(0.05, 0.05)
            .setSpeed(0.05, 0.05);
        world.world.addEntity(es1);
        world.world.addEntity(e1);
    }
    exports.init = init;
});
//# sourceMappingURL=game.js.map