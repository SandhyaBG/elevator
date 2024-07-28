const { Car, Button, Controller, pressButton } = require('./elevator');

describe('Elevator System Tests', () => {
  let controller;
  let car1, car2;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="elevator1"></div>
      <div id="elevator2"></div>
    `;
    controller = new Controller();
    car1 = controller.cars[0];
    car2 = controller.cars[1];
  });

  test('Elevator moves to a valid floor', done => {
    car1.moveToFloor(2);
    expect(car1.isMoving).toBe(true);
    setTimeout(() => {
      expect(car1.currentFloor).toBe(2);
      expect(car1.isMoving).toBe(false);
      expect(car1.doorOpen).toBe(true);
      done();
    }, 1000);
  });

  test('Elevator door opens and closes properly', () => {
    car1.openDoor();
    expect(car1.doorOpen).toBe(true);
    expect(document.getElementById('elevator1').innerHTML).toBe('Elevator 1 at 1 Floor - Door Open');

    car1.closeDoor();
    expect(car1.doorOpen).toBe(false);
    expect(document.getElementById('elevator1').innerHTML).toBe('Elevator 1 at 1 Floor');
  });

  test('Elevator ignores invalid floor requests', () => {
    car1.moveToFloor(4);
    expect(car1.currentFloor).toBe(1);
    expect(car1.isMoving).toBe(false);
  });

  test('Elevator does not move when door is open', () => {
    car1.openDoor();
    car1.moveToFloor(2);
    expect(car1.currentFloor).toBe(1);
    expect(car1.isMoving).toBe(false);
  });

  test('Button press for valid floor and direction', done => {
    pressButton(2, 'up');
    expect(controller.requests.length).toBe(0);
    setTimeout(() => {
      expect(car1.currentFloor).toBe(2);
      done();
    }, 1000);
  });

  test('Button press for invalid floor', () => {
    expect(() => pressButton(4, 'up')).toThrow('Invalid floor number');
  });

  test('Button press for invalid direction', () => {
    expect(() => pressButton(2, 'left')).toThrow('Invalid direction');
  });
});
