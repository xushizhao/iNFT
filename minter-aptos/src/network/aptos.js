import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";

let link = null;
const self = {
    init: (network, ck) => {
        if (link !== null) return ck && ck(link);
        switch (network) {
            case Network.DEVNET:
                const aptosConfig = new AptosConfig({ network: Network.DEVNET });
                link = new Aptos(aptosConfig);
                break;

            default:
                const acfg = new AptosConfig({ network: Network.DEVNET });
                link = new Aptos(acfg);
                break;
        }
        return ck && ck(link);
    },
    generate: (ck, cfg) => {
        return ck && ck(cfg === undefined ? Account.generate() : Account.generate(cfg));
    },
    recover: (u8arr, ck) => {
        const privateKey = new Ed25519PrivateKey(u8arr);
        const account = Account.fromPrivateKey({ privateKey });
        return ck && ck(account);
    },
    balance:(address,ck, network)=>{
        self.init(network, async (aptos) => {
            //console.log(aptos);
            aptos.getAccountCoinAmount({
                accountAddress: address,
            }).then((amount) => {
                return ck && ck(amount);
            }).catch((error) => {
                return ck && ck(error);
            });
        });
    },
    wallet: (ck) => {

    },
    storage: (data, ck, network) => {
        self.init(network, async (aptos) => {
            // build a transaction
            // const transaction = await aptos.transaction.build.simple({
            //     sender: alice.accountAddress,
            //     data: {
            //     function: "0x1::coin::transfer",
            //     typeArguments: ["0x1::aptos_coin::AptosCoin"],
            //     functionArguments: [bobAddress, 100],
            //     },
            // });

            // // using sign and submit separately
            // const senderAuthenticator = aptos.transaction.sign({
            //     signer: alice,
            //     transaction,
            // });
            // const committedTransaction = await aptos.transaction.submit.simple({
            //     transaction,
            //     senderAuthenticator,
            // });

            // // using signAndSubmit combined
            // const committedTransaction = await aptos.signAndSubmitTransaction({
            //     signer: alice,
            //     transaction,
            // });
        });
    },
    run: (program_id, param, ck, network) => {

    },
    divide:()=>{
        return 100000000;
    },
    //get airdrop when create a new account
    airdrop: (u8Address, amount, ck, network) => {
        self.init(network, (aptos) => {
            aptos.fundAccount({
                accountAddress: u8Address,
                amount: amount,
            }).then((transaction) => {
                console.log(transaction);
                return ck && ck(true);
            }).catch((error) => {
                return ck && ck(error);
            });
        });
    },
    view: (value, type, ck, network) => {
        self.init(network, (aptos) => {
            console.log(aptos);
            switch (type) {
                case 'resource':
                    const rcfg = { accountAddress: value[0], resourceType: value[1] };
                    //accountAddress: testAccount.accountAddress,
                    //resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
                    //path: `accounts/${account}/resource/${resourceType}`,
                    aptos.getAccountResource(rcfg).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                case 'account':
                    const param = { accountAddress: value };
                    aptos.getAccountInfo(param).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                case 'transaction_hash':
                    const hcfg = { "transactionHash": value }
                    aptos.getTransactionByHash(hcfg).then((obj) => {
                        return ck && ck(obj);
                    })
                    // .catch((error) => {
                    //     return ck && ck(error);
                    // });
                    break;
                case 'transaction_version':
                    const vcfg = { "ledgerVersion": value }
                    aptos.getTransactionByVersion(vcfg).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                case 'token':
                    //console.log(aptos);
                    const kcfg = {
                        accountAddress: value
                    }
                    aptos.getAccountOwnedTokens(kcfg).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });


                    break;
                case 'block':
                    aptos.getBlockByHeight({ blockHeight: value }).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                case 'height':
                    aptos.getName({ chain_name: network }).then((obj) => {
                        return ck && ck(obj);
                    }).catch((error) => {
                        return ck && ck(error);
                    });
                    break;
                default:

                    break;
            }
        });
    },
    subscribe: (ck, network) => {
        //getLedgerInfo
        self.init(network, (aptos) => {
            aptos.getLedgerInfo().then((obj) => {
                ck && ck(obj);
            }).catch((error) => {
                return ck && ck(error);
            });
        });
    }
};

export default self;