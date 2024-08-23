
export function handleGameOver(mainPlayer, rungsArray, spawnInterval) {

    // prevent more rungs from being created
    clearInterval(spawnInterval);

    // stop rungs
    rungsArray.forEach(rung => {
        rung.vel = {x: 0, y: 0};
    })

    // stop player
    mainPlayer.halted = true;
}


export function drawCount(c, g) {

    // apply g.countConfig to context
    Object.keys(g.countConfig).forEach(key => {
        c[key] = g.countConfig[key];
    });
    c.strokeText(g.count, g.countConfig.loc.x, g.countConfig.loc.y);
    c.fillText(g.count, g.countConfig.loc.x, g.countConfig.loc.y);
}


export function checkCollision_and_pass(mainPlayer, rungsArray, g) {

    // do not keep collision checking if game is over
    if (g.gameOver) {return false;}

    let x = mainPlayer.loc.x;
    let y = mainPlayer.loc.y;
    let radius = mainPlayer.radius;

    // first check collision with ground
    if (y + radius >= g.canvasHeight) {
        g.gameOver = true;
        return true;
    }

    // check collision with each rung
    for (let i=0; i<rungsArray.length; i++) {
        let rung = rungsArray[i];
        let [collision, passed] = rung.checkCollision_and_pass(x, y, radius);
        if (collision) {
            g.gameOver = true;
            return true;
        }
        g.count += passed;
    }
    return false;
}