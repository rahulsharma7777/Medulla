import React from "react";
import { Skeleton, Row, Col } from "antd";

const LeaveHistoryShimmer = () => {
  const rowCount = 6;

  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <Row key={rowIndex} gutter={[16, 16]}>
          <Col lg={6} className="leave-leftr">
            <div className="leave-left-rowr">
              <Skeleton avatar active paragraph={{ rows: 2 }} />
            </div>
          </Col>
          <Col lg={6} className="leave-leftr">
            <div className="leave-left-rowr">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          </Col>
          <Col lg={6} className="leave-leftr">
            <div className="leave-left-rowr">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          </Col>
          <Col lg={6} className="leave-leftr">
            <div className="leave-left-rowr">
              <Skeleton active paragraph={{ rows: 1 }} />
            </div>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default LeaveHistoryShimmer;
