import { Row, Col } from 'react-bootstrap';
import { useEffect, useState } from "react";

import tools from "../lib/tools";
import Network from '../network/router';
import Config from '../system/config';

function BountyDetail(props) {
  const size = {
    row: [12],
    grid: [6],
    thumb: [4, 8],
  };

  let [list, setList] = useState([]);
  let [total,setTotal] =useState("");
  let [coin, setCoin]=useState("");
  let [target, setTarget]=useState("");

  const self = {
    getParts: () => {
      if (!props.data || !props.data.parts) return 0;
      return props.data.parts.length;
    },

    selected: (bonus,coin) => {
      if (!props.data || !props.data.series) return false;
      const nlist = [];
      let sum=0;
      for (let i = 0; i < bonus.length; i++) {
        const row = tools.clone(bonus[i]);
        const se = props.data.series[row.series];
        row.thumb = se.thumb[0];
        row.name = se.name;
        row.coin=coin;
        nlist.push(row);

        sum+=row.bonus*row.amount;
      }
      setList(nlist);
      setTotal(sum);
    },
    fresh: (name) => {
      console.log(name);
      if (name) Network("anchor").view({ name: name.toLowerCase() }, "anchor", (res) => {
        //1.list bonus and calc total
        self.selected(res.raw.bonus,res.raw.coin);

        //2. set coin
        setCoin(res.raw.coin);

        //3. set receiver
        const addr=Config.get(["bounty","receiver","anchor"]);
        setTarget(addr);
      });
    },
  }

  useEffect(() => {
    self.fresh(props.link);

  }, [props.data]);

  return (
    <Row className='pt-2'>
      {list.map((row, index) => (
        <Col key={index} md={size.grid[0]} lg={size.grid[0]} xl={size.grid[0]} xxl={size.grid[0]}>
          <Row>
            <Col md={size.thumb[0]} lg={size.thumb[0]} xl={size.thumb[0]} xxl={size.thumb[0]}>
              <img className='series_thumb' src={row.thumb} alt={row.name} />
            </Col>
            <Col md={size.thumb[1]} lg={size.thumb[1]} xl={size.thumb[1]} xxl={size.thumb[1]}>
              <h5>#{row.series} {row.name}</h5>
              <p>Bonus <strong>{row.bonus}</strong> ${row.coin} <br/>Wanted <strong>{row.amount}</strong></p>
            </Col>
          </Row>

        </Col>
      ))}
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}><hr /></Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        Total: {total.toLocaleString()} ${coin}. Target account: <strong>{target}</strong>
      </Col>
    </Row>
  );
}
export default BountyDetail;