function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

class Entity {
    constructor(name) {
        this.entityId = nbEntities++;
        this.entityName = name;
        this.tags = [];
    }

    addComponent(component) {
        this[lowercaseFirstLetter(component.name)] = new component;
        return this;
    }
    removeComponent(component) {
        var index = this.indexOf(tag);
        if (this[lowercaseFirstLetter(component.name)] != undefined)
            delete this[lowercaseFirstLetter(component.name)];
        return this;
    }
    hasComponent(component) {
        return (this[lowercaseFirstLetter(component.name)] != undefined);
    }
    hasComponents(components) {
        for (var key in components) {
            if (!hasComponent(components[key]))
                return false;
        }
        return true;
    }

    addTag(tag) {
        this.tags.push(tag);
        return this;
    }
    removeTag(tag) {
        var index = this.tags.indexOf(tag);
        if (index != -1)
            this.tags[index].remove();
        return this;
    }
    hasTag(tag) {
        return (this.tags.indexOf(tag) != -1);
    }
    hasTags(tags) {
        for (var key in tags) {
            if (!hasTag(tags[key]))
                return false;
        }
        return true;
    }
}
var nbEntities = 0;

class EntityManager {
    constructor() {
        this.entities = [];
    }

    createEntity() {
        var entity = new Entity();
        this.entities.push(entity);
        return entity;
    }

    all() {
        return this.entities;
    }

    queryComponent(component) {
        var result = [];
        this.entities.forEach(function(entity) {
            if (entity.hasComponent(component))
                result.push(entity);
        });
        return result;
    }

    queryTag(tag) {
        var result = [];
        this.entities.forEach(function(entity) {
            if (entity.hasTag(tag))
                result.push(entity);
        });
        return result;
    }
}

class ECS {
    constructor() {
        this.entities = new EntityManager();
        this.systems = [];
    }

    addSystem(system) {
        this.systems.push(new system);
    }
    addSystems(systems) {
        for (var key in systems)
            this.systems.push(new systems[key]);
    }

    update() {
        var entities = this.entities;
        this.systems.forEach(function(system) {
            system.update(entities);
        });
    }
}
