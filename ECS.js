nbEntities = 0;

class Component {
    constructor(name) {
        this.componentName = name;
    }
}

class Entity {
    constructor(name) {
        this.entityId = (+new Date()).toString(16) + (Math.random() * 100000000).toString(16) + nbEntities;
        this.entityName = name;
        this.components = {};
        nbEntities++;
    }

    addComponent(component) {
        this.components[component.componentName] = component;
    }
}

class ECS {
    constructor() {
        this.entities = {};
        this.components = {};
    }

    addEntity(entity) {
        this.entities[entity.entityId] = entity;
    }

    addComponent(component) {
        this.components[component.componentName] = component;
    }

    update() {
        for (var key in this.components)
            this.components[key].update(this.entities);
    }
}
