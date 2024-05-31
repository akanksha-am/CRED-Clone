import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import AlertMessage from "../components/AlertMessage";
import TransactionTable from "../components/TransactionTable";
import Paginate from "../components/Paginate";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { getCardById } from "../redux/actions/cardActions";
import { getStatementsByMonth } from "../redux/actions/statementActions";
import { getStatementsByDateReset } from "../redux/statementSlice";

const StatementScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const cardId = params.id;
  const year = params.year;
  const month = params.month;
  const pageNumber = parseInt(searchParams.get("pageNumber") || "1");

  const [show, setShow] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const { card } = useSelector((state) => state.card);

  const statementDetails = useSelector((state) => state.statement);
  const {
    statements,
    loading: loadingStatements,
    error: errorStatements,
    pages,
    page,
  } = statementDetails;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(getStatementsByDateReset());
      if (!card.cardNumber) {
        dispatch(getCardById(cardId));
      } else {
        dispatch(
          getStatementsByMonth(card.cardNumber, year, month, pageNumber)
        );
        setShow(true);
      }
    }
  }, [navigate, userInfo, card, cardId, dispatch, year, month, pageNumber]);

  const utils = {
    cardId,
    year,
    month,
    setSearchParams,
  };

  const onCloseHandler = () => {
    setShow(false);
  };

  return (
    <>
      <h2 style={{ marginTop: "1.5rem" }}>Statements</h2>
      {/* {show && errorStatements && (
        <AlertMessage variant="danger" onCloseHandler={onCloseHandler}>
          {errorStatements}
        </AlertMessage>
      )} */}
      {loadingStatements ? (
        <Loader color={"#333940"} />
      ) : (
        <>
          <TransactionTable transactions={statements} />
          <Paginate pages={pages} page={page} utils={utils} />
        </>
      )}
    </>
  );
};

export default StatementScreen;
