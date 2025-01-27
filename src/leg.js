import { Vector } from "./vector.js";
import { Point } from "./point.js";
import { Stick } from "./stick.js";

export class Leg {
  static get HOLY_NUMBERS() {
    return {
      a: 38.0,
      b: 41.5,
      c: 39.3,
      d: 40.1,
      e: 55.8,
      f: 39.4,
      g: 36.7,
      h: 65.7,
      i: 49.0,
      j: 50.0,
      k: 61.9,
      l: 7.8,
      m: 15.0,
    };
  }

  static number = 1;

  constructor(fixedPoint, rotation, mirrored, dna) {
    this.number = Leg.number++; //Just used for labeling and debugging
    this.fixedPoint = fixedPoint; //The point where the leg is attached (p0)
    this.direction = mirrored ? -1 : 1; //Whether the leg is mirrored or not
    this.points = [];
    this.sticks = [];
    this.dna = dna || Leg.HOLY_NUMBERS; //If you want to specify your own dna instead of the HOLY NUMBERS
    this.rotationOffset = rotation || 0; //Initial starting position of the leg
    this.rotation = 0; //Current rotation of the motor
    this.calculateLeg();
    this.trace = [];
  }

  /**
   * This function will use trigonometry to calculate the position of all the points in the leg
   *
   * The leg is composed by 9 points and 13 sticks as visualised in the "diagram" under img/leg.png
   */
  calculateLeg() {
    this.points = [];
    this.sticks = [];
    const { a, b, c, d, e, f, g, h, i, j, k, l, m } = this.dna;

    const p0 = this.fixedPoint;
    p0.lock();
    this.points.push(p0);

    //Set position p1
    const p1 = new Point(p0.location.subtract(new Vector(0, l)));
    p1.lock();
    this.points.push(p1);
    this.sticks.push({ name: "l", stick: new Stick(p0, p1) });

    const p2 = new Point(p0.location.add(new Vector(this.direction * -a, 0)));
    p2.lock();
    this.points.push(p2);
    this.sticks.push({ name: "a", stick: new Stick(p0, p2) });

    const p3 = new Point(
      p1.location.add(new Vector(0, -m).rotate(this.rotation))
    );
    p3.lock(); //"Locked", since its position is set by the rotation of the leg (by the "motor")
    this.points.push(p3);
    this.sticks.push({ name: "m", stick: new Stick(p1, p3) });

    //Calculate angle of p2 to p3
    const theta1 = Math.atan2(
      l + Math.cos(this.rotation) * m,
      a + this.direction * Math.sin(this.rotation) * m
    );

    //Calculate position of p4
    let w = Vector.dist(p2.location, p3.location); //Imaginary line between p2 and p3
    const thetaP4a = Math.acos((w ** 2 + b ** 2 - j ** 2) / (2 * w * b)); // Use cosine rule to calculate angle w to b
    const thetaP4 = theta1 + thetaP4a; // Total angle from a to b
    //Calculate position of p4 relative to p2
    const p4 = new Point(
      new Vector(
        p2.location.x + this.direction * b * Math.cos(thetaP4),
        p2.location.y - b * Math.sin(thetaP4)
      )
    );
    this.points.push(p4);
    this.sticks.push({ name: "b", stick: new Stick(p2, p4) });
    this.sticks.push({ name: "j", stick: new Stick(p3, p4) });

    //Calculate position of p5
    const thetaP5a = Math.acos((d ** 2 + b ** 2 - e ** 2) / (2 * d * b)); // Use cosine rule to calculate angle b to d
    const thetaP5 = thetaP4 + thetaP5a; // Total angle from a to d
    //Calculate position of p5 relative to p2
    const p5 = new Point(
      new Vector(
        p2.location.x + this.direction * d * Math.cos(thetaP5),
        p2.location.y - d * Math.sin(thetaP5)
      )
    );
    this.points.push(p5);
    this.sticks.push({ name: "d", stick: new Stick(p2, p5) });
    this.sticks.push({ name: "e", stick: new Stick(p4, p5) });

    //Calculate position of p6
    const thetaP6a = Math.acos((w ** 2 + c ** 2 - k ** 2) / (2 * w * c)); // Use cosine rule to calculate angle w to c
    const thetaP6 = thetaP6a - theta1; //Total angle from a to c
    //Calculate position of p6 relative to p2
    const p6 = new Point(
      new Vector(
        p2.location.x + this.direction * c * Math.cos(thetaP6),
        p2.location.y + c * Math.sin(thetaP6)
      )
    );
    this.points.push(p6);
    this.sticks.push({ name: "c", stick: new Stick(p2, p6) });
    this.sticks.push({ name: "k", stick: new Stick(p3, p6) });

    // //Calculate position of p7
    let v = Vector.dist(p5.location, p6.location); //Imaginary line between p5 and p6
    const thetaP7a = Math.acos((v ** 2 + d ** 2 - c ** 2) / (2 * v * d)); //Cosine rule to calculate angle d to v
    const thetaP7b = Math.acos((v ** 2 + f ** 2 - g ** 2) / (2 * v * f)); //Cosine rule to calculate angle v to f

    const thetaP7 = thetaP7a + thetaP7b; //Total angle from d to f
    //Calculate position of p7 relative to p5
    let dir = p2.location.subtract(p5.location).normalize(); //Get direction vector from p5 to p2
    const p7 = new Point(
      p5.location.add(dir.rotate(this.direction * thetaP7).scale(f)) //Rotate the direction vector by the angle from d to f and scale it by f
    );
    this.points.push(p7);
    this.sticks.push({ name: "f", stick: new Stick(p5, p7) });
    this.sticks.push({ name: "g", stick: new Stick(p6, p7) });

    // //Calculate position of p8
    const thetaP8 = Math.acos((g ** 2 + h ** 2 - i ** 2) / (2 * g * h)); //Cosine rule to calculate angle g to h
    // //Calculate position of p8 relative to p7
    dir = p6.location.subtract(p7.location).normalize(); //Get direction vector from p7 to p6
    const p8 = new Point(
      p7.location.add(dir.rotate(this.direction * thetaP8).scale(h)) //Rotate the direction vector by the angle from g to h and scale it by h
    );
    this.points.push(p8);
    this.sticks.push({ name: "h", stick: new Stick(p7, p8) });
    this.sticks.push({ name: "i", stick: new Stick(p6, p8) });
  }

  /**
   * Debug function: this function will print the length of all the sticks in the leg
   */
  printLenghts() {
    this.sticks.sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
    console.log("Leg", this.number);
    for (const s of this.sticks) {
      console.log(
        s.name,
        Vector.dist(s.stick.pointA.location, s.stick.pointB.location)
      );
    }
  }

  update(rotation) {
    this.rotation = this.rotationOffset + rotation;
    this.calculateLeg();
    this.trace.push(this.points[this.points.length - 1].location);
    for (const p of this.points) {
      p.update();
    }
    for (const s of this.sticks) {
      s.stick.update();
    }
  }

  draw(ctx, showTrace = false) {
    let i = 1;
    for (const p of this.points) {
      p.draw(ctx, i++);
    }
    for (const s of this.sticks) {
      s.stick.draw(ctx, s.name);
    }
    if (showTrace) {
      this.drawTrace(ctx);
    }
  }

  drawTrace(ctx) {
    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(this.trace[0].x, this.trace[0].y);
    for (let i = 1; i < this.trace.length; i++) {
      ctx.lineTo(this.trace[i].x, this.trace[i].y);
    }
    ctx.stroke();
    ctx.closePath();
  }
}
