function createEntity(){
    var entity = {
        children: [],
        lifespan: 1000,
        breedTime: 100,
        strength: 10,
        health: 100
    };
    entity.breed = function(){
        var child = new this.life.constructor(this);
        this.life.simulation.addLife(child);
        this.children.push(child);
    };

    return entity;
}

module.exports = createEntity;