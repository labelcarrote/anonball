// -----------------------
// GameState
// -----------------------
class GameState{

	constructor(gameManager){
		this.BLOCKS_COUNT = 1;
		this.BALLS_COUNT = 1;

		// Game manager
		this.gm = gameManager;

		// Sound Manager
		this.sound_manager = new SoundManager();

		// Game objects
		this.stuffs = [];
		this.boundaries = [];
		this.player = null;

        this.color_palette_index = 0;
		this.color_index = 0;

        // ML5
        this.poseNet;
        this.poses = [];

        // By default, PoseNet loads a MobileNetV1 architecture with a 0.75 multiplier. This is recommended for computers with mid-range/lower-end GPUs. A model with a 0.50 multiplier is recommended for mobile. The ResNet achitecture is recommended for computers with even more powerful GPUs.
        this.pose_net_options = {
            // -- RESNET (larger, slower, more accurate)
            architecture: 'ResNet50',
            // Can be one of 8, 16, 32 (Stride 16, 32 are supported for the ResNet architecture and stride 8, 16, 32 are supported for the MobileNetV1 architecture). It specifies the output stride of the PoseNet model. The smaller the value, the larger the output resolution, and more accurate the model at the cost of speed. Set this to a larger value to increase speed at the cost of accuracy.
            outputStride: 16,//32,
            // Defaults to 257. It specifies the size the image is resized and padded to before it is fed into the PoseNet model. The larger the value, the more accurate the model at the cost of speed. Set this to a smaller value to increase speed at the cost of accuracy. If a number is provided, the image will be resized and padded to be a square with the same width and height. If width and height are provided, the image will be resized and padded to the specified width and height.Should be one of 161,193,257,289,321,353,385,417,449,481,513,801"
            inputResolution: 417,//257,
            //This argument controls the bytes used for weight quantization. The available options are:
            // 4 bytes per float (no quantization). Leads to highest accuracy and original model size (~90MB).
            // (default) 2 bytes per float. Leads to slightly lower accuracy and 2x model size reduction (~45MB).
            // 1 byte per float. Leads to lower accuracy and 4x model size reduction (~22MB).
            quantBytes: 4,
            
            // -- MOBILE NET (smaller, faster, less accurate)
            // architecture: 'MobileNetV1',
            // outputStride: 16,
            // inputResolution: 257,
            // // Can be one of 1.01, 1.0, 0.75, or 0.50 (The value is used only by the MobileNetV1 architecture and not by the ResNet architecture). It is the float multiplier for the depth (number of channels) for all convolution ops. The larger the value, the larger the size of the layers, and more accurate the model at the cost of speed. Set this to a smaller value to increase speed at the cost of accuracy.
            // multiplier: 0.50,
            
            // -- ML5 parameters
            // A number between 0.2 and 1. Defaults to 0.50. What to scale the image by before feeding it through the network. Set this number lower to scale down the image and increase the speed when feeding through the network at the cost of accuracy.
            imageScaleFactor: 0.5,//0.3,
            // Defaults to false. If the poses should be flipped/mirrored horizontally. This should be set to true for videos where the video is by default flipped horizontally (i.e. a webcam), and you want the poses to be returned in the proper orientation.
            flipHorizontal: true,
            // number of pose / person
            maxPoseDetections: 3,
            // minimum confidence of the root part of a pose
            minConfidence: 0.5,
            scoreThreshold: 0.5,
            // minimum distance in pixels between the root parts of poses
            nmsRadius: 20,
            // type of detection. 'single' or 'multiple'
            detectionType: 'multiple'
        };

		this.init();
	}

	init(){
        this.loadPosenet(this.pose_net_options);
		this.player = new Player(this.gm);
	}

	// ------- State Loop : inputCheck -> update -> display

	inputCheck(){
		// if(this.gm.keyboardPad.state & this.gm.keyboardPad.DIR_RIGHT)
		// 	this.gm.setState(this.gm.endState);
	}

	update(){
		Engine.update(this.gm.engine);

		for (let i = 0; i < this.stuffs.length; i++) {
		    if(this.stuffs[i].isOutOfScreen()){
		        this.stuffs[i].removeFromWorld();
		        this.stuffs.splice(i,1);
		        i--;
		    }
		}
        for (let i = 0; i < this.poses.length; i++) {
            let pose = this.poses[i].pose;
			this.player.update(pose);
            break;
        }
		this.createRandomBall();
	}

    display() {
        if(this.gm.video.loadedmetadata){
			translate(this.gm.cw,0);
			scale(-1,1);
    		image(this.gm.video, 0, 0, this.gm.cw, this.gm.ch);
			translate(this.gm.cw,0);
			scale(-1,1);
    		filter(GRAY);
    		this.drawFPS();
			this.player.draw();

            for (let i = 0; i < this.stuffs.length; i++)
			    this.stuffs[i].show();
    	}
    }

    // ---- SKELETONS

    drawPsychoGun(elbow,wrist){
    	let w = dist(elbow.position.x , elbow.position.y, wrist.position.x, wrist.position.y) * 2;
    	let h = w / 4;
    	let x = (elbow.position.x + wrist.position.x) / 2;
    	let y = (elbow.position.y + wrist.position.y) / 2;
    	let c = color("#ff9900");
    	angleMode(DEGREES);
    	let a = atan2(elbow.position.y - wrist.position.y, elbow.position.x - wrist.position.x);
    	push();
    	noStroke();
    	fill(c);	
    	translate(x,y);
    	rotate(a);
    	rectMode(CENTER);
    	rect(0,0,w,h);
    	pop();
    }

    drawFPS(){
    	fill(255,164,70);
    	stroke(0);
    	text(frameRate().toFixed(0), 10, height - 10);
    }

	// --------

	createBall(){
		this.stuffs.push(new Ball(this.gm,mouseX,mouseY,random()*32,this.pickColor()));
	}

	createRandomBall(){
		if(random()*100 > 80)
			this.stuffs.push(new Ball(this.gm,random()*this.gm.cw,0,random()*32,this.pickColor()));
	}

    pickColor(){
		let color_pick = color(this.gm.configuration.palettes[this.color_palette_index][this.color_index]);
		this.color_index = (this.color_index >= this.gm.configuration.palettes[this.color_palette_index].length - 1)
			? 0
			: this.color_index + 1;
		return color_pick;
	}

    // ---- ML5    

    loadPosenet(options){
        let that = this;
        this.poseNet = ml5.poseNet(this.gm.video, options, this.updateDebugInfos);
        this.poseNet.on('pose', function(results) { that.poses = results; });
    }

	// ---- Events Handling

	mousePressed(){
		this.createBall();
		return false;
	}

    mouseDragged(){
		//if (mouseButton === LEFT)
		// this.createRandomStuff();
		return false;
	}

	mouseReleased(){
		return false;
	}

	keyPressed(){
		return false;
	}

	keyReleased(){
		return false;
	}
}
