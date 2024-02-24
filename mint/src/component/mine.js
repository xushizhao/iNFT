import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import Local from "../lib/local";
import Render from "../lib/render";
import  Chain from "../lib/chain";
import  Data from "../lib/data";


function Mine(props) {
    const size = {
        row: [12],
        list:[6],
    };

    let [list,setList] = useState([]);
    let [image,setImage]=useState("image/empty.png");

    const self = {
        page:(arr,page,step)=>{
            //console.log(arr);
            const nlist=[];
            const max=arr.length;
            if((page-1)*step>max) return nlist;
            for(let i=0;i<step;i++){
                const key=(page-1)*step+i;
                if(arr[key]!==undefined)nlist.push(arr[key]);
            }
            return nlist;
        },
        cacheTemplate:(alinks,ck)=>{
            if(alinks.length===0) return ck && ck();
            const single=alinks.pop();
            if(!Data.exsistHash("cache",single)){
                return Chain.read(single,(res)=>{
                    const key=`${res.location[0]}_${res.location[1]}`;
                    res.data[key].raw=JSON.parse(res.data[key].raw);
                    Data.setHash("cache",single,res.data[key]);
                    return self.cacheData(alinks,ck);
                });
            }else{
                return self.cacheData(alinks,ck);
            }
        },
        cacheData:(alinks,ck,tpls)=>{
            if(tpls===undefined) tpls={};
            if(alinks.length===0){
                const last=[];
                for(var k in tpls) last.push(k);
                return ck && ck(last);
            } 
            const single=alinks.pop();
            if(!Data.exsistHash("cache",single)){
                return Chain.read(single,(res)=>{
                    const key=`${res.location[0]}_${res.location[1]}`;
                    const raw=JSON.parse(res.data[key].raw);
                    res.data[key].raw=raw;
                    if(raw.tpl) tpls[raw.tpl]=true;

                    Data.setHash("cache",single,res.data[key]);
                    return self.cacheData(alinks,ck,tpls);
                });
            }else{
                return self.cacheData(alinks,ck,tpls);
            }
        },
        getAlinks:(arr)=>{
            const alist=[];
            for(let i=0;i<arr.length;i++){
                alist.push(arr[i].link.toLocaleLowerCase());
            }
            return alist;
        },
        getThumbs:(arr,dom_id,ck,todo)=>{
            if(todo===undefined) todo=[];
            if(arr.length===0) return ck && ck(todo);

            //1.获取数据内容
            const me=arr.shift();
            const me_anchor=Data.getHash("cache",me.link.toLocaleLowerCase());
            const row=Data.getHash("cache",me_anchor.raw.tpl);
            const dt=row.raw;
            const basic = {
                cell: dt.cell,
                grid: dt.grid,
                target: dt.size
            }

            //2.准备绘图用的canvas
            const con = document.getElementById("handle");
            const cvs = document.createElement('canvas');
            cvs.id = dom_id;
            cvs.width=400;
            cvs.height=400;
            con.appendChild(cvs);

            const pen = Render.create(dom_id,true);
            Render.reset(pen);
            Render.preview(pen,dt.image,me.hash,dt.parts,basic);

            //3.获取生成的图像
            return setTimeout(()=>{
                me.bs64=pen.canvas.toDataURL("image/jpeg");
                me.block=row.block;
                todo.push(me);
                con.innerHTML="";

                return self.getThumbs(arr,dom_id,ck,todo);
            },0);
        },
    }

    const dom_id="pre_mine";
    useEffect(() => {
        const ls=Local.get("list");
        if(ls!==undefined){
            try {
                const nlist=JSON.parse(ls);
                const plist=self.page(nlist,1,10);
                self.cacheData(self.getAlinks(plist),(tpls)=>{
                    self.cacheTemplate(tpls,()=>{
                        self.getThumbs(plist,dom_id,(glist)=>{
                            //console.log(glist);
                            setList(glist);
                        });
                    });
                })
                
            } catch (error) {
                console.log(error);
            }
        }
    }, [props.update]);

    return (
        <Row>
            <Col hidden={true} id="handle" sm={size.row[0]} xs={size.row[0]}>
                {/* <canvas hidden={true} width={400} height={400} id={dom_id}></canvas> */}
            </Col>
            {list.map((row, index) => (
                <Col className="pt-2" key={index} sm={size.list[0]} xs={size.list[0]}>
                    <Row>
                        <Col className="" sm={size.row[0]} xs={size.row[0]}>
                            <img className="mine" src={row.bs64} alt="" />
                        </Col>
                        <Col className="" sm={size.row[0]} xs={size.row[0]}>
                            {row.block.toLocaleString()}
                        </Col>
                    </Row>
                </Col>
            ))}
        </Row>
    )
}

export default Mine;