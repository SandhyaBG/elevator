
// Car class represents an elevator car
class Car {
  constructor(id, elementId) {
    this.id = id;
    this.element = document.getElementById(elementId);
    this.currentFloor = 1;
    this.isMoving = false;
    this.doorOpen = false;
  }

  // Opens the elevator door if it's not already open
  openDoor() {
    if (!this.doorOpen) {
      this.doorOpen = true;
      this.updateDisplay();
    }
  }

  // Closes the elevator door if it's not already closed
  closeDoor() {
    if (this.doorOpen) {
      this.doorOpen = false;
      this.updateDisplay();
    }
  }

  // Moves the elevator to the specified floor if the conditions are met
  moveToFloor(floor) {
    // Validate floor number and elevator status
    if (this.isMoving || this.doorOpen || floor < 1 || floor > 3) {
      console.error(`Elevator ${this.id} can't move to Floor ${floor}`);
      return;
    }

    this.isMoving = true;
    this.closeDoor();

    // Simulate the time it takes to move to the specified floor
    setTimeout(() => {
      this.currentFloor = floor;
      this.isMoving = false;
      this.openDoor();
      controller.notifyCarArrival(this.id, floor);
    }, Math.abs(this.currentFloor - floor) * 1000);
  }

  // Updates the display to show the current status of the elevator
  updateDisplay() {
    if (this.element) {
      this.element.innerHTML = this.doorOpen
        ? `Elevator ${this.id} at ${this.currentFloor} Floor - Door Open`
        : `Elevator ${this.id} at ${this.currentFloor} Floor`;
    }
  }
}

// Button class represents an elevator call button
class Button {
  constructor(floor, direction) {
    // Validate floor number and direction
    if (floor < 1 || floor > 3) {
      throw new Error('Invalid floor number');
    }
    if (!['up', 'down'].includes(direction)) {
      throw new Error('Invalid direction');
    }
    this.floor = floor;
    this.direction = direction;
  }

  // Simulates pressing the button to request an elevator
  press() {
    controller.requestElevator(this.floor, this.direction);
  }
}

// Controller class manages the elevator cars and requests
class Controller {
  constructor() {
    this.cars = [
      new Car(1, 'elevator1'),
      new Car(2, 'elevator2')
    ];
    this.requests = [];
  }

  // Handles the request for an elevator
  requestElevator(floor, direction) {
    // Validate floor number and direction
    if (floor < 1 || floor > 3) {
      console.error(`Invalid floor request: ${floor}`);
      return;
    }
    if (!['up', 'down'].includes(direction)) {
      console.error(`Invalid direction request: ${direction}`);
      return;
    }

    const car = this.findClosestCar(floor);
    if (car) {
      car.moveToFloor(floor);
    } else {
      this.requests.push({ floor, direction });
    }
  }

  // Finds the closest available car to the requested floor
  findClosestCar(floor) {
    let closestCar = null;
    let minDistance = Infinity;
    this.cars.forEach(car => {
      if (!car.isMoving) {
        const distance = Math.abs(car.currentFloor - floor);
        if (distance < minDistance) {
          minDistance = distance;
          closestCar = car;
        }
      }
    });
    return closestCar;
  }

  // Notifies the system when a car has arrived at the requested floor
  notifyCarArrival(carId, floor) {
    this.requests = this.requests.filter(request => {
      if (request.floor === floor) {
        const car = this.cars.find(car => car.id === carId);
        if (car) {
          car.moveToFloor(floor);
        }
        return false;
      }
      return true;
    });
  }
}

// Global controller instance
const controller = new Controller();

// Simulates pressing a button to request an elevator
function pressButton(floor, direction) {
  try {
    const button = new Button(floor, direction);
    button.press();
  } catch (error) {
    console.error(error.message);
  }
}
