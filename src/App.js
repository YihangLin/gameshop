// import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import Cart from './components/Cart';
import AuthContextProvider from './components/AuthContext';
import Footer from './components/footer';
import DetailPage from './components/DetailPage';
import { useEffect } from 'react';
import Wishlist from './components/Wishlist';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/NotFound';
import FormApp from './components/FormApp';
import AfterPayment from './components/AfterPayment';
import ViewOrders from './components/ViewOrders';

function App() {

  useEffect(() => {
    document.title = 'Games';
  });

  return (
    <BrowserRouter>
      <Container>
        <AuthContextProvider>
          <Navbar/>
          <Switch>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/signup' component={Signup}/>
            <Route path='/login' component={Login}/>
            <PrivateRoute path='/cart/:id' component={Cart}/>
            <Route path='/game/:id' component={DetailPage}/>
            <PrivateRoute path='/wishlist/:id' component={Wishlist}/>
            <PrivateRoute path='/checkout/:id/:sid' component={FormApp}/>
            <PrivateRoute path='/finish/:id/:sid' component={AfterPayment}/>
            <PrivateRoute path='/orders/:id' component={ViewOrders} />
            <Route path='*' component={NotFound} />
          </Switch>
          <Footer/>
        </AuthContextProvider>
      </Container>
   </BrowserRouter>
  );
}

export default App;
