// Tutorial:
// https://www.youtube.com/watch?v=vyqbNFMDRGQ&t=5665s

// Resources:
// https://itch.io/game-assets/free this wedsite has some free game assets and materials


// Addition ideas:
// I wanna add 擊退 - done
// Make both characters can be in the front (not always enemy)
// attack Duration (like 0.1 second)
// range attack
// Make two characters can attack at the same time
// health bar and timer - done

const canvas = document.querySelector('canvas');
// Context is responsible for drawing our shape 
const c = canvas.getContext('2d');

// Setup the canvas size
// canvas.width = window.innerWidth; // Make the canvas as wide as the window size (has the bug that if resize the window, the canvas size will move be resized...)
if (window.innerWidth >= 1024) {
    canvas.width = 1024
} else {
    canvas.width = window.innerWidth
}
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5
let gameover = false

const background = new Sprite ({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
}) 

const shop = new Sprite ({
    position: {
        x: 650,
        y: 192
    },
    imageSrc: './img/shop (1).png',
    scale: 2.25,
    framesMax: 6,
    framesCurrent: 6
}) 

const player = new Fighter({
    position: {
        x:0,
        y:0 // position y is the height of the object, and higher its position y is, lower its position is
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    height: 150,
    width: 50,
    direction: 'right',
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Fighter({
    position:  {
        x:400,
        y:100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    height: 150,
    width: 50,
    direction: 'left',
    offset: {
        x: 0,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

// the c.fillStyle will set the color of an specific area in canvas 
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    // Player movement
    player.velocity.x = 0 // reset the movement

        if (keys.a.pressed && player.lastKey === 'a' && player.position.x >= 0) {
            player.direction = 'left'
            player.velocity.x = -5
        } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x + player.width <= canvas.width) {
            player.direction = 'right'
            player.velocity.x = 5
        } else if (keys.a.pressed && player.position.x >= 0) { // if a is not pressed last but still being pressed while other key is not pressed
            player.direction = 'left'
            player.velocity.x = -5
        } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
            player.direction = 'right'
            player.velocity.x = 5
        }    

    // Jump movement
        // Player
    if (keys.w.pressed && player.onTheGround) {
        player.velocity.y = -15
    } 
    
        //Enemy
    if (keys.ArrowUp.pressed && enemy.onTheGround) {
        enemy.velocity.y = -15
    }

    // Enemy movement
    enemy.velocity.x = 0

        if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= 0) {
            enemy.direction = 'left'
            enemy.velocity.x = -5
        } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x + enemy.width <= canvas.width) {
            enemy.direction = 'right'
            enemy.velocity.x = 5
        } else if (keys.ArrowLeft.pressed && enemy.position.x >= 0) { 
            enemy.direction = 'left'
            enemy.velocity.x = -5
        } else if (keys.ArrowRight.pressed && enemy.position.x + enemy.width <= canvas.width) {
            enemy.direction = 'right'
            enemy.velocity.x = 5
        }

    // Detect for collision
    if (!gameover) {
        if (rectangularCollision({rectangular1: player, rectangular2: enemy})
            && player.isAttacking && enemy.health >= 0 // Enemy is attacked
            ) {
            player.isAttacking = false // Reset isAttacking
            console.log("You are attacking")
            // console.log(`Damage: ${Math.floor(Math.random() * (100 - 50 + 1) + 50)}`)
            enemy.health -= 20
            document.querySelector('#enemyHealth').style.width = `${enemy.health}%`

            // enemy.isAttacked = true // 暫時用不到
            if(player.direction === 'left' && enemy.position.x >= 0) { // Knockback (擊退)
                enemy.velocity.x = -15
                } else if(player.direction === 'right' && enemy.position.x + enemy.width < canvas.width) {
                    enemy.velocity.x = 15
                }

            if (enemy.onTheGround) {
                    enemy.velocity.y = -3
                }
        }

        if (rectangularCollision({rectangular1: enemy, rectangular2: player})
            && enemy.isAttacking && player.health >= 0 // player is attacked 
            ) {
        enemy.isAttacking = false // Reset isAttacking
        console.log("Enemy is attacking")
        // console.log(`Damage: ${Math.floor(Math.random() * (100 - 50 + 1) + 50)}`)
        
        player.health -= 20
        document.querySelector('#playerHealth').style.width = `${player.health}%`

        // player.isAttacked = true // 暫時用不到
        if(enemy.direction === 'left' && player.position.x >= 0) { // Knockback
            player.velocity.x = -15
            } else if(enemy.direction === 'right' && player.position.x + player.width < canvas.width) {
                player.velocity.x = 15
            }

            if (player.onTheGround) {
                player.velocity.y = -3 // 
            }
        }

        // end game based on health
        if (player.health <= 0 || enemy.health <= 0) {
            determineWinner({ player, enemy }, timerId)
        }
    }
}

animate()

// The keydown event is fired when a key is pressed
window.addEventListener('keydown', (event) => {
    // console.log(event)
    switch (event.key) {
        case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        // player.direction = 'left'
        break
        case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        // player.direction = 'right'
        break
        case 'w':
        // player.velocity.y = -15
        keys.w.pressed = true        
        break
        case 's': 
        player.attack()
        break

        case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        // enemy.direction = 'left'
        break
        case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        // enemy.direction = 'right'
        break
        case 'ArrowUp':
        // enemy.velocity.y = -15
        keys.ArrowUp.pressed = true
        // enemy.lastKey = 'ArrowUp' 
        break
        case 'ArrowDown':
        enemy.attack()
        break
    }
})

window.addEventListener('keyup', (event) => {
    // Player
    switch (event.key) {
        case 'a':
        keys.a.pressed = false
        break
        case 'd':
        keys.d.pressed = false
        break
        case 'w':
        keys.w.pressed = false
        break
    }
    
    // Enemy
    switch (event.key) {
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
        case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
        case 'ArrowUp':
        keys.ArrowUp.pressed = false
        break
    }
})

// const background = new Sprite ({
//     position: {
//         x: 0,
//         y: 0
//     },
//     imageSrc: './img/background.png',
//     image: {
//         width: window.innerWidth,
//         height: window.innerHeight
//     }, 
//     scale: 1
// }) 

// const shop = new Sprite ({
//     position: {
//         x: 0,
//         y: 0
//     },
//     imageSrc: './img/shop (1).png',
//     scale: 2
// }) 
