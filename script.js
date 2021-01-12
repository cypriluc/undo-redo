const createUndoAbleCounter = () => {
  let history = [0];
  let position = 0;

  return {
    value() {
      return history[position];
    },

    setValue(value) {
      // if position is not last in history array, cleqr all future states
      if (position < history.length - 1) {
        history = history.slice(0, position + 1);
      }
      history.push(value);
      position += 1;
    },

    increment() {
      this.setValue(this.value() + 1);
    },

    decrement() {
      this.setValue(this.value() - 1);
    },

    undo() {
      if (position > 0) {
        position -= 1;
      }
    },

    redo() {
      if (position < history.length - 1) {
        position += 1;
      }
    },

    // to String function to aid in illustrating
    toString() {
      return `Value: ${this.value()}, History: [${history}], Position: ${position}`;
    },
  };
};

const undoAbleCounter = createUndoAbleCounter();
console.log(undoAbleCounter.toString());

undoAbleCounter.increment();
console.log(undoAbleCounter.toString()); // => Value: 1, History: [0,1], Position: 1

undoAbleCounter.decrement();
console.log(undoAbleCounter.toString()); // => Value: 0, History: [0,1,0], Position: 2

undoAbleCounter.undo();
console.log(undoAbleCounter.toString()); // => Value: 1, History: [0,1,0], Position: 1

undoAbleCounter.increment();
console.log(undoAbleCounter.toString()); // => Value: 2, History: [0,1,2], Position: 2
