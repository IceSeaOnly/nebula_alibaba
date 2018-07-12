import React, { Component } from 'react';
import SettingsForm from './components/SettingsForm';

export default class CreateShop extends Component {
  static displayName = 'CreateShop';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="create-shop-page">
        <SettingsForm />
      </div>
    );
  }
}
