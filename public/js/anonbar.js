
class AnonBar{

	constructor(gm,left_eye,right_eye,nose){
		this.gm = gm;
		this.smooth_left_eye = new Keypoint();
		this.smooth_right_eye = new Keypoint();
		this.smooth_nose = new Keypoint();
		this.pw = 100;
		this.px = 0;
		this.py = 0;
		this.body = null;
		this.recent_angle = [];
		this.update(left_eye,right_eye,nose);
	}

	isOutOfScreen(){
		return this.body.position.y > height + 100;
	}

	removeFromWorld(){
		Composite.remove(this.gm.world,this.body);
	}

	getDistance(p1,p2){
		return dist(p1.x, p1.y, p2.x, p2.y)
	}
	getAngle(p1,p2){
		return atan2(p1.y - p2.y, p1.x - p2.x);
	}

	update(left_eye,right_eye,nose){
		const left_eye_pos = this.smooth_left_eye.getSmoothPosition(left_eye.position);
		const right_eye_pos = this.smooth_right_eye.getSmoothPosition(right_eye.position);
		const nose_pos = this.smooth_nose.getSmoothPosition(nose.position);
		this.w = this.getDistance(left_eye_pos, right_eye_pos) * 4;
		this.h = this.w / 4;
		const angle = radians(this.getAngle(left_eye_pos,right_eye_pos));
		if(this.body === null){
			const options = {
				angle: angle,
				friction : 0,
				restitution: 1,
				slop: 0
			};
			this.body = Bodies.rectangle(nose_pos.x,nose_pos.y - (this.h / 2),this.w,this.h,options);
			Composite.add(this.gm.world,this.body);
		}else{
			Body.setAngle(this.body, angle);
			const velocity_scale = 8;
			Body.setVelocity(this.body, { 
				x: (nose_pos.x - this.px) * velocity_scale, 
				y: (nose_pos.y - this.py) * velocity_scale,
			});
			Body.setPosition(this.body, { 
				x: nose_pos.x, 
				y: nose_pos.y - (this.h / 2)
			});
			const scale = this.w / this.pw;
			Body.scale(this.body, scale, scale);
		}
		this.pw = this.w;
		this.px = nose_pos.x;
		this.py = nose_pos.y;
	}

	draw(){
		fill(0,0,0);
		noStroke();
		push();
		translate(this.body.position.x,this.body.position.y);
		angleMode(DEGREES);
		rotate(degrees(this.body.angle));
		rectMode(CENTER);
		rect(0,0,this.w,this.h);
		pop();
	}
}