// this is the file for the world and entity of the world.
// NOTICE:this simulation may have the diffuse issue. 
//I'm don't know the coverge condition
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'main'], function (require, exports, main) {
    "use strict";
    var World = (function () {
        function World() {
            var _this = this;
            this.entityList = new Array();
            //start the game looper
            setInterval(function () {
                _this.tick();
            }, 50);
        }
        World.prototype.addEntity = function (entity) {
            this.entityList.push(entity);
            entity.setWorld(this);
            entity.enable(true);
        };
        World.prototype.getEntityList = function () {
            return this.entityList;
        };
        World.prototype.tick = function () {
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
        };
        return World;
    }());
    exports.World = World;
    var Entity = (function () {
        function Entity() {
            this.x = 0;
            this.y = 0;
            this.speedX = 0;
            this.speedY = 0;
            this.world = null;
            this.mass = 1.0;
            this.rotate = 0.0;
            this.sizeX = 0;
            this.sizeY = 0;
            this.enabled = false;
        }
        Entity.prototype.enable = function (enable) {
            this.enabled = enable;
        };
        Entity.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Entity.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Entity.prototype.setPos = function (x, y) {
            this.setX(x);
            this.setY(y);
            return this;
        };
        Entity.prototype.setSpeedX = function (x) {
            this.speedX = x;
            return this;
        };
        Entity.prototype.setSpeedY = function (y) {
            this.speedY = y;
            return this;
        };
        Entity.prototype.setSpeed = function (x, y) {
            this.setSpeedX(x);
            this.setSpeedY(y);
            return this;
        };
        Entity.prototype.setWorld = function (world) {
            this.world = world;
            return this;
        };
        Entity.prototype.setRotate = function (rotate) {
            this.rotate = rotate;
            return this;
        };
        Entity.prototype.setMass = function (mass) {
            this.mass = mass;
            return this;
        };
        Entity.prototype.setSizeX = function (x) {
            this.sizeX = x;
            return this;
        };
        Entity.prototype.setSizeY = function (y) {
            this.sizeY = y;
            return this;
        };
        Entity.prototype.setSize = function (x, y) {
            this.setSizeX(x);
            this.setSizeY(y);
            return this;
        };
        Entity.prototype.getX = function () {
            return this.x;
        };
        Entity.prototype.getY = function () {
            return this.y;
        };
        Entity.prototype.getSpeedX = function () {
            return this.speedX;
        };
        Entity.prototype.getSpeedY = function () {
            return this.speedY;
        };
        Entity.prototype.getRotate = function () {
            return this.rotate;
        };
        Entity.prototype.getSizeX = function () {
            return this.sizeX;
        };
        Entity.prototype.getSizeY = function () {
            return this.sizeY;
        };
        Entity.prototype.update = function () {
            if (!this.enabled) {
                return;
            }
            //check for the world bound
            if (this.x < -1.0) {
                this.setSpeedX(this.getSpeedX() + 1.0);
            }
            if (this.y < -1.0) {
                this.setSpeedY(this.getSpeedY() + 1.0);
            }
            if (this.x > 1.0) {
                this.setSpeedX(this.getSpeedX() - 1.0);
            }
            if (this.y > 1.0) {
                this.setSpeedY(this.getSpeedY() - 1.0);
            }
            // chenck force of every entity
            var forceX = 0;
            var forceY = 0;
            for (var index = 0; index < this.world.getEntityList().length; index++) {
                var element = this.world.getEntityList()[index];
                //if same position or same object , continue
                if (element.getX() == this.getX() && element.getY() == this.getY()) {
                    continue;
                }
                //AABB box test,ok this is not exactly the accrually AABB test
                if (element.AABB(this.getX(), this.getY()) || this.AABB(element.getX(), element.getY())) {
                    // update the force. i know the rule is pretty strange
                    forceX += (this.getX() - element.getX()) * 10 / this.mass;
                    forceY += (this.getY() - element.getY()) * 10 / this.mass;
                }
            }
            //change the speed 
            this.setSpeedX(this.getSpeedX() + forceX / 20);
            this.setSpeedY(this.getSpeedY() + forceY / 20);
            //change the position
            this.setX(this.getX() + this.getSpeedX() / 20);
            this.setY(this.getY() + this.getSpeedY() / 20);
        };
        Entity.prototype.AABB = function (x, y) {
            var ax = this.x - this.sizeX / 2;
            var bx = this.x + this.sizeX / 2;
            var ay = this.y - this.sizeY / 2;
            var by = this.y + this.sizeY / 2;
            if ((ax < x && x < bx) &&
                (ay < y && y < by)) {
                return true;
            }
            return false;
        };
        return Entity;
    }());
    exports.Entity = Entity;
    var EntityStatic = (function (_super) {
        __extends(EntityStatic, _super);
        function EntityStatic() {
            _super.apply(this, arguments);
        }
        EntityStatic.prototype.setSpeedX = function () {
            this.speedX = 0;
            return this;
        };
        EntityStatic.prototype.setSpeedY = function () {
            this.speedY = 0;
            return this;
        };
        return EntityStatic;
    }(Entity));
    exports.EntityStatic = EntityStatic;
    exports.world = new World();
});
//# sourceMappingURL=world.js.map