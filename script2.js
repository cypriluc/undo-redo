const createNamedCounter = (name) => {
  return {
    name,
    count: 0,
  };
};

const createIncrementCommand = (counter) => {
  const previousCount = counter.count;

  return {
    execute() {
      counter.count += 1;
    },
    undo() {
      counter.count = previousCount;
    },
  };
};

const createDecrementCommand = (counter) => {
  const previousCount = counter.count;

  return {
    execute() {
      counter.count -= 1;
    },
    undo() {
      counter.count = previousCount;
    },
  };
};

const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

const commands = {
  [INCREMENT]: createIncrementCommand,
  [DECREMENT]: createDecrementCommand,
};

const createCommandManager = (target) => {
  let history = [null];
  let position = 0;

  return {
    doCommand(commandType) {
      if (position < history.length - 1) {
        history = history.slice(0, position + 1);
      }

      if (commands[commandType]) {
        const concreteCommand = commands[commandType](target);
        history.push(concreteCommand);
        position += 1;

        concreteCommand.execute();
      }
    },

    undo() {
      if (position > 0) {
        console.log(history[position]);
        history[position].undo();
        position -= 1;
      }
    },

    redo() {
      if (position < history.length - 1) {
        position += 1;
        history[position].execute();
      }
    },

    getState() {
      return {
        position,
        historyLength: history.length,
      };
    },

    toString() {
      return `History length: ${history.length}, Position: ${position}`;
    },
  };
};

/* const quinnCounter = createNamedCounter("Quinn");
console.log(quinnCounter); // => { name: 'Quinn', count: 0 }

const quinnCountManager = createCommandManager(quinnCounter);

quinnCountManager.doCommand(INCREMENT);
console.log(quinnCounter); // => { name: 'Quinn', count: 1 }

quinnCountManager.doCommand(INCREMENT);
console.log(quinnCounter); // => { name: 'Quinn', count: 2 }

quinnCountManager.doCommand(DECREMENT);
console.log(quinnCounter); // => { name: 'Quinn', count: 1 }

quinnCountManager.undo();
console.log(quinnCounter); // => { name: 'Quinn', count: 2 }

quinnCountManager.redo();
console.log(quinnCounter); // => { name: 'Quinn', count: 1 } */

// WORK FROM DOM

const yourCounter = createNamedCounter("Your");
const yourCountManager = createCommandManager(yourCounter);
let undo = document.getElementById("undo");
let redo = document.getElementById("redo");
updateDOM();

DOMIncrement = () => {
  yourCountManager.doCommand(INCREMENT);
  updateDOM();
};

DOMDecrement = () => {
  yourCountManager.doCommand(DECREMENT);
  updateDOM();
};

DOMUndo = () => {
  yourCountManager.undo();
  updateDOM();
};

DOMRedo = () => {
  yourCountManager.redo();
  updateDOM();
};

function updateDOM() {
  // update DOM number according the counter
  document.getElementById("value").innerHTML = yourCounter.count;
  // disable undo button when not possible to undo
  if (yourCountManager.getState().position === 0) {
    undo.disabled = true;
  } else {
    undo.disabled = false;
  }
  // disable redo button when not possible to redo
  if (
    yourCountManager.getState().position >=
    yourCountManager.getState().historyLength - 1
  ) {
    redo.disabled = true;
  } else {
    redo.disabled = false;
  }
  // console log history and position
  console.log(yourCountManager.toString());
}
