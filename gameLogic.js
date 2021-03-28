let canvas = document.getElementById("gameCanvas")
let ctx = canvas.getContext('2d')
let introScreen = true
let gameScreen = false
let endScreen = false
let objects = []
let level = 1
let lives = 3
let difficulty = 5
let score = 0

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (introScreen) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white"
        ctx.fillText("Instructions", 400, 100)
        ctx.fillText("1. Use your arrow keys to move Nemo up and down", 50, 150)
        ctx.fillText("2. Make sure to dodge the sharks and don't get eaten!", 50, 200)
        ctx.fillText("3. To progress in the game, eat as many Planktons as you can!", 50, 250)
        ctx.fillText("4. The game will get harder the farther you get.", 50, 300)
        ctx.fillText("5. Click Play to begin!", 50, 350)
    } else if (endScreen) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "white"
        ctx.fillText("Game Over!", 400, 100)
        ctx.fillText(`Score: ${score}`, 50, 150)
        ctx.fillText(`Level: ${level}`, 50, 200)
        ctx.fillText("Click Play to try again!", 50, 350)
    } else if (gameScreen) {
        ctx.drawImage(playerObject.img, playerObject.x, playerObject.y, playerObject.width, playerObject.height)
        ctx.font = "30px Arial";
        ctx.fillStyle = "white"
        ctx.fillText(`Score: ${score} Level: ${level} Lives: ${lives}`, 400, 100)
        if (time % 150 === 0) {
            switch (Math.floor(Math.random() * 2)) {
                case 0:
                    let newShark = new Shark(playerObject.y)
                    objects.push(newShark)
                    break
                case 1:
                    let newPlankton = new Plankton()
                    objects.push(newPlankton)
                    break
            }
        }
        objects.forEach(obj => {
            obj.move()
            ctx.drawImage(obj.image, obj.x, obj.y, obj.width, obj.height)
            if (playerObject.x < obj.y + obj.width &&
                playerObject.x + playerObject.width > obj.x &&
                playerObject.y < obj.y + obj.height &&
                playerObject.y + playerObject.height > obj.y) {
                if (obj instanceof Plankton) {
                    objects = objects.filter(object => object !== obj)
                    score++
                    if (score % 10 === 0) {
                        difficulty += 2
                        level++
                    }
                }
                if (obj instanceof Shark) {
                    objects = objects.filter(object => object !== obj)
                    lives--
                    if (lives === 0) {
                        introScreen = false
                        gameScreen = false
                        endScreen = true
                    }
                }
            }
        })
    }
}


document.getElementById("startGame").addEventListener("click", () => {
    introScreen = false
    endScreen = false
    gameScreen = true
    objects = []
    level = 1
    lives = 3
    difficulty = 5
    score = 0
})

let playerObject = {
    img: null,
    x: 0,
    y: 360,
    height: 100,
    width: 125,
    speed: 15
}
playerObject.img = new Image()
playerObject.img.src = 'static/nemo.png'

let time = 0

function main() {
    time++
    draw()
}

setInterval(main, 10)

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "Up") {
        playerObject.y -= 15
    } else if (event.key === "ArrowDown" || event.key === "Down") {
        playerObject.y += 15
    }
})

function Shark(height) {
    this.image = new Image()
    this.image.src = 'static/shark.png'
    this.x = canvas.width
    this.y = height
    this.width = 125
    this.height = 100
    this.move = () => {
        if (this.x <= 0) {
            objects = objects.filter(obj => obj !== this)
        } else {
            this.x -= difficulty
        }
    }
}

function Plankton() {
    this.image = new Image()
    this.image.src = 'static/plankton.png'
    this.x = canvas.width
    this.y = Math.floor(Math.random() * (canvas.height - 125)) + 125
    this.width = 100
    this.height = 125
    this.move = () => {
        if (this.x <= 0) {
            objects = objects.filter(obj => obj !== this)
        } else {
            this.x -= difficulty
        }
    }
}
