import { Vector } from "./vector.js";

export class Point {
  constructor(location, locked = false) {
    this.location = location;
    this.oldLocation = new Vector(location.x, location.y);
    this.locked = locked;
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  update() {
    if (this.locked) return;
    const velocity = this.location.subtract(this.oldLocation);
    const newLocation = this.location.add(velocity);
    this.oldLocation = this.location;
    this.location = newLocation;
  }

  draw(ctx, i) {
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(this.location.x, this.location.y, 2, 0, Math.PI * 2);
    ctx.stroke();
    // ctx.font = "10px Arial";
    // ctx.textBaseline = "bottom";
    // ctx.fillText(" " + i, this.location.x, this.location.y);
    ctx.closePath();
  }
}
