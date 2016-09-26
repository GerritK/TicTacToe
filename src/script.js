$(document).ready(function () {
    const VOID = 0;
    const CROSS = 1;
    const CIRCLE = 2;

    var score = [0, 0];
    var finished = false;
    var player = 0;
    var computer = 2;
    var playground = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    function init() {
        finished = false;
        player = 0;
        for(var x = 0; x < playground.length; x++) {
            for(var y = 0; y < playground[x].length; y++) {
                playground[x][y] = 0;
            }
        }

        $(".playground td").click(function () {
            var coords = $(this).attr("id").split("_");
            if(!finished && player != computer && markField(parseInt(coords[1]), parseInt(coords[2]))) {
                drawPlayground();
                turn();
            }
        });

        turn();
        drawPlayground();
    }

    function drawPlayground() {
        $(".board #score_1").text(score[0]);
        $(".board #score_2").text(score[1]);

        if(player == 1) {
            $("#player_1").addClass("turn");
            $("#player_2").removeClass("turn");
        } else if(player == 2) {
            $("#player_2").addClass("turn");
            $("#player_1").removeClass("turn");
        } else {
            $("#player_1").removeClass("turn");
            $("#player_2").removeClass("turn");
        }

        for(var x = 0; x < playground.length; x++) {
            for(var y = 0; y < playground[x].length; y++) {
                var elem = $("#field_" + x + "_" + y);
                var field = playground[x][y];

                if(field == CROSS) {
                    elem.addClass("cross");
                    elem.removeClass("circle");
                } else if(field == CIRCLE) {
                    elem.addClass("circle");
                    elem.removeClass("cross");
                } else {
                    elem.removeClass("cross");
                    elem.removeClass("circle");
                }
            }
        }
    }

    function turn() {
        var winner = checkPlayground();

        if(winner == 0) {
            if(getFieldsBySymbol(VOID).length == 0) {
                winner = 3;
            }
        }

        if(winner > 0) {
            finished = true;
            setTimeout(function () {
                if(winner == 3) {
                    alert("Draw!");
                } else if(winner == 2) {
                    alert("Player 2 wins!");
                    score[1]++;
                } else if(winner == 1) {
                    alert("Player 1 wins!");
                    score[0]++;
                }
                init();
            }, 250);
        } else {
            nextPlayer();

            if (player == computer) {
                setTimeout(computerTurn, 500);
            }
        }
    }

    function computerTurn() {
        var field = {x: 0, y: 0};
        var fields = getWinningFieldsBySymbol(player);
        console.log("WIN::", fields);

        if(fields.length > 0) {
            field = fields[random(0, fields.length)];
        } else {
            fields = getWinningFieldsBySymbol(getOtherPlayer(player));
            console.log("LOSE::", fields);

            if(fields.length > 0) {
                field = fields[random(0, fields.length)];
            } else {
                if(playground[1][1] == VOID) {
                    console.log("FREE CENTER!");
                    field = {x: 1, y: 1};
                } else {
                    fields = getFieldsBySymbol(VOID);
                    console.log("FREE::", fields);

                    field = fields[random(0, fields.length)];
                }
            }
        }

        if(markField(field.x, field.y)) {
            drawPlayground();
            turn();
        } else {
            computerTurn();
        }
    }

    function nextPlayer() {
        if(player == CROSS) {
            player = CIRCLE;
        } else if(player == CIRCLE) {
            player = CROSS;
        } else {
            player = random(1, 3);
        }
    }

    function markField(x, y) {
        if(playground[x][y] == VOID) {
            playground[x][y] = player;
            return true;
        }

        return false;
    }

    function getFieldsBySymbol(symbol) {
        var result = [];

        for(var x = 0; x < playground.length; x++) {
            for(var y = 0; y < playground[x].length; y++) {
                if(playground[x][y] == symbol) {
                    result.push({x: x, y: y});
                }
            }
        }

        return result;
    }

    function getWinningFieldsBySymbol(symbol, freeSymbol) {
        var result = [];

        if(freeSymbol === undefined) {
            freeSymbol = VOID;
        }

        for(var x = 0; x < playground.length; x++) {
            if(playground[x][0] == symbol && playground[x][1] == symbol && playground[x][2] == freeSymbol) {
                result.push({x: x, y: 2});
            }
            if(playground[x][0] == symbol && playground[x][1] == freeSymbol && playground[x][2] == symbol) {
                result.push({x: x, y: 1});
            }
            if(playground[x][0] == freeSymbol && playground[x][1] == symbol && playground[x][2] == symbol) {
                result.push({x: x, y: 0});
            }
        }

        for(var y = 0; y < playground[0].length; y++) {
            if(playground[0][y] == symbol && playground[1][y] == symbol && playground[2][y] == freeSymbol) {
                result.push({x: 2, y: y});
            }
            if(playground[0][y] == symbol && playground[1][y] == freeSymbol && playground[2][y] == symbol) {
                result.push({x: 1, y: y});
            }
            if(playground[0][y] == freeSymbol && playground[1][y] == symbol && playground[2][y] == symbol) {
                result.push({x: 0, y: y});
            }
        }

        if(playground[0][0] == symbol && playground[1][1] == symbol && playground[2][2] == freeSymbol) {
            result.push({x: 2, y: 2});
        }
        if(playground[0][0] == symbol && playground[1][1] == freeSymbol && playground[2][2] == symbol) {
            result.push({x: 1, y: 1});
        }
        if(playground[0][0] == freeSymbol && playground[1][1] == symbol && playground[2][2] == symbol) {
            result.push({x: 0, y: 0});
        }

        if(playground[0][2] == symbol && playground[1][1] == symbol && playground[2][0] == freeSymbol) {
            result.push({x: 2, y: 0});
        }
        if(playground[0][2] == symbol && playground[1][1] == freeSymbol && playground[2][0] == symbol) {
            result.push({x: 1, y: 1});
        }
        if(playground[0][2] == freeSymbol && playground[1][1] == symbol && playground[2][0] == symbol) {
            result.push({x: 0, y: 2});
        }

        return result;
    }

    function checkPlayground() {
        for(var i = 1; i <= 2; i++) {
            for(var x = 0; x < playground.length; x++) {
                if(playground[x][0] == i && playground[x][1] == i && playground[x][2] == i) {
                    return i;
                }
            }
            for(var y = 0; y < playground[0].length; y++) {
                if(playground[0][y] == i && playground[1][y] == i && playground[2][y] == i) {
                    return i;
                }
            }

            if(playground[0][0] == i && playground[1][1] == i && playground[2][2] == i) {
                return i;
            }
            if(playground[0][2] == i && playground[1][1] == i && playground[2][0] == i) {
                return i;
            }
        }

        return 0;
    }

    function getOtherPlayer(player) {
        if(player == CROSS) {
            return CIRCLE;
        } else if(player == CIRCLE) {
            return CROSS;
        }
        return 0;
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    init();
});