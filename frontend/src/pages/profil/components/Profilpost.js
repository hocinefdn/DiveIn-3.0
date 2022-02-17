import { Col, Divider, Row } from 'antd'
import React, { useState, useEffect } from 'react'
import '../css/profil.css'

function Profilpost() {
    return (
        <div className="w-5/6 border-b-2 border-t-0 mt-8 ml-auto mr-auto border-gray-300 hyy">
            {/* <Divider orientation="left"></Divider> */}
            <Row>
                <Col
                    span={6}
                    xs={{ order: 1 }}
                    sm={{ order: 2 }}
                    md={{ order: 3 }}
                    lg={{ order: 4 }}
                >
                    <div className="design">Likes</div>
                </Col>
                <Col
                    span={6}
                    xs={{ order: 2 }}
                    sm={{ order: 1 }}
                    md={{ order: 4 }}
                    lg={{ order: 3 }}
                >
                    <div className="design">Media</div>
                </Col>
                <Col
                    span={6}
                    xs={{ order: 3 }}
                    sm={{ order: 4 }}
                    md={{ order: 2 }}
                    lg={{ order: 1 }}
                >
                    <div className="design">
                        <button>DiveIn</button>{' '}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default Profilpost
