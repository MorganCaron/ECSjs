function degtorad(degres) {
    return (degres * (2 * Math.PI) / 360);
}

class CircleEntity extends Entity {
    constructor(x, y, radius, color) {
        super("circle");
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.moveTo(this.x, this.y - this.radius);
        for (var i = 0; i <= 360; i += 10)
            context.lineTo(this.x + Math.cos(degtorad(i)) * this.radius, this.y - Math.sin(degtorad(i)) * this.radius);
        context.closePath();
        context.fillStyle = this.color;
        context.lineCap = "round";
        context.fill();
    }
}

class CircleAppearanceComponent extends Component {
    constructor() {
        super("circleAppearance");
    }

    update(entities) {
        for (var key in entities)
            entities[key].draw();
    }
}

class GravityComponent extends Component {
    constructor() {
        super("gravity");
    }

    update(entities) {
        for (var key in entities)
            entities[key].y += 1;
    }
}

var ecs, canvas, context;
function main() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    ecs = new ECS();
    var circleAppearanceComponent = new CircleAppearanceComponent();
    ecs.addComponent(circleAppearanceComponent);
    var gravityComponent = new GravityComponent();
    ecs.addComponent(gravityComponent);
    var circleEntity = new CircleEntity(100, 100, 80, "red");
    circleEntity.addComponent(gravityComponent);
    ecs.addEntity(circleEntity);
    requestAnimationFrame(loop);
}

function loop() {
    context.clearRect(0, 0, 600, 400);
    ecs.update();
    requestAnimationFrame(loop);
}

document.addEventListener('DOMContentLoaded', main, false);
