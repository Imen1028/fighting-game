// Definition of sprite: A sprite is a two-dimensional (2D) graphical object used in computer graphics, particularly in video games.

class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x:0, y:0}}) {
        this.position = position  
        this.image = new Image() // The new Image() is the same as document.createElement("img")
        this.image.src = imageSrc
        this.scale = scale
        this.offset = offset
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 8
    }

    draw() {
        c.drawImage(
            this.image, 
            this.framesCurrent * (this.image.width / this.framesMax), // the starting x position of the crop and "this.framesCurrent * this.image.width / this.image.framesMax" is use to animate the image by moving one of its frames at a time
            0, // the starting y position of the crop 
            this.image.width / this.framesMax, // the width of the crop 
            this.image.height, // the height of the crop 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
            )
        }
    
    animateFrames() {
        // The following two lines are for making the image animation move slower (Move every 10 frames)
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0) {
            // Move the image frame by frame
            if(this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        color, 
        height, 
        width, 
        direction, 
        offset = {x: 0, y: 0}, 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        sprites,
        attackBox= { offset: {}, width: undifined, height: undefined} 
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.velocity = velocity
        this.width = width
        this.height = height // Height is the distance from top to bottom of the object
        this.attackBox = {
            position: {
              x: this.position.x,
              y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
          }
        this.offset 
        this.onTheGround
        this.color = color
        this.isAttacking = false
        this.attackCooldown = false
        this.direction = direction
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 8
        this.sprites = sprites
        this.dead = false

        for (const sprite in sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        console.log(this.sprites)
    }

    resetAttackCooldown() {
        this.attackCooldown = true
        setTimeout(() => {
            this.attackCooldown = false
        }, 200)
    }

    takeHit() {
        this.health -= 10
        if(this.health <= 0) {
            this.switchSprites('death')
            console.log("I'm dead!")
        } else {
            this.switchSprites('takeHit')
            console.log("Don't hit me!")
        }
    }

    update() {
        this.draw()
        if(!this.dead) {
            this.animateFrames()
        }

        this.attackBox.position.x = this.position.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x // Horizontal movement
        this.position.y += this.velocity.y // Vertical movement
        this.lastKey

        if (this.position.y + this.height + this.velocity.y 
            >= canvas.height - 94 ) { // To make the character to stop falling at 94 px height (94px above from the grounda)
            this.velocity.y = 0
            this.position.y = 332
            this.onTheGround = true
        } else {
            this.velocity.y += gravity
            this.onTheGround = false
        }

        // Attack
        // c.fillRect(
        //     this.attackBox.position.x + this.attackBox.offset.x, 
        //     this.attackBox.position.y + this.attackBox.offset.y, 
        //     this.attackBox.width, 
        //     this.attackBox.height
        //     )

        // if(this.attackCooldown === false) {
        //     if(this.isAttacking && this.direction === 'right') { // only drow the attack while we are attacking 
        //     c.fillStyle = 'gray'
        //     c.fillRect(this.attackBox.position.x, 
        //         this.attackBox.position.y + 25, 
        //         this.attackBox.width, 
        //         this.attackBox.height
        //         )
        //     this.resetAttackCooldown()
        //     } else if (this.isAttacking && this.direction === 'left') {
        //         this.attackBox.attackOffset.x = 50
        //         c.fillStyle = 'gray'
        //         c.fillRect(this.attackBox.position.x - this.attackBox.attackOffset.x , 
        //             this.attackBox.position.y + 25, 
        //             this.attackBox.width, 
        //             this.attackBox.height
        //             )
        //         this.resetAttackCooldown()
        //     }
        
        // }
    }

    attack() {
        this.switchSprites('attack1')
        this.isAttacking = true
    }  

    switchSprites(sprite) { 
        if (this.direction === 'left') {
            
        }
        
        if(this.image === this.sprites.death.image) {
            if(this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true
            }
            return
        }

        switch(sprite) {
            case 'death':
                if(this.image !== this.sprites.death.image) 
                {
                    this.image= this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
            break
        }

        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
            ){
                return
            }

        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
            ){
                return
            }
            
        switch(sprite) {
            case 'idle':
            if(this.image !== this.sprites.idle.image) {
                this.image = this.sprites.idle.image
                this.framesMax = this.sprites.idle.framesMax
                this.framesCurrent = 0
            }
            break
            case 'run':
                if(this.image !== this.sprites.run.image) {
                        this.image = this.sprites.run.image
                        this.framesMax = this.sprites.run.framesMax
                        this.framesCurrent = 0
                    }
            break
            case 'jump':
                if(this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
            break
            case 'fall':
                if(this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
            break 
            case 'attack1':
                if(this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
            break   
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
            break        
        }
    }
}