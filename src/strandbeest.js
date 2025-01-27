import { Leg } from "./leg.js";

export class StrandBeest {
  constructor(motorPosition, initialRotation) {
    this.motorPosition = motorPosition;
    this.speed = 0.015;
    this.rotation = initialRotation || 0;
    this.legs = [
      new Leg(this.motorPosition, 0),
      new Leg(this.motorPosition, (2 * Math.PI) / 3),
      new Leg(this.motorPosition, (4 * Math.PI) / 3),
      new Leg(this.motorPosition, 0, true),
      new Leg(this.motorPosition, (2 * Math.PI) / 3, true),
      new Leg(this.motorPosition, (4 * Math.PI) / 3, true),
    ];
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  update() {
    this.rotation += this.speed;
    this.motorPosition.location.x += this.speed * 25; //Fake movement
    for (const leg of this.legs) {
      leg.update(this.rotation);
    }
  }

  draw(ctx) {
    for (const leg of this.legs) {
      leg.draw(ctx);
    }
  }
}
