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
// Flip the image
// Random danage - console.log(`Damage: ${Math.floor(Math.random() * (100 - 50 + 1) + 50)}`)


// Bugs:
// Attack will not stop if it doesn't hit the other character
// Transition between images with different frames - The solution is in the video, from 2:44:00 section Jump. Use switch to only trigger the image and frame change once!
// The attack has a bug and The attack cooldown makes the attack inactive

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
        x: 0,
        y: canvas.height - 94 // position y is the height of the object, and higher its position y is, lower its position is
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    height: 150,
    width: 75,
    direction: 'right',
    offset: {
        x: 150,
        y: 95
    },
    imageSrc: './img/Player/EIdle.png',
    scale: 2,
    framesMax: 8,
    sprites: {
        idle: {
            framesMax: 8,
            imageSrc: './img/Player/EIdle.png'
        },
        run: {
            framesMax: 8,
            imageSrc: './img/Player/ERun.png'
        },
        jump: {
            framesMax: 2,
            imageSrc: './img/Player/EJump.png'
        },
        fall: {
            framesMax: 2,
            imageSrc: './img/Player/EFall.png'
        },
        attack1: {
            framesMax: 6,
            imageSrc: './img/Player/EAttack1.png'
        },
        takeHit: {
            framesMax: 4,
            imageSrc: './img/Player/ETake Hit - white silhouette.png'
        },
        death: {
            framesMax: 6,
            imageSrc: './img/Player/EDeath.png'
        }
    },
    attackBox: {
        offset: {
            x: 80,
            y: 50
        },
        width: 150,
        height: 50
    }
})

const enemy = new Fighter({
    position:  {
        x: canvas.width - 40,
        y: canvas.height - 94
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    height: 150,
    width: 25,
    direction: 'left',
    offset: {
        x: 200,
        y: 105
    },
    imageSrc: './img/Enemy/Idle.png',
    scale: 2,
    framesMax: 4,
    sprites: {
        idle: {
            framesMax: 4,
            imageSrc: './img/Enemy/Idle.png'
        },
        run: {
            framesMax: 8,
            imageSrc: './img/Enemy/Run.png'
        },
        jump: {
            framesMax: 2,
            imageSrc: './img/Enemy/Jump.png'
        },
        fall: {
            framesMax: 2,
            imageSrc: './img/Enemy/Fall.png'
        },
        attack1: {
            framesMax: 4,
            imageSrc: './img/Enemy/Attack1.png'
        },
        takeHit: {
            framesMax: 3,
            imageSrc: './img/Enemy/Take hit.png'
        },
        death: {
            framesMax: 7,
            imageSrc: './img/Enemy/death.png'
        }
    },
    attackBox: {
        offset: {
            x: -165,
            y: 50
        },
        width: 150,
        height: 50
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
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

  // Attack Box  
    // c.fillRect(
    //     player.attackBox.position.x + player.attackBox.offset.x, 
    //     player.attackBox.position.y + player.attackBox.offset.y, 
    //     player.attackBox.width, 
    //     player.attackBox.height
    //     )

//     // position x
//     c.fillStyle = 'red'
//     c.fillRect (
//         enemy.position.x,
//         enemy.position.y,
//         5,
//         200   
//        )
//        c.fillRect (
//         player.position.x,
//         player.position.y,
//         5,
//         200   
//        )

//     // position x + width or - width   
//     c.fillStyle = 'blue'
//     c.fillRect (
//          enemy.position.x - 25,
//          enemy.position.y,
//          5,
//          200   
//         )
//    c.fillRect (
//          player.position.x + 75,
//          player.position.y,
//          5,
//          200   
//         )

    // Player movement
    player.velocity.x = 0 // reset the movement

        if (keys.a.pressed && player.lastKey === 'a' && player.position.x >= 0) {
            player.direction = 'left'
            player.velocity.x = -5
            player.switchSprites('run')
        } else if (keys.d.pressed && player.lastKey === 'd' && player.position.x + player.width <= canvas.width) {
            player.direction = 'right'
            player.velocity.x = 5
            player.switchSprites('run')
        } else if (keys.a.pressed && player.position.x >= 0) { // if a is not pressed last but still being pressed while other key is not pressed
            player.direction = 'left'
            player.velocity.x = -5
            player.switchSprites('run')
        } else if (keys.d.pressed && player.position.x + player.width < canvas.width) {
            player.direction = 'right'
            player.velocity.x = 5
            player.switchSprites('run')
        } else {
            player.switchSprites('idle')
        }

    // Jump movement
        // Player
    if (keys.w.pressed && player.onTheGround) {
        player.velocity.y = -12
    }

    // Jump image
    if (player.velocity.y < 0) {
        player.switchSprites('jump')
    } else if(player.velocity.y > 0) {
        player.switchSprites('fall')
    }

    
    //Enemy

    // Enemy movement
    enemy.velocity.x = 0

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x - enemy.width >= 0) {
        enemy.direction = 'left'
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x <= canvas.width) {
        enemy.direction = 'right'
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    } else if (keys.ArrowLeft.pressed && enemy.position.x - enemy.width >= 0) { // if a is not pressed last but still being pressed while other key is not pressed
        enemy.direction = 'left'
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    } else if (keys.ArrowRight.pressed && enemy.position.x <= canvas.width) {
        enemy.direction = 'right'
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    } else {
        enemy.switchSprites('idle')
    }

    // Enemy jump
    if (keys.ArrowUp.pressed && enemy.onTheGround) {
        enemy.velocity.y = -12
    }

    // Jump image
    if (enemy.velocity.y < 0) {
        enemy.switchSprites('jump')
    } else if(enemy.velocity.y > 0) {
        enemy.switchSprites('fall')
    }

    // Detect for collision
    if (!gameover) {

        // if(player.isAttacking) {
        //     console.log(rectangularCollision({rectangular1: player, rectangular2: enemy}))
        //     || console.log(player.isAttacking)
        //     || console.log(player.framesCurrent === 4)
        //     || console.log(player.attackCooldown === false)
        // }


        // Player atack enemy
        if (
            rectangularCollision({rectangular1: player, rectangular2: enemy}) && 
            player.isAttacking && 
            enemy.health >= 0 && 
            player.framesCurrent === 4 && 
            player.attackCooldown === false  // Enemy is attacked
            ) {
            player.isAttacking = false // Reset isAttacking
            player.resetAttackCooldown()
            console.log("You are attacking")

            enemy.takeHit()
            gsap.to('#enemyHealth', {
                width: enemy.health + '%'
            })

            // determine if the enemy is dead
            if (enemy.health < 0) {
                enemy.health = 0
            }

            if(player.direction === 'left' && enemy.position.x >= 0) { // Knockback (擊退)
                enemy.velocity.x = -15
                } else if(player.direction === 'right' && enemy.position.x + enemy.width < canvas.width) {
                    enemy.velocity.x = 15
                }

            if (enemy.onTheGround) {
                    enemy.velocity.y = -3
                }
        }

        if (player.framesCurrent === 4) {
            player.isAttacking = false
        }


        // Enemy attack player
        if (rectangularCollision({rectangular1: enemy, rectangular2: player})
            && enemy.isAttacking && 
            player.health >= 0 &&
            enemy.framesCurrent === 1 &&
            enemy.attackCooldown === false// player is attacked 
            ) {
        enemy.isAttacking = false // Reset isAttacking
        enemy.resetAttackCooldown()
        console.log("Enemy is attacking")
        player.takeHit()
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })

        if(enemy.direction === 'left' && player.position.x >= 0) { // Knockback
            player.velocity.x = -15
            } else if(enemy.direction === 'right' && player.position.x + player.width < canvas.width) {
                player.velocity.x = 15
            }

            if (player.onTheGround) {
                player.velocity.y = -3 // 
            }
        }

        if (enemy.framesCurrent === 1) {
            enemy.isAttacking = false
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
    if(player.health > 0){
    switch (event.key) {
        case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
        case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
        case 'w':
        // player.velocity.y = -15
        keys.w.pressed = true        
        break
        case 's': 
        player.attack()
        break
        }
    }

    if(enemy.health > 0) {    
    switch (event.key) {
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break
        case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
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
