import { useEffect, useState } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { useSelector, useDispatch } from "react-redux";
import Loader from "react-spinners/PuffLoader";
import AlertMessage from "../components/AlertMessage";
import ModalForm from "../components/ModalForm";
import Dropdown from "../components/Dropdown";
import TransactionTable from "../components/TransactionTable";
import { useNavigate, useParams } from "react-router-dom";
import { getCardById } from "../redux/actions/cardActions";
import { getRecentStatements } from "../redux/actions/statementActions";
import CreditCard2 from "../components/CreditCard2";

const getMonthsArr = (year) => {
  let d = new Date();
  let monthsArr = [];
  if (year === d.getFullYear().toString()) {
    const l = d.getMonth() + 1;
    monthsArr = Array.from({ length: l }, (x, i) => {
      const month = i + 1;
      return month <= 9 ? "0" + month : month;
    });
  } else if (!year) {
    monthsArr = [];
  } else {
    monthsArr = Array.from({ length: 12 }, (x, i) => {
      const month = i + 1;
      return month <= 9 ? "0" + month : month;
    });
  }
  return monthsArr;
};

const getYearsArr = () => {
  const currentYear = new Date().getFullYear();
  const yearsArr = Array.from({ length: 20 }, (_x, i) => currentYear - i);
  return yearsArr;
};

const CardScreen = () => {
  const { id: cardId } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  const { recentStatements: statements, loading: loadingStatements } =
    useSelector((state) => state.statement);

  const { userInfo } = useSelector((state) => state.user);

  const { card, error, loading } = useSelector((state) => state.card);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (card == null) {
        dispatch(getCardById(cardId));
      } else {
        dispatch(getRecentStatements(card.cardNumber, 3));
      }
    }
  }, [userInfo, card, cardId, dispatch, navigate]);

  const parseAmount = (amount) => {
    if (amount || amount === 0) {
      let temp = amount.toString();
      if (temp.indexOf(".") === -1) {
        // no precision
        temp += ".00";
      }
      return temp;
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {loading ? (
        <Loader color={"#333940"} />
      ) : error ? (
        <AlertMessage variant="danger">{error}</AlertMessage>
      ) : (
        <Row>
          <Col >
            <h2 className="text-center" style={{ marginTop: "2rem" }}>
              Card Details
            </h2>
            {card != null && (
              <div className="checking" style={{ marginTop: "2rem" }}>
                <CreditCard2 card={card} />
              </div>
            )}
            <Card
              bg="dark"
              text="white"
              className="mx-auto text-center responsive-card"
              style={{ marginTop: "5rem" }}
            >
              <Card.Body>
                <Card.Title> Outstanding Amount </Card.Title>
                {card != null && (
                  <Card.Text className="responsive-text">
                    {`₹ ${parseAmount(card.outstandingAmount)}`}
                  </Card.Text>
                )}

                {card != null && (
                  <Button
                    className="btn btn-outline-success"
                    style={
                      card.outstandingAmount === 0
                        ? { cursor: "not-allowed" }
                        : {}
                    }
                    disabled={card.outstandingAmount === 0}
                    onClick={handleShowModal}
                  >
                    Pay Now
                  </Button>
                )}
                {card != null && (
                  <ModalForm
                    handleClose={handleCloseModal}
                    show={showModal}
                    card={card}
                    cardId={cardId}
                  ></ModalForm>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col className="responsive-col-2">
            <div
              style={{ marginLeft: "1rem", marginRight: "1rem" }}
              className="text-center"
            >
              <h2 style={{ marginTop: "2rem" }}>Recent Transactions</h2>
              {loadingStatements ? (
                <Loader color={"#333940"} />
              ) : (
                <>
                  <TransactionTable transactions={statements} />
                </>
              )}
              <h2 style={{ marginTop: "4rem" }}>Statement By Month</h2>
              <Row style={{ margin: "1rem auto" }}>
                <Col md={3}>
                  <Dropdown
                    value={year}
                    handleChange={(e) => setYear(e.target.value)}
                    label="Year"
                    data={getYearsArr()}
                  />
                </Col>
                <Col md={3}>
                  <Dropdown
                    value={month}
                    handleChange={(e) => setMonth(e.target.value)}
                    label="Month"
                    data={getMonthsArr(year)}
                  />
                </Col>

                <Col md={3}>
                  <LinkContainer
                    to={`/cards/${cardId}/statements/${parseInt(
                      year
                    )}/${parseInt(month)}`}
                  >
                    <Button
                      className="btn btn-outline-info"
                      disabled={!month || !year ? true : false}
                    >
                      Get
                    </Button>
                  </LinkContainer>
                </Col>
                <Col md={3}>
                  <LinkContainer
                    to={`/cards/${cardId}/smartstatements/${parseInt(
                      year
                    )}/${parseInt(month)}`}
                  >
                    <Button
                      className="btn btn-outline-info"
                      disabled={!month || !year ? true : false}
                    >
                      Smart
                    </Button>
                  </LinkContainer>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CardScreen;
