var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var score = 0;
var scoreText;
var gameOver = false;

var game = new Phaser.Game(config);

function preload(){
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/plataform.png");
    this.load.image("star", "assets/star1.png");
    this.load.image("bomb", "assets/water.png")
    this.load.spritesheet("dude", "assets/dude.png", {frameWidth:67.2, frameHeight:90});
}

function create(){
    this.add.image(960, 565.5, "sky");

    platforms = this.physics.add.staticGroup();

    platforms.create(100, 600, "ground").setScale(1.5);
    platforms.create(400, 600, "ground").setScale(1.5);
    platforms.create(600, 600, "ground").setScale(1.5);
    platforms.create(620, 425, "ground");
    platforms.create(180, 320, "ground");
    platforms.create(530, 150, "ground");

    player = this.physics.add.sprite(100, 400, "dude");

    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "turn",
        frames: [{key: "dude", frame: 4}],
        frameRate: 20,
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });

    // player.body.setGravityY(300);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: "star",
        repeat: 10,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, true);

    scoreText = this.add.text(16, 16, "Score: 0", {fontSize: "32px", fill: "00000"});

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

}

function update(){

    if(gameOver) {
        return
    }

    if(cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play("left", true);
    } else if(cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play("right", true);
    } else {
        player.setVelocityX(0);
        player.anims.play("turn", true);
    }

    if(cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-350);
    }

}

function collectStar(player, star){
    star.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);

    if(stars.countActive(true) === 0) {
        stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true)
        });
    
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 50, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

function hitBomb(player, bomb){
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;
}