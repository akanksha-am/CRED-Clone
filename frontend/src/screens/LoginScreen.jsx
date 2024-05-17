import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Formik } from "formik";

import { login } from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const LoginScreen = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();

  // const { location, history } = props;

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userState = useSelector((state) => state.user);

  const { loading, error, userInfo } = userState;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

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
            <h1>Sign Up</h1>
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
              <Button
                type="submit"
                disabled={!(dirty && isValid)}
                className={!(dirty && isValid) ? "disabled-btn" : ""}
              >
                Login
              </Button>
            </Form>
            <Row className="py-3">
              <Col>
                <div className="normal-text">
                  Already have an account? <Link to="/register">Sign In</Link>
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
