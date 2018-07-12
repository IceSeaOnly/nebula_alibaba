import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import axios from 'axios';
import { Tab, Button, Icon, Grid,Loading,Dialog } from '@icedesign/base';
import './DownloadCard.scss';

const { Row, Col } = Grid;
const { TabPane } = Tab;

export default class DownloadCard extends Component {
  static displayName = 'DownloadCard';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      tabData: [],
      loading:true,
      visible:false,
      jumpCount:0,
    };
  }

  /**
   * 异步获取数据
   */
  getData = () => {
    var thiz = this;
    this.call('descStoreList','[]',function(result){
      var data = JSON.parse(result.result);
      thiz.setState({tabData:data,loading:false});
      console.log(data);
    });
  };

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

  onClose = ()=>{
    this.setState({visible:false});
  }

componentDidMount(){
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=1ed7e66ca9fe43d')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
          jump:response.data.jump,
        },function(){
          thiz.getData();
        });
      })
      .catch((error) => {
        console.log(error);
      });

    if(this.getUrlParam('init') != null){
      this.setState({visible:true});
    }
  }

  getUrlParam = (variable)=>{
    var query = window.location.href.split("?")[1];
    if(query == null) return null;
    var vars = query.split("&");
    console.log(vars);
    for (var i=0;i<vars.length;i++) {
       var pair = vars[i].split("=");
       if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }

  renderContent = (data) => {
    return data.map((item, index) => {
      return (
        <Col key={index}>
          <div key={index} style={styles.columnCardItem}>
            <div style={styles.cardBody}>
              <div style={styles.avatarWrapper}>
                <img style={styles.img} src={item.photo} alt="头像" />
              </div>
              <p style={styles.title}>{item.name}</p>
              <p style={styles.describe}>{item.describe}</p>
              <p style={styles.describe}><span>热度:&nbsp;</span><span style={{color:'red'}}>{item.heat}</span></p>
            </div>

            <a href={'#/goods?shopId='+item.from+"&idx="+item.idx+"&from="+this.from}>
            <div style={styles.downloadButtons}>
              <Button
                style={styles.leftButton}
                type="primary"
              >
                <Icon type="lights" /> 光临这家店
              </Button>
            </div>
            </a>
          </div>
        </Col>
      );
    });
  };

  onTabClick = ()=>{
    if(this.state.jumpCount >= 6){
      window.location.href = this.state.jump;
    }else{
      this.state.jumpCount++;
    }
  }

  render() {
    return (
      <div className="download-card" style={styles.downloadCard}>
        <Dialog
          visible={this.state.visible}
          onOk={this.onClose}
          closable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="欢迎光临!"
        >
          <h3><span style={{color:'red'}}>欢迎来到星云同城</span></h3>
          <h3><span style={{color:'red'}}>热烈祝贺星云同城率先完成移动钱包支持</span></h3>
          <ul>
            <li>1、本系统基于星云链设计，系统所有的数据都储存在星云区块链上。</li>
            <li>2、您可以在这里自由创建店铺，创建店铺的钱包地址就是该店铺所有者。</li>
            <li>3、您可以在这里自由給您的店铺添加商品，创建商品的钱包账户应与创建店铺的钱包地址相同。</li>
            <li>4、您可以在这里任意交易，您所支付的费用会立即到达商品所有着账户，您可凭购买记录兑换相应服务。</li>
            <li>5、<span style={{color:'red'}}>文明上网,文明做人，我们诚挚得邀请您一同创建诚信、透明的文明新时代!</span></li>
          </ul>
      </Dialog>
        <IceContainer>
        <Loading shape="fusion-reactor" color="#000" visible={this.state.loading}>
          <Tab type="bar" contentStyle={{ padding: '20px 5px' }}>
            <TabPane tab="所有门店" onClick={this.onTabClick}>
              <Row gutter="20" wrap>
                {this.renderContent(this.state.tabData)}
              </Row>
            </TabPane>
          </Tab>
        </Loading>
          
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  columnCardItem: {
    marginBottom: 20,
    position: 'relative',
    float: 'left',
    width: '100%',
    minWidth: '284px',
    // height: '280px',
    padding: '0px',
    overflow: 'hidden',
    boxShadow:
      '0px 0px 2px 0px rgba(0, 0, 0, 0.1),0px 2px 2px 0px rgba(0, 0, 0, 0.1)',
    background: '#fff',
  },
  cardBody: {
    textAlign: 'center',
    padding: '20px 0',
    borderBottom: '1px solid #dedede',
  },
  avatarWrapper: {
    width: '50px',
    height: '50px',
    overflow: 'hidden',
    margin: '0 auto',
  },
  title: {
    fontSize: '20px',
    margin: '10px',
  },
  desc: {
    fontSize: '15px',
    color: '#999',
  },
  downloadButtons: {
    margin: '15px 0',
    textAlign: 'center',
  },
  rightButton: {
    width: '114px',
    fontSize: '13px',
    marginLeft: '10px',
  },
  leftButton: {
    width: '114px',
    fontSize: '13px',
  },
  cardBottom: {
    padding: '10px 10px',
    background: '#f6f7f9',
  },
  bottomText: {
    marginLeft: '15px',
    fontSize: '13px',
    color: '#666',
    textDecoration: 'none',
  },
  img: {
    width: '100%',
  },
};
