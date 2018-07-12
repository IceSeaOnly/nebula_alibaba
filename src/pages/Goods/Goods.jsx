import React, { Component } from 'react';
import PictureTextList from './components/PictureTextList';

export default class Goods extends Component {
  static displayName = 'Goods';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="goods-page">
        <PictureTextList />
      </div>
    );
  }
}
