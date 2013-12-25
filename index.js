var log = require('./createLog'),
    Simulation = require('./simulation'),
    simulation = new Simulation(),
    Life = require('./life');

simulation.addLife(new Life());

simulation.tick();

setInterval(function(){
    console.log(simulation.lives.length);
    log.print(-10);
    console.log(JSON.stringify(simulation.stats));
},1000);