import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Formik } from "formik";

import { register } from "../redux/actions/userActions";
import AlertMessage from "../components/AlertMessage";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { registerFailure } from "../redux/userSlice";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const RegisterScreen = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { location, history } = props;

  const userState = useSelector((state) => state.user);

  const { loading, error, userInfo } = userState;

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, error]);

  const submitForm = (values) => {
    if (values.password !== values.confirmPassword) {
      dispatch(registerFailure("Password & Confirm Password should be equal"));
    } else {
      dispatch(register(values.name, values.email, values.password));
    }
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
            <h1>Register</h1>
            {show && error && (
              <AlertMessage variant="danger" onCloseHandler={onCloseHandler}>
                {error}
              </AlertMessage>
            )}
            {loading && <Loader color={"#333940"} />}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name">
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.name}
                  placeholder="Enter name"
                />
                {errors.name && touched.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
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
              <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.confirmPassword}
                ></Form.Control>
                {errors.confirmPassword && touched.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <br></br>

              <Button
                id = 'register'
                type="submit"
                disabled={!(dirty && isValid)}
                className={!(dirty && isValid) ? "disabled-btn" : ""}
              >
                Register
              </Button>
            </Form>
            <Row className="py-3">
              <Col>
                <div className="normal-text">
                  Already have an account? <Link to="/login">Sign In</Link>
                </div>
              </Col>
            </Row>
          </FormContainer>
        )}
      </Formik>
    </>
  );
};

export default RegisterScreen;
