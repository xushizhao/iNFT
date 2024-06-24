import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";

import SettingSidebar from "../component/setting_sidebar";
import SettingBasic from "../component/setting_basic";
import SettingNetwork from "../component/setting_network";
import SettingAccount from "../component/setting_account";
import SettingStorage from "../component/setting_storage";
import Setting404 from "../component/setting_404";

function Setting(props) {
    const size = {
        sidebar: [2, 10],
    };

    const map={
        "basic":<SettingBasic />,
        "account":<SettingAccount />,
        "network":<SettingNetwork />,
        "storage":<SettingStorage />,
        "404":<Setting404 />
    }

    let [ active, setActive ]= useState("basic");
    let [ content, setContent] =useState("");

    const self = {
        fresh: () => {

        },
    }

    useEffect(() => {
        console.log(props.extend);
        if(props.extend && props.extend.mod){
            const mod=props.extend.mod;
            if(mod!==active){
                setActive(mod);
                if(map[mod]){
                    setContent(map[mod]);
                }else{
                    setContent(map["404"]);
                }
            }
        }else{
            setContent(map[active]);
        }

        

    }, [props.extend]);
    return (
        <Row className="pt-2">
            <Col md={size.sidebar[0]} lg={size.sidebar[0]} xl={size.sidebar[0]} xxl={size.sidebar[0]} >
                <SettingSidebar link={props.link} active={active}/>
            </Col>
            <Col md={size.sidebar[1]} lg={size.sidebar[1]} xl={size.sidebar[1]} xxl={size.sidebar[1]} >
                {content}
            </Col>
        </Row>
    )
}

export default Setting;