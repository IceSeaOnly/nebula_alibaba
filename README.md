# 星云上的阿里巴巴

> 星云链第三周优秀奖

![](http://cdn.binghai.site/o_1ci7e36hu6dc175mcra18bccsda.png)

[智能合约](https://explorer.nebulas.io/#/address/n1pJzBmC6N1DuTx4eajsLUC1iGjAUaBDjJA)地址

### 合约代码
```
'use strict';
var Store = function(text) {
	if(text) {
		var o = JSON.parse(text);
   		this.idx = o.idx;
    	this.name = o.name;
    	this.describe = o.describe;
    	this.photo = o.photo;
    	this.from = o.from;
    	this.addTime = o.addTime;
    	this.heat = o.heat;
	}
};

Store.prototype = {
	toString: function() {
    	return JSON.stringify(this);
  }
};

var Merchandise = function(text) {
	if(text) {
		var o = JSON.parse(text);
		this.idx = o.idx;
		this.name = o.name;
    	this.photo = o.photo;
    	this.from = o.from;
    	this.addTime = o.addTime;
    	this.price = new BigNumber(o.price);
    	this.number = o.number;
    	this.flag = o.flag;
	}
};

Merchandise.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};

var Comment = function(text) {
	if(text){
		var o = JSON.parse(text);
		this.idx = o.idx;
		this.details = o.details;
		this.from = o.from;
		this.meridx = o.meridx;
		this.addTime = o.addTime;
	}
};

Comment.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};

var BuyRecord = function (text) {
	if (text) {
	    var o = JSON.parse(text);
	    this.idx = o.idx;
	    this.from = o.from;
	    this.addTime = o.addTime;
	    this.meridx = o.meridx;
	    this.number  = o.number;
    }
};

BuyRecord.prototype = {
	toString: function () {
    	return JSON.stringify(this);
  }
};

var IntelligentStore = function(){
  LocalContractStorage.defineProperty(this, "buyRecordSize");
  LocalContractStorage.defineProperty(this, "storeSize");
  LocalContractStorage.defineProperty(this, "merchSize");
  LocalContractStorage.defineProperty(this, "commSize");
 

  LocalContractStorage.defineMapProperty(this, "buyRecords", {
    parse: function (text) {
      return new BuyRecord(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "stores", {
    parse: function (text) {
      return new Store(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "merchandises", {
    parse: function (text) {
      return new Merchandise(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });

  LocalContractStorage.defineMapProperty(this, "comments", {
    parse: function (text) {
      return new Comment(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

IntelligentStore.prototype = {
	init: function () {
	    this.buyRecordSize = 0;
	    this.storeSize = 0;
	    this.merchSize = 0;
	    this.commSize = 0;
  	},

	addStore: function(name, photo,describe) {
	    var from = Blockchain.transaction.from;
	    var ts = Blockchain.transaction.timestamp;

	    var sto = new Store();

	    sto.idx = this.storeSize;
	    sto.name = name;
	    sto.photo = photo;
	    sto.from = from;
	    sto.addTime = ts; 
	    sto.heat = 0;
	    sto.describe = describe;
  	
	    this.stores.put(this.storeSize,sto);
	    this.storeSize++;

   		return sto;
 	},

  	addMerch: function(name, photo, price, number) {
	    var ts = Blockchain.transaction.timestamp;
	    var from = Blockchain.transaction.from;

	    var merch = new Merchandise();

	    merch.idx = this.merchSize;
	    merch.name = name;
	    merch.photo = photo;
	    merch.from = from;
	    merch.addTime = ts; 
	    merch.price = new BigNumber(price*1000000000000000000); //NAS -> wei
	    merch.number = number;
	    merch.flag = 0;
  	
	    this.merchandises.put(this.merchSize,merch);
	    this.merchSize++;

   		return merch;
  	},

  	addComment: function(meridx, details) {
  		var from = Blockchain.transaction.from;
	    var ts = Blockchain.transaction.timestamp;

	    var comm = new Comment();

	    comm.idx = this.commSize;
	    comm.details = details;
	    comm.meridx = meridx;
	    comm.from = from;
	    comm.addTime = ts;

	    this.comments.put(this.commSize, comm);
	    this.commSize++;

	    return comm;
  	},

  	deleteMerch: function(meridx) {
  		var from = Blockchain.transaction.from;
  		var merch = this.readMerch(meridx);

  		if(merch == null){
  			throw new Error('item not exist!');
  		}

  		if(merch.from == from){
  			merch.flag = 1;
  			this.merchandises.put(meridx,merch);
  		} 

  		return merch;
  	},

  	readStore:function(idx){
    	return this.stores.get(idx);
  	},

  	readMerch:function(idx){
    	return this.merchandises.get(idx);
  	},

  	readComm:function(idx){
    	return this.comments.get(idx);
  	},

  	storeList:function(){
	    var list = [];
	    for(var i = 0;i < this.storeSize; i++){
	      list.push(this.readStore(i));
	    }
	    return list;
  	},

  	descStoreList:function(){
	    var list = [];
	    for(var i = this.storeSize-1; i >= 0; i--){
	      list.push(this.readStore(i));
	    }
	    return list;
  	},

  	merchList:function(storeFrom){
	    var list = [];
	    for(var i = 0; i < this.merchSize; i++){
	    	var item = this.readMerch(i);
	    	if(item.from == storeFrom && item.flag == 0) {
	    		list.push(item);
	    	}
	    }
	    return list;
  	},

  	descMerchList:function(storeFrom){
	    var list = [];
	    for(var i = this.merchSize-1;i >= 0; i--){
	   		var item = this.readMerch(i);
	    	if(item.from == storeFrom) {
	      		list.push(item);
	      	}
	    }
	    return list;
  	},

  	commOfMerchList:function(meridx){
	    var list = [];
	    for(var i = 0;i < this.commSize; i++){
	    	var item = this.readComm(i);
	    	if(item.meridx == meridx) {
	    		list.push(item);
	    	}
	    }
	    return list;
  	},

  	desCommOfMerchcList:function(meridx){
	    var list = [];
	    for(var i = this.commSize-1; i >= 0; i--){
	     	var item = this.readComm(i);
	    	if(item.meridx == meridx) {
	      		list.push(item);
	      	}
	    }
	    return list;
  	},

  	buy:function(stoidx, meridx, number){
  		var from = Blockchain.transaction.from;
	    var ts = Blockchain.transaction.timestamp;
	    var payMuch = Blockchain.transaction.value;

	    var merch = this.readMerch(meridx);

	    if(merch == null || merch.flag == 1 || merch.number <= 0 || merch.number < number){
	    	Blockchain.transfer(from, payMuch);
	    	throw new Error("item not exist or stock not enough or has been deleted! your payment has been send back.");
	    }

	    if(merch.price*number > payMuch){
	    	Blockchain.transfer(from, payMuch);
	    	throw new Error("your payment is not enough! your payment has been send back.");
	    }

	    var buyRec = new BuyRecord();

	    Blockchain.transfer(merch.from, payMuch);

	    buyRec.idx = this.buyRecordSize;
	    buyRec.from = from;
	    buyRec.addTime = ts;
	    buyRec.meridx = meridx;
	    buyRec.number  = number;

	    this.buyRecords.put(this.buyRecordSize, buyRec);
	    this.buyRecordSize++;
  		
  		
  		merch.number -= number;
  		this.merchandises.put(merch.idx,merch);
  		

  		var sto = this.readStore(stoidx);
  		sto.heat += number;
  		this.stores.put(stoidx, sto);

  		return buyRec;
  	},

  	buyRecordsList:function(meridx){
  		var list = [];
	    for(var i = this.buyRecordSize-1; i >= 0; i--){
	     	var item = this.buyRecords.get(i);
	    	if(item.meridx == meridx) {
	      		list.push(item);
	      	}
	    }
	    return list;
  	},
};

module.exports = IntelligentStore;
```