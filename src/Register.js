import React, {useState} from 'react';
import {Grid, Paper, Avatar, TextField, Typography, Link, Button} from '@material-ui/core'; 
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';

export default function Register (props) {	

	const [values, setValues] = useState({'fname': '', 'lname': ''});
	const [usernameValid, setUsernameValid] = useState();
	const [emailValid, setEmailValid] = useState();
	const [pwdValid, setPwdValid] = useState();
	const [confirmpwdValid, setConfirmpwdValid] = useState();
	const [formValid, setFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');	

	const handleChange = ({target}) => {
		let {name, value} = target;
		setValues((prev) => ({
				...prev,
				[name]: value
			}));
	}

	const handleUsername = ({target}) => {
		let {name, value} = target;
		var usernameRegex = new RegExp(/^(?!_)\w+(?<!_)$/);
		let userValid = usernameRegex.test(value);		
		if(value.length > 0 && userValid) {
			setUsernameValid(true);		
			setValues((prev) => ({
				...prev,
				[name]: value
			}));			
		}
		else {
			setUsernameValid(false);
			setFormValid(false);					
		}
	}

	const handleEmail = ({target}) => {
		let {name, value} = target;
		// eslint-disable-next-line
		var emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
		let emailidValid = emailRegex.test(value);
		if(value.length > 0 && emailidValid) {
			setEmailValid(true);
			setValues((prev) => ({
				...prev,
				[name]: value
			}));					
		}
		else {
			setEmailValid(false);
			setFormValid(false);				
		}
	}

	const handlePassword = ({target}) => {
		let {name, value} = target;
		if(value.length >= 6 && value.length <= 16) {
			setPwdValid(true);		
			setValues((prev) => ({
				...prev,
				[name]: value
			}));	
		}
		else {
			setPwdValid(false);
			setFormValid(false);			
		}
	}

	const handleConfirmpwd = ({target}) => {
		let {name, value} = target;
		if(value === values['password']) {
			setConfirmpwdValid(true);	
			setValues((prev) => ({
				...prev,
				[name]: value
			}));		
		}
		else {
			setConfirmpwdValid(false);
			setFormValid(false);			
		}
	}

	const handleSubmit = (event) => {
		event.preventDefault();		
		setLoading(true);
		let resok = false;
		setTimeout(function() {
			fetch('https://capshare.herokuapp.com/register', {
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
			  		props.setmsg(data.message);	
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
		}, 1000);		
	}	

	return ( 
		<Grid container item>
			<Paper elevation={10} style={{padding: '20px', textAlign: 'center'}}>
				<Avatar style={{backgroundColor: '#282c34', margin: '0px auto'}}> 
					<LockOutlinedIcon /> 
				</Avatar>
				<h2>Sign Up</h2>
				{
					errorMsg && <Alert style={{backgroundColor: '#f9c4cc'}} 
						severity="error" onClose={() => setErrorMsg('')}>
							{errorMsg}
						</Alert>
				}
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField label="First Name" name="fname" fullWidth 
								onChange={handleChange} />
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField label="Last Name" name="lname" fullWidth 
								onChange={handleChange} />				
						</Grid>
					</Grid>
					<TextField error={usernameValid === false && true} label="Username" name="username" fullWidth required
					 onChange={handleUsername} helperText={usernameValid === false ? "Username must include only alphanumeric characters." : ""} />
					<TextField error={emailValid === false && true} label="Email" type="email" name="email" fullWidth required
					 onChange={handleEmail} helperText={emailValid === false ? "Please enter valid email format." : ""} />
					<TextField error={pwdValid === false && true} label="Password" type="password" name="password" fullWidth required
					 onChange={handlePassword} helperText={pwdValid === false ? "Password must be between 6 to 16 characters." : ""} />
					<TextField error={confirmpwdValid === false && true} label="Confirm Password" type="password" name="confirm_pwd"
					 fullWidth required	onChange={handleConfirmpwd} helperText={confirmpwdValid === false ? "Password does not match." : ""} />
					{
						(usernameValid && emailValid && pwdValid && confirmpwdValid && !formValid) &&
							setFormValid(true)
					}
					<Button type="submit" variant="contained" fullWidth disabled={!formValid || loading}
						style={formValid && !loading ? {margin: '20px 0px 20px 0px', backgroundColor: '#282c34', color: 'white'}
							: {margin: '20px 0px 20px 0px'}} >
						{loading ? <CircularProgress size="2rem" color="inherit" /> : 'SIGN UP'}
					</Button>
				</form>
				<Typography>
					Already have an account? &nbsp;
					<Link href="#login" onClick={props.onClick}>
						 Sign In
					</Link>
				</Typography>
			</Paper>
		</Grid>
	);
}