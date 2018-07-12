import React, { Component } from 'react';
import SettingsForm from './components/SettingsForm';

export default class CreateGood extends Component {
  static displayName = 'CreateGood';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="create-good-page">
        <SettingsForm />
      </div>
    );
  }
}
