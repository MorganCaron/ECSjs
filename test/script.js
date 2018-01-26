function degtorad(degres) {
    return (degres * (2 * Math.PI) / 360);
}

class CircleComponent {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 0;
        this.color = 'black';
    }

    init(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
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

class CanvasSystem {
    update(entities) {
        var canvasEntities = entities.queryComponent(CanvasComponent);
        canvasEntities.forEach(function(canvas) {
            canvas.canvasComponent.context.clearRect(0, 0, 600, 400);
        });
    }
}

class CircleSystem {
    update(entities) {
        var canvasEntities = entities.queryComponent(CanvasComponent);
        var circleEntities = entities.queryComponent(CircleComponent);
        canvasEntities.forEach(function(canvas) {
            circleEntities.forEach(function(circle) {
                circle.circleComponent.x = canvas.canvasComponent.mouseX;
                circle.circleComponent.y = canvas.canvasComponent.mouseY;
                canvas.canvasComponent.context.beginPath();
                canvas.canvasComponent.context.moveTo(circle.circleComponent.x, circle.circleComponent.y - circle.circleComponent.radius);
                for (var i = 0; i <= 360; i += 10)
                    canvas.canvasComponent.context.lineTo(circle.circleComponent.x + Math.cos(degtorad(i)) * circle.circleComponent.radius, circle.circleComponent.y - Math.sin(degtorad(i)) * circle.circleComponent.radius);
                canvas.canvasComponent.context.closePath();
                canvas.canvasComponent.context.fillStyle = circle.circleComponent.color;
                canvas.canvasComponent.context.lineCap = 'round';
                canvas.canvasComponent.context.fill();
            });
        });
    }
}

class App {
    constructor() {
        this.ecs = new ECS();

        this.ecs.addSystems([
            CanvasSystem,
            CircleSystem
        ]);

        var canvas = this.ecs.entities.createEntity();
        canvas.addComponent(CanvasComponent);
        canvas.canvasComponent.init('canvas');
        canvas.canvasComponent.element.addEventListener('mousemove', function(evt) {
            canvas.canvasComponent.updateMousePos(this, evt);
        }, false);

        var circle = this.ecs.entities.createEntity();
        circle.addComponent(CircleComponent);
        circle.circleComponent.init(0, 0, 80, 'red');
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
