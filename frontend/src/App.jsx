import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Header from "./components/Header";
import HomeScreen from "./screens/HomeScreen";
import { Container } from "react-bootstrap";
import Footer from "./components/Footer";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AddCardScreen from "./screens/AddCardScreen";
import CardScreen from "./screens/CardScreen";
import StatementScreen from "./screens/StatementScreen";
import SmartStatementScreen from "./screens/SmartStatementScreen";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/login" Component={LoginScreen} />
            <Route path="/register" Component={RegisterScreen} />
            <Route path="/profile" Component={ProfileScreen} />
            <Route path="/cards/add/new" Component={AddCardScreen} />
            <Route path="/cards/:id" Component={CardScreen} exact />
            <Route
              path="/cards/:id/statements/:year/:month"
              Component={StatementScreen}
              exact
            />
            <Route
              path="/cards/:id/smartstatements/:year/:month"
              Component={SmartStatementScreen}
              exact
            />
            <Route
              path="/cards/:id/statements/:year/:month/:pageNumber"
              Component={StatementScreen}
              exact
            />
            <Route path="/" Component={HomeScreen} exact />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export default App;
