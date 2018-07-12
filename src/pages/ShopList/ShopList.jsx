import React, { Component } from 'react';
import DownloadCard from './components/DownloadCard';

export default class ShopList extends Component {
  static displayName = 'ShopList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="shop-list-page">
        <DownloadCard />
      </div>
    );
  }
}
