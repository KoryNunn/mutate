function createEntity(){
    var entity = {
        breedTime: 100,
        strength: 10,
        health: 100
    };
    entity.breed = function(life){
        var child = new life.constructor(this);
        life.simulation.addLife(child);
        life.children.push(child);
    };

    return entity;
}

module.exports = createEntity;