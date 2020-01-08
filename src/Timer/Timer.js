class TimerAdapter {
  constructor() {
    this.pvtIsPause = true;
    this.pvtStartTime = 0;
    this.pvtTotal = 0;
    this.pvtTimer = null;
    this.pvtDeff = null;

    this.pvtHandleUpdate = this.pvtHandleUpdate.bind(this);

    this.onChangeTime = null;
  }

  start() {
    if (this.pvtIsPause) {
      this.pvtIsPause = false;
      this.pvtStartTime = (new Date()).getTime();
      this.pvtStartTimer();
    }
  }

  pvtStartTimer() {
    this.pvtTimer = setInterval(this.pvtHandleUpdate, 10);
  }

  pvtHandleUpdate() {
    const currentTime = (new Date()).getTime();
    this.pvtDeff = currentTime - this.pvtStartTime;

    const total = Math.floor((this.pvtTotal + this.pvtDeff) / 10) / 100;
    const s = total % 60;
    const h = Math.floor( total / (60 * 60));
    const m = ( total - (h * 60 * 60) - s) / 60; 

    if (typeof this.onChangeTime === 'function') {
      this.onChangeTime({
        h: this.pvtInsertZero(h, 2),
        m: this.pvtInsertZero(m, 2),
        s: this.pvtInsertZero(s, 2, 2),
      });

    }
  }

  pvtInsertZero(propStr, digit, decimal) {
    let str = String(propStr);
    let [ left, right ] = str.split('.');

    while (left.length < digit) {
      left = `0${left}`;
    }

    if (!right) {
      right = "";
    }

    if (decimal) {
      while (right.length < decimal) {
        right = `${right}0`;
      }
      right = `.${right}`;
    }

    return `${left}${right}`;
  }

  pvtClearTimer() {
    clearInterval(this.pvtTimer);
    this.pvtTimer = null;
  }

  pause() {
    if (!this.pvtIsPause) {
      this.pvtTotal += this.pvtDeff;
      this.pvtIsPause = true;
      this.pvtClearTimer();
    }
  }

  reset() {
    this.pvtTotal = 0;
    this.pvtIsPause = true;
    this.pvtClearTimer();
    if (typeof this.onChangeTime === 'function') {
      this.onChangeTime({
        h: '00',
        m: '00',
        s: '00.00',
      });
    }
  }
}

class TimerView {
  constructor () {
    this.pvtContainer = null;
    this.pvtBlockList = {};

    this.pvtCreateUI();
  }

  pvtCreateUI() {
    this.pvtContainer = document.createElement('div');
    this.pvtContainer.classList.add('view-container');
    
    const view = document.createElement('div');
    view.classList.add('view');

    TimerView.TimeBlockList.forEach((name) => {
      const block = document.createElement('div');
      if (name === ':') {
        block.classList.add('sign');
        block.innerText = ':';
      } else {
        block.classList.add(name);
        this.pvtBlockList[name] = block;
      }
      view.appendChild(block);
    });

    this.pvtContainer.appendChild(view);
  }

  setContent({ h, m, s }) {
    this.pvtBlockList.h.innerText = h;
    this.pvtBlockList.m.innerText = m;
    this.pvtBlockList.s.innerText = s;
  }

  render(parent) {
    if (parent
      && typeof parent.appendChild === 'function'
    ) {
      parent.appendChild(this.pvtContainer);
    }
  }
}

TimerView.TimeBlockList = ['h', ':', 'm', ':', 's'];

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