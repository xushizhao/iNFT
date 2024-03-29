import { Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

// import Preview from "./component/render";
// import Action from "./component/action";
import Header from "./component/header";

import Data from "./lib/data";
import Local from "./lib/local";
import Chain from "./lib/chain";
import config from "./default";

// iNFT definition
// anchor://aabb/217148
let subs = {};            //加载订阅的方法

function App() {

  const size = {
    row: [12],
    side: [6, 3, 3],
  };

  let [update, setUpdate] = useState(0);
  let [show, setShow] = useState(false);
  let [title, setTitle] = useState("");
  let [content, setContent] = useState("");

  const self = {
    dialog: (ctx, title) => {
      setTitle(title);
      setContent(ctx);
      setShow(true);
    },
    fresh: (force) => {
      update++;
      setUpdate(update);
      if(force) self.start();
    },
    subscribe: (key, fun) => {
      subs[key] = fun;
    },
    getTemplate: () => {
      const ts = Local.get("template");
      if (!ts){
        const data = []
        data.push({
          alink: config.default[0],
          name: "",
          tags: []
        })
        Local.set("template", JSON.stringify(data));
        return config.default[0];
      } 
      try {
        const tpls = JSON.parse(ts);
        if (tpls[0] && tpls[0].alink) return tpls[0].alink
        return config.default[0];
      } catch (error) {
        return config.default[0];
      }
    },
    countdown:()=>{
      let n=9;
      const tt=setInterval(()=>{
        if(n <= 0) return clearInterval(tt);
        n--;
      },1000);
    },
    start:()=>{
      const tpl = self.getTemplate();
      Chain.read(tpl, (res) => {
        const key = `${res.location[0]}_${res.location[1]}`;
        if (res.data && res.data[key] !== undefined) {
          const dt = res.data[key];
          try {
            const raw = JSON.parse(dt.raw);
            Data.set("template", raw);

            console.log(raw);

            dt.raw = JSON.parse(dt.raw);
            Data.setHash("cache", config.default, dt);

            self.fresh();
          } catch (error) {
            console.log(error);
          }
        }
      });
    },
  }

  useEffect(() => {
    //1.连接服务器
    // Chain.link(config.node[0], (API) => {
    //   self.start();
    // });
  }, []);

  return (
    <div>
      <Container>
        <Header fresh={self.fresh} dialog={self.dialog} update={update} />
        {/* <Preview fresh={self.fresh} update={update} node={config.node[0]} />
        <Action fresh={self.fresh} dialog={self.dialog} update={update} countdown={self.countdown}/> */}
      </Container>
      <Modal show={show} size="lg" onHide={
          (ev) => {
            setShow(false);
          }
        }
        centered={false}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {content}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;