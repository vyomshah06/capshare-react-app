import React, {useState, useEffect} from 'react';
import {
	Grid, 
	Paper, 
	Button, 
	TextField, 
	Avatar, 
	Typography, 
	Divider, 	
	MenuItem, 
	useMediaQuery, 
	makeStyles} from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles(theme => ({        
	gridContainer: {			   
	    width: '70%',	    	   
	    margin: '0px auto',
	},
	mediaGridContainer: {			   
	    width: '100%',	    	   
	    margin: '0px auto',
	},
	paper: {
		padding: '20px',
		textAlign: 'center',		
		paddingLeft: '100px',
		paddingRight: '100px',	
	},
	mediaPaper: {
		padding: '20px',
		textAlign: 'center',		
		paddingLeft: '5%',
		paddingRight: '5%',	
	},
	avatar: {
		backgroundColor: '#282c34',
		margin: '0px auto',
		width: '80px',
		height: '80px',
	},	
	textarea: {
		fontSize: '20px',
		lineHeight: '200%'
	},
	subtitle: {
		float: 'right',
		marginTop: '20px',
		fontStyle: 'italic',
	}
}))

export default function PostCaptions (props) {

	const classes = useStyles();
	const history = useHistory();
	const isMedia = useMediaQuery("(max-width: 765px)");	
	let user = JSON.parse(localStorage.getItem('user'));
	const token = user.access_token;	

	const [values, setValues] = useState({'category_id': '', 'caption': ''});
	const [categories, setCategories] = useState([]);	
	const [captionValid, setCaptionValid] = useState(true);
	const [categoryValid, setCategoryValid] = useState(true);
	const [errorMsg, setErrorMsg] = useState();
	const [loading, setLoading] = useState(false);
	const [alertMsg, setAlertMsg] = useState();

	useEffect(() => {
		let resok = false;
		fetch('https://capshare.herokuapp.com/categories', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},			
		}).then((response) => {
			resok = response.ok;
			return response.json();
		  })
		  .then((data) => {
		  	if(resok) {		  		
		  		setCategories(data.category);
		  	}
		  	else {
		  		setAlertMsg(data.message);
		  	}
		  })
		  .catch((error) => {		  	
		  	if(error.message.includes('fetch')) {
		  		setAlertMsg('Failed to connect to the server.');		  	
		  	}		  	
		  	else {
		  		setAlertMsg(error.message);
		  	}
		  });
	}, [token]);

	const handleCategory = (event) => {		
		let {name, value} = event.target;
		if(value !== '') {
			setCategoryValid(true);					
		}		
		setValues((prev) => ({
			...prev, 
			[name]: value
		}));
	}

	const handleCaption = (event) => {
		let {name, value} = event.target;		
		if(value.length > 0 && value.length < 1000) {
			setCaptionValid(true);			
		}
		setValues((prev) => ({
			...prev, 
			[name]: value
		}));
	}

	function validate() {
		let formisValid = true;
		if(values['category_id'] === '') {
			formisValid = false;
			setCategoryValid(false);
			setErrorMsg('This field is required.');
		}
		if(values['caption'] === '') {
			formisValid = false;
			setCaptionValid(false);
			setErrorMsg('This field is required.');
		}		
		else if(values['caption'].length > 1000) {
			formisValid = false;
			setCaptionValid(false);
			setErrorMsg('Caption text must be less than 1000 characters.');
		}
		return formisValid;	
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		if(validate()) {			
			setLoading(true);
			let resok = false;
			setTimeout(function() {
				fetch('https://capshare.herokuapp.com/captions', {
					method: 'post',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify(values)
				}).then((response) => {
					resok = response.ok;
					return response.json();
				  })
				  .then((data) => {
				  	setLoading(false);			  		  			  				  		  		 
				  	if(resok) {					  		
				  		history.push({
				  			pathname: '/view/captions',
				  			state: {message: data.message}
				  		});
				  	}
				  	else {
				  		setAlertMsg(data.message);
				  	}
				  })
				  .catch((error) => {
				  	setLoading(false);				  	
				  	if(error.message.includes('fetch')) {
				  		setAlertMsg('Failed to connect to the server.');		  	
				  	}		  	
				  	else {
				  		setAlertMsg(error.message);
				  	}
				  });
			}, 1000);
			
		}		
	}

	return (					
		<Grid container 
			  direction="column"					  					  				
			  className={`${isMedia ? classes.mediaGridContainer : classes.gridContainer}`}>
		  <Grid item xs={12}>
			<Paper elevation={1} className={`${isMedia ? classes.mediaPaper : classes.paper}`} >
				<Avatar className={classes.avatar}> 
					<PostAddIcon style={{width: '60px', height: '60px'}}/> 
				</Avatar>	
				<h2>POST CAPTIONS</h2>	
				<Typography variant="body1" gutterBottom 
				 style={{fontStyle: 'italic', marginBottom: '20px'}}>
					Do you have a great caption in mind? Post your favorite captions here by 
					selecting from the various categories available and write your own caption.
				</Typography>	
				{
					alertMsg && <Alert 
								  severity="error"
								  style={{backgroundColor: '#f9c4cc', marginTop: '5px'}}
								  onClose={() => setAlertMsg('')}>
									{alertMsg}
							 	</Alert>
				}	
				<Divider />									
				<form onSubmit={handleSubmit} noValidate>								
					<TextField variant="outlined" select
					  label="Category" name="category_id"
					  fullWidth required
					  onChange={handleCategory}
					  value={values['category_id']}
					  error={!categoryValid}
					  helperText={!categoryValid ? errorMsg : ''}
					  style={{marginTop: '70px', marginBottom: '20px'}} >
					  	<MenuItem key="none" value=""><em>None</em></MenuItem>
					  	{
					  		categories.map(cat => 
					  			<MenuItem key={cat.id} value={cat.id}>
					  				{cat.category_name}
					  			</MenuItem>		
					  		)
					  	}								
					</TextField>						 
					<TextField variant="outlined" 
						multiline rows={7}
						placeholder="Write your own caption."
						label="Caption" name="caption" 
						error={!captionValid}
						helperText={!captionValid ? errorMsg : ''}
						onChange={handleCaption}
						InputProps={{
							classes: {
								root: classes.textarea
							},									
						}}							
						fullWidth required />
					<Typography variant="subtitle1" className={classes.subtitle}>
						- Posting by...
						<div style={{
						    display: 'flex',
						    alignItems: 'center',
						    flexWrap: 'wrap',
						}}>
							<AccountCircle />    			
							<span style={{fontStyle: 'normal', fontWeight: 'bold'}}>
								&nbsp;{user.username}
							</span>
						</div> 																
					</Typography>
					<Button type="submit" variant="contained" fullWidth
					  style={{margin: '40px 0px 20px 0px', 
				      backgroundColor: '#282c34', color: 'white'}} >
						{loading ? <CircularProgress size="2rem" color="inherit" /> : 'SUBMIT'}
					</Button>
				</form>
			</Paper>
		  </Grid>
		</Grid>			
	);	
}