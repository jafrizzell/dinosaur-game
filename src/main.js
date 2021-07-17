import './scripts/helpers.js'
import './scripts/objects/game-object.js'
import './scripts/objects/cactus.js'
import './scripts/objects/dinosaur.js'
import './scripts/objects/background.js'
import './scripts/objects/score.js'
import './scripts/game.js'

new Game({
    el: document.getElementById("game")
});