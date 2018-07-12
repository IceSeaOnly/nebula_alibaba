import React, { Component } from 'react';
import PlatformLanding from './components/PlatformLanding';

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home-page" style={{ background: '#fff' }}>
        <PlatformLanding />
      </div>
    );
  }
}
