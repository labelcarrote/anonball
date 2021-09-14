
class SumoTrunk{

	constructor(gm,left_hip,right_hip){
		this.gm = gm;
        this.smooth_left_hip = new Keypoint();
        this.smooth_rigt_hip = new Keypoint();
		this.w = 100;
		this.h = 100;
		this.pw = 100;
		this.px = 0;
		this.py = 0;
		this.body = null;
		this.update(left_hip,right_hip);
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
		angleMode(DEGREES);
		return atan2(p1.y - p2.y, p1.x - p2.x);
	}

	update(left_hip,right_hip){
		const left_hip_pos = this.smooth_left_hip.getSmoothPosition(left_hip.position);
		const right_hip_pos = this.smooth_rigt_hip.getSmoothPosition(right_hip.position);

		this.w = this.getDistance(left_hip_pos, right_hip_pos) * 1.5;
		this.h = this.w / 4;
		
		const x = (left_hip_pos.x + right_hip_pos.x) / 2;
		const y = (left_hip_pos.y + right_hip_pos.y) / 2;
		const angle = radians(this.getAngle(left_hip_pos, right_hip_pos));
		if(this.body === null){
			const options = {
				angle: angle,
				friction : 0,
				restitution: 1,
				slop: 0
			};
			this.body = Bodies.rectangle(x,y,this.w,this.h,options);
			Composite.add(this.gm.world,this.body);
		}else{
			Body.setAngle(this.body, angle);
			const velocity_scale = 8;
			Body.setVelocity(this.body, { 
				x: (x - this.px) * velocity_scale, 
				y: (y - this.py) * velocity_scale,
			});
			Body.setPosition(this.body, { x: x, y: y });
			const scale = this.w / this.pw;
			Body.scale(this.body, scale, scale);
		}
		this.pw = this.w;
		this.px = x;
		this.py = y;
	}

	draw(){
		push();
		stroke("gray");
		fill(color("white"));	
		translate(this.body.position.x,this.body.position.y);
		angleMode(DEGREES);
		rotate(degrees(this.body.angle));
		rectMode(CENTER);
		rect(0,this.h/2,this.w,this.h);
		rect(0,0,this.h,this.w/2);
		pop();
	}
}