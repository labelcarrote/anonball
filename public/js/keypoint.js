const SMOOTHAMT = 5;

// https://editor.p5js.org/lisajamhoury/sketches/zbsptgaQw
class Keypoint {
  	constructor() {
		this.position = { x: null, y: null };
		this.visible = true;
		this.smoothAmt = SMOOTHAMT;
		this.pastX = [];
		this.pastY = [];
  	}

	setPosition(position){
		this.position = this.getSmoothPosition(position);
	}

	setVisibility(score) {
		this.visible = score > 0.5;
	}

	getSmoothPosition(position) {
		return { 
			x: this.getSmoothCoord(position.x, this.pastX),
			y: this.getSmoothCoord(position.y, this.pastY)
		};
	}

	getSmoothCoord(coord, frameArray) {
		if (frameArray.length < 1) {
			for (let i = 0; i < this.smoothAmt; i++) {
				frameArray.push(coord);
			}
		// every other time it runs we update only the most recent value in the array
		} else {
			frameArray.shift(); // removes first item from array
			frameArray.push(coord); // adds new x to end of array
		}
		let sum = 0;
		for (let i = 0; i < frameArray.length; i++) {
			sum += frameArray[i];
		}
		return sum / frameArray.length;
	}
}
