import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Pagination, Grid,Loading,Feedback,Button } from '@icedesign/base';
import SingleItem from './SingleItem';
import axios from 'axios';

const { Row, Col } = Grid;
const Toast = Feedback.toast;

export default class PictureTextList extends Component {
  static displayName = 'PictureTextList';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      dataSource:[],
    };
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
  }

  fetchData(){
    var thiz = this;
    var shopId = this.getUrlParam("shopId");
    this.call('merchList',"[\""+shopId+"\"]",function(result){
      var data = JSON.parse(result.result);
      thiz.setState({dataSource:data,loading:false});
      if(data == null || data.length == 0){
        Toast.error('这家门店没有任何商品哦!');
      }
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

  getUrlParam = (variable)=>{
    var query = window.location.href.split("?")[1];
    var vars = query.split("&");
    console.log(vars);
    for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

  renderItem = (item, index) => {
    return (
      <Col xxs={12} s={8} m={6} l={4} key={index}>
        <SingleItem {...item} contract={this.state.contract} shopId={this.getUrlParam('idx')} shopFrom={this.getUrlParam('shopId')}/>
      </Col>
    );
  };

  renderItemRow = () => {
    return <div style={styles.row}>{this.state.dataSource.map(this.renderItem)}</div>;
  };

  render() {
    return (
      <div className="picture-text-list">
        <IceContainer>
          <a href="#/shopList"><Button type="primary">返回店铺列表</Button></a>
        </IceContainer>
        <IceContainer style={styles.card}>
          <Loading shape="fusion-reactor" color="#000" visible={this.state.loading}>
          </Loading>
            <Row wrap gutter={20}>
              {this.state.dataSource.map(this.renderItem)}
            </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  row: {
    margin: '0 10px 10px 10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cardStyle: {
    display: 'flex',
    margin: '20px',
    padding: '0 30px',
  },
  card: {
    padding: '20px 10px',
  },
  paginationContainer: {
    marginTop: '25px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
};
