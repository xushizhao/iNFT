import { Row,Col,Card,Placeholder } from 'react-bootstrap';
import { useEffect,useState } from "react";

import TPL from "../lib/tpl";
import Render from '../lib/render';
import tools from '../lib/tools';

/* iNFT list component
*   @param  {array}     data            //iNFT[], list of iNFT to show
*   @param  {string}    network         //network
*/

/*  iNFT data sample
  {
    "name":"xxx_40",
    "raw":{
      "tpl":"bafkreigkauu4hjwhzi3q6ar5jqfgh55b3exfxpoymasl4gt7wsbsw3nr4y",
      "offset":[0,4,4,6],
      "from":"ipfs",
      "origin":"web3.storage"
    },
    "protocol":{
      "type":"data",
      "fmt":"json",
      "tpl":"inft"
    },
    "pre":0,
    "signer":"5HMy4ULuRS15DveBH1Nbe6F45jinXQyVup9kpj6jYXnte7KH",
    "block":"0xb3e086e7a6ab4288405eae40e5708ff2c9c95ff5f2125a9f3394aaf66a539c54",
    "valid":true,
    "network":"anchor",
    "blocknumber":13598
  }
*/

function ListNFTs(props) {
  const size = {
    row: [12],
    grid:[3],
  };

  let [list,setList]=useState([]);
  let [ready,setReady]=useState(false);
  let [info, setInfo]=useState("");

  const self={
    getHolder:(n)=>{
      const arr=[]
      for(let i=0;i<n;i++){
        arr.push({name:"#"+i});
      }
      return arr;
    },
    getTemplates:(list,ck)=>{
      //1.filter out all template cid
      const map={};
      for(let i=0;i<list.length;i++){
        const row=list[i];
        if(row && row.raw && row.raw.tpl) map[row.raw.tpl]=true;
      }

      //get cid array
      const tpls=[];
      for(var cid in map) tpls.push(cid);
      TPL.cache(tpls,ck);
    },
    getThumbs:(list,ck,imgs)=>{
      if(imgs===undefined){
        list=tools.copy(list);
        imgs={}
      }
      if(list.length===0) return ck && ck(imgs);
      const row=list.pop();
      //console.log(row);
      TPL.view(row.raw.tpl,(def)=>{
        const basic = {
            cell: def.cell,
            grid: def.grid,
            target: def.size
        }
        const offset=!row.raw.offset?[]:row.raw.offset;
        Render.thumb(row.block,def.image,def.parts,basic,offset,(img)=>{
          imgs[row.name]=img;
          return self.getThumbs(list,ck,imgs)
        });
      })
    },
    formatResult:(list,imgs)=>{
      const arr=[];
      for(let i=0;i<list.length;i++){
        const row=list[i];
        arr.push({
          name:row.name,
          signer:row.signer,
          network:row.network,
          bs64:imgs[row.name],
        });
      }
      return arr;
    },
    showThumb:(bs64)=>{
      if(!bs64) return `${window.location.origin}/imgs/logo.png`;
      return bs64;
    },
  }

  useEffect(() => {
    const iNFTs=props.data;
    //console.log(JSON.stringify(iNFTs[0]));
    if(iNFTs.length===0){
      setInfo("No iNFT result list.");
      setList([]);
    }else{
      setInfo("");
      const nlist=self.getHolder(iNFTs.length);
      setList(nlist);
  
      self.getTemplates(iNFTs,(res)=>{
        self.getThumbs(iNFTs,(imgs)=>{
          const narr=self.formatResult(iNFTs,imgs);
          setList(narr)
          setReady(true);
        });
      });
    }
  }, [props.data]);

  return (
    <Row>
      <Col className='pt-1' hidden={!info?true:false} md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h4>{info}</h4>
      </Col>
      {list.map((row, index) => (
        <Col className="justify-content-around pt-2" key={index}  lg={size.grid[0]} xxl={size.grid[0]} md={size.grid[0]}>
          
          <Card hidden={!ready} style={{ width: '100%' }}>
              <a href={`/detail/${row.name}@${row.network}`}>
                <Card.Img variant="top" src={self.showThumb(row.bs64)} />
              </a>
              <Card.Body>
                <Card.Title>{row.name}</Card.Title>
                <Card.Text>
                  {!row.owner?"":tools.shorten(row.owner)}
                </Card.Text>
              </Card.Body>
            
          </Card>

          <Card hidden={ready} style={{ width: '100%' }}>
            <Card.Img variant="top" src={`${window.location.origin}/imgs/logo.png`} />
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                <Placeholder xs={6} /> <Placeholder xs={8} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
export default ListNFTs;