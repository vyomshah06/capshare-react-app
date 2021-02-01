import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import './index.css';
import App from './App';
import Home from './Home';
import PostCaptions from './PostCaptions';
import ViewCaptions from './ViewCaptions';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(  
  	<BrowserRouter basename={process.env.PUBLIC_URL}>  		
  		<Switch>
  			<Route exact path="/" component={App} />  			
  			<ProtectedRoute exact path="/home" component={Home} />
  			<ProtectedRoute exact path="/post/captions" component={PostCaptions} />
  			<ProtectedRoute exact path="/view/captions" component={ViewCaptions} />
			  <Route path="*" render={() => <h1>Page Not Found!</h1>} />
	   	</Switch>	   	
    </BrowserRouter>,  
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
