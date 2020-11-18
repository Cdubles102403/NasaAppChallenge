
var cols, rows;
var canvW, canvH;
var camX, camY, camZ, camDX, camDY;
var scl = 30;

var cam;

var terrain = [];
var tMin = 1;
var tMax = 0;

var displayNormal = true;
var displayHeight = false;
var displaySlope = false;

function setup() {
  document.getElementById("Canvas").onwheel = function(event){
    event.preventDefault();
  };

  document.addEventListener("contextmenu",
    function(event) {
      if (event.target.nodeName === "CANVAS") {
        event.preventDefault();
      }
    }
  , false);

  canvW = windowWidth * .8;
  canvH = windowHeight * .8;
  var canvas = createCanvas(canvW, canvH, WEBGL);
  canvas.parent("Canvas");

  cam = createCamera();
  camX = 0;
  camY = 150;
  camZ = 750;
  camDX = 0;
  camDY = 0;
  cam.setPosition(camX, camY, camZ);
  cam.lookAt(0, -300, 0);

  cols = 104;
  rows = 64;
  for(var x = 0; x <= rows; x++){
    terrain[x] = [];
    for(var y = 0; y < cols; y++){
      terrain[x][y] = noise(x * .25, y * .5);
      if (terrain[x][y] < tMin) tMin = terrain[x][y];
      if (terrain[x][y] > tMax) tMax = terrain[x][y];
    }
  }
}

function draw() {
  colorMode(RGB);
  background(24);
  fill(255, 255, 255);
  translate((-cols * scl) / 2, (-rows * scl) / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      if (displayNormal) {
        fill(50 + terrain[y][x] * 100, 50 + terrain[y][x] * 100, 50 + terrain[y][x] * 100);
      }
      else if (displayHeight) {
        colorMode(HSB);
        fill(360 - (((terrain[y][x] - tMin) / (tMax - tMin * .85)) * 360), 100, 100);
        console.log(terrain[y][x]);
      }
      else if (displaySlope) {
        colorMode(HSB);

      }
      vertex(x * scl, y * scl, terrain[y][x] * 150);
      vertex(x * scl, (y + 1) * scl, terrain[y+1][x] * 150);
    }
    endShape();
  }
  rect(0, 0, cols * scl, (rows - 1) * scl);

  camX += camDX * ((camZ - 100) / 900);
  camY += camDY * ((camZ - 100)/ 900);

  cam.setPosition(camX, camY, camZ);

  camDX /= 4;
  camDY /= 4;

  setCamera(cam);

  let azimuth = random(90);
}

$(function() {
  $("#sendFile").click(function() {
    var file = $("#fileUpload")[0].files[0];
    console.log(file)
    
    var obj = {"File":file}
    $.ajax({
      type: "POST",
      url: 'upload',
      data: file,
      processData: false,
      contentType: false,
    })
  })
})

$(function() {
  $("#normal").click(function() {
    displayNormal = true;
    displayHeight = false;
    displaySlope = false;
  })
  $("#height").click(function() {
    displayNormal = false;
    displayHeight = true;
    displaySlope = false;
  })
  $("#slope").click(function() {
    displayNormal = false;
    displayHeight = false;
    displaySlope = true;
  })
})

function mouseDragged(event) {
  if (event.buttons === 1) {
    camDX -= movedX;
    camDY -= movedY;
  }
}

function keyPressed(event) {
  if (keyCode === 32) {
    //cam.lookAt(0, 0, 0);
  }
}

function mouseWheel(event) {
  if (event.target.nodeName === "CANVAS") {
    camZ += event.delta * 10;
  }
  if (camZ < 150) {
    camZ = 150;
  }
  if (camZ > 1600) {
    camZ = 1600;
  }
}