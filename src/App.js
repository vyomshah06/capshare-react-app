import React, {useState, useEffect} from 'react';
import Bgimage from './images/bg_image4.jpg';
import {Grid, Typography, useMediaQuery} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ShareIcon from '@material-ui/icons/Share';
import Login from './Login';
import Register from './Register';
import {Redirect} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  main_bg: {   
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),  url(${Bgimage})`,
    backgroundRepeat: 'no-repeat',  
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    color: '#fff',               
  },  
  gridContainer: {
    minHeight: '100vh',
    width: '100%',
    margin: '0px',
  },
  gridItem: {
    textAlign: 'center',
    flexBasis: '30%',
  },
  mediaGridItem: {
    textAlign: 'center',
    flexBasis: '100%'
  },
  gridMediaBorder: {
	borderRight: '0px',
  },
  gridBorder: {
	borderRight: '3px solid white',
  },
  title: {	
    fontFamily: 'cursive',
    paddingBottom: 'inherit',
  },
  mediaTitle: {
    fontFamily: 'cursive',
    paddingBottom: 'inherit',
    fontSize: '4rem'
  },
  subtitle: {
    fontStyle: 'italic',
    fontSize: 'x-large',
    marginBottom: '0.5em',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',    
  },
}))

function App (props) {
  const classes = useStyles();
  const isMedia = useMediaQuery("(max-width: 768px)"); 

  useEffect(() => {
  	let user = localStorage.getItem('user');
  	if(user) {
  		<Redirect to='/home' />
  	}
  }, []);

  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');  

  const handleClick = (event) => {
  	event.preventDefault();
  	setIsLogin(!isLogin);
  	setMessage('');
  }

  const setMsg = (message) => {  	  	  	
  	setIsLogin(true);
  	setMessage(message);
  }

  return (    
    <div className={classes.main_bg}>      
      <Grid container spacing={2} justify="center" alignItems="center" className={classes.gridContainer}>	  
		<Grid item xs={12} sm={12} md={6} className={`${classes.gridItem} ${isMedia ? classes.gridMediaBorder : classes.gridBorder}`} >
          <Typography variant="h1" className={`${isMedia ? classes.mediaTitle : classes.title}`}>				
            CapShare
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>				
            For Users By Users
          </Typography>
          <Typography variant="body1" gutterBottom>				
            CapShare allows users to view the captions posted by other users and share them on social media platforms. 
			We provide extensive search results on filtering various categories of the captions.
          </Typography>				          
		  <Grid container direction="row" justify="space-around" alignItems="center" style={{marginTop: "0.5rem", marginBottom: "0.5rem"}}>
			<Grid item>
			  <SearchIcon style={{fontSize: "2.5rem"}}/> <br />
				Search
			</Grid>
			<Grid item>
			  <PostAddIcon style={{fontSize: "2.5rem"}} /> <br />
				Post
			</Grid>
			<Grid item>
		  	  <ShareIcon style={{fontSize: "2.5rem"}} /> <br />
				Share
			</Grid>						
		  </Grid>		  
		  <Typography variant="body1" gutterBottom>  				
            Please login to view, post and share captions on CapShare.
          </Typography>		  
        </Grid>        
        <Grid item xs={12} sm={12} md={6} 
          className={`${isMedia ? classes.mediaGridItem : classes.gridItem}`}>
            {
              isLogin ? <Login onClick={handleClick} getMsg={message} />
               : <Register onClick={handleClick} setmsg={setMsg}/>
            }
        </Grid>
      </Grid>    
	</div>       
  );
}

export default App;
