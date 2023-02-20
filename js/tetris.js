window.onload = () => {
    const
        background = document.getElementById("background"),
        lblScore = document.getElementById("score"),
        lblLines = document.getElementById("lines"),
        canvas = document.getElementById("game-canvas"),
        ctx = canvas.getContext("2d");

    class Tetromino {
        static COLORS = ["blue", "green", "yellow", "red", "orange", "light-blue", "purple"];
        static BLOCK_SIZE = 28;
        static DELAY = 400;
        static DELAY_INCREASED = 5;

        constructor(xs, ys, color = null) {
            this.x = xs;
            this.y = ys;
            this.length = xs.length;
            if (color !== null) {
                this.color = color;
                this.img = new Image();
                this.img.src = `./src/${Tetromino.COLORS[color]}.jpg`
            }
        }

        update(updateFunc) {
            for (let i = 0; i < this.length; ++i) {
                ctx.clearRect(                    
                    this.x[i] * Tetromino.BLOCK_SIZE,
                    this.y[i] * Tetromino.BLOCK_SIZE,
                    Tetromino.BLOCK_SIZE,
                    Tetromino.BLOCK_SIZE
                );

                updateFunc(i);
            }

            this.draw();

        }

        draw() {
            if (!this.img.complete) {
                this.img.onload = () => this.draw();
                return;
            }
            // Print the current tetromine
            for (let i = 0; i < this.length; ++i) {
                ctx.drawImage(
                    this.img,
                    this.x[i] * Tetromino.BLOCK_SIZE,
                    this.y[i] * Tetromino.BLOCK_SIZE,
                    Tetromino.BLOCK_SIZE,
                    Tetromino.BLOCK_SIZE
                );
            }            
            
        }   
        
        collides() {
            for(let i = 0; i < this.length; ++i) {
                const {x, y} = checkFunc(i);
                if (x < 0 || x >= FIELD_WIDTH || y < 0 || y >= FIELD_HEIGHT || FIELD[y][x] !== false)
                return true;
            }
            return false;
        }

        merge() {
            for(let i = o; i <= this.length; ++i) {
                FIELD[this.y[i]][this.x[i]] = this.color;
            }
        }

        rotate() {
            const 
                maxX = Math.max(...thix.x),
                minX = Math.min(...thix.x),
                maxY = Math.max(...thix.y),
                nx=[],
                ny=[];

            if(!this.collides(i => {
                nx.push(maxX + minY - tetrominos.y[i]);
                ny.push(tetrominos.x[i] - minX + minY);
                return { x: nx[i], y: [i] };
            }))
            {
                this.update(i => {
                    this.x[i] = nx[i];
                    this.y[i] = ny[i];
                });
            }

        }

    }

    const
        FIELD_WIDTH = 10,
        FIELD_HEIGHT = 20,
        FIELD = Array.from({ length: FIELD_HEIGHT }),
        MIN_VALID_ROW = 4,
        TETROMINOES = [
            new Tetromino([0, 0, 0, 0], [0, 1, 2, 3]),
            new Tetromino([0, 0, 1, 1], [0, 1, 0, 1]),
            new Tetromino([0, 1, 1, 1], [0, 0, 1, 2]),
            new Tetromino([0, 0, 0, 1], [0, 1, 2, 0]),
            new Tetromino([0, 1, 1, 2], [0, 0, 1, 1]),
            new Tetromino([0, 1, 1, 2], [1, 1, 0, 1]),
            new Tetromino([0, 1, 1, 2], [1, 1, 0, 0])
        ];

    let tetrominos = null,
        delay,
        score,
        lines;



    (function setup() {

        canvas.style.top = Tetromino.BLOCK_SIZE;
        canvas.style.left = Tetromino.BLOCK_SIZE;

        ctx.canvas.width = FIELD_WIDTH * Tetromino.BLOCK_SIZE;
        ctx.canvas.height = FIELD_HEIGHT * Tetromino.BLOCK_SIZE;

        // Scale background
        const scale = Tetromino.BLOCK_SIZE / 13.8333;
        background.style.width = scale * 166;
        background.style.height = scale * 304;

        // Offset each block to the middle of the table width
        const middle = Math.floor(FIELD_WIDTH / 2);
        for (const t of TETROMINOES) t.x = t.x.map(x => x + middle);

        reset();
        draw();
    })();

    function reset() {
        // Make false all blocks
        FIELD.forEach((_, y) => FIELD[y] = Array.from({ length: FIELD_WIDTH }).map(_ => false));

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        delay = Tetromino.DELAY;
        score = 0;
        lines = 0;
    }   

    function draw() {
        if (tetrominos) {

            //Collision?
            if (tetrominos.collides(i => ({x:tetrominos.x[i], y:tetrominos + 1}))){
                tetrominos.merge();
            // Prepare for new tetromino
            tetrominos = null;

            } else 

            tetrominos.update(i => ++tetrominos.y[i]);

        }
        //No tetromino failing
        else {

            lblScore.innerText = score;
            lblLines.innerText = lines;

            // Create random tetrominos
            tetrominos = (({ x, y }, color) => 
            new Tetromino([...x], [...y], color) 
            )(
                TETROMINOES[Math.floor(Math.random() * (TETROMINOES.length - 1))],
                Math.floor(Math.random() * (Tetromino.COLORS.length - 1))
            );

            tetrominos.draw();

        }

        setTimeout(draw, delay);

    }

    //Move
    window.onkeydown = event => {
        switch(event.key) {
            case "ArrowLeft":
                if(!tetrominos.colliders(i => ({x: tetrominos.x[i] - 1, y: tetrominos.y[1]})))
                tetrominos.update(i => --tetrominos.x[1]);
                break;
            case "ArrowRight":
                if(!tetrominos.colliders(i => ({x: tetrominos.x[i] + 1, y: tetrominos.y[1]})))
                tetrominos.update(i => ++tetrominos.x[1]);
                break;
            case "ArrowDown":
                delay = Tetromino.DELAY / Tetromino.DELAY_INCREASED;
                break;
        }
    }
}