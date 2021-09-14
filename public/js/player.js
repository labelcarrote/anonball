class Player{
	constructor(gm){
		this.gm = gm;
		this.pose = null;
		this.anonbar = null;
		this.sumotrunk = null;

		// ---- KEYPOINTS 
        // Id 	Part
        // 0 	nose
        // 1 	leftEye
        // 2 	rightEye
        // 3 	leftEar
        // 4 	rightEar
        // 5 	leftShoulder
        // 6 	rightShoulder
        // 7 	leftElbow
        // 8 	rightElbow
        // 9 	leftWrist
        // 10 	rightWrist
        // 11 	leftHip
        // 12 	rightHip
        // 13 	leftKnee
        // 14 	rightKnee
        // 15 	leftAnkle
        // 16 	rightAnkle
		this.MAX_KEYPOINTS = 17;
        this.POSE_PROBABILITY_THRESHOLD = 0.75;

	}

	update(pose){
		this.pose = pose;

		// anonbar
		let nose = pose.keypoints[0];
		let left_eye = pose.keypoints[1];
		let right_eye = pose.keypoints[2];
		if(this.anonbar !== null){
			this.anonbar.update(left_eye,right_eye,nose);
		}else{
			this.anonbar = new AnonBar(this.gm, left_eye, right_eye, nose);
		}

		// sumotrunk
		let left_hip = pose.keypoints[11];
		let right_hip = pose.keypoints[12];	
		if(this.sumotrunk !== null){
			this.sumotrunk.update(left_hip,right_hip);
		}else{
			this.sumotrunk = new SumoTrunk(this.gm, left_hip, right_hip);
		}
	}

	draw(){
		if(this.anonbar !== null)
			this.anonbar.draw();

		if(this.sumotrunk !== null)
			this.sumotrunk.draw();

		if(this.pose !== null){
			this.drawKeypoints();
			// // body connections
			// let skeleton = this.pose.keypoints;
			// stroke(255, 0, 0);
			// fill(255, 0, 0);
			// for (let j = 0; j < skeleton.length; j++) {
			// 	let partA_position = skeleton[j].position;
			// 	let partB_position = skeleton[j].position;
			// 	line(partA_position.x, partA_position.y, partB_position.x, partB_position.y);
			// }
		}
	}

	drawKeypoints()  {
    	fill(255, 0, 0);
    	noStroke();
		let keypoints_limit = Math.min(this.MAX_KEYPOINTS,this.pose.keypoints.length)
		for (let j = 0; j < keypoints_limit; j++) {
			let keypoint = this.pose.keypoints[j];
			if (keypoint.score > this.POSE_PROBABILITY_THRESHOLD) {
				ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
			}
		}
    }
}