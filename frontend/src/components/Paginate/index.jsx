import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./styles.scss";

const Paginate = (props) => {
  const { pages, page, utils } = props;
  const { cardId, year, month } = utils;

  const handlePageChange = (pageNumber) => {
    utils.setSearchParams({ pageNumber: pageNumber.toString() });
  };

  return (
    pages > 1 && (
      <Pagination className="justify-content-center">
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item
            key={x + 1}
            active={x + 1 === page}
            onClick={() => handlePageChange(x + 1)}
            activeLabel=""
            className={x + 1 === page ? "custom-active-item" : "custom-item"}
          >
            <Link to={`/cards/${cardId}/statements/${year}/${month}`}>
              {x + 1}
            </Link>
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
