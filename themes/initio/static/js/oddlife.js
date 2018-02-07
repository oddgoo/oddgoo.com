// Adapted from Flocking Processing example by Daniel Schiffman:
// http://processing.org/learning/topics/flocking.html

var Boid = Base.extend({
	initialize: function(position, maxSpeed, maxForce) {
		//var strength = Math.random() * 0.5;
        var strength =  Math.random() * 0.5;
		this.acceleration = new Point();
		this.vector = Point.random() * 2 - 1;
		this.position = position.clone();
		this.radius = 30;
		this.maxSpeed = maxSpeed + strength;
		this.maxForce = maxForce + strength;
		this.amount = strength * 10 + 10;
		this.count = 0;
		this.createItems();
	},

	run: function(boids) {
		this.lastLoc = this.position.clone();
		if (!groupTogether) {
			this.flock(boids);
		} else {
			this.align(boids);
		}
		this.borders();
		this.update();
		this.calculateTail();
		this.moveHead();
	},

	calculateTail: function() {
		/*var segments = this.path.segments,
			shortSegments = this.shortPath.segments;
		var speed = this.vector.length;
		var pieceLength = 5 + speed / 3;
		var point = this.position;
		segments[0].point = shortSegments[0].point = point;
		// Chain goes the other way than the movement
		var lastVector = -this.vector;
		for (var i = 1; i < this.amount; i++) {
			var vector = segments[i].point - point;
			this.count += speed * 10;
			var wave = Math.sin((this.count + i * 3) / 300);
			var sway = lastVector.rotate(90).normalize(wave);
			point += lastVector.normalize(pieceLength) + sway;
			segments[i].point = point;
			if (i < 3)
				shortSegments[i].point = point;
			lastVector = vector;
		}
		this.path.smooth();*/
	},

	createItems: function() {
        
        this.type=0;
        
        this.flippers =  new Path({
            strokeColor: '#00aded',
			strokeWidth: 3,
        });
        
        this.flippers.add(new Point(-20,-20));
        this.flippers.add(new Point(0,0));
        //this.flippers.add(new Point(15,-15));

	},

	moveHead: function() {
		this.flippers.position = this.position;
		this.flippers.rotation = this.vector.angle;
	},

	// We accumulate a new acceleration each time based on three rules
	flock: function(boids) {
		var separation = this.separate(boids) * 3;
		var alignment = this.align(boids);
		var cohesion = this.cohesion(boids);
		this.acceleration += separation + alignment + cohesion;
	},

	update: function() {
		// Update velocity
		this.vector += this.acceleration;
		// Limit speed (vector#limit?)
		this.vector.length = Math.min(this.maxSpeed, this.vector.length);
		this.position += this.vector;
		// Reset acceleration to 0 each cycle
		this.acceleration = new Point();
	},

	seek: function(target) {
		this.acceleration += this.steer(target, false);
	},

	borders: function() {
		var vector = new Point();
		var position = this.position;
		var radius = this.radius;
		var size = view.size;
		if (position.x < -radius) vector.x = size.width + radius;
		if (position.y < -radius) vector.y = size.height + radius;
		if (position.x > size.width + radius) vector.x = -size.width -radius;
		if (position.y > size.height + radius) vector.y = -size.height -radius;
		if (!vector.isZero()) {
			this.position += vector;
			/*var segments = this.path.segments;
			for (var i = 0; i < this.amount; i++) {
				segments[i].point += vector;
			}*/
		}
	},

	// A method that calculates a steering vector towards a target
	// Takes a second argument, if true, it slows down as it approaches
	// the target
	steer: function(target, slowdown) {
		var steer,
			desired = target - this.position;
		var distance = desired.length;
		// Two options for desired vector magnitude
		// (1 -- based on distance, 2 -- maxSpeed)
		if (slowdown && distance < 100) {
			// This damping is somewhat arbitrary:
			desired.length = this.maxSpeed * (distance / 100);
		} else {
			desired.length = this.maxSpeed;
		}
		steer = desired - this.vector;
		steer.length = Math.min(this.maxForce, steer.length);
		return steer;
	},

	separate: function(boids) {
        var desiredSeparation=50;
		var steer = new Point();
		var count = 0;
		// For every boid in the system, check if it's too close
		for (var i = 0, l = boids.length; i < l; i++) {
			var other = boids[i];
            if(other.type==1)
                desiredSeperation=200;
            else
                desiredSeperation=40;
			var vector = this.position - other.position;
			var distance = vector.length;
			if (distance > 0 && distance < desiredSeperation) {
				// Calculate vector pointing away from neighbor
				steer += vector.normalize(1 / distance);
				count++;
			}
		}
		// Average -- divide by how many
		if (count > 0)
			steer /= count;
		if (!steer.isZero()) {
			// Implement Reynolds: Steering = Desired - Velocity
			steer.length = this.maxSpeed;
			steer -= this.vector;
			steer.length = Math.min(steer.length, this.maxForce);
		}
		return steer;
	},

	// Alignment
	// For every nearby boid in the system, calculate the average velocity
	align: function(boids) {
		var neighborDist = 25;
		var steer = new Point();
		var count = 0;
		for (var i = 0, l = boids.length; i < l; i++) {
			var other = boids[i];
			var distance = this.position.getDistance(other.position);
			if (distance > 0 && distance < neighborDist) {
				steer += other.vector;
				count++;
			}
		}

		if (count > 0)
			steer /= count;
		if (!steer.isZero()) {
			// Implement Reynolds: Steering = Desired - Velocity
			steer.length = this.maxSpeed;
			steer -= this.vector;
			steer.length = Math.min(steer.length, this.maxForce);
		}
		return steer;
	},

	// Cohesion
	// For the average location (i.e. center) of all nearby boids,
	// calculate steering vector towards that location
	cohesion: function(boids) {
        var neighborDist = 80;
        if(this.type==1)
		 neighborDist = 400;
		var sum = new Point();
		var count = 0;
		for (var i = 0, l = boids.length; i < l; i++) {
			var other = boids[i];
			var distance = this.position.getDistance(other.position);
			if (distance > 0 && distance < neighborDist) {
				sum += other.position; // Add location
				count++;
			}
		}
		if (count > 0) {
			sum /= count;
			// Steer towards the location
			return this.steer(sum, false);
		}
		return sum;
	}
});


var Predator = Boid.extend({
    createItems: function() {
        
        this.flippers =  new Path({
            strokeColor: '#ff2e8a',
			strokeWidth: 4,
        });
        
        this.flippers.add(new Point(-25,-25));
        this.flippers.add(new Point(-25,25));
        this.flippers.add(new Point(25,25));
        this.flippers.add(new Point(25,-25));
        //this.flippers.add(new Point(15,-15));
        
        this.type=1;

	}
});


/*var bg= new Path({
	fillColor: '#002f9a',
	closed : true
});
bg.add(new Point(0,0));
bg.add(new Point(0,view.size.height));
bg.add(new Point(view.size.width,view.size.height));
bg.add(new Point(view.size.width,0));
bg.opacity=0.05;*/

var boids = [];
var groupTogether = false;
var predator =  new Predator( new Point(0, 0), 4, 0.01);

// Add the boids
var boidsToAddVertically = Math.floor(view.size.height/100);
var boidsToAddHorizontally = Math.floor(view.size.width/100);


for (var i = 0; i < (boidsToAddHorizontally + boidsToAddVertically) ; i++) {
    
    var x = Math.random()*view.size.width;
    var y = -20;
    console.log( 'view width is: ' + view.size.width);
	boids.push(new Boid( new Point(x, y), 8, 0.005));
   
}

boids.push(predator);
//add the predator





	

function onFrame(event) {
	
	for (var i = 0, l = boids.length; i < l; i++) {
		boids[i].run(boids);
	}
}
