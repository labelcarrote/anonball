// -----------------------
// 101 CaML5
// -----------------------

const { Engine, World, Bodies, Body, Bounds, Mouse, MouseConstraint, Composite, Composites, Query, Svg } = Matter; 

let gameManager;
let colors;

let video_constraints = { 
	video: {
		width: { ideal: 640 },
		height: { ideal: 360 }  
		// width: { ideal: 1280 },
		// height: { ideal: 720 }  
	} 
};
let CANVAS_WIDTH = 800; //720;// cw = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 32;


function preload(){
    colors = loadJSON('public/js/colors/palettes.json');

    // remove context menu and default keyboard event
    document.oncontextmenu = 
    document.onkeydown = 
    document.onkeypress = function(){
        return false; 
    };
}

function setup(){
	const video = createCapture(video_constraints);
	video.hide();
	const vw = video.width;
	const vh = video.height;
	const vratio = vw/vh;
	const cw = CANVAS_WIDTH;
	const ch = cw/vratio;
	const canvas = createCanvas(cw, ch);
	canvas.parent('camera-holder');
	video.size(cw, ch);
    gameManager = new GameManager(1,colors,canvas,video,cw,ch);
}

// ---- LOOP

function draw(){
    gameManager.step();
}

// ---- INPUT HANDLER (keyboard, mouse)

function keyPressed(){
    gameManager.keyPressed();
    return false;
}

function keyReleased(){
	gameManager.keyReleased();
	return false;
}

function touchStarted(){
    gameManager.mousePressed();
    return false;
}

function touchMoved(){
    gameManager.mouseDragged();
    return false;
}

function touchEnded(){
    gameManager.mouseReleased();
    return false;
}