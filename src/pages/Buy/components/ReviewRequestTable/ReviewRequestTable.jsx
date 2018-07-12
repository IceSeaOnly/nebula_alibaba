import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Icon,Table,Button } from '@icedesign/base';
import axios from 'axios';


export default class ReviewRequestTable extends Component {
  static displayName = 'ReviewRequestTable';

  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      avatars:[],
      contract:this.props.contract,
      net:this.props.net,
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
          console.log(thiz.state);
          thiz.fetchData();
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get('https://wx.nanayun.cn/api?act=d5db1466f52291a')
    .then((response) => {
        thiz.setState({
          avatars:response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchData(){
    var idx = this.props.idx;
    var thiz = this;
    this.call('desCommOfMerchcList','['+idx+']',function(data){
      var list = JSON.parse(data.result);
      thiz.setState({tableData:list});
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

  getAvatar = ()=>{
    var number = parseInt(Math.random()*100);
    var size = this.state.avatars.length;
    var idx = number % size;
    var src = this.state.avatars[idx];
    return src;
  }

  renderInviteInfo = (value, index, record) => {
    return (
      <div style={styles.sentInfo}>
        <span style={styles.avatarWrapper}>
          <img
            style={styles.avatar}
            width="40"
            height="40"
            src={this.getAvatar()}
            alt=""
          />
        </span>
        <span style={styles.sentName}>{record.from}</span>
      </div>
    );
  };

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

  render() {
    return (
      <IceContainer title="最近评论">
        <div align="center" ><Button width="200" type="primary" onClick={this.props.addComment}><Icon type="atm" />添加评论</Button></div>
        <Table dataSource={this.state.tableData} hasBorder={false}>
          <Table.Column title="评论人" cell={this.renderInviteInfo} width="200" />
          <Table.Column title="评论内容" dataIndex="details" width="200"/>
          <Table.Column title="评论时间" dataIndex="addTime" cell={this.timestampToTime} width="80"/>
        </Table>
      </IceContainer>
    );
  }
}

const styles = {
  inviteInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  sentInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderRadius: '40px',
    overflow: 'hidden',
    display: 'inline-block',
    marginRight: 10,
  },
  avatar: {
    display: 'block',
  },
};
