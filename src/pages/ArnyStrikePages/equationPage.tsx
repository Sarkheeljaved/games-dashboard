import { useNavigate, useParams } from "react-router-dom";
import { groupPositions } from "../../components/ArmyStrikeComponents/GroupPosition";
import "../../styles/ArnyStrikePages/EquationPage.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import Card from "react-bootstrap/Card";

// Define prop types for the modal component
interface MydModalWithGridProps {
  show: boolean;
  onHide: () => void;
}

const bullets = [
  {
    bullets: 5,
  },
  {
    bullets: 10,
  },
  {
    bullets: 15,
  },
  {
    bullets: 25,
  },
  {
    bullets: 35,
  },
  {
    bullets: 45,
  },
];

function MydModalWithGrid({ show, onHide }: MydModalWithGridProps) {
  const { index } = useParams<{ index: string }>();
  const group = groupPositions[parseInt(index || "0")];
  const navigate = useNavigate();
  const handleGroupClick = (selectedBullets: number) => {
    navigate("/fight-page", {
      state: {
        bullets: selectedBullets,
        group, // your mujahid group details
      },
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      size="xl"
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="grid-example">
        <Container>
          <Row>
            {bullets.map((b, index) => (
              <Col
                key={index}
                xs={12}
                sm={12}
                md={6}
                lg={4}
                xl={4}
                xxl={4}
                className="my-5 position-relative d-flex justify-content-center align-items-start"
              >
                <Card
                  className="Bullet-Card"
                  onClick={() => handleGroupClick(b.bullets)}
                >
                  <Card.Body>
                    <img
                      src="/card-bullet.svg"
                      style={{
                        position: "absolute",
                        top: "0px",
                        marginTop: "-40px",
                        left: "calc(50% - 100px)",
                      }}
                      width="200px"
                      height="80px"
                      alt=""
                    />
                    <div className="fs-3 fw-bold text-center mt-4">
                      {b.bullets}
                    </div>
                    <div className="text-center fw-bold fs-4-5">BULLETS</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

const GroupDetailPage = () => {
  const [modalShow, setModalShow] = useState(true);

  return (
    <div className="cover">
      {modalShow && (
        <MydModalWithGrid show={modalShow} onHide={() => setModalShow(false)} />
      )}
    </div>
  );
};

export default GroupDetailPage;
