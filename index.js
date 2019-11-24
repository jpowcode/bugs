// Import stylesheets
import './style.css';

// the world grid: a 2d array of tiles
var world = [[]];

// size in the world in sprite tiles
var worldWidth = 48;
var worldHeight = 48;

// size of a tile in pixels (this is only important for drawing)
var tileWidth = 8;
var tileHeight = 8;

/*
Variables we can use to tweak our demo!
*/
var initspec1 = 0.2;
var initspec2 = 0.1;
var deathLimit = 3;
var birthLimit = 4;
var numberOfSteps = 2;

//This is called right at the start when the page loads
function onload() 
{
  //HTML5 stuff
  canvas = document.getElementById('gameCanvas');
  canvas.width = worldWidth * tileWidth;
  canvas.height = worldHeight * tileHeight;
  ctx = canvas.getContext("2d");
  //Make the world map!
  world = generateMap();
  redraw();
}

function generateMap()
{
    var map = [[]];
    //And randomly scatter solid blocks
    initialiseMap(map);

    return map;
}

function initialiseMap(map)
{
  for (var x=0; x < worldWidth; x++)
    map[x] = [];
  
  for (var x=0; x < worldWidth; x++)
  {
    for (var y=0; y < worldHeight; y++)
    {
      var rand_num = Math.random()
      if (rand_num < initspec1)
        {map[x][y] = 1;}
      else if (rand_num > initspec1 && rand_num < initspec1+initspec2)
        {map[x][y] = 2;}
      else 
        {map[x][y] = 0;}
    }
  }
  return map;
}

//This is called whenever you press the 'doSimulationStep' button
function iterate()
{
    world = doSimulationStep(world);
    redraw();
}

//Used to create a new world - it grabs the values from
//the HTML form so you can affect the world gen :)
function recreate(form)
{
  birthLimit = form.birthLimit.value;
  deathLimit = form.deathLimit.value;
  initspec1 = form.initspec1.value;
  initspec2 = form.initspec2.value;
  numberOfSteps = form.numSteps.value;
    
  world = generateMap();
  redraw();
}


function doSimulationStep(map)
{
    //Here's the new map we're going to copy our data into
    var newmap = [[]];
    for(var x = 0; x < map.length; x++){
        newmap[x] = [];
        for(var y = 0; y < map[0].length; y++)
        {    
            //Count up the neighbours
            var nbs = countAliveNeighbours(map, x, y);
            //If the tile is currently solid
            if(map[x][y] > 0){
                //See if it should die
                if(nbs < deathLimit){
                    newmap[x][y] = 0;
                }
                //Otherwise keep it solid
                else{
                    newmap[x][y] = 1;   
                }
            }
            //If the tile is currently empty
            else{
                //See if it should become solid
                if(nbs > birthLimit){
                    newmap[x][y] = 1;       
                }
                else{
                    newmap[x][y] = 0;      
                }
            }
        }
    }
    
    return newmap;
}

//This function counts the number of solid neighbours a tile has
function countAliveNeighbours(map, x, y)
{
    var count = 0;
    for(var i = -1; i < 2; i++){
        for(var j = -1; j < 2; j++){
            var nb_x = i+x;
            var nb_y = j+y;
            if(i == 0 && j == 0){
            }
            //If it's at the edges, consider it to be solid (you can try removing the count = count + 1)
            else if(nb_x < 0 || nb_y < 0 ||
                    nb_x >= map.length ||
                    nb_y >= map[0].length){
                count = count + 1;   
            }
            else if(map[nb_x][nb_y] == 1){
                count = count + 1;
            }
        }
    }
    return count;
}


function redraw() 
{
  // clear the screen
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  for (var x=0; x < worldWidth; x++)
  {
    for (var y=0; y < worldHeight; y++)
    {

      if(world[x][y] == 1)
        {
        var colour = "#32CD32";
         circle(x*tileWidth, y*tileWidth, 2, colour );
        }
      else if(world[x][y] == 2)
        {
        colour = "#00FFFF";
        circle(x*tileWidth, y*tileWidth, 2, colour );
        }
    }
  }
}

function circle( x, y, r, colour)
  //Draw a filled circle
{
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2*Math.PI, true);
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = colour;
  ctx.stroke();
}

// the game's canvas element
var canvas = null;
// the canvas 2d context
var ctx = null;

// ensure that concole.log doesn't cause errors
if (typeof console == "undefined") var console = { log: function() {} };

// start running immediately
onload();

// export function names to the global scope
window.iterate = iterate;
window.recreate = recreate;
