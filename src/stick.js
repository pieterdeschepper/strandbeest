import { Vector } from "./vector.js";

export class Stick {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.length = Vector.dist(pointA.location, pointB.location);
  }

  update() {
    const delta = this.pointA.location.subtract(this.pointB.location);
    const dist = delta.magnitude();
    const diff = dist - this.length;

    const norm = delta.normalize();

    if (this.pointA.locked && this.pointB.locked) return;
    if (this.pointA.locked) {
      this.pointB.location = this.pointB.location.add(norm.scale(diff));
      return;
    }
    if (this.pointB.locked) {
      this.pointA.location = this.pointA.location.add(norm.scale(-diff));
      return;
    }
    this.pointA.location = this.pointA.location.add(norm.scale(-diff / 2));
    this.pointB.location = this.pointB.location.add(norm.scale(diff / 2));
  }

  draw(ctx, name) {
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.pointA.location.x, this.pointA.location.y);
    ctx.lineTo(this.pointB.location.x, this.pointB.location.y);
    ctx.stroke();
    // ctx.fillStyle = "green";
    // ctx.fillText(
    //   name,
    //   (this.pointA.location.x + this.pointB.location.x) / 2,
    //   (this.pointA.location.y + this.pointB.location.y) / 2
    // );
    ctx.closePath();
  }
}
