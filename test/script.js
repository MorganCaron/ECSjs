function degtorad(degres) {
    return (degres * (2 * Math.PI) / 360);
}

class CanvasComponent {
    constructor() {
        this.element = null;
        this.context = null;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    init(id) {
        this.element = document.getElementById(id);
        this.context = this.element.getContext('2d');
    }

    updateMousePos(element, evt) {
        var rect = element.getBoundingClientRect();
        this.mouseX = evt.clientX - rect.left,
        this.mouseY = evt.clientY - rect.top
    }
}

class Position2dComponent {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    init(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Velocity2dComponent {
    constructor() {
        this.vx = 0;
        this.vy = 0;
    }

    init(vx, vy) {
        this.vx = vx;
        this.vy = vy;
    }
}

class PhysicComponent {
    constructor() {
        this.gravity = 0;
        this.gravityDirection = 0;
        this.friction = 0;
    }

    init(gravity, gravityDirection, friction) {
        this.gravity = gravity;
        this.gravityDirection = gravityDirection;
        this.friction = friction;
    }
}

class CircleComponent {
    constructor() {
        this.radius = 0;
        this.color = 'black';
    }

    init(radius, color) {
        this.radius = radius;
        this.color = color;
    }
}

class CanvasSystem {
    update(entities) {
        var canvasEntities = entities.queryComponent(CanvasComponent);
        canvasEntities.forEach(function(canvas) {
            canvas.canvasComponent.context.clearRect(0, 0, 600, 400);
        });
    }
}

class Velocity2dSystem {
    update(entities) {
        var velocity2dEntities = entities.queryComponents([Velocity2dComponent]);
        velocity2dEntities.forEach(function(entity) {
            entity.position2dComponent.x += entity.velocity2dComponent.vx;
            entity.position2dComponent.y += entity.velocity2dComponent.vy;
        });
    }
}

class Gravity2dSystem {
    update(entities) {
        var physicEntities = entities.queryComponent(PhysicComponent);
        physicEntities.forEach(function(entity) {
            entity.velocity2dComponent.vx *= entity.physicComponent.friction;
            entity.velocity2dComponent.vy *= entity.physicComponent.friction;
            entity.velocity2dComponent.vx += Math.cos(degtorad(entity.physicComponent.gravityDirection)) * entity.physicComponent.gravity;
            entity.velocity2dComponent.vy += Math.sin(degtorad(entity.physicComponent.gravityDirection)) * entity.physicComponent.gravity;
        });
    }
}

class CircleSystem {
    update(entities) {
        var canvasEntities = entities.queryComponent(CanvasComponent);
        var circleEntities = entities.queryComponent(CircleComponent);
        canvasEntities.forEach(function(canvas) {
            circleEntities.forEach(function(circle) {
                canvas.canvasComponent.context.beginPath();
                canvas.canvasComponent.context.moveTo(circle.position2dComponent.x, circle.position2dComponent.y - circle.circleComponent.radius);
                for (var i = 0; i <= 360; i += 10)
                    canvas.canvasComponent.context.lineTo(circle.position2dComponent.x + Math.cos(degtorad(i)) * circle.circleComponent.radius, circle.position2dComponent.y - Math.sin(degtorad(i)) * circle.circleComponent.radius);
                canvas.canvasComponent.context.closePath();
                canvas.canvasComponent.context.fillStyle = circle.circleComponent.color;
                canvas.canvasComponent.context.lineCap = 'round';
                canvas.canvasComponent.context.fill();
            });
        });
    }
}

class CollisionSystem {
    update(entities) {
        var circleEntities = entities.queryComponent(CircleComponent);
        circleEntities.forEach(function(circle) {
            if (circle.position2dComponent.x <= circle.circleComponent.radius && circle.velocity2dComponent.vx < 0)
                circle.velocity2dComponent.vx *= -1;
            if (circle.position2dComponent.y <= circle.circleComponent.radius && circle.velocity2dComponent.vy < 0)
                circle.velocity2dComponent.vy *= -1;
            if (circle.position2dComponent.x >= 600-circle.circleComponent.radius && circle.velocity2dComponent.vx > 0)
                circle.velocity2dComponent.vx *= -1;
            if (circle.position2dComponent.y >= 400-circle.circleComponent.radius && circle.velocity2dComponent.vy > 0)
                circle.velocity2dComponent.vy *= -1;
        });
    }
}

class App {
    constructor() {
        this.ecs = new ECS();

        this.ecs.addSystems([
            CanvasSystem,
            Velocity2dSystem,
            Gravity2dSystem,
            CircleSystem,
            CollisionSystem
        ]);

        var canvas = this.ecs.entities.createEntity();
        canvas.addComponent(CanvasComponent);
        canvas.canvasComponent.init('canvas');
        canvas.canvasComponent.element.addEventListener('mousemove', function(evt) {
            canvas.canvasComponent.updateMousePos(this, evt);
        }, false);
        
        var circle = this.ecs.entities.createEntity();
        circle.addComponents([Position2dComponent, Velocity2dComponent, PhysicComponent, CircleComponent]);
        circle.position2dComponent.init(50, 50);
        circle.physicComponent.init(.09807, 90, .99);
        circle.circleComponent.init(20, 'red');
    }

    update() {
        this.ecs.update();
    }
}

var app;
document.addEventListener('DOMContentLoaded', function() {
    app = new App();
    requestAnimationFrame(update);
}, false);
function update() {
    app.update();
    requestAnimationFrame(update);
};
