// @ts-nocheck
/* eslint-disable */
import React, { Component } from 'react';
// import './index.css'

class TextCountDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftTime: props.leftTime || 0,
    };
    // this.timeCounter = null;
    this.raf = null;
  }

  componentDidMount() {
    this.init();
    this.run();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { leftTime: curTime } = this.props;
    const { leftTime: nextTime } = nextProps;
    if (nextTime > 0 && curTime !== nextTime) {
      this.setState(
        {
          leftTime: nextTime,
        },
        () => {
          cancelAnimationFrame(this.raf);
          this.init();
          this.run();
        },
      );
    }
  }

  componentWillUnmount() {
    this.setState({
      exiting: true,
    });
  }

  // 初始化数字
  init() {
    const { leftTime } = this.state;
    const nowTimeStr = this.formatDate(leftTime, 'HHIISS');
    // for (let i = 0; i < this.flipObjs.length; i++) {
    //   this.flipObjs[i].current.setFront(nowTimeStr[i])
    // }
    this.setState({
      timeText: `
            <div class="day-wrap">
                <span>${nowTimeStr}
                </span><
            /div>`,
    });
  }

  // 开始计时
  run() {
    let { leftTime: targetTime } = this.state;
    let lastTime = 0;

    const _CountDownLoop = () => {
      if (this.state.exiting) {
        return;
      }
      if (Date.now() - lastTime >= 1000) {
        const nowTimeStr = this.formatDate(targetTime, 'HHIISS');
        targetTime -= 1000;
        this.setState({
          timeText: `
                    <div class="day-wrap">
                        <span>${nowTimeStr}</span>
                    </div>`,
        });
        lastTime = Date.now();
      }

      if (targetTime > 0) {
        this.raf = requestAnimationFrame(() => {
          _CountDownLoop();
        });
      }
    };

    _CountDownLoop();
  }

  // 正则格式化日期
  formatDate(date, dateFormat) {
    // 格式化月、日、时、分、秒
    const o = {
      'D+': parseInt(date / (1000 * 60 * 60 * 24), 10),
      'H+': parseInt((date % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 10),
      'I+': parseInt((date % (1000 * 60 * 60)) / (1000 * 60), 10),
      'S+': (date % (1000 * 60)) / 1000,
    };

    const dayText = {
      'D+': `:`,
      'H+': `:`,
      'I+': `:`,
      'S+': ``,
    };

    Object.keys(o).forEach((k) => {
      if (new RegExp(`(${k})`).test(dateFormat)) {
        // 取出对应的值
        const str = `${o[k]}`;
        const textStr = `${dayText[k]}`;
        /* 根据设置的格式，输出对应的字符
         * 例如: 早上8时，hh => 08，h => 8
         * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
         * 例如: 下午15时，hh => 15, h => 15
         */
        dateFormat = dateFormat.replace(
          RegExp.$1,
          // RegExp.$1.length === 1 ? str : this.padLeftZero(str)
          +str + textStr,
        );
      }
    });
    return dateFormat;
  }

  // 日期时间补零
  padLeftZero(str) {
    return `00${str}`.substr(str.length);
  }

  render() {
    const { timeText } = this.state;
    return (
      <div
        className="count-down-wrap"
        dangerouslySetInnerHTML={{ __html: `${timeText}` }}
      ></div>
    );
  }
}
export default TextCountDown;
