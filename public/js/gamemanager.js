// -----------------------
// GameManager
// -----------------------
class GameManager{

	constructor(status, configuration, canvas, video, cw, ch){
		this.STATUS_GAME = 1;
		this.status = status;
		
		this.configuration = configuration;
		this.canvas = canvas;
        this.video = video;
        this.cw = cw;
        this.ch = ch;

		// Actual state
		this.state; 

		// Matter.js engine
		this.engine = Engine.create();
		// this.engine.gravity.y = 0.24;
    	this.world = this.engine.world;

		// All game states
		this.gameState = new GameState(this);

		this.init();
	}
	
	init(){
		// const options = { mouse: Mouse.create(this.canvas.elt) };
		let mConstraint = MouseConstraint.create(this.engine);//, options);
		Composite.add(this.world,mConstraint);

		if(this.status == 1)
			this.state = this.gameState;
	}
		
	step(){
		this.state.inputCheck();
		this.state.update();
		this.state.display(); 
        this.updateDebugInfos();
	}
	
	setState(state){
		this.state = state;  
	}

    keyPressed(){
		this.state.keyPressed();
	}

	keyReleased(){
		this.state.keyReleased();
	}

	mousePressed(){
		this.state.mousePressed();
		return false;
	}

	mouseDragged(){
		this.state.mouseDragged();
		return false;
	}

	mouseReleased(){
		this.state.mouseReleased();
		return false;
	}

    updateDebugInfos() {
        let message = (this.isPortrait() ? "portrait" : "landscape")
            + ", cw :" + this.cw
            + ", ch :" + this.ch;
        select('#status').html(message);
    }

    isPortrait() {
        return window.matchMedia("(orientation: portrait)").matches;
    }
}
