import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Formik } from "formik";

import { getUserDetails, login } from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { logout } from "../redux/userSlice";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const LoginScreen = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userState = useSelector((state) => state.user);

  const { loading, error, userInfo } = userState;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, error]);

  const submitForm = (values) => {
    dispatch(login(values.email, values.password));
    setShow(true);
  };

  const onCloseHandler = () => {
    setShow(false);
  };

  return (
    <>
      <Formik onSubmit={submitForm} initialValues={initialValues}>
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
          <FormContainer>
            <h1>Login</h1>
            {show && error && (
              <AlertMessage variant="danger" onCloseHandler={onCloseHandler}>
                {error}
              </AlertMessage>
            )}
            {loading && <Loader color={"#333940"} />}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label className="form-label">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.email}
                  placeholder="Enter email"
                />
                {errors.email && touched.email && (
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.password}
                  placeholder="Enter password"
                />
                {errors.password && touched.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <br></br>
              <Button
                type="submit"
                id = 'login'
                disabled={!(dirty && isValid)}
                className={!(dirty && isValid) ? "disabled-btn" : ""}
              >
                Login
              </Button>
            </Form>
            <Row className="py-3">
              <Col>
                <div className="normal-text">
                  New Customer? <Link to="/register">Register</Link>
                </div>
              </Col>
            </Row>
          </FormContainer>
        )}
      </Formik>
    </>
  );
};

export default LoginScreen;
