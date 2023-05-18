function rectangularCollision({rectangular1, rectangular2}) {
    return (
             rectangular1.attackBox.position.x + rectangular1.attackBox.width >= 
             rectangular2.position.x && // Width of the attackBox
             rectangular1.attackBox.position.x <= 
             rectangular2.position.x + rectangular2.width && // 要取rectangular1的position X (最左邊) 跟rectangular2的position Y + width (會等於他的最右邊) 並比較rectangular1的左邊有沒有超過rectangular2的右邊 <= 所以沒有就是true  
             rectangular1.attackBox.position.y + rectangular1.attackBox.height >= 
             rectangular2.position.y && // Height of the attackBox
             rectangular1.attackBox.position.y <= 
             rectangular2.position.y + rectangular2.height &&
             rectangular1.direction === 'right'
         ) || (
             rectangular1.attackBox.position.x - rectangular1.attackBox.offset.x <= // Left position of Player's attack box is small to the right position of enemy's position
             rectangular2.position.x + rectangular2.width && 
             rectangular1.attackBox.position.x + rectangular1.attackBox.width >= // right edge of player's position is greater than the right edge of enemy's position
             rectangular2.position.x + rectangular2.width && 
             rectangular1.attackBox.position.y + rectangular1.attackBox.height >= 
             rectangular2.position.y &&
             rectangular1.attackBox.position.y <= 
             rectangular2.position.y + rectangular2.height &&
             rectangular1.direction === 'left'
         )
 }
 
 function determineWinner({ player, enemy }, timerId) {
     clearTimeout(timerId)
     displayText.style.display = 'flex'
     if (player.health === enemy.health) {
         displayText.innerHTML = 'Tie'
     } else if(player.health > enemy.health) {
         displayText.innerHTML = 'Player 1 Wins'
     }  else if(enemy.health > player.health) {
         displayText.innerHTML = 'Player 2 Wins'
     }
 
     gameover = true
 }
 
 let timer = 61
 const time = document.querySelector('#timer')
 const displayText = document.querySelector('#displayText')
 console.log(displayText)
 let timerId
 
 function decreaseTimer() {
     if (timer > 0) {
        timerId =  setTimeout(decreaseTimer, 1000)
         timer--
         time.textContent = timer
     }
 
     if (timer === 0) {
         determineWinner({ player, enemy }, timerId)
         clearTimeout(timerId)
     }
 }
 