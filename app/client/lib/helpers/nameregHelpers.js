window.NameReg = NameReg = {
    methods: {},
};

NameReg.at = function(address){
    var Contract = web3.eth.contract(NameReg.abi);
    var Instance = web3.buildInstance(Contract.at(address), NameReg.methods);
    Instance.Instance = Contract.at(address);
    
    return Instance;
};

NameReg.new = function(){
    var args = Array.prototype.slice.call(arguments);
    var Contract = web3.eth.contract(NameReg.abi);
    var options = web3.getMethodDetails(args);
    var transactionObject = {data: NameReg.code, gas: 500600};
    var callback = function(err, result){
        options.callback(err, NameReg.at(result.address));
    };
    var buildArgs = web3.buildMethodArray(args, transactionObject, callback);
    Contract.new.apply(Contract, buildArgs);
};

NameReg.methods.register = function(name, transactionObject, callback){
    if(_.isUndefined(transactionObject))
        transactionObject = {};
    
    if(_.isUndefined(callback))
        callback = function(err, result, mined){};
    
    var Instance = this.Instance;
    
    var watcher = Instance.AddressRegistered({account: transactionObject.from}, function(err, result){
            watcher.stopWatching();
            callback(err, result, true);
        });
    
    Instance.register(name, transactionObject, function(err, result){
        callback(err, result, false);
        
        if(err)
            return watcher.stopWatching();
    });
};

NameReg.methods.unregister = function(transactionObject, callback){
    if(_.isUndefined(transactionObject))
        transactionObject = {};
    
    if(_.isUndefined(callback))
        callback = function(err, result, mined){};
    
    var Instance = this.Instance,
        watcher = Instance.AddressDeregistered(function(err, result){
            watcher.stopWatching();
            callback(err, result, true);
        });
    
    Instance.unregister(transactionObject, function(err, result){
        callback(err, result, false);
        
        if(err)
            return watcher.stopWatching();
    });
};

NameReg.abi = [{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"getAddress","outputs":[{"name":"o_owner","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"configAddr","outputs":[{"name":"a","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"getName","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"name","type":"bytes32"}],"name":"addressOf","outputs":[{"name":"addr","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"name","type":"bytes32"}],"name":"register","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"unregister","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"nameOf","outputs":[{"name":"name","type":"bytes32"}],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"AddressRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"AddressDeregistered","type":"event"}];

NameReg.code = '6060604052600173c6d9d2cd449a754c494264e1809c50e34d64562b7fdbbdf083000000000000000000000000000000000000000000000000000000006060908152606483905230600160a060020a031660845263dbbdf0839060a49060009060448183876161da5a03f1156002575050505060008054600160a060020a0319163317905561025d806100936000396000f300606060405236156100615760e060020a600035046321f8a72181146100635780635c820c96146100725780635fd4b08a146100a5578063bb34534c146100b0578063e1fa8e84146100d3578063e79a198f146100fb578063f5c5738214610124575b005b6100886004355b60005b919050565b73c6d9d2cd449a754c494264e1809c50e34d64562b5b60408051600160a060020a03929092168252519081900360200190f35b61014860043561006a565b610088600435600081815260026020526040902054600160a060020a031661006d565b610061600435600081815260026020526040812054600160a060020a03161461015a576101fb565b61006133600160a060020a0316600090815260016020526040812054908114156101fe576101fb565b610148600435600160a060020a03811660009081526001602052604090205461006d565b60408051918252519081900360200190f35b33600160a060020a03166000908152600160205260408120541461019757604060008181205481526002602052208054600160a060020a03191690555b33600160a060020a038116600081815260016020908152604080832086905585835260029091528082208054600160a060020a031916909417909355915190917fb2899cb26a6f22b6b94e4cc8de24dc97bcf3cc73fc0dfaac71decef29fac7c5391a25b50565b33600160a060020a0316600081815260016020908152604080832083905584835260029091528082208054600160a060020a0319169055517fe4519776825d8a4617d2ccb206c8ff2de7c8451c6c7b02367b882de96fb0493c9190a25056';