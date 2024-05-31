import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <div
      className="pb-0 mb-0 justify-content-center text-light"
      style={{ backgroundColor: "#333940" }}
    >
      <footer>
        <Container>
          <div className="row my-5 py-5">
            <div className="col-12">
              <div className="row ">
                <div className="col-xl-6 col-md-4 col-sm-4 col-12 my-auto mx-auto a">
                  <h3
                    className="text-muted mb-md-0 mb-5 bold-text"
                    style={{ fontSize: "2rem" }}
                  >
                    CRED
                  </h3>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                  <h6 className="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5">
                    <b>Menu</b>
                  </h6>
                </div>
                <div className="col-xl-3 col-md-4 col-sm-4 col-12">
                  <h6 className="mb-3 mb-lg-4 text-muted bold-text mt-sm-0 mt-5">
                    <b>Members</b>
                  </h6>
                  <ui className="list-unstyled">
                    <li>Abhinav</li>
                    <li>Akanksha</li>
                    <li>Karuna</li>
                    <li>Subham</li>
                    <li>Shivangi</li>
                  </ui>
                </div>
              </div>
              <div className="row ">
                <div className="col-xl-6 col-md-4 col-sm-4 col-auto my-md-0 mt-5 order-sm-1 order-3 align-self-end">
                  <p className="social text-muted mb-0 pb-0 bold-text">
                    {" "}
                    <span className="mx-2">
                      <i className="fab fa-facebook" aria-hidden="true"></i>
                    </span>{" "}
                    <span className="mx-2">
                      <i className="fab fa-linkedin" aria-hidden="true"></i>
                    </span>{" "}
                    <span className="mx-2">
                      <i className="fab fa-twitter" aria-hidden="true"></i>
                    </span>{" "}
                    <span className="mx-2">
                      <i className="fab fa-instagram" aria-hidden="true"></i>
                    </span>{" "}
                  </p>
                  <small className="rights">
                    <span>&#174;</span> CRED All Rights Reserved.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
