let shapes = [];
let showBlackLayer = false;
let blackLayer;
let boxCount = 0;
let wolfFoundCount = 0;
let wolfLeftCount = 0;
let backgroundImage;
let boxImage, catImage, wolfImage;

function preload() {
  
  backgroundImage = loadImage('ai/chalkboard2.jpg'); 
  boxImage = loadImage('ai/box-01.svg'); 
  catImage = loadImage('ai/cat1-01.svg'); 
  wolfImage = loadImage('ai/WOLF-01.svg'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight); 

  // Tạo một lớp màu xám bên trên
  blackLayer = createGraphics(windowWidth, windowHeight);
  blackLayer.background(50); // 

  // Đặt ngẫu nhiên số lượng hộp từ 15 đến 39
  let numShapes = floor(random(15, 39));
  boxCount = numShapes; 

  for (let i = 0; i < numShapes; i++) {
    let shape = {
      x: random(width),
      y: random(height),
      diameter: 130,
      xSpeed: random(-2, 2),
      ySpeed: random(-2, 2),
      type: 'box', 
      canBecomeWolf: false 
    };
    shapes.push(shape);
  }
  
  // Chọn ngẫu nhiên 1/3 số lượng hợp sẽ trở thành sói
  let numWolves = floor(shapes.length / 3);
  wolfLeftCount = numWolves; // số sói cần tìm hiện trên bộ đếm

  
  let selectedIndices = [];
  while (selectedIndices.length < numWolves) {
    let index = floor(random(shapes.length));
    if (!selectedIndices.includes(index)) {
      selectedIndices.push(index);
      shapes[index].canBecomeWolf = true;
    }
  }
  
  setTimeout(() => {
    showBlackLayer = true;
  }, 0);
}

function draw() {
  
  image(backgroundImage, 0, 0, windowWidth, windowHeight);
  
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    shape.x += shape.xSpeed;
    shape.y += shape.ySpeed;

    if (shape.x < 0 || shape.x > width) {
      shape.xSpeed *= -1;
    }
    if (shape.y < 0 || shape.y > height) {
      shape.ySpeed *= -1;
    }

    
    if (shape.type === 'box') {
      image(boxImage, shape.x - shape.diameter / 2, shape.y - shape.diameter / 2, shape.diameter, shape.diameter); 
    } else if (shape.type === 'cat') {
      image(catImage, shape.x - shape.diameter / 2, shape.y - shape.diameter / 2, shape.diameter, shape.diameter);
    } else if (shape.type === 'wolf') {
      image(wolfImage, shape.x - shape.diameter / 2, shape.y - shape.diameter / 2, shape.diameter, shape.diameter);
    }
  }

  if (showBlackLayer) {
    // Vẽ lớp phủ màu xám
    image(blackLayer, 0, 0, width, height);
  }

  // Bộ đếm số lượng Hộp + Sói
  fill(255); 
  textSize(30);
  textAlign(CENTER, TOP);
  text(`Boxes: ${boxCount}  Wolf Found: ${wolfFoundCount}  Wolf Left: ${wolfLeftCount}`, width / 2, 10);

  // Tìm thấy hết sói thì end game
  if (wolfLeftCount === 0) {
    window.location.href = 'end.html';
  }
}

function mouseDragged() {
  if (showBlackLayer) {
    // Erase lớp màu xám khi rê chuột
    blackLayer.erase();
    blackLayer.noFill();
    blackLayer.stroke(50); 
    blackLayer.strokeWeight(50);
    blackLayer.line(pmouseX, pmouseY, mouseX, mouseY);
    blackLayer.noErase();
  }
}

function mousePressed() {
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    let d = dist(mouseX, mouseY, shape.x, shape.y);
    if (d < shape.diameter / 2) {
      if (shape.type === 'box') {
        boxCount--; 
        if (shape.canBecomeWolf) {
          shape.type = 'wolf';
          wolfFoundCount++; 
          wolfLeftCount--; 
        } else {
          shape.type = 'cat';
        }
      }
    }
  }
}

//Fix lỗi lớp phủ màu xám để ko bị reset khi chuyển kích cỡ màn hình
function windowResized() {
  
  let tempLayer = createGraphics(blackLayer.width, blackLayer.height);
  tempLayer.image(blackLayer, 0, 0);

  
  resizeCanvas(windowWidth, windowHeight); 
  blackLayer.resizeCanvas(windowWidth, windowHeight);

  
  blackLayer.image(tempLayer, 0, 0, windowWidth, windowHeight);
}