let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#..@.....#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

class level {
    constructor(plan) {
        let rows = plan.trim().split("\n").map(l => [...l]);
        //.trim() removes whitespace (spaces, newlines, tabs, and similar characters) from the start and end of a string
        //.split("\n") split the string into arrays, each line is an element of the array
        //.map(1 => [...1])             
        this.height = rows.length; //number of arrays in the row array
        this.width = rows[0].length; //number of characters in the first array (all lines have the same num of characters)
        this.startActors = []; //actors are all moving elements
        this.rows = rows.map((row, y) => {
        return row.map((ch, x) => {
            let type = levelChars[ch];
            if (typeof type == "string") return type;
            this.startActors.push(
                type.create(new Vec(x, y), ch));
                return "empty";
        });
        });
    }
}

class State {
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
    }
    static start(level) {
        return new State(level, level.startActors, "playing");
    }

    get player() {
        return this.actors.find(a => a.type == "player");
    }
}

class Vec {
    constructor(x, y) {
        this.x = x; this.y = y;
    }
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }
    times(factor) {
        return new Vec(this.x * factor, this.y *factor);
    }
}

class Player {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
    }

    get type() { return "player"; }
    
    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0.5)),
                          new Vec(0, 0));
    }
}

Player.prototype.site = new Vec(0.8, 1.5);

class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
    }

    get type() { return "lava"; }

    static create(pos, ch) {
        if (ch == "=") {
            return new Lava(pos, new Vec(2, 0));
        } else if (ch == "|") {
            return new Lava(pos, new Vec(0, 2));
        } else if (ch == "v") {
            return new Lava(pos, new Vec(0, 3), pos);
        }
    }
}

Lava.prototype.size = new Vec(1, 1);

class Coin {
    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
    }

    get type() { return "coin"; }

    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(basePos, basePos,
                           Math.random() * Math.PI * 2);
    }
}

Coin.prototype.size = new Vec(0.6, 0.6);

const levelChars = {
    ".": "empty", "#": "wall", "+": "lave",
    "@": Player, "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
};

let simpleLevel = new level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
