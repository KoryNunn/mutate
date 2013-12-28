var log = require('./createLog'),
    Simulation = require('./simulation'),
    simulation = new Simulation(),
    Life = require('./life');

simulation.addLife(new Life());

simulation.on('tick', function(){
    //log.print(-10);
    console.log(JSON.stringify(simulation.stats, null, '    '));
});

simulation.tick();