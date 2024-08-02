import INDEXED from "../lib/indexed";
import tools from "../lib/tools";

import Config from "./config";

const prefix={          //anchor name prefix
    submit:"bounty_",           
    payment:"pay_",
    apply:"apply_",
    distribe:"distribe_",
}

const process={
    bounty:{
        "REMOVED":      0,          //bounty is removed         
        "ON_CHAIN":     2,          //bounty details is written on chain
        "LOCAL_SAVED":  3,          //bounty is saved locally
        "REPORTED":     4,          //bounty reported to system
        "NORMAL":       1,          //{after approved} bounty details approved, accepted
        "PAY_SUBMITTED":5,          //bonus payment done, need to approve
        "PAYED":        6,          //{after approved} bonus is payed
        "ON_PROGRESS":  7,          //bounty is on progress
        "DONE":         8,          //bounty ended at the setting time
        "ALL_APPROVED": 9,          //bounty finished and all bonus done
    },
    apply:{
        "SUBMITTED":    2,        //bonus anchor submitted
        "FAILED":       4,        //invalid iNFT submission
        "APPROVED":     1,        //target iNFT approved
        "PAYED":        6,        //bonus payed after approved
    },
};

const funs = {
    checkDB:(table,ck)=>{
        const cfg = Config.get(["storage"]);
        INDEXED.checkDB(cfg.DBname, (db) => {
            const tbs = db.objectStoreNames;
            if (!funs.checkTable(table, tbs)) {
                const tb = tools.clone(cfg.tables[table]);
                tb.table=table;
                db.close();         //must close, or the DB is blocked
                INDEXED.initDB(cfg.DBname, [tb], db.version + 1).then((ndb) => {
                    return ck && ck(ndb);
                }).catch((error) => {
                    return ck && ck({ error: "failed to init indexDB" });
                });
            } else {
               return ck && ck(db);
            }
        });
    },
    checkTable: (from, list) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i] === from) return true;
        }
        return false;
    },
    randomPassword: (len) => {
        const n = !len ? 16 : len;
        return tools.char(n);
    },
}

const table="bounty";
const self = {
    insert:(row,ck)=>{
        funs.checkDB(table,(db)=>{
            INDEXED.insertRow(db, table, [row],ck);
        });
    },
    get:(name,ck)=>{
        funs.checkDB(table,(db)=>{
            INDEXED.searchRows(db,table,"name",name,ck);
        });
    },
    list: (ck,filter,page,step) => {
        funs.checkDB(table,(db)=>{
            INDEXED.pageRows(db,table,ck,{page:page,step:step})
        });
    },
    status:{
        toChain:(name,ck)=>{

        },
        toSystem:(name,ck)=>{

        },
        toProgress:(name,ck)=>{

        },
        toDone:(name,ck)=>{

        },
    },
    format:{
        status:()=>{

        },
        local:(alink,addr,more)=>{
            return {
                name: alink,
                title: more.title,
                desc: more.desc,
                publish:{
                  network:"anchor",
                  address:addr, 
                  block:0,              //anchor block
                  hash:"",              //setAnchor transaction hash
                },
                payer: {
                  address:"",
                  transaction:"",     //transation hash
                  receiver:"",
                },
                template:{
                  cid:more.template,
                  orgin:"web3.storage",
                },
                bonus: more.bonus,
                start: more.start,
                end: more.end,
                coin: more.coin,
                status: 1, 
                stamp:tools.stamp(),    
              }
        },
        name:(type)=>{
            if(!prefix[type]) return false;
            return `${prefix[type]}${tools.char(8).toLocaleLowerCase()}`;
        },
        raw:{
            submit:(addr,more)=>{
                return {
                    title: more.title,
                    desc: more.desc,
                    publisher: addr,
                    coin: more.coin,
                    template: {
                      cid: more.template,
                      orgin: "web3.storage",
                    },
                    contract:{      //contract to call for the bounty. if no, free to mint
                      network:"",
                      address:"",
                    },
                    period: {
                      start: more.start,
                      end: more.end,
                    },
                    bonus: more.bonus
                  }
            },
            payment:()=>{
                return {

                }
            },
            apply:()=>{
                return {
                    
                }
            },
            distribe:()=>{
                return {
                    
                }
            },
        },
        protocol:{
            submit:()=>{
                return { 
                    fmt: "json", 
                    type: "data",
                    tpl: "bounty",
                    app:"inft"
                };
            },
            payment:(bounty)=>{
                return { 
                    fmt: "json", 
                    type: "data",
                    app:"inft",
                    ref:bounty,
                };
            },
            apply:(bounty)=>{
                return { 
                    fmt: "json", 
                    type: "data",
                    app:"inft",
                    ref:bounty,
                };
            },
            distribe:(bounty)=>{
                return { 
                    fmt: "json", 
                    type: "data",
                    app:"inft",
                    ref:bounty,
                };
            },
        },
    },
}

export default self;