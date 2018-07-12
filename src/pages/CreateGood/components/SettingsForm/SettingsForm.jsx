/* eslint  react/no-string-refs: 0 */
import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Button, Radio, Switch, Upload, Grid,Feedback } from '@icedesign/base';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import './SettingsForm.scss';
import axios from 'axios';
import NebPay from 'nebpay.js';

const Toast = Feedback.toast;
const { Row, Col } = Grid;
const { Group: RadioGroup } = Radio;
const { ImageUpload } = Upload;

function onError(file) {
  Toast.error('上传失败!');
  console.log('onError callback : ', file);
}

function onSuccess(resp){
  console.log(resp);
  Toast.success('上传成功!');
}

function formatQiNiuImgResp(resp){
  return {
    "code": "0",
    "imgURL": "http://cdn.binghai.site/"+resp.key
  };
}

export default class SettingsForm extends Component {
  static displayName = 'SettingsForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {
        name: '',
        photo: '',
      },
    };
  }

  componentDidMount(){
    var thiz = this;
    axios.get('https://wx.nanayun.cn/api?act=1ed7e66ca9fe43d')
    .then((response) => {
        thiz.setState({
          contract:response.data.contract,
          net:response.data.net,
        });
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get('https://wx.nanayun.cn/qiniuToken')
    .then(function (response) {
      thiz.setState({imgUpToken:response.data.data});
    })
    .catch(function (error) {
      console.log(error);
    });

    var nebPay = new NebPay();
    this.setState({nebPayHolder:nebPay});
  }

  formChange = (value) => {
    this.setState({
      value,
    });
  };

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      if(errors){
        Toast.error('填写不完整!');
        return;
      }
      try{
        if(!parseInt(values.number) || parseInt(values.number) < 1){
          Toast.error('库存必须为大于0的整数!');
          return;
        }
        if(!parseFloat(values.price) || parseFloat(values.price) < 0.0001){
          Toast.error('价格必须为大于0.0001的数!');
          return;
        }
      }catch(e){
        Toast.error('库存必须为大于0的整数!');
        return;
      }

      console.log(values);
      this.createStore(values);
    });
  };

  createStore = (values)=>{
    this.callTx('addMerch',"[\""+values.name+"\",\""+values.photo.file.imgURL+"\","+values.price+","+values.number+"]",0);
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

  render() {
    return (
      <div className="settings-form">
        <IceContainer>
          <IceFormBinderWrapper
            value={this.state.value}
            onChange={this.formChange}
            ref="form"
          >
            <div style={styles.formContent}>
              <h2 style={styles.formTitle}>添加商品</h2>

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  商品名称：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="name" required max={6} message="必填，不超过6个字符">
                    <Input size="large" placeholder="必填，不超过6个字符" />
                  </IceFormBinder>
                  <IceFormError name="name" />
                </Col>
              </Row>
              

              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  商品图片：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="photo" required message="必填">
                    <ImageUpload
                      limit={1}
                      listType="picture-card"
                      action="http://up-z2.qiniup.com"
                      data={{ token: this.state.imgUpToken}}
                      accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                      locale={{
                        image: {
                          cancel: '取消上传',
                          addPhoto: '上传图片',
                        },
                      }}
                      onSuccess={onSuccess}
                      onError={onError}
                      formatter={formatQiNiuImgResp}
                    />
                  </IceFormBinder>
                  <IceFormError name="photo" />
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  商品价格(NAS)：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="price" required max={20} message="必填，以NAS为单位">
                    <Input size="large" placeholder="必填，以NAS为单位" />
                  </IceFormBinder>
                  <IceFormError name="price" />
                </Col>
              </Row>
              <Row style={styles.formItem}>
                <Col xxs="6" s="3" l="3" style={styles.label}>
                  商品库存：
                </Col>
                <Col s="12" l="10">
                  <IceFormBinder name="number" required max={20} message="必填，大于0的整数">
                    <Input size="large" placeholder="必填,大于0的整数" />
                  </IceFormBinder>
                  <IceFormError name="number" />
                </Col>
              </Row>
            </div>
          </IceFormBinderWrapper>

          <Row style={{ marginTop: 20 }}>
            <Col offset="3">
              <Button
                size="large"
                type="primary"
                style={{ width: 100 }}
                onClick={this.validateAllFormField}
              >
                提 交
              </Button>
            </Col>
          </Row>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  label: {
    textAlign: 'right',
  },
  formContent: {
    width: '100%',
    position: 'relative',
  },
  formItem: {
    alignItems: 'center',
    marginBottom: 25,
  },
  formTitle: {
    margin: '0 0 20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
};
