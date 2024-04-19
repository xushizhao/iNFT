const config={
    node:"wss://fraa-flashbox-2690-rpc.a.stagenet.tanssi.network",  //Tanssi appchain URI
    target:12000,           //How long to create a new block
}
const subs={};      //subscribe funs

let wsAPI = null;
let linking = false;
const self={
    init: (ck) => {
        const uri=config.node;
        if (linking) return setTimeout(() => {
            self.init(uri, ck);
        }, 500);

        if (wsAPI !== null) return ck && ck(wsAPI);

        linking = true;
        const { ApiPromise, WsProvider } = window.Polkadot;
        try {
            const provider = new WsProvider(uri);
            ApiPromise.create({ provider: provider }).then((api) => {
                console.log(`Linked to node.`);
                wsAPI = api;
                linking = false;
                return ck && ck(wsAPI);
            });
        } catch (error) {
            console.log(error);
            linking = false;
            return ck && ck(error);
        }
    },
    divide:()=>{
        return 1000000000000;
    },
    read:(block,ck)=>{
        
    },
    balance:(address,ck)=>{
        let unsub=null;
        wsAPI.query.system.account(address, (res) => {
			if(unsub!=null) unsub();
			const data=res.toJSON().data;
			return ck && ck(data);
		}).then((fun)=>{
			unsub=fun;
		});
    },
    subscribe:(key,fun)=>{
        self.init(()=>{
            wsAPI.rpc.chain.subscribeFinalizedHeads((lastHeader) => {
                const data=JSON.parse(JSON.stringify(lastHeader));
                const block=data.number-1;      //get the right block number
                const hash=data.parentHash;     //get the finalized hash
                for(let k in subs){
                    subs[k](block,hash);
                }
            });
            subs[key]=fun;
        });
    },
}

export default self;