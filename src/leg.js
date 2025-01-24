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
    this.number = Leg.number++;
    this.fixedPoint = fixedPoint;
    this.direction = mirrored ? -1 : 1;
    this.points = [];
    this.sticks = [];
    this.dna = dna || Leg.HOLY_NUMBERS;
    this.rotationOffset = rotation || 0;
    this.rotation = 0;
    this.speed = 0.01;
    this.calculateLeg();
    // this.printLenghts();
    this.trace = [];
  }

  calculateLeg() {
    this.points = [];
    this.sticks = [];
    //Set position p1
    const p1 = this.fixedPoint;
    p1.lock();
    this.points.push(p1);

    const p2 = new Point(
      p1.location
        .add(new Vector(this.direction * -this.dna.a, 0))
        .add(new Vector(0, this.dna.l)),
      true
    );
    this.points.push(p2);

    const p3 = new Point(
      p1.location.add(new Vector(0, -this.dna.m).rotate(this.rotation)),
      true
    );
    this.points.push(p3);
    this.sticks.push({ name: "m", stick: new Stick(p1, p3) });

    const theta1 = Math.atan2(
      this.dna.l + Math.cos(this.rotation) * this.dna.m,
      this.dna.a + this.direction * Math.sin(this.rotation) * this.dna.m
    );

    //Calculate position of p4
    let a = Vector.dist(p2.location, p3.location);
    let b = this.dna.b;
    let c = this.dna.j;
    const thetaP4a = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
    const thetaP4 = theta1 + thetaP4a;
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
    a = this.dna.d;
    b = this.dna.b;
    c = this.dna.e;
    const thetaP5 =
      thetaP4 + Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
    const p5 = new Point(
      new Vector(
        p2.location.x + this.direction * a * Math.cos(thetaP5),
        p2.location.y - a * Math.sin(thetaP5)
      )
    );
    this.points.push(p5);
    this.sticks.push({ name: "d", stick: new Stick(p2, p5) });
    this.sticks.push({ name: "e", stick: new Stick(p4, p5) });

    // //Calculate position of p6
    a = Vector.dist(p2.location, p3.location);
    b = this.dna.c;
    c = this.dna.k;
    const thetaP6 =
      Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b)) - theta1;
    const p6 = new Point(
      new Vector(
        p2.location.x + this.direction * b * Math.cos(thetaP6),
        p2.location.y + b * Math.sin(thetaP6)
      )
    );
    this.points.push(p6);
    this.sticks.push({ name: "c", stick: new Stick(p2, p6) });
    this.sticks.push({ name: "k", stick: new Stick(p3, p6) });

    // //Calculate position of p7
    a = Vector.dist(p5.location, p6.location);
    b = this.dna.d;
    c = this.dna.c;
    const thetaP7a = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));

    a = Vector.dist(p5.location, p6.location);
    b = this.dna.f;
    c = this.dna.g;
    const thetaP7b = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
    const thetaP7 = thetaP7a + thetaP7b;
    let dir = p2.location.subtract(p5.location).normalize();
    const p7 = new Point(
      p5.location.add(dir.rotate(this.direction * thetaP7).scale(this.dna.f))
    );
    this.points.push(p7);
    this.sticks.push({ name: "f", stick: new Stick(p5, p7) });
    this.sticks.push({ name: "g", stick: new Stick(p6, p7) });

    // //Calculate position of p8
    a = this.dna.g;
    b = this.dna.h;
    c = this.dna.i;
    const thetaP8 = Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
    dir = p6.location.subtract(p7.location).normalize();
    const p8 = new Point(
      p7.location.add(dir.rotate(this.direction * thetaP8).scale(this.dna.h))
    );
    this.points.push(p8);
    this.sticks.push({ name: "h", stick: new Stick(p7, p8) });
    this.sticks.push({ name: "i", stick: new Stick(p6, p8) });

    // this.printLenghts();
  }

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
    // this.trace.push(this.points[7].location);
    // for (const p of this.points) {
    //   p.update();
    // }
    // for (const s of this.sticks) {
    //   s.stick.update();
    // }
  }

  draw(ctx) {
    let i = 1;
    for (const p of this.points) {
      p.draw(ctx, i++);
    }
    for (const s of this.sticks) {
      s.stick.draw(ctx, s.name);
    }
    // ctx.strokeStyle = "green";
    // ctx.beginPath();
    // ctx.moveTo(this.trace[0].x, this.trace[0].y);
    // for (let i = 1; i < this.trace.length; i++) {
    //   ctx.lineTo(this.trace[i].x, this.trace[i].y);
    // }
    // ctx.stroke();
    // ctx.closePath();
  }
}
