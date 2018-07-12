import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid ,Feedback,Loading,NumberPicker,Button,Dialog,Input } from '@icedesign/base';
import axios from 'axios';
import LiteTable from '../LiteTable';
import ReviewRequestTable from '../ReviewRequestTable';
import NebPay from 'nebpay.js';
const { Row, Col } = Grid;
const Toast = Feedback.toast;


export default class BasicDetailInfo extends Component {
  static displayName = 'BasicDetailInfo';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource:{
        name:'loading',
        heat:'loading',
        photo:'loading',
      },
      buyNumber:1,
      loading:true,
      visible:false,
      comment:'',
      nebPayHolder:null,
    };
  }

  buyNumberChange = (num,e)=>{
    this.setState({buyNumber:num});
  }

  onCommentChange = (txt)=>{
    this.setState({comment:txt});
  }

  addComment = ()=>{
    this.setState({visible:true});
  }

  onAddCommentClose=()=>{
   this.setState({visible:false}); 
  }

  onAddCommentOk = ()=>{
    if(this.state.comment.length == 0){
      Toast.error("您没有输入任何评论!");
      return;
    }
    var idx = this.getUrlParam("idx");
    this.callTx('addComment',"["+idx+",\""+this.state.comment+"\"]",0);
    this.onAddCommentClose();
  }

  buyIt = ()=>{
    var idx = this.getUrlParam("idx");
    var storeId = this.getUrlParam("shopId");
    var shouldPay = this.state.dataSource.price * this.state.buyNumber;
    var buyNumber = this.state.buyNumber;
    var rest = this.state.dataSource.number;

    console.log('rest:'+rest+',buy:'+buyNumber);

    if(rest < buyNumber){
      Toast.error('库存不足以满足您的购买需要!');
      return;
    }

    this.callTx('buy',"["+storeId+","+idx+","+buyNumber+"]",shouldPay);
  }

  callTx = (func,args,payMuch)=>{
    window.postMessage({
          "target": "contentscript",
          "data":{
              "to" : this.state.contract,
              "value" : payMuch,
              "contract" : {
                  "function" : func,
                  "args" : args
              }
          },
          "method": "neb_sendTransaction"
      }, "*");

    if(!this.state.nebPayHolder){
      console.log('nebPayHolder is null!');
      return;
    }

    var to = this.state.contract;
    var value = payMuch;
    var callFunction = func;
    var callArgs =  args;
    this.state.nebPayHolder.call(to, value, callFunction, callArgs, null);
  }

  timestampToTime = (timestamp) => {
        var date = new Date(timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
  }

  componentDidMount(){
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=1ed7e66ca9fe43d')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
        },function(){
          thiz.fetchData();
        });
      })
      .catch((error) => {
        console.log(error);
      });

    var nebPay = new NebPay();
    this.setState({nebPayHolder:nebPay});
  }

  fetchData(){
    var idx = this.getUrlParam("idx");
    var thiz = this;
    this.call('readMerch',"["+idx+"]",function(data){
      var data = JSON.parse(data.result);
      data.price = parseFloat(data.price/1000000000000000000);
      thiz.setState({dataSource:data,loading:false});

      console.log(data);
    })
  }

  call = (method,args,func)=>{
    var thiz =this;
    axios.post(thiz.state.net+'/v1/user/call', {
          "from": "n1PFsLu6naDWixA3VLrq2Ppyyp5XUYB7u15",
          "to": thiz.state.contract,
          "value": "0",
          "nonce": 0,
          "gasPrice": "1000000",
          "gasLimit": "2000000",
          "contract": {
              "function": method,
              "args": args
          }
      })
      .then(function (response) {
        func(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getUrlParam = (variable)=>{
    var query = window.location.href.split("?")[1];
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

  render() {
    return (
      <div>
      <IceContainer>
        <a href={'#/goods?idx='+this.getUrlParam('shopId')+'&shopId='+this.getUrlParam('shopFrom')}><Button type="primary" >返回门店</Button></a>
      </IceContainer>
      <IceContainer>
      <Dialog
          visible={this.state.visible}
          onOk={this.onAddCommentOk}
          closable="esc,mask,close"
          onCancel={this.onAddCommentClose}
          onClose={this.onAddCommentClose}
          title="发表评论"
        >
          <h3><span style={{color:'red'}}>文明上网，文明发言</span></h3>
          <ul>
            <li><Input multiple maxLength={50} rows="4" hasLimitHint onChange={this.onCommentChange}/></li>
          </ul>
      </Dialog>

      <Loading shape="fusion-reactor" color="#000" visible={this.state.loading}>
        <h2 style={styles.basicDetailTitle}>商品详情</h2>

        <div style={styles.infoColumn}>
          <h5 style={styles.infoColumnTitle}>您准备购买</h5>
          <Row wrap style={styles.infoItems}>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>商品名称：</span>
              <span style={styles.infoItemValue}>{this.state.dataSource.name}</span>
            </Col>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>商品价格：</span>
              <span style={styles.infoItemValue}>{this.state.dataSource.price+' NAS'}</span>
            </Col>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>商品卖家：</span>
              <span style={styles.infoItemValue}>{this.state.dataSource.from}</span>
            </Col>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>上架时间：</span>
              <span style={styles.infoItemValue}>{this.timestampToTime(this.state.dataSource.addTime)}</span>
            </Col>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>上架时间：</span>
              <span style={styles.infoItemValue}>{this.state.dataSource.flag == 0?'上架中':'已下架'}</span>
            </Col>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.attachLabel}>商品图片：</span>
              <span>
                <img
                  src={this.state.dataSource.photo}
                  style={styles.attachPics}
                />
              </span>
            </Col>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>商品库存：</span>
              <span style={styles.infoItemValue}>{this.state.dataSource.number}</span>
            </Col>
          </Row>

          <h5 style={styles.infoColumnTitle}>请确认购买件数</h5>
          <Row wrap style={styles.infoItems}>
            <Col xxs="24" l="12" style={styles.infoItem}>
              <span style={styles.infoItemLabel}>购买件数：</span>
              <NumberPicker
                type="inline"
                step={1}
                min={1}
                max={this.state.dataSource.number}
                onChange={this.buyNumberChange}
                defaultValue={1}
              />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" onClick={this.buyIt}>立即下单</Button>
            </Col>
            
          </Row>
        </div>
        </Loading>
      </IceContainer>
      <IceContainer>
        <h2 style={styles.basicDetailTitle}>谁在购买该商品</h2>
        <LiteTable idx={this.getUrlParam("idx")}/>
      </IceContainer>
      <IceContainer>
        <ReviewRequestTable idx={this.getUrlParam("idx")} addComment={this.addComment}/>
      </IceContainer>
      </div>
    );
  }
}

const styles = {
  basicDetailTitle: {
    margin: '10px 0',
    fontSize: '16px',
  },
  infoColumn: {
    marginLeft: '16px',
  },
  infoColumnTitle: {
    margin: '20px 0',
    paddingLeft: '10px',
    borderLeft: '3px solid #3080fe',
  },
  infoItems: {
    padding: 0,
    marginLeft: '25px',
  },
  infoItem: {
    marginBottom: '18px',
    listStyle: 'none',
    fontSize: '14px',
  },
  infoItemLabel: {
    minWidth: '70px',
    color: '#999',
  },
  infoItemValue: {
    color: '#333',
  },
  attachLabel: {
    minWidth: '70px',
    color: '#999',
    float: 'left',
  },
  attachPics: {
    width: '80px',
    height: '80px',
    border: '1px solid #eee',
    marginRight: '10px',
  },
};
