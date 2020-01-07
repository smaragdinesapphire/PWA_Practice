class TimerAdapter {
  constructor() {
    this.pvtIsStart = false;
    this.pvtStartTime = 0;
    this.pvtTimer = null;
    
    this.pvtHandleUpdate = this.pvtHandleUpdate.bind(this);

    this.onChangeTime = null;
  }

  start() {
    if (!this.pvtIsStart) {
      this.pvtIsStart = true;
      this.pvtStartTime = (new Date()).getTime();
    }
    this.pvtStartTimer();
  }

  pvtStartTimer() {
    if (!this.pvtTimer) {
      this.pvtTimer = setInterval(this.pvtHandleUpdate, 10);
    }
  }

  pvtHandleUpdate() {
    const currentTime = (new Date()).getTime();
    const deff = Math.floor((currentTime - this.pvtStartTime) / 10) / 100;
    const s = deff % 60;
    const h = Math.floor(deff / (60 * 60));
    const m = (deff - (h * 60 * 60) - s) / 60; 
    if (typeof this.onChangeTime === 'function') {
      this.onChangeTime(`${this.pvtInsertZeroToHead(h)}:${this.pvtInsertZeroToHead(m)}:${this.pvtInsertZeroToHead(s)}`);
    }
  }

  pvtInsertZeroToHead(propStr, digit) {
    let str = String(propStr);
    while (str.length < digit) {
      str = `0${str}`;
    }
    return str;
  }

  pause() {
    clearInterval(this.pvtTimer);
    this.pvtStartTime = (new Date()).getTime();
    this.pvtTimer = null;
  }

  reset() {
    this.pvtIsStart = false;
    this.pause();
    if (typeof this.onChangeTime === 'function') {
      this.onChangeTime(`${this.pvtInsertZeroToHead(0)}:${this.pvtInsertZeroToHead(0)}:${this.pvtInsertZeroToHead(0)}`);
    }
  }
}

class TimerView {
  constructor () {
    this.pvtContainer = null;
    this.pvtView = null;

    this.pvtCreateUI();
  }

  pvtCreateUI() {
    this.pvtContainer = document.createElement('div');
    this.pvtContainer.classList.add('view-container');
    
    this.pvtView = document.createElement('div');
    this.pvtView.classList.add('view');

    this.pvtContainer.appendChild(this.pvtView);
  }

  setContent(str) {
    this.pvtView.innerText = str;
  }

  render(parent) {
    if (parent
      && typeof parent.appendChild === 'function'
    ) {
      parent.appendChild(this.pvtContainer);
    }
  }
}

class TimerButton {
  constructor() {
    this.pvtCreateUI();

    this.onClick = null;
  }

  pvtCreateUI() {
    this.pvtContainer = document.createElement('div');
    this.pvtContainer.classList.add('button-container');

    Object.values(TimerButton.TYPE).forEach((name) => {
      const button = document.createElement('button');
      button.classList.add('button');
      button.classList.add(name);
      button.innerText = name;
      button.addEventListener('click', () => {
        this.pvtHandleClick(name);
      });
      this.pvtContainer.appendChild(button);
    });

  }

  pvtHandleClick(name) {
    if (this.onClick
      && typeof this.onClick === 'function'
    ) {
      this.onClick(name);
    }
  }

  render(parent) {
    if (parent
      && typeof parent.appendChild === 'function'
    ) {
      parent.appendChild(this.pvtContainer);
    }
  }
}
TimerButton.TYPE = {
  START: 'Start',
  PAUSE: 'Pause',
  RESET: 'Reset',
}

class Timer {
  constructor (){
    this.pvtTimerAdapter = new TimerAdapter();

    this.pvtContainer = null;

    this.pvtHandleClick = this.pvtHandleClick.bind(this);
    
    this.pvtCreateUI();
  }

  pvtCreateUI() {
    this.pvtContainer = document.createElement('div');
    this.pvtContainer.classList.add('Timer');

    const view = new TimerView();
    view.render(this.pvtContainer);

    this.pvtTimerAdapter.onChangeTime = (time) => {
      view.setContent(time);
    };

    const buttonPanel = new TimerButton();
    buttonPanel.render(this.pvtContainer);
    buttonPanel.onClick = this.pvtHandleClick;
  }

  pvtHandleClick(action) {
    const TYPE = TimerButton.TYPE;
    switch (action) {
      case TYPE.START:
        this.pvtTimerAdapter.start();
        break;
      case TYPE.PAUSE:
        this.pvtTimerAdapter.pause();
        break;
      case TYPE.RESET:
        this.pvtTimerAdapter.reset();
        break;
      // no default
    }
  }

  render(parent) {
    if (parent
      && typeof parent.appendChild === 'function'
    ) {
      parent.appendChild(this.pvtContainer);
    }
  }
}