import React, { Component } from 'react';
import IceImg from '@icedesign/img';
import './SingleItem.scss';
import { Icon,Feedback,Dialog } from "@icedesign/base";
import axios from 'axios';
const Toast = Feedback.toast;

export default class SingleItem extends Component {
  static displayName = 'SingleItem';

  constructor(props) {
    super(props);
    this.state = {
      visible:false,
    };
  }

  deleteItem = ()=>{
    this.setState({
      visible: true
    });
  }

  onOk=()=>{
    this.onClose();
    var idx = this.props.idx;

    window.postMessage({
          "target": "contentscript",
          "data":{
              "to" : this.props.contract,
              "value" : "0",
              "contract" : {
                  "function" : 'deleteMerch',
                  "args" : "["+idx+"]"
              }
          },
          "method": "neb_sendTransaction"
      }, "*");
  }

  onClose = () => {
    this.setState({
      visible: false
    });
  };

  go = (idx)=>{
      console.log("idx="+idx);
    }

  render() {
    const {
      style,
      className = '',
      idx,
      photo,
      name,
      price,
      number,
      active,
      shopId,
      shopFrom,
    } = this.props;
    return (
      <div
        className={`${className} single-item`}
        style={{
          ...style,
          width: '165px',
          height: '230px',
          cursor: 'pointer',
          borderRadius: '4px',
          margin: '0 auto',
          backgroundColor: active ? '#f4f4f4' : undefined,
        }}
      >
        <a href={'#/buy?idx='+idx+'&shopId='+shopId+"&shopFrom="+shopFrom}>
          <IceImg
            src={photo}
            width={149}
            height={149}
            style={{ margin: '8px' }}
          />
        </a>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            fontSize: '12px',
            lineHeight: '18px',
            margin: '0 14px',
          }}
        >
          {name}
        </div>
        <div
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: '#999',
            lineHeight: '18px',
            fontSize: '12px',
            margin: '0 14px',
          }}
        >
          <span style={{color:'red'}}>{parseFloat(price/1000000000000000000)}</span> {"NAS"}&nbsp;&nbsp;&nbsp;{'库存:'+number}
        </div>
        <div style={{textAlign:"right"}}>
          <Icon type="ashbin" style={{color:'#D1D1D1'}} onClick={this.deleteItem}/>
        </div>
      <Dialog
          visible={this.state.visible}
          onOk={this.onOk}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="温馨提示"
        >
          <h3>您点了删除按钮!</h3>
          <ul>
            <li>1、如果您只是想购买此商品，那您只需要点击商品图片就可以购买了哦~</li>
            <li>2、如果您是店主，确实想删除此商品，那么请点击确认~</li>
          </ul>
        </Dialog>
      </div>
    );
  }
}
