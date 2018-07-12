import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table } from '@icedesign/base';
import axios from 'axios';

const styles = {
  processing: {
    color: '#5485F7',
  },
  finish: {
    color: '#64D874',
  },
  terminated: {
    color: '#999999',
  },
  pass: {
    color: '#FA7070',
  },
};


const statusComponents = {
  finish: <span style={styles.finish}>好评</span>,
  pass: <span style={styles.pass}>差评</span>,
};

export default class LiteTable extends Component {
  static displayName = 'LiteTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      tableData: []
    };
  }

  renderStatus = (value) => {
    return statusComponents[value];
  };

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
    this.call('buyRecordsList','['+this.props.idx+']',function(data){
      var list = JSON.parse(data.result);
      console.log(list);
      thiz.setState({tableData:list});
    });
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

  render() {

    return (
      <div className="lite-table">
        <IceContainer style={styles.tableCard}>
          <Table dataSource={this.state.tableData} hasBorder={false}>
            <Table.Column title="购买顾客" dataIndex="from" width={200} />
            <Table.Column title="购买时间" dataIndex="addTime" cell={this.timestampToTime} width={100} />
            <Table.Column title="购买数量" dataIndex="number" width={100} />
          </Table>
        </IceContainer>
      </div>
    );
  }
}
