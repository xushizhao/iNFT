import { Row, Col, Table } from 'react-bootstrap';
import { useEffect, useState } from "react";

import Bounty from "../system/bounty";

import { FaSkullCrossbones, FaSync,FaFileDownload } from "react-icons/fa";

function UserBounty(props) {
  const size = {
    row: [12],
  };
  
  let [list, setList]=useState([]);

  const self = {
    fresh:()=>{
      Bounty.list((arr)=>{
        console.log(arr);
        setList(arr);
      });
    }
  }

  useEffect(() => {
    self.fresh();
  }, []);

  return (
    <Row>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
        <h5>Bounty List</h5>
      </Col>
      <Col md={size.row[0]} lg={size.row[0]} xl={size.row[0]} xxl={size.row[0]}>
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Start</th>
          <th>End</th>
          <th>Template</th>
        </tr>
      </thead>
      <tbody>
        {list.map((row, index) => (
          <tr key={index}>
            <td>
              {row.name}
            </td>
            <td>
              {row.status}
            </td>
            <td>
              {row.start.toLocaleString()}
            </td>
            <td>
              {row.end.toLocaleString()}
            </td>
            <td>
              {row.template.cid}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
      </Col>
    </Row>
  );
}
export default UserBounty;