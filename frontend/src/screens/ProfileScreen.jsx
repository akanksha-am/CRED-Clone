import { useEffect } from "react";
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
import { updateUserProfile } from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";

const initialValues = {
  name: "",
  authCode: "",
  email: "",
  phoneNumber: "",
};

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

  const userState = useSelector((state) => state.user);
  const { user, loading, error } = userState;

  //   const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  //   const { success: updateSuccess } = userUpdateProfile;

  const cardList = useSelector((state) => state.card);
  const { cards, error: errorCards, loading: loadingCards } = cardList;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(resetCardDetails());
      dispatch(listCards());
      if (false) {
      } else {
        initialValues.name = user.name;
        initialValues.authCode = user.authCode ? user.authCode : "";
        initialValues.email = user.email;
        initialValues.phoneNumber = user.phoneNumber;
        setReminder(user.reminder);
      }
    }
  }, [dispatch, user]);

  const submitForm = (values) => {
    const data = { name: values.name };
    if (values.authCode) {
      data.authCode = values.authCode;
    }
    if (values.phoneNumber) {
      data.phoneNumber = values.phoneNumber;
    }
    dispatch(updateUserProfile(data));
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
        Authorization: `Bearer ${user.token}`,
      },
    };
    setDisableReminder(true);
    const { data } = await axios.patch(
      "/api/user/profile",
      { reminders: !reminder },
      config
    );
    setDisableReminder(false);
    setReminder(data.reminders);
  };

  const handleCouponClick = () => {
    history.push("/rewards/coupons");
  };

  const onCloseHandler = () => {
    setShow(false);
  };

  return (
    <>
      {show && error && (
        <AlertMessage onCloseHandler={updateCloseHandler} variant="success">
          Profile updated.
        </AlertMessage>
      )}
      <Row>
        <Col md={5}>
          <div className="text-center">
            <h2>User Profile</h2>
            {updateAlert && (
              <AlertMessage
                onCloseHandler={updateCloseHandler}
                variant="success"
              >
                Profile updated.
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
                  src="images/avatar7.png"
                  roundedCircle
                />
                <br />

                <OverlayTrigger
                  placement="left"
                  overlay={
                    readOnly ? (
                      <Tooltip id={`tooltip-left`}>Edit Profile</Tooltip>
                    ) : (
                      <></>
                    )
                  }
                >
                  <Button
                    className="btn-sm"
                    onClick={() => setReadOnly(false)}
                    disabled={!readOnly}
                    style={{ margin: "0.5rem 1rem" }}
                    variant="outline-primary"
                  >
                    <i className="far fa-edit"></i>
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
                    <i
                      className={
                        reminder
                          ? "far fa-bell-slash fa-lg"
                          : "far fa-bell fa-lg"
                      }
                    ></i>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id={`tooltip-right`}>View all coupons.</Tooltip>
                  }
                >
                  <Button
                    className="btn-sm"
                    variant="outline-primary"
                    style={{ margin: "0.5rem 1rem" }}
                    onClick={handleCouponClick}
                  >
                    <i className="fas fa-money-check-alt fa-lg"></i>
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
                      <Form.Group as={Row} controlId="name">
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
                      <Form.Group as={Row} controlId="authCode">
                        <Form.Label column sm="3" className="form-label">
                          Auth Code
                        </Form.Label>
                        <Col sm="9">
                          <InputGroup className="mb-3">
                            <Form.Control
                              type={showAuthCode ? "text" : "password"}
                              name="authCode"
                              placeholder="Enter authCode"
                              value={values.authCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={!!errors.authCode}
                              // readOnly={readOnly}
                              disabled={readOnly}
                            />
                            <InputGroup.Append>
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
                            </InputGroup.Append>
                            {errors.authCode && touched.authCode && (
                              <Form.Control.Feedback type="invalid">
                                {errors.authCode}
                              </Form.Control.Feedback>
                            )}
                          </InputGroup>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="phoneNumber">
                        <Form.Label column sm="3" className="form-label">
                          Phone
                        </Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="text"
                            name="phoneNumber"
                            placeholder="Enter phone no."
                            value={values.phoneNumber}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={!!errors.phoneNumber}
                            disabled={readOnly}
                          />
                          {errors.phoneNumber && touched.phoneNumber && (
                            <Form.Control.Feedback type="invalid">
                              {errors.phoneNumber}
                            </Form.Control.Feedback>
                          )}
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="email">
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
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={readOnly || !(dirty && isValid)}
                        className={
                          readOnly || !(dirty && isValid) ? "disabled-btn" : ""
                        }
                      >
                        Update
                      </Button>
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
                      <tr key={card.id}>
                        <td>{index + 1}</td>
                        <td>{card.cardNumber}</td>
                        <td>{card.cardOwnerName}</td>
                        <td>{card.outstandingAmount}</td>
                        <td>
                          <LinkContainer to={`/cards/${card.id}`}>
                            <Button
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
