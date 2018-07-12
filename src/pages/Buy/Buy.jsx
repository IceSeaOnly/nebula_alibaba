import React, { Component } from 'react';
import BasicDetailInfo from './components/BasicDetailInfo';

export default class Buy extends Component {
  static displayName = 'Buy';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="buy-page">
        <BasicDetailInfo />
      </div>
    );
  }
}
