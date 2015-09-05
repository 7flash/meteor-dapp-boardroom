/*BoardRoom.at = function(address){
    var Contract = web3.eth.contract(BoardRoom.abi);    
    var Instance = web3.buildInstance(Contract.at(address), BoardRoom.methods);
    Instance.Instance = Contract.at(address);
    
    return Instance;
};

BoardRoom.new = function(){
    var args = Array.prototype.slice.call(arguments);
    var Contract = web3.eth.contract(BoardRoom.abi);
    var options = web3.getMethodDetails(args);
    var transactionObject = _.extend(options.transactionObject,
                                     {data: BoardRoom.code, 
                                      gas: 3000000,
                                      gasPrice: web3.eth.gasPrice});
    
    var callback = function(err, result){       
        options.callback(err, result, false);
        
        if(result.address)
            options.callback(err, 
                             BoardRoom.at(result.address)
                             , true);
    };
    var buildArgs = web3.buildMethodArray(args, transactionObject, callback);
    Contract.new.apply(Contract, buildArgs);
};*/

var methods = {};

methods.parent = function(){
    var args = Array.prototype.slice.call(arguments),
        options = web3.getMethodDetails(args),
        callback = function(err, result){
        options.callback(err, BoardRoom.at(result));   
    },
        buildArgs = web3.buildMethodArray(args, {}, callback);
    
    return this.Instance.parent.apply(this.Instance, buildArgs);
};

/*methods.children = function(){
    var args = Array.prototype.slice.call(arguments),
        options = web3.getMethodDetails(args),
        callback = function(err, result){
            options.callback(err, BoardRoom.at(result));   
        },
        buildArgs = web3.buildMethodArray(args, {}, callback);
    return this.Instance.children.apply(this.Instance, buildArgs);
};*/

methods.table = function(){
    var args = Array.prototype.slice.call(arguments),
        options = web3.getMethodDetails(args),
        This = this,
        callback = function(err, result){
            var watcher;
            watcher = This.Instance.onProposal({
                _kind: args[2],
                _from: (options.from || web3.eth.defaultAccount)
            }, function(err, eventResult){
                watcher.stopWatching();
                options.callback(err, result, eventResult);
            });
            options.callback(err, result, null);   
        },
        buildArgs = web3.buildMethodArray(args, {}, callback);
    
    console.log(buildArgs);
    
    return this.Instance.table.apply(this.Instance, buildArgs);
};

methods.info = function(callObject, callback){
    if(_.isFunction(callObject))
        callback = callObject;
    
    if(_.isUndefined(callback))
        callback = function(err, result){};
    
    if(_.isUndefined(callObject))
        callObject = {};
    
    var properties = ['numExecuted', 'numProposals', 'numMembers', 'parent', 'configAddr', 'numMembersActive', 'chair', 'numChildren', 'numChildrenActive', 'balance'],
        batch = web3.createBatch(),
        return_object = {address: this.address},
        This = this;
    
    _.each(properties, function(property, propertyIndex){
        batch.add(This.Instance[property].request(function(err, result){ //callObject
            if(result instanceof BigNumber)
                result = result.toNumber(10);
                
            return_object[property] = result;
            
            if(propertyIndex == properties.length - 1)
                callback(err, return_object);
        }));
    });
    
    batch.execute();
};

var abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "proposals",
    "outputs": [
      {
        "name": "name",
        "type": "bytes32"
      },
      {
        "name": "data",
        "type": "bytes32"
      },
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "from",
        "type": "uint256"
      },
      {
        "name": "value",
        "type": "uint256"
      },
      {
        "name": "numVoters",
        "type": "uint256"
      },
      {
        "name": "numVotes",
        "type": "uint256"
      },
      {
        "name": "numFor",
        "type": "uint256"
      },
      {
        "name": "numAgainst",
        "type": "uint256"
      },
      {
        "name": "executed",
        "type": "bool"
      },
      {
        "name": "kind",
        "type": "uint256"
      },
      {
        "name": "numMembers",
        "type": "uint256"
      },
      {
        "name": "created",
        "type": "uint256"
      },
      {
        "name": "expiry",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      },
      {
        "name": "_param",
        "type": "bytes32"
      }
    ],
    "name": "getProposalBytes",
    "outputs": [
      {
        "name": "b",
        "type": "bytes32"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      }
    ],
    "name": "getProposalAddress",
    "outputs": [
      {
        "name": "a",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      },
      {
        "name": "_to",
        "type": "uint256"
      }
    ],
    "name": "getDelegationType",
    "outputs": [
      {
        "name": "b",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_mid",
        "type": "uint256"
      },
      {
        "name": "_param",
        "type": "bytes32"
      }
    ],
    "name": "getMemberUint",
    "outputs": [
      {
        "name": "u",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      }
    ],
    "name": "getProposalExecuted",
    "outputs": [
      {
        "name": "b",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_b",
        "type": "bool"
      }
    ],
    "name": "setConfigOverride",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numExecuted",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numProposals",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numMembers",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "configAddr",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      },
      {
        "name": "_param",
        "type": "bytes32"
      }
    ],
    "name": "getProposalUint",
    "outputs": [
      {
        "name": "u",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "members",
    "outputs": [
      {
        "name": "permission",
        "type": "uint256"
      },
      {
        "name": "addr",
        "type": "address"
      },
      {
        "name": "joined",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "parent",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "toMember",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "children",
    "outputs": [
      {
        "name": "addr",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      }
    ],
    "name": "hasWon",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numMembersActive",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_mid",
        "type": "uint256"
      }
    ],
    "name": "getMemberAddress",
    "outputs": [
      {
        "name": "a",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "delegations",
    "outputs": [
      {
        "name": "delegated",
        "type": "bool"
      },
      {
        "name": "numDelegations",
        "type": "uint256"
      },
      {
        "name": "to",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      },
      {
        "name": "_to",
        "type": "uint256"
      }
    ],
    "name": "getDelegationNumDelegations",
    "outputs": [
      {
        "name": "u",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "balance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      },
      {
        "name": "_type",
        "type": "bool"
      }
    ],
    "name": "vote",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "configOverride",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "uint256"
      },
      {
        "name": "_pid",
        "type": "uint256"
      }
    ],
    "name": "delegate",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numChildrenActive",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numChildren",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "bytes32"
      },
      {
        "name": "_data",
        "type": "bytes32"
      },
      {
        "name": "_kind",
        "type": "uint256"
      },
      {
        "name": "_addr",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      },
      {
        "name": "_expiry",
        "type": "uint256"
      }
    ],
    "name": "table",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "chair",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_pid",
        "type": "uint256"
      }
    ],
    "name": "execute",
    "outputs": [],
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_pid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_from",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_to",
        "type": "uint256"
      }
    ],
    "name": "onDelegate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_kind",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_from",
        "type": "uint256"
      }
    ],
    "name": "onProposal",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_pid",
        "type": "uint256"
      }
    ],
    "name": "onExecute",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_pid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_from",
        "type": "uint256"
      }
    ],
    "name": "onVote",
    "type": "event"
  }
],
    code =  '6060604052602133600080808080600160a060020a038616811415602f576098565b611af7806100a16000396000f35b600160a060020a0386168082526003602081815260408085208054865260028084528287208754885292872060018082018054600160a060020a0319168f1790554292820192909255878155875496885294909352849055928101845580548101905590945091505b50505050505056006060604052361561015e5760e060020a6000350463013cf08b81146101755780630c4f2842146101f65780631128bbfd1461023f578063117fc2ae146102675780631ae99af0146102945780631bd85e30146103045780632448ec05146103265780632ed5e072146103a2578063400e3949146103ab5780634698d110146103b45780635c820c96146103bd5780635ca9a4d5146103cf5780635daf08ca1461041b57806360f96a8f1461044c5780636772b2f31461045e5780637002ce421461047657806375eeadc314610497578063777b17c0146104f85780639029444a146105015780639501ed301461054c578063ac61134514610583578063b69ef8a8146105b0578063c9d27afe146105b9578063d6f6ecb61461061b578063d9a349521461062e578063da28850414610795578063de42b2601461079e578063e19077fb146107a7578063fdf893f514610849578063fe0d94c114610852575b6108a960003411156101735760058054340190555b565b600d60208190526004803560009081526040902060098101548154600183015460038401546002850154958501546005860154600687015460078801546008890154600a8a0154600b8b0154600c8c01549b909d01546108ab9d999c989b600160a060020a03999099169a97999698959794969395929460ff16939192908e565b6109226004356024356000828152600d60205260408120817f6e616d65000000000000000000000000000000000000000000000000000000008414156113cc57815492506109a5565b6109346004356000818152600d602052604081206002810154600160a060020a03169161099a565b6109226004356024356000828152600e602090815260408083208484529091528120805460ff16916109a5565b61092260043560243560008281526002602052604081206001810154829182918691908390600160a060020a031681146109a15790938491507f6a6f696e656400000000000000000000000000000000000000000000000000008714156109ad57505050600282015492506109a5565b6109226004356000818152600d60205260408120600981015460ff169161099a565b6108a9600435600160a060020a0333811660008181526003602090815260408083205480845260029092528220600181015491949093911614801561036f575060046000505483145b1561039b57600a805474ff0000000000000000000000000000000000000000191660a060020a86021790555b5050505b50565b610922600c5481565b610922600b5481565b61092260005481565b610934600a54600160a060020a031681565b6109226004356024356000828152600d60205260408120817f66726f6d0000000000000000000000000000000000000000000000000000000084141561143d57600382015492506109a5565b600260208190526004356000908152604090208054600182015491909201546109519291600160a060020a03169083565b610934600854600160a060020a031681565b61092260043560036020526000908152604090205481565b610934600435600960205260009081526040902054600160a060020a031681565b6109226004355b600160a060020a03338116600081815260036020908152604080832054835260029091528120600181015491938493849384938493909284929091161415610ba257878152600d60205260408120889082610bae83610b7b565b61092260015481565b61093460043560008181526002602052604081206001810154829182918591908390600160a060020a0316811461099657506001810154600160a060020a03169450925061099a9050565b600e60209081526004356000908152604080822090925260243581522060018101548154600292909201546109789260ff16919083565b6109226004356024356000828152600e6020908152604080832084845290915281206001810154916109a5565b61092260055481565b600160a060020a0333811660008181526003602090815260408083205483526002909152812060018101546108a9946004359460243594938493849384938493928492161415610aa957888152600d60205260408120899082610ab583610b7b565b610922600a5460a060020a900460ff1681565b600160a060020a0333811660008181526003602090815260408083205483526002909152812060018101546108a9946004359460243594938493849384938493928492161415610aa9578881526040812060018101548a91908390600160a060020a03168114610aa5576003600050600033600160a060020a03168152602001908152602001600020600050549950600e60005060008c815260200190815260200160002060005060008b815260200190815260200160002060009850985088885060000160009054906101000a900460ff16600014801561074d5750600260005060008d815260200190815260200160002060005060020160005054600d60005060008d8152602001908152602001600020600050600c0160005054115b8015610779575060008a8152600260208181526040808420909201548e8452600d9091529120600c0154115b80156107855750898c14155b80156109e257506109e28b610b7b565b61092260075481565b61092260065481565b6108a960043560243560443560643560843560a435600160a060020a0333811660008181526003602090815260408083205483526002909152812060018101549193909284929091161415610aa9576003600050600033600160a060020a03168152602001908152602001600020600050549250610aa989898989878a6001600050548b600060008260001415801561083f57504283105b156116b2576117e3565b61092260045481565b600160a060020a0333811660008181526003602090815260408083205483526002909152812060018101546108a994600435948493928492161415610d7e57848152600d60205260408120859082610d8683610b7b565b005b604080519e8f5260208f019d909d52600160a060020a039b909b168d8d015260608d019990995260808c019790975260a08b019590955260c08a019390935260e08901919091526101008801526101208701526101408601526101608501526101808401526101a083015251908190036101c00190f35b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b60408051938452600160a060020a0392909216602084015282820152519081900360600190f35b60408051938452602084019290925282820152519081900360600190f35b5050505b5050919050565b5050505b505092915050565b867f7065726d697373696f6e0000000000000000000000000000000000000000000014156109a1575050825493506109a59050565b15610aa557600189895060000160006101000a81548160ff021916908302179055508b89895060020160005081905550600e60005060008c815260200190815260200160002060005060008d8152602001908152602001600020600096509650888850600101600050546001018787506001016000828282505401925050819055508a7f2dfceefb6d217bc7a26eb48019d8a48251e18f4699c014fc195904c4a4e6d8778b8e604051808381526020018281526020019250505060405180910390a25b5050505b50505b50505050505050565b8015610ac85750600982015460ff166000145b15610aa557600160a060020a0333166000908152600360209081526040808320548f8452600d8352818420600e84528285208286529093529083208054919d50919b50919950975088965060ff1686148015610b4b5750600260005060008b815260200190815260200160002060005060020160005054898950600c0160005054115b15610aa557610aa58c8b8d8a8a50600101600050546001016000848152600d6020526040812081908690826117ef835b600060008210158015610b905750600b548211155b15610b99575060015b919050565b5050505b50505b50505050919050565b15610b9e5760008b8152600d60209081526040808320600381810154855260028452828520600854600160a060020a03168652908452828520548552600e8201845282852085805290935290832054909b50919950975088965086148015610d6757506002898950600b0160005054066001148015610c4157506002898950600b01600050540489895060070160005054115b80610c7e5750600854600160a060020a03166000908152600360209081526040808320548352600e8c018252808320600180855292529091205410155b80610c9d5750600a8901548754148015610c9d5750600a890154600014155b80610cba57506008546001880154600160a060020a039081169116145b80610cdb5750600a8901546003148015610cdb5750600489015460038a0154145b80610cfc5750600a890154600c148015610cfc5750600489015460038a0154145b80610d675750600b890154600290066000148015610d675750600b89015460078a01546002909104901180610d675750600b89015460078a01546002909104148015610d6757506004546000908152600e8a0160209081526040808320600180855292529091205410155b15610b9e57600199505050505050610ba5565b5050505b50505b505050565b8015610d995750600982015460ff166000145b15610d7a576000888152600d6020526040812097509550610db98861049e565b1515610dc9575050505050610d81565b600a87015460011415610dfe5760028701546004880154610dfe91600160a060020a03169060055481901015611684576116ae565b600a87015460021415610e285760028701546004880154610e2891600160a060020a031690610eb6565b600a87015460031415610ed1576004870154610ed19060008181526002602052604081206001810154829184918390600160a060020a0316811461167c575060018054600019018155018054600160a060020a0319169055505080805260036020527f3617319a054d772f909f7c479a2cebe5066e836a939412e32403c99029b92eff5550565b61039f8160005b6000808080600160a060020a0386168114156116115761167c565b600a87015460041415610f17576004870154610f179060008181526002602052604081206001810154839290600160a060020a0316811461039b57600483905550505050565b600a87015460051415610f76576002870154610f7690600160a060020a03166000811461039f576006805460009081526009602052604090208054600160a060020a031916831790558054600190810190915560078054909101905550565b600a87015460061415610faf57600487015460009081526009602052604090208054600160a060020a0319169055600780546000190190555b600a87015460071415610fe7576002870154610fe790600160a060020a0316610eaf8160088054600160a060020a0319168217905550565b600a8701546008141561104d5760408051600289015460018a01548a5460e060020a908190048102819004908102845260048401919091529251600160a060020a03919091169291602481810192600092909190829003018183876161da5a03f1505050505b600a870154600914156110b05760408051600289015460048a8101548b5460e060020a9081900481028190049081028552918401529251600160a060020a03919091169291602481810192600092909190829003018183876161da5a03f1505050505b600a8088015414156110c85730600160a060020a0316ff5b600a870154600b1415611135576002870154600160a060020a03166000908152600360205260409020546004880154611135919060008281526002602052604081206001810154829185918390600160a060020a03168114610aac57858255909384915050505050505050565b600a870154600c14156111dd57600287015460048801546111dd91600160a060020a031660008281526002602052604081206001810154829185918390600160a060020a03168114610aac5760018201549194508491600160a060020a03908116339091161480156111a75750858114155b15610aac57505050506001018054600160a060020a03191682179055600160a060020a0316600090815260036020526040902055565b600a870154600d141561121157600287015461121190600160a060020a0316600a8054600160a060020a0319168217905550565b600a870154600e141561128f5760408051600289015460048a8101547ffe0d94c10000000000000000000000000000000000000000000000000000000084529083018c90529251600160a060020a03919091169263fe0d94c19290916024828101926000929190829003018185886185025a03f11561000257505050505b600a870154600f14156113095760408051600289015460018a01547fe1fa8e8400000000000000000000000000000000000000000000000000000000835260048301529151600160a060020a03929092169163e1fa8e8491602481810192600092909190829003018183876161da5a03f115610002575050505b600a87015460101415611379576040805160028901547fe79a198f0000000000000000000000000000000000000000000000000000000082529151600160a060020a03929092169163e79a198f91600481810192600092909190829003018183876161da5a03f115610002575050505b610d7a88600160a060020a0333811660008181526003602090815260408083205483526002909152812060018101549093919291161415610d8157828152600d602052604081208390826119b483610b7b565b837f6461746100000000000000000000000000000000000000000000000000000000141561140057600182015492506109a5565b837f616464720000000000000000000000000000000000000000000000000000000014156109a5576002820154600160a060020a031692506109a5565b837f76616c7565000000000000000000000000000000000000000000000000000000141561147157600482015492506109a5565b837f6e756d566f74657273000000000000000000000000000000000000000000000014156114a557600582015492506109a5565b837f6e756d566f74657300000000000000000000000000000000000000000000000014156114d957600682015492506109a5565b837f6e756d466f720000000000000000000000000000000000000000000000000000141561150d57600782015492506109a5565b837f6e756d416761696e737400000000000000000000000000000000000000000000141561154157600882015492506109a5565b837f6b696e6400000000000000000000000000000000000000000000000000000000141561157557600a82015492506109a5565b837f6e756d4d656d626572730000000000000000000000000000000000000000000014156115a957600b82015492506109a5565b837f637265617465640000000000000000000000000000000000000000000000000014156115dd57600c82015492506109a5565b837f657870697279000000000000000000000000000000000000000000000000000014156109a557600d82015492506109a5565b50505050600160a060020a03821660008181526003602081815260408084208054855260028084528286208654875292862060018181018054600160a060020a0319168c17905542928201929092558881558654978752949093528590559381018355805481019055815b505050505050565b600580548290039055604051600160a060020a03831690600090839082818181858883f150505050505b5050565b5050600b80546000908152600d602081815260408084208d8155600181018d9055600a81018c9055600281018054600160a060020a0319168c179055600381018a90556004810189905542600c82015594850187905591840185905581518a815290810188905281517f229d22335ad9cb689a138432ed928fc299b1defde311e84cf8dcf6f9128a7d4d929181900390910190a1600a54600160a060020a0316811480159061176b5750600a5460a060020a900460ff16155b156117d957600a5460408051600b547ff1d5da6c00000000000000000000000000000000000000000000000000000000825260048201529051600160a060020a03929092169163f1d5da6c91602481810192600092909190829003018183876161da5a03f115610002575050505b600b805460010190555b50505050505050505050565b80156118025750600982015460ff166000145b15610aa9576000898152600d602090815260408083208b8452600e8101835281842060018552909252822054909650909450841415806118755750848450600e01600050600089815260200190815260200160002060005060006000815260200190815260200160002060005054600014155b806118845750600985015460ff165b156118915750505061167c565b6005850180546001019055600685018054870190556000888152600e8601602090815260408083208a845282529182902088905581518a815291518b927f70df472d8ab8488dc291e66aa1d664a32341a67a0c63ce5676157aab894e1ed392908290030190a2861561190c5760078501805487019055611917565b600885018054870190555b600a54600160a060020a031660001480159061193d5750600a5460a060020a900460ff16155b15610aa957600a54604080517f441a8b9d000000000000000000000000000000000000000000000000000000008152600481018c90529051600160a060020a03929092169163441a8b9d91602481810192600092909190829003018183876161da5a03f11561000257505050505050505050505050565b80156119c75750600982015460ff166000145b1561167c5761167c866000818152600d6020526040812081908390826119ec83610b7b565b80156119ff5750600982015460ff166000145b1561167c5760405186907f35ba8426ecea7dcc3faef9e50aa1e0ef92057b147afff0843d06d863e24c0fad90600090a26000868152600d6020526040812060098101805460ff19166001908117909155600c80549091019055600a54909650909450600160a060020a03168414801590611a835750600a5460a060020a900460ff16155b1561167c57600a54604080517f35ba8426000000000000000000000000000000000000000000000000000000008152600481018990529051600160a060020a0392909216916335ba842691602481810192600092909190829003018183876161da5a03f1156100025750505050505050505056',
    options = {
        transactionObject: {gas: 3000000},
               callObject: {}
    };

window.BoardRoom = BoardRoom = web3.eth.contractus(abi, code, options, methods);

var BoardroomMinimongoImport = function(methodName, filter, args, mongodb){
    var boardroomAddress = args[0],
        indexFrom = args[1],
        indexTo = indexFrom + 1,
        callObject = {},
        callback = function(e, r){};

    _.each(args, function(arg, argIndex){
        if(argIndex > 1 && _.isNumber(arg))
            indexTo = arg;

        if(_.isFunction(arg))
            callback = arg;

        if(_.isObject(arg) 
           && !_.isFunction(arg) 
           && !_.isNumber(arg))
            callObject = arg;
    });
    
    if(indexTo < 0)
        indexTo = 0;
    
    if(_.isUndefined(filter))
        filter = function(id, result){ return true; };
    
    var batch = web3.createBatch(),
        abi = BoardRoom.abi,
        boardroomInstance = BoardRoom.at(boardroomAddress);
    
    var addToBatch = function(batchInstance, id){
        batchInstance.add(boardroomInstance[methodName](id, function(err, result){ 
            if(err)
                return;

            result = web3.returnObject(methodName, result, abi);
            var idObject = {id: id, boardroom: boardroomAddress};
            
            if(!filter(id, result))
                return;
            
            if(mongodb.find(idObject).fetch().length) {
                mongodb.update(mongodb.findOne(idObject)._id, {$set: _.extend(idObject, result), $setOnInsert: _.extend(idObject, result)}, {upsert: true});
            } else {
                mongodb.upsert(idObject, {$set: _.extend(idObject, result)});
            }
        }));
    };
    
    try{
        // add fromIndex item
        addToBatch(batch, indexFrom);

        // add other items to fromTo index
        for(var id = indexFrom; id < indexTo; id++) {
            addToBatch(batch, id);
        }
        
        batch.execute();
    }catch(e){
        //console.log(e);
    }
};

BoardRoom.ProposalsMinimongo = function(mongodb){
    mongodb.import = function(){
        var args = Array.prototype.slice.call(arguments),
            filter = function(id, proposal){
            if(proposal.kind == 0)
                return false;
            
            return true;
        };
        
        BoardroomMinimongoImport('proposals', filter, 
                                 args, mongodb);
    };
};

BoardRoom.ChildrenMinimongo = function(mongodb){
    mongodb.import = function(){
        var args = Array.prototype.slice.call(arguments),
            filter = function(id, child){
                
            console.log(id, child);
                
            if(child.addr == web3.address(0))
                return false;
            
            return true;
        };
        BoardroomMinimongoImport('children', filter, 
                                 args, mongodb);
    };
};

BoardRoom.MembersMinimongo = function(mongodb){
    mongodb.import = function(){
        var args = Array.prototype.slice.call(arguments);
        var filter = function(id, member){
            if(member.addr == web3.address(0))
                return false;
            
            return true;
        };
        BoardroomMinimongoImport('members', filter, 
                                 args, mongodb);
    };
};

BoardRoom.DelegationsMinimongo = function(mongodb){
    mongodb.import = function(){
        var args = Array.prototype.slice.call(arguments);
        BoardroomMinimongoImport('delegations', args, function(id, child){return true;}, mongodb);
    };
};

BoardRoom.BoardsMinimongo = function(mongodb){
    mongodb.import = function(){
        var args = Array.prototype.slice.call(arguments),
            address = args[0],
            callObject = {},
            callback = function(err, result){};
        
        var boardroom = BoardRoom.at(address);
        boardroom.info(callObject, function(err, result){
            if(err)
                return;
            
            if(result.numMembers == 0)
                return;
            
            /*mongodb.upsert({address: result.address}, 
                           _.extend({address: result.address}, result));*/
            
            
            if(mongodb.find({address: result.address}).fetch().length) {
                mongodb.update(mongodb.findOne({address: result.address})._id, {$set: _.extend({address: result.address}, result)});
            } else {
                mongodb.upsert({address: result.address}, {$set: _.extend({address: result.address}, result)});
            }
                           
        });
    };
};

var LoadReadMe = function(repoURL){
    HTTP.get(Meteor.absoluteUrl(repoURL + "README.md"), 
             function(err, result){
    });
};