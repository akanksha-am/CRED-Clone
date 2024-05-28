import { useState, useEffect, useRef } from "react";
import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";

import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import { useNavigate, useParams } from "react-router-dom";
import { getCardById } from "../redux/actions/cardActions";
import { getSmartStatementsByMonth } from "../redux/actions/statementActions";
import { getSmartStatementsByMonthReset } from "../redux/statementSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faChartPie } from "@fortawesome/free-solid-svg-icons";

const getRandomColor = (count) => {
  const transBackground = "0.2";
  const transBorder = "1";
  let colorArr = { background: [], border: [] };
  for (let i = 0; i < count; i++) {
    let color = "rgba(";
    for (let j = 0; j < 3; j++) {
      color += Math.floor(Math.random() * 255) + ",";
    }
    let color1 = color + transBackground + ")";
    let color2 = color + transBorder + ")";
    colorArr.background.push(color1);
    colorArr.border.push(color2);
  }
  return colorArr;
};

const SmartStatementScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const cardId = params.id;
  const year = params.year;
  const month = params.month;

  const [categoryPie, setCategoryPie] = useState(true);
  const [vendorPie, setVendorPie] = useState(true);

  const [show, setShow] = useState(false);

  const colorCategory = useRef();
  const colorVendor = useRef();

  const { userInfo } = useSelector((state) => state.user);

  const { card } = useSelector((state) => state.card);

  const statement = useSelector((state) => state.statement);

  const { smartStatementsByMonth: stat, error, loading } = statement;
  if (stat && !colorCategory.current) {
    colorCategory.current = getRandomColor(stat.categories.length);
    colorVendor.current = getRandomColor(stat.vendors.length);
  }

  console.log(stat);
  console.log(stat?.categories);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!card.cardNumber) {
        dispatch(getCardById(cardId));
      } else {
        dispatch(getSmartStatementsByMonth(card.cardNumber, year, month));
        setShow(true);
      }
    }
    return () => {
      dispatch(getSmartStatementsByMonthReset());
    };
  }, [userInfo, history, card, dispatch, year, month, cardId]);

  const onCloseHandler = () => {
    setShow(false);
  };

  return (
    <>
      <h2
        className="text-center"
        style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
      >
        Smart Statements
      </h2>
      {show && error && (
        <AlertMessage variant="danger" onCloseHandler={onCloseHandler}>
          {error}
        </AlertMessage>
      )}
      {loading || !stat ? (
        <Loader color={"#333940"} />
      ) : (
        <>
          <div>
            <Row>
              <Col md={6}>
                <div className="text-center">
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      marginTop: "1.5rem",
                    }}
                  >
                    Spending on basis of category.
                  </p>
                  {stat.categories && stat.categories.length > 0 && (
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id={`tooltip-left`}>
                          {categoryPie ? "Bar Chart" : "Pie Chart"}
                        </Tooltip>
                      }
                    >
                      <Button
                        style={{ marginBottom: "1rem" }}
                        onClick={() => setCategoryPie(!categoryPie)}
                        size="sm"
                        variant="outline-info"
                      >
                        <FontAwesomeIcon
                          icon={categoryPie ? faChartBar : faChartPie}
                          size="2xl"
                        />
                      </Button>
                    </OverlayTrigger>
                  )}

                  {categoryPie ? (
                    <PieChart
                      color={colorCategory.current}
                      labels={stat.categories.map((item) => item.label)}
                      label="Pie Chart"
                      value={stat.categories.map((item) => item.data)}
                    />
                  ) : (
                    <BarChart
                      color={colorCategory.current}
                      labels={stat.categories.map((item) => item.label)}
                      label="Bar Chart"
                      value={stat.categories.map((item) => item.data)}
                    />
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center">
                  <p
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "600",
                      marginTop: "1.5rem",
                    }}
                  >
                    Spending on basis of vendor.
                  </p>
                  {stat.vendors && stat.vendors.length > 0 && (
                    <OverlayTrigger
                      placement="left"
                      overlay={
                        <Tooltip id={`tooltip-left`}>
                          {vendorPie ? "Bar Chart" : "Pie Chart"}
                        </Tooltip>
                      }
                    >
                      <Button
                        style={{ marginBottom: "1rem" }}
                        onClick={() => setVendorPie(!vendorPie)}
                        size="sm"
                        variant="outline-info"
                      >
                        <FontAwesomeIcon
                          icon={vendorPie ? faChartBar : faChartPie}
                          size="2xl"
                        />
                      </Button>
                    </OverlayTrigger>
                  )}

                  {vendorPie ? (
                    <PieChart
                      color={colorVendor.current}
                      labels={stat.vendors.map((item) => item.label)}
                      label="Pie Chart"
                      value={stat.vendors.map((item) => item.data)}
                    />
                  ) : (
                    <BarChart
                      color={colorVendor.current}
                      labels={stat.vendors.map((item) => item.label)}
                      label="Bar Chart"
                      value={stat.vendors.map((item) => item.data)}
                    />
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default SmartStatementScreen;
