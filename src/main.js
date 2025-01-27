import { Vector } from "./vector.js";
import { Point } from "./point.js";
import { StrandBeest } from "./strandbeest.js";

class Main {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(2, 2);
    this.strandBeest = new StrandBeest(new Point(new Vector(110, 100)));
    this.render();
  }

  render() {
    this.update();
    this.draw();
    requestAnimationFrame(this.render.bind(this));
  }

  update() {
    this.strandBeest.update();
    if (
      this.strandBeest.motorPosition.location.x > this.canvas.width / 2 - 110 ||
      this.strandBeest.motorPosition.location.x < 110
    ) {
      this.strandBeest.setSpeed(-this.strandBeest.speed); // Move strandbeest back and forth
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.strandBeest.draw(this.ctx);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Main();
});
