(function() { "use strict"

  var controller, display, game;

  // controller start
  controller = {
    down:false, left:false, right:false, up:false, space:false,

    keyUpDown:function(event) {
      var key_state = (event.type == "keydown")?true:false;
      switch(event.keyCode) {
        case 37: controller.left = key_state; break; // left key
        case 38: controller.up = key_state; break; // up key
        case 39: controller.right = key_state; break; // right key
        case 40: controller.down = key_state; break; // down key
        case 32: controller.space = key_state; break; // spcae key
      }
    }
  };
  // controller finnish

  // display start
  display = {
    buffer:document.createElement("canvas").getContext("2d"),
    context:document.querySelector("canvas").getContext("2d"),


    render:function() {
      for (let index = game.world.map.length - 1; index > -1; -- index) {
        this.buffer.fillStyle = (game.world.map[index] > 0)?("#0099" + game.world.map[index] + "f"):"#303840";
        this.buffer.fillRect((index % game.world.columns) * game.world.tile_size, Math.floor(index / game.world.columns) * game.world.tile_size, game.world.tile_size, game.world.tile_size);
      }
      this.buffer.fillStyle = game.player.color;
      this.buffer.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);

      this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height);
    },

    resize:function(event) {
      var client_height = document.documentElement.clientHeight;
      display.context.canvas.width = document.documentElement.clientWidth;
      display.context.canvas.height = Math.floor(display.context.canvas.width * 0.475);
      display.render();
    }
  };
  // display finnish

  // game start
  game = {
    player: {
      color:"#ff9900",
      height: 32,
      width: 32,
      jumping: true,
      crouch: false,
      ability: true,
      x: 120,
      y: 320,
      old_x: 120 + 16,
      old_y: 320 + 16,
      velocity_x: 0,
      velocity_y: 0,
      get bottom()    { return this.y + this.height; },
      get oldBottom() { return this.old_y + this.height; },
      get left()      { return this.x; },
      get oldLeft()   { return this.old_x; },
      get right()     { return this.x + this.width; },
      get oldRight()  { return this.old_x + this.width; },
      get top()       { return this.y; },
      get oldTop()    { return this.old_y; }
    },

    world: {
      columns:21,
      rows:10,
      tile_size:40,
      map: 0,

      map1: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            5,0,0,0,0,6,0,0,0,0,0,0,0,0,0,7,0,0,0,0,5,
            0,5,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,5,0,
            0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,4,4,4,0,0,0,0,0,4,4,4,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],

      map2:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,
            0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,5,
            5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,
            0,0,0,0,0,0,0,4,4,4,4,0,0,0,0,5,5,5,5,5,5,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,
            0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,5,5,5,5,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,5,2,0,0,7,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,5,5,2,0,0,0,0,0,5,5,5,5,5,
            4,4,4,4,4,4,4,4,4,4,2,8,8,8,8,8,4,4,4,4,4]
    },

    collision: {
      // collision from bottom
      1:function(object, row, column) {
        this.bottomCollision(object, row);
      },
      // collision from right
      2:function(object, row, column) {
        this.rightCollision(object, column);
      },
      // collision from left
      3:function(object, row, column) {
        this.leftCollision(object, column);
      },
      // collision from above
      4:function(object, row, column) {
        this.topCollision(object, row);
      },
      // block with four walls
      5:function(object, row, column) {
        if (this.topCollision(object, row)) { return; }
        if (this.leftCollision(object, column)) { return; }
        if (this.rightCollision(object, column)) { return; }
        this.bottomCollision(object, row);
      },
      // power up
      6:function(object, row, column) {
        if (this.topCollision2(object, row)) { return; }
        if (this.leftCollision2(object, column)) { return; }
        if (this.rightCollision2(object, column)) { return; }
        this.bottomCollision2(object, row);
      },
      leftCollision2(object, column) {
        if (object.x - object.old_x > 0) {
          var left = column * game.world.tile_size;
          if (object.right > left && object.oldRight <= left) {
            object.ability = true;
            return true;
          }
        }
        return false;
      },
      rightCollision2(object, column) {
        if (object.x - object.old_x < 0) {
          var right = (column + 1) * game.world.tile_size;
          if (object.left < right && object.oldLeft >= right) {
            object.ability = true;
            return true;
          }
        }
        return false;
      },
      bottomCollision2(object, row) {
        if (object.y - object.old_y < 0) {
          var bottom = (row + 1) * game.world.tile_size;
          if (object.top < bottom && object.oldTop >= bottom) {
            object.ability = true;
          }
        }
      },
      topCollision2(object, row) {
        if (object.y - object.old_y > 0) {
          var top = row * game.world.tile_size;
          if (object.bottom > top && object.oldBottom <= top) {
            object.ability = true;
            return true;
          }
        }
        return false;
      },
      // jump reset
      7:function(object, row, column) {
        if (this.topCollision3(object, row)) { return; }
        if (this.leftCollision3(object, column)) { return; }
        if (this.rightCollision3(object, column)) { return; }
        this.bottomCollision3(object, row);
      },
      leftCollision3(object, column) {
        if (object.x - object.old_x > 0) {
          var left = column * game.world.tile_size;
          if (object.right > left && object.oldRight <= left) {
            object.jumping = false;
            return true;
          }
        }
        return false;
      },
      rightCollision3(object, column) {
        if (object.x - object.old_x < 0) {
          var right = (column + 1) * game.world.tile_size;
          if (object.left < right && object.oldLeft >= right) {
            object.jumping = false;
            return true;
          }
        }
        return false;
      },
      bottomCollision3(object, row) {
        if (object.y - object.old_y < 0) {
          var bottom = (row + 1) * game.world.tile_size;
          if (object.top < bottom && object.oldTop >= bottom) {
            object.jumping = false;
          }
        }
      },
      topCollision3(object, row) {
        if (object.y - object.old_y > 0) {
          var top = row * game.world.tile_size;
          if (object.bottom > top && object.oldBottom <= top) {
            object.jumping = false;
            return true;
          }
        }
        return false;
      },
      8:function(object, row, column) {
        if (this.topCollision4(object, row)) { return; }
        if (this.leftCollision4(object, column)) { return; }
        if (this.rightCollision4(object, column)) { return; }
        this.bottomCollision4(object, row);
      },
      leftCollision4(object, column) {
        if (object.x - object.old_x > 0) {
          var left = column * game.world.tile_size;
          if (object.right > left && object.oldRight <= left) {
            object.y = 0;
            return true;
          }
        }
        return false;
      },
      rightCollision4(object, column) {
        if (object.x - object.old_x < 0) {
          var right = (column + 1) * game.world.tile_size;
          if (object.left < right && object.oldLeft >= right) {
            object.y = 0;
            return true;
          }
        }
        return false;
      },
      bottomCollision4(object, row) {
        if (object.y - object.old_y < 0) {
          var bottom = (row + 1) * game.world.tile_size;
          if (object.top < bottom && object.oldTop >= bottom) {
            object.y = 0;
          }
        }
      },
      topCollision4(object, row) {
        if (object.y - object.old_y > 0) {
          var top = row * game.world.tile_size;
          if (object.bottom > top && object.oldBottom <= top) {
            object.y = 0;
            return true;
          }
        }
        return false;
      },


      leftCollision(object, column) {
        if (object.x - object.old_x > 0) {
          var left = column * game.world.tile_size;
          if (object.right > left && object.oldRight <= left) {
            object.velocity_x = 0;
            object.x = object.old_x = left - object.width - 0.001;
            return true;
          }
        }
        return false;
      },
      rightCollision(object, column) {
        if (object.x - object.old_x < 0) {
          var right = (column + 1) * game.world.tile_size;
          if (object.left < right && object.oldLeft >= right) {
            object.velocity_x = 0;
            object.old_x = object.x = right;
            return true;
          }
        }
        return false;
      },
      bottomCollision(object, row) {
        if (object.y - object.old_y < 0) {
          var bottom = (row + 1) * game.world.tile_size;
          if (object.top < bottom && object.oldTop >= bottom) {
            object.velocity_y = 0;
            object.old_y = object.y = bottom;
          }
        }
      },
      topCollision(object, row) {
        if (object.y - object.old_y > 0) {
          var top = row * game.world.tile_size;
          if (object.bottom > top && object.oldBottom <= top) {
            object.velocity_y = 0;
            object.old_y = object.y = top - object.height - 0.01;
            object.jumping = false;
            return true;
          }
        }
        return false;
      }
    },

    // The game loop:
    loop:function() {

      // gameplay
      if (controller.left) {
        game.player.velocity_x -= 0.5;
      }
      if (controller.right) {
        game.player.velocity_x += 0.5;
      }
      if (controller.up && game.player.jumping == false) {
        game.player.velocity_y -= 30;
        game.player.jumping = true;
      }
      if (controller.down && game.player.crouch == false) {
        game.player.y += 16;
        game.player.height = 16;
        game.player.crouch = true;
      }
      if ( !controller.down && game.player.crouch == true) {
        game.player.y -= 16;
        game.player.height = 32;
        game.player.crouch = false;
      }
      if (controller.space && game.player.ability == true) {
        game.player.ability = false;
        if (game.player.x > game.player.old_x) {
          game.player.x += 120;
        }
        else if (game.player.x < game.player.old_x) {
          game.player.x -= 120;
        }
        else {
          game.player.x += 120;
        }
      }

      // ability ready
      if (game.world.map == 0) {
        game.world.map = game.world.map1;
      }

      if (game.player.ability == true) {
        game.player.color = "#FF0000";
      }
      if (game.player.ability == false) {
        game.player.color = "#ff9900";
      }

      // map
      if (game.player.x > display.buffer.canvas.width - game.player.width - 1) {
        game.player.x = 2;
        game.world.map = game.world.map2;
      }
      if (game.player.x < 1) {
        game.player.x = display.buffer.canvas.width - game.player.width - 3;
        game.world.map = game.world.map1;
      }

      // game physics
      game.player.velocity_x *= 0.9; //friction
      game.player.velocity_y *= 0.9; //friction

      game.player.velocity_y += 1.0; //gravity

      // update player
      game.player.old_x = game.player.x;
      game.player.old_y = game.player.y;

      game.player.x += game.player.velocity_x;
      game.player.y += game.player.velocity_y;

      // Do collision detection and response with the boundaries of the screen.
      if (game.player.x < 0) {
        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = 0;
      } else if (game.player.x + game.player.width > display.buffer.canvas.width) {
        game.player.velocity_x = 0;
        game.player.old_x = game.player.x = display.buffer.canvas.width - game.player.width - 0.001;
      }
      if (game.player.y < 0) {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = 0;
      } else if (game.player.y + game.player.height > display.buffer.canvas.height) {
        game.player.velocity_y = 0;
        game.player.old_y = game.player.y = display.buffer.canvas.height - game.player.height - 0.001;
      }

      // collision detection points
      // look for collision on the left side of the player when moving left
      if (game.player.x - game.player.old_x < 0) {
        var left_column    = Math.floor(game.player.left / game.world.tile_size);

        var bottom_row     = Math.floor(game.player.bottom / game.world.tile_size); // Check the bottom left point
        var value_at_index = game.world.map[bottom_row * game.world.columns + left_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, left_column);
        }
        var top_row    = Math.floor(game.player.top / game.world.tile_size); // Check the top left point
        value_at_index = game.world.map[top_row * game.world.columns + left_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, left_column);
        }

      // look for collision on the right side of the player when moving right
      } else if (game.player.x - game.player.old_x > 0) {
        var right_column   = Math.floor(game.player.right / game.world.tile_size);

        var bottom_row     = Math.floor(game.player.bottom / game.world.tile_size); // Check the bottom right point
        var value_at_index = game.world.map[bottom_row * game.world.columns + right_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, right_column);
        }
        var top_row    = Math.floor(game.player.top / game.world.tile_size); // Check the top right point
        value_at_index = game.world.map[top_row * game.world.columns + right_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, right_column);
        }
      }

      // look for collision on the top of the player when moving up
      if (game.player.y - game.player.old_y < 0) {
        var left_column    = Math.floor(game.player.left / game.world.tile_size);

        var top_row        = Math.floor(game.player.top / game.world.tile_size); // Check the top left point
        var value_at_index = game.world.map[top_row * game.world.columns + left_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, left_column);
        }
        var right_column = Math.floor(game.player.right / game.world.tile_size); // Check the top right point
        value_at_index = game.world.map[top_row * game.world.columns + right_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, top_row, right_column);
        }

      // look for collision on the bottom of the player when moving down
      } else if (game.player.y - game.player.old_y > 0) {
        var left_column    = Math.floor(game.player.left / game.world.tile_size);

        var bottom_row     = Math.floor(game.player.bottom / game.world.tile_size); // Check the bottom left point
        var value_at_index = game.world.map[bottom_row * game.world.columns + left_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, left_column);
        }
        var right_column = Math.floor(game.player.right / game.world.tile_size); // Check the bottom right point
        value_at_index = game.world.map[bottom_row * game.world.columns + right_column];
        if (value_at_index != 0) {
          game.collision[value_at_index](game.player, bottom_row, right_column);
        }
      }

      display.render();

      window.requestAnimationFrame(game.loop);

    }

  };
  // game finnish

  // unspecified
  display.buffer.canvas.height = game.world.rows * game.world.tile_size;
  display.buffer.canvas.width = game.world.columns * game.world.tile_size;

  window.addEventListener("resize", display.resize);
  window.addEventListener("keydown", controller.keyUpDown);
  window.addEventListener("keyup", controller.keyUpDown);

  display.resize();

  game.loop();

})();
