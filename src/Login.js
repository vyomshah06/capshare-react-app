import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField, Typography, Link, Button} from '@material-ui/core'; 
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';

export default function Login (props) {	

	const history = useHistory();

	const [values, setValues] = useState({});
	const [loginidValid, setLoginidValid] = useState();
	const [passwordValid, setPasswordValid] = useState();
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');	

	const handleLoginid = ({target}) => {
		let {name, value} = target;
		// eslint-disable-next-line
		var emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
		let emailValid = emailRegex.test(value);
		var usernameRegex = new RegExp(/^(?!_)\w+(?<!_)$/);
		let usernameValid = usernameRegex.test(value);
		if(value.length > 0 && (emailValid || usernameValid)) {
			setLoginidValid(true);	
			setValues((prev) => ({
				...prev, 
				[name]: value
			}));		
		}
		else {
			setLoginidValid(false);			
		}		
	}

	const handlePassword = ({target}) => {
		let {name, value} = target;
		if(value.length >= 6 && value.length <= 16) {
			setPasswordValid(true);
			setValues((prev) => ({
				...prev, 
				[name]: value
			}));
		}
		else {
			setPasswordValid(false);
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault();		
		setLoading(true);
		let resok = false;
		setTimeout(function() {
			fetch('https://capshare.herokuapp.com/login', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			}).then((response) => {
				resok = response.ok;
				return response.json();
			  })
			  .then((data) => {
			  	setLoading(false);		  	
			  	if(resok) {		  				  		
			  		localStorage.setItem("user", JSON.stringify(data));		  		
			  		history.push('/home');
			  	}
			  	else {
			  		setErrorMsg(data.message);
			  	}
			  })
			  .catch((error) => {
			  	setLoading(false);	
			  	if(error.message.includes('fetch')) {
			  		setErrorMsg('Failed to connect to the server.');		  	
			  	}		  	
			  	else {
			  		setErrorMsg(error.message);
			  	}
			  });
		},1000);
	}

	return ( 
		<Grid container item>
			<Paper elevation={10} style={{padding: '20px', textAlign: 'center'}}>
				<Avatar style={{backgroundColor: '#282c34', margin: '0px auto'}}> <LockOutlinedIcon /> </Avatar>
				<h2>Sign In</h2>
				{
					props.getMsg && <Alert style={{backgroundColor: '#d3f5d3'}} 
					  severity="success">{props.getMsg}</Alert>
				}
				{
					errorMsg && <Alert style={{backgroundColor: '#f9c4cc'}}
					  severity="error" onClose={() => setErrorMsg('')}>{errorMsg}</Alert>
				}
				<form onSubmit={handleSubmit}>
					<TextField error={loginidValid === false && true} label="Username or Email"
					 name="login_id" fullWidth required onChange={handleLoginid}
					 helperText={loginidValid === false ? "Username or Email must include alphanumeric characters or valid email format." : ""} />					
					<TextField   label="Password" type="password" name="password" fullWidth required 
					 onChange={handlePassword} />
					<Button type="submit" variant="contained" fullWidth disabled={!loginidValid || !passwordValid || loading} 
					 style={loginidValid && passwordValid && !loading ? 
					 {margin: '20px 0px 20px 0px', backgroundColor: '#282c34', color: 'white'} : {margin: '20px 0px 20px 0px'}}>
						{loading ? <CircularProgress size="2rem" color="inherit" /> : 'SIGN IN'}
					</Button>
				</form>
				<Typography>
					Don't have an account? &nbsp;
					<Link href="#register" onClick={props.onClick}>
						Sign Up
					</Link>
				</Typography>
			</Paper>
		</Grid>
	);
}