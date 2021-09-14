class Ball{

    constructor(gm,x,y,r,color){
        this.gm = gm;
        const options = {
            friction: 0,
            restitution: 1,
            slop: 0
        };
        this.body = Bodies.circle(x,y,r,options);
        this.r = r;
        this.color = color;
        Composite.add(this.gm.world,this.body);
    }

    isOutOfScreen(){
        return this.body.position.y > height + 100;
    }

    removeFromWorld(){
        Composite.remove(this.gm.world,this.body);
    }

    show(){
        noStroke();
        fill(this.color);
        push();
        translate(this.body.position.x,this.body.position.y);
        rotate(this.body.angle);
        ellipseMode(CENTER);
        ellipse(0,0,this.r*2);
        pop();
    }
}