var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var World = (function () {
    function World() {
        var _this = this;
        this.entityList = new Array();
        setInterval(function () {
            _this.tick();
        }, 100);
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
        this.entityList.forEach(function (entity) {
            entity.update();
        });
    };
    return World;
})();
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
    Entity.prototype.setSpeedX = function (x) {
        this.speedX = x;
        return this;
    };
    Entity.prototype.setSpeedY = function (y) {
        this.speedY = y;
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
        if (this.x < -1.0) {
            this.setSpeedX(this.getSpeedX() + 0.0001);
        }
        if (this.y < -1.0) {
            this.setSpeedY(this.getSpeedY() + 0.0001);
        }
        if (this.x > 1.0) {
            this.setSpeedX(this.getSpeedX() - 0.0001);
        }
        if (this.y > 1.0) {
            this.setSpeedY(this.getSpeedY() - 0.0001);
        }
        var forceX = 0;
        var forceY = 0;
        for (var index = 0; index < this.world.getEntityList().length; index++) {
            var element = this.world.getEntityList()[index];
            if (element.getX() == this.getX() && element.getY() == this.getY()) {
                continue;
            }
            forceX += (this.getX() - element.getX()) / this.mass;
            forceY += (this.getY() - element.getY()) / this.mass;
        }
        this.setSpeedX(this.getSpeedX() + forceX / 10);
        this.setSpeedY(this.getSpeedY() + forceY / 10);
        this.setX(this.getX() + this.getSpeedX() / 10);
        this.setY(this.getY() + this.getSpeedY() / 10);
    };
    return Entity;
})();
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
})(Entity);
exports.EntityStatic = EntityStatic;
exports.world = new World();
//# sourceMappingURL=world.js.map