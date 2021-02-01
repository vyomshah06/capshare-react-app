import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Header from './Header';
import Footer from './Footer';
import './index.css';

const authentication = {  

  getLoginStatus() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      let token = user.access_token;
      let tokenExpiration = jwtDecode(token).exp;
      let dateNow = new Date();

      if (tokenExpiration < dateNow.getTime()/1000) {            
        return false;
      }
      else { 
        return true;
      }
    }    
  }
}

const ProtectedRoute = ({ component: Component, ...rest }) => {    

  return (
    <Route {...rest} render={props =>
      authentication.getLoginStatus() ? (
        <div className="root"><Header />
          <div className="main">
            <Component {...props} />
          </div>
        <Footer />
        </div>        
      ) : (
        <Redirect to='/?redirect=1' />
      )
    }
    />
  );
};

export default ProtectedRoute;