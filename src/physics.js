export class Physics {
  constructor(points, sticks) {
    this.points = points;
    this.sticks = sticks;
  }

  update() {
    for (const p of this.points) {
      p.update();
    }
    for (const s of this.sticks) {
      s.update();
    }
  }

  draw(ctx) {
    for (const p of this.points) {
      p.draw(ctx);
    }
    for (const s of this.sticks) {
      s.draw(ctx);
    }
  }
}
