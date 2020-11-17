
var cols, rows;
var canvW, canvH;
var camX, camY, camZ, camDX, camDY;
var scl = 30;

var cam;

var terrain = [];

var displayNormal = true;
var displayHeight = false;
var displayslope = false;

function setup() {

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
  camY = 0;
  camZ = 750;
  camDX = 0;
  camDY = 0;
  cam.setPosition(camX, camY, camZ);
  cam.lookAt(0, 0, 0);

  cols = 96;
  rows = 64;
  for(var x = 0; x <= rows; x++){
    terrain[x] = [];
    for(var y = 0; y < cols; y++){
      terrain[x][y] = noise(x * .4, y * .4);
    }
  }
}

function draw() {
  background(24);
  fill(255, 255, 255);
  translate((-cols * scl) / 2, (-rows * scl) / 2);
  for (var y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      fill(50 + terrain[y][x] * 100, 50 + terrain[y][x] * 100, 50 + terrain[y][x] * 100);
      vertex(x * scl, y * scl,terrain[y][x] * 120);
      vertex(x * scl, (y + 1) * scl,terrain[y+1][x] * 120);
    }
    endShape();
  }
  rect(0, 0, cols * scl, rows * scl);

  camX += camDX;
  camY += camDY;

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
    cam.lookAt(0, 0, 0);
  }
}

function mouseWheel(event) {
  camZ += event.delta * 10;
  if (camZ < 150) {
    camZ = 150;
  }
  if (camZ > 1600) {
    camZ = 1600;
  }
}