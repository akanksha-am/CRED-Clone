import { useState, useEffect } from "react";
import axios from "../axios";
import { LinkContainer } from "react-router-bootstrap";
import {
  Form,
  Button,
  Row,
  Col,
  Image,
  Table,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { resetCardDetails } from "../redux/cardSlice";
import { listCards } from "../redux/actions/cardActions";
import {
  getUserDetails,
  updateAuthCode,
  updateUserProfile,
} from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import avatar from "../assets/images/avatar7.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBellSlash,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [readOnly, setReadOnly] = useState(true);
  const [updateAlert, setUpdateAlert] = useState(false);
  const [cardAlert, setCardAlert] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [disableReminder, setDisableReminder] = useState(false);
  const [show, setShow] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    authCode: "",
  });

  const userState = useSelector((state) => state.user);
  const { userInfo, loading, error, profileInfo } = userState;

  const cardList = useSelector((state) => state.card);
  const { cards, error: errorCards, loading: loadingCards } = cardList;

  useEffect(() => {
    console.log("Inside useEffect");
    console.log(profileInfo?.profile?.authCode);

    if (userInfo === null) {
      navigate("/login");
      return;
    }

    dispatch(resetCardDetails());
    dispatch(listCards());

    if (profileInfo?.updateSuccess) {
      setUpdateAlert(true);
      setReadOnly(true);
      setShow(true);
      setCardAlert(true);
      setInitialValues((prevValues) => ({
        ...prevValues,
        authCode: profileInfo.profile.authCode,
      }));
    } else {
      setInitialValues({
        name: userInfo.user.name,
        authCode: "",
        email: userInfo.user.email,
      });
      setReminder(profileInfo?.profile.reminder);
    }
  }, [dispatch, userInfo, profileInfo, navigate]);

  useEffect(() => {
    if (userInfo === null) return;

    dispatch(getUserDetails());
  }, [userInfo, dispatch]);

  const submitForm = (values) => {
    const data = { name: values.name, authCode: values.authCode };
    dispatch(updateUserProfile(data));
  };

  const getAuthCode = () => {
    dispatch(updateAuthCode());
  };

  const updateCloseHandler = () => {
    setUpdateAlert(false);
  };

  const cardCloseHandler = () => {
    setCardAlert(false);
  };

  const handleAuthCodeVisibility = () => {
    setShowAuthCode(!showAuthCode);
  };

  const handleReminderClick = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    setDisableReminder(true);
    const { data } = await axios.patch(
      "/api/user/profile",
      { reminder: !reminder },
      config
    );
    setDisableReminder(false);
    setReminder(data.profile.reminder);
  };

  const handleCouponClick = () => {
    history.push("/rewards/coupons");
  };

  const onCloseHandler = () => {
    setShow(false);
  };

  return (
    <>
      {/* {show && error !== null && (
        <AlertMessage onCloseHandler={updateCloseHandler} variant="success">
          Profile updated.
        </AlertMessage>
      )} */}
      <Row>
        <Col md={5}>
          <div className="text-center">
            <h2>User Profile</h2>
            {updateAlert && (
              <AlertMessage
                onCloseHandler={updateCloseHandler}
                variant="success"
              >
                {profileInfo.message}
              </AlertMessage>
            )}
            {loading ? (
              <Loader color={"#333940"} />
            ) : (
              <>
                <Image
                  style={{
                    maxWidth: "30%",
                    height: "auto",
                    background: "#333940",
                    marginBottom: "15px",
                  }}
                  src={avatar}
                  roundedCircle
                />
                <br />

                <OverlayTrigger
                  placement="left"
                  overlay={
                    readOnly ? (
                      <Tooltip id={`tooltip-left`}>Get AuthCode</Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Button
                    id = "authButton"
                    className="btn-sm"
                    onClick={() => getAuthCode()}
                    disabled={!readOnly}
                    style={{ margin: "0.5rem 1rem" }}
                    variant="outline-primary"
                  >
                    <FontAwesomeIcon icon={faSquare} size="2xl" />
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-bottom`}>
                      {reminder ? "Turn off reminder." : "Turn on reminder."}
                    </Tooltip>
                  }
                >
                  <Button
                    className="btn-sm"
                    variant="outline-primary"
                    style={{ margin: "0.5rem 1rem" }}
                    onClick={handleReminderClick}
                    disabled={disableReminder}
                  >
                    <FontAwesomeIcon
                      icon={reminder ? faBellSlash : faBell}
                      size="2xl"
                    />
                  </Button>
                </OverlayTrigger>

                <Formik
                  enableReinitialize
                  onSubmit={submitForm}
                  initialValues={initialValues}
                >
                  {({
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                    isValid,
                    dirty,
                  }) => (
                    <Form onSubmit={handleSubmit} style={{ padding: "20px" }}>
                      <Form.Group as={Row} controlId="email" className="mt-3">
                        <Form.Label column sm="3" className="form-label">
                          Email
                        </Form.Label>
                        <Col sm="9">
                          <Form.Control
                            name="email"
                            type="email"
                            placeholder="Enter Email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.email}
                            // readOnly
                            disabled
                          />
                          {errors.email && touched.email && (
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="name" className="mt-3">
                        <Form.Label column sm="3" className="form-label">
                          Name
                        </Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter name"
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.name}
                            // readOnly={readOnly}
                            disabled={readOnly}
                          />
                          {errors.name && touched.name && (
                            <Form.Control.Feedback type="invalid">
                              {errors.name}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                      </Form.Group>
                      <Form.Group
                        as={Row}
                        controlId="authCode"
                        className="mt-3"
                      >
                        <Form.Label column sm="3" className="form-label">
                          Auth Code
                        </Form.Label>
                        <Col sm="9">
                          <InputGroup className="mb-3">
                            <Form.Control
                              // type={showAuthCode ? "text" : "password"}
                              type="text"
                              name="authCode"
                              placeholder="Generate authCode"
                              value={values.authCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={!!errors.authCode}
                              // readOnly={readOnly}
                              disabled={readOnly}
                            />
                            {/* <InputGroup.Append>
                              <InputGroup.Text>
                                <i
                                  onClick={handleAuthCodeVisibility}
                                  className={
                                    showAuthCode
                                      ? "fas fa-eye-slash authcode-hide"
                                      : "fas fa-eye authcode-show"
                                  }
                                ></i>
                              </InputGroup.Text>
                            </InputGroup.Append> */}
                            {errors.authCode && touched.authCode && (
                              <Form.Control.Feedback type="invalid">
                                {errors.authCode}
                              </Form.Control.Feedback>
                            )}
                          </InputGroup>
                        </Col>
                      </Form.Group>
                      {/* <Button
                        type="submit"
                        variant="primary"
                        disabled={readOnly || !(dirty && isValid)}
                        className={
                          readOnly || !(dirty && isValid) ? "disabled-btn" : ""
                        }
                      >
                        Update
                      </Button> */}
                    </Form>
                  )}
                </Formik>
              </>
            )}
          </div>
        </Col>
        <Col md={7}>
          <div className="text-center">
            <h2>My Cards</h2>
            <LinkContainer to="/cards/add/new" style={{ marginBottom: "15px" }}>
              <Button>
                <i className="fas fa-plus"></i> Add Card
              </Button>
            </LinkContainer>
            {loadingCards ? (
              <Loader color={"#333940"} />
            ) : errorCards && cardAlert ? (
              <AlertMessage variant="danger" onCloseHandler={cardCloseHandler}>
                {errorCards}
              </AlertMessage>
            ) : (
              <Table
                striped
                bordered
                hover
                responsive
                className="table-sm table-dark"
              >
                <thead>
                  <tr>
                    <th>S.NO.</th>
                    <th>CARD NO</th>
                    <th>HOLDER</th>
                    <th>OUTSTANDING AMOUNT</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cards.map((card, index) => {
                    return (
                      <tr key={card._id}>
                        <td>{index + 1}</td>
                        <td>{card.cardNumber}</td>
                        <td>{card.cardOwnerName}</td>
                        <td>{card.outstandingAmount}</td>
                        <td>
                          <LinkContainer to={`/cards/${card._id}`}>
                            <Button
                              id ='detail'
                              className="btn-sm btn btn-outline-info"
                              variant="light"
                            >
                              Details
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
