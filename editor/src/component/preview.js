import { Row, Col } from "react-bootstrap";
import { useEffect, useState,useRef } from "react";

import  Data from "../lib/data";
import tools from "../lib/tools";

//let selected=0;

function Preview(props) {
    const size = {
        row: [12],
        grid: [6,6],
    };

    let [image,setImage]=useState("image/empty.png");
    let [grid, setGrid] =useState([]);
    let [active, setActive]=useState(null);

    //let [width,setWidth]=useState(400);
    //let [height,setHeight]=useState(400);
    let [cellX,setCellX]=useState(50);      //cell的X轴像素宽度
    let [cellY,setCellY]=useState(50);      //cell的Y轴像素宽度
    let [line,setLine]=useState(8);        //X轴，每行多少个
    let [row,setRow]=useState(10);          //Y轴，多少行

    const ref = useRef(null);

    const self={
        clickGrid:(index)=>{
            Data.set("grid",index);
            self.updateHash(index,()=>{
                props.fresh();
            });
        },
        updateHash:(order,ck)=>{
            const puzzle_index=Data.get("selected");
            const NFT=Data.get("NFT");
            const hash=Data.get("hash");
            const def=NFT.puzzle[puzzle_index];
            const [hash_start,hash_step,amount]=def.value;
            //console.log(self.getHash(hash,order,hash_start,hash_step,amount));
            Data.set("hash",self.getHash(hash,order,hash_start,hash_step,amount));
            return ck && ck();
        },
        getHelper:(amount,line,w,h,gX,gY,eX,eY)=>{       //gX没用到，默认从0开始
            const list=[];
            const max=line/(1+eX);
            for(let i=0;i<amount;i++){
                const br=Math.floor((gX+i)/max);
                list.push({
                    mX:w*(eX+1)*((gX+i)%max),    //margin的X值
                    mY:h*(gY+br*(1+eY)),        //margin的Y值
                    wX:w*(eX+1),                //block的width
                    wY:h*(eY+1),                //block的height
                });
            } 
            return list;
        },
        getBackground:(index)=>{
            const selected_grid=Data.get("grid");
            const ac="#4aab67";
            const sc="#f7cece";
            const bc="#99ce23";
            if(selected_grid===index){
                return sc;
            }else{
                return active===index?ac:bc
            }
        },
        getHash:(hash,order,start,step,max)=>{
            const top=Math.pow(16,step);         //总数据量
            const m=Math.floor(top/max)-1;
            const multi=tools.rand(0,m);
            const n=multi*max+order;

            const px=2;     //支付串"0x"前缀
            const prefix=hash.substring(0,start+px);
            const tailor=hash.substring(start+step+px,hash.length+px);
            return `${prefix}${n.toString(16)}${tailor}`;
        },
        autoFresh:()=>{
            const width=ref.current.offsetWidth;
            const w=tools.toF(width/line,3);
            const rate=w/cellX;
            const h=cellY*rate;
            const bs64=Data.get("template");
            if(bs64!==null){
                setImage(bs64);
                const puzzle_selected=Data.get("selected");
                const NFT=Data.get("NFT");
                if(puzzle_selected!==null){
                    const def=NFT.puzzle[puzzle_selected];
                    const hash=Data.get("hash");
                    
                    if(def.img){
                        const [hash_start,hash_step,amount]=def.value;
                        const str="0x"+hash.substring(hash_start+2,hash_start+2+hash_step);
                        const rand=parseInt(str);
    
                        const sel=rand%amount;
                        setActive(sel);
    
                        const [gX,gY,eX,eY]=def.img;
                        const gg=self.getHelper(amount,line,w,h,gX,gY,eX,eY);
                        setGrid(gg);
                    }
                }
            }
        },
    }

    useEffect(() =>{
        const ss=Data.get("size");
        setCellX(ss.cell[0]);      //cell的X轴像素宽度
        setCellY(ss.cell[1]);      //cell的Y轴像素宽度
        setLine(ss.grid[0]);        //X轴，每行多少个
        setRow(ss.grid[1]);          //Y轴，多少行
        self.autoFresh();
    }, [props.update,ref.current]);

    return (
        <Row>
            <Col className="pt-2" lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
                {grid.map((row, index) => (
                    <div className="cover" key={index} style={{
                            marginLeft:`${row.mX}px`,
                            marginTop:`${row.mY}px`,
                            width:`${row.wX}px`,
                            height:`${row.wY}px`,
                            lineHeight:`${row.wY}px`,
                            backgroundColor:self.getBackground(index),
                        }} 
                        onClick={(ev)=>{
                            self.clickGrid(index);
                        }}>{index}</div>
                ))}
                {<img id="preview" ref={ref} src={image} alt="Preview of full iNFT" />}
            </Col>
        </Row>
    )
}

export default Preview;