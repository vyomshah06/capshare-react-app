import React, {useState, useEffect} from 'react';
import {
	Grid, 
	Paper, 
	Button, 
	TextField, 	
	Typography, 
	Divider, 		
	CircularProgress, 
	Dialog, 
	DialogTitle, 
	DialogContent, 
	DialogActions, 
	useMediaQuery, 
	makeStyles} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  
  faFacebook,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import Alert from '@material-ui/lab/Alert';
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles(theme => ({        
	gridContainer: {			   
	    width: '80%',	    	   
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
	captionView: {
		textAlign: 'left',
  		webkitTouchCallout: 'none',
    	webkitUserSelect: 'none',
     	khtmlUserSelect: 'none',
       	mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
	},	
	quoteIcon: {
		fontSize: '4rem',
		color: 'gray',
	},
	catStyle: {
		backgroundColor: '#282c34', 
		color: 'white',
		display: 'flex',
		alignItems: 'center',
		padding: '8px',
		borderRadius: '1020px'
	},
	dialogTitle: {		
		display: 'flex',
		alignItems: 'center'
	},
	dTitle: {
		flexGrow: 1, 
		fontFamily: 'cursive',
		fontSize: 'xx-large'
	},
	textarea: {
		fontSize: '16px',
		lineHeight: '200%'
	},
}))
	
export default function ViewCaptions (props) {

	const classes = useStyles();
	const history = useHistory();
	let state = props.location.state;
	const isMedia = useMediaQuery("(max-width: 765px)"); 
	let user = JSON.parse(localStorage.getItem('user'));
	const token = user.access_token;

	const [captions, setCaptions] = useState([]);
	const [btnClick, setBtnClick] = useState({});	
	const [shareDialog, setShareDialog] = useState(false);
	const [editDialog, setEditDialog] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [captionId, setCaptionId] = useState();
	const [captionText, setCaptionText] = useState();
	const [copyMsg, setCopyMsg] = useState();
	const [loading, setLoading] = useState(false);
	const [alertMsg, setAlertMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		let res = false;
		setLoading(true);
		fetch('https://capshare.herokuapp.com/user/captions', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},			
		}).then((response) => {
			res = response.ok;
			return response.json();
		  }).then((data) => {
		  	setLoading(false);			  	
		  	res ? setCaptions(data.captions) : setErrorMsg(data.message);		  	
		  }).catch((error) => {	
		  	setLoading(false);		  	
		  	error.message.includes('fetch') ? setErrorMsg('Failed to connect to the server.')
		  	 : setErrorMsg(error.message);		  	
		  });
		let res2 = false;
		setLoading(true);
		fetch('https://capshare.herokuapp.com/caption/like', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},			
		}).then((response) => {
			res2 = response.ok;
			return response.json();
		  }).then((data) => {
		  	setLoading(false);
		  	if(res2) {
		  		if(data.liked_captions.length > 0) {
		  			//eslint-disable-next-line
		  			data.liked_captions.map(lc => {
		  				setBtnClick((prev) => ({
			  				...prev,
			  				[lc.caption_id]: true
			  			}));
		  			});
		  		}
		  	}
		  	else {
		  		setErrorMsg(data.message);
		  	}		
		  }).catch((error) => {	
		  	setLoading(false);		  	
		  	error.message.includes('fetch') ? setErrorMsg('Failed to connect to the server.')
		  	 : setErrorMsg(error.message);		  	
		  });
	}, [token]);

	useEffect(() => {
		var query = new URLSearchParams(window.location.search);		
		if(parseInt(query.get('delete')) === 1) {
			setAlertMsg('Caption deleted successfully!');
			history.replace('/view/captions', null);
		}
		else if(parseInt(query.get('edit')) === 1) {
			setAlertMsg('Caption updated successfully!');
			history.replace('/view/captions', null);
		}
	}, [history]);

	useEffect(() => {
		if(state) {
			setAlertMsg(state.message);
			history.replace('/view/captions', null);
		}		
	}, [history, state]);

	const printPostTime = (postTime) => {
		var currentTime = new Date();		
		var postedTime = new Date(postTime);
		let diff = (currentTime - postedTime) / 1000;		
		let options = {year: 'numeric', month: 'long', day: 'numeric'};
		if(diff < 60) {
			return ('posted 0 minute ago.');
		}
		else if(diff >= 60 && diff < (60*60)) {
			if(Math.floor(diff/60) === 1) {
				return ('posted ' + Math.floor(diff/60) + ' minute ago.');
			}
			return ('posted ' + Math.floor(diff/60) + ' minutes ago.');
		}
		else if(diff >= (60*60) && diff < (60*60*24)) {
			if(Math.floor((diff/60)/60) === 1) {
				return ('posted ' + Math.floor((diff/60)/60) + ' hour ago.');
			}
			return ('posted ' + Math.floor((diff/60)/60) + ' hours ago.');
		}
		else if(diff >= (60*60*24) && diff < (60*60*24*7)) {
			if(Math.floor(((diff/60)/60)/24) === 1) {
				return ('posted ' + Math.floor(((diff/60)/60)/24) + ' day ago.');	
			}
			return ('posted ' + Math.floor(((diff/60)/60)/24) + ' days ago.');
		}
		else {
			return ('posted on ' + postedTime.toLocaleString('en-US', options));
		}
	}

	const captionView = (captions) => {
	  	return (	  	
	  		<div><>
	  		{
	  			captions.map(caption => {
	  				return ( 
	  				  <div key={caption.id} className={classes.captionView}> 				
				      	<div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
				          	<AccountCircle style={{fontSize: '2.5rem'}}/>
							<span style={{fontStyle: 'normal', fontWeight: 'bold'}}>
								&nbsp;{caption.username} &nbsp;
							</span>
							{printPostTime(caption.timestamp)}							
							<div style={{marginLeft: 'auto'}}>
								<Button id={caption.id} variant="contained" color="primary" 
								  style={{margin: '5px'}} onClick={() => {setEditDialog(true);
								  	setCaptionText(caption.caption); setCaptionId(caption.id)}}>				          			
				          			<EditIcon />
				          			Edit
				          		</Button>
				          		<Button id={caption.id} variant="contained" color="secondary"
				          		  onClick={() => {setDeleteDialog(true); setCaptionId(caption.id)}}>
				          			<DeleteIcon />
				          			Delete
				          		</Button>
							</div>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', marginLeft: '40px'}}>
							<FormatQuoteIcon className={classes.quoteIcon} style={{transform: 'scaleX(-1)'}} />				
				          	<Typography variant="body1" style={{textAlign: 'center', fontSize: '1.5rem'}}>
				          		{caption.caption}
				          	</Typography>
				          	<FormatQuoteIcon className={classes.quoteIcon} style={{marginLeft: 'auto'}} />			          	
				          	{
				          		caption.like_count > 0 && caption.like_count !== 1 ? <Typography>
				          			{caption.like_count} Likes</Typography> : ''
				          	}
				          	{
				          		caption.like_count === 1 && <Typography>{caption.like_count} Like</Typography>
				          	}
				          	
				          	<Typography style={{display: 'flex', justifyContent: 'space-evenly'}}>
				          		<span className={classes.catStyle}>
				          			<CategoryOutlinedIcon />
				          			{caption.category_name}
				          		</span>
				          		<Button id={caption.id} variant="contained" color="secondary"
				          		  onClick={handleLike}>
				          			{
				          				btnClick[caption.id] ? <FavoriteOutlinedIcon />
				          			 	 : <FavoriteBorder />
				          			}
				          			Like
				          		</Button>
				          		<Button id={caption.id} variant="contained" color="primary"
				          		  onClick={() => {setShareDialog(true); setCaptionText(caption.caption)}}>
				          			<ShareIcon />
				          			Share
				          		</Button>
				          					          		
				          	</Typography>
				      	</div>
				      	<Divider variant="middle" 
				      	  style={{marginTop: '20px', marginBottom: '20px'}}/>
				      </div>	
				    );		    
	  			})
	  		}
	  		{
	  			<Dialog onClose={() => {setShareDialog(false); setCopyMsg('');}} 
				  		open={shareDialog}
		  				BackdropProps={{style: 
		  					{backgroundColor: 'rgba(0,0,0,0.7)'}
		  				}} 
		  				PaperProps={{style: 
		  					{boxShadow: 'none', width: '-webkit-fill-available'}
		  				}}>
			        <DialogTitle disableTypography className={classes.dialogTitle}>
			          <Typography variant="h6" className={classes.dTitle}>
			            CapShare
			          </Typography>
			          <IconButton onClick={() => {setShareDialog(false); setCopyMsg('');}}>
			          	<CloseIcon />
			          </IconButton>
			        </DialogTitle>
			        <DialogContent dividers>
			        	<Typography gutterBottom>Caption Text: </Typography>
			        	<Grid container justifycontent='center' alignItems='center'
			        	  style={{padding: '5px'}}>
			        		<Grid item xs={12} sm={9}>				        	
						        <TextField id="caption-text" defaultValue={captionText}
						          variant="outlined" fullWidth InputProps={{readOnly: true}} />
			        		</Grid>
			        		<Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
				        		<Button onClick={handleCopy} 
				        	  	  variant="contained" color="primary">
				        	  		Copy to Clipboard
				        		</Button>
			        		</Grid>
			        	</Grid>			        				        	
			        	{
			        		copyMsg && <Alert severity="success" 
			        		  style={{backgroundColor: '#d3f5d3'}} >
			        		  {copyMsg}
			        		  </Alert>
			        	}							        	
			        </DialogContent>
			        <DialogActions>			        
			        	<Typography gutterBottom>
			        	Share on: &nbsp; 
			        	<a href="https://www.facebook.com" rel="noreferrer" target="_blank"
			        	  style={{padding: '5px'}}>
						  <FontAwesomeIcon icon={faFacebook} size="2x" style={{color: '#3A569C'}}/>
						</a>
						<a href="https://www.instagram.com" rel="noreferrer" target="_blank"
						  style={{padding: '5px'}}>
						  <FontAwesomeIcon icon={faInstagram} size="2x" style={{color: '#e84393'}} />
						</a>
						<a href="https://www.twitter.com" rel="noreferrer" target="_blank"
						  style={{padding: '5px'}}>
						  <FontAwesomeIcon icon={faTwitter} size="2x" style={{color: '#0097e6'}}/>
						</a>
						</Typography>					
			        </DialogActions>
			    </Dialog>
	  		}
	  		{
	  			<Dialog onClose={() => {setEditDialog(false); setCopyMsg('');}} 
				  		open={editDialog}
		  				BackdropProps={{style: 
		  					{backgroundColor: 'rgba(0,0,0,0.7)'}
		  				}} 
		  				PaperProps={{style: 
		  					{boxShadow: 'none', width: '-webkit-fill-available'}
		  				}}>
			        <DialogTitle disableTypography className={classes.dialogTitle}>
			          <Typography variant="h6" className={classes.dTitle}>
			            CapShare
			          </Typography>
			          <IconButton onClick={() => {setEditDialog(false); setCopyMsg('');}}>
			          	<CloseIcon />
			          </IconButton>
			        </DialogTitle>
			        <DialogContent dividers>
			        	<Typography gutterBottom style={{textAlign: 'center', fontStyle: 'italic'}}>
			        		Update the caption text for this caption
			        	</Typography>
			        	<TextField id="updated-caption-text" variant="outlined" 
							multiline rows={4}
							placeholder="Write your own caption."
							label="Caption" name="caption"
							defaultValue={captionText}
							InputProps={{
								classes: {
									root: classes.textarea
								},
							}}
							fullWidth autoFocus required />
			        </DialogContent>	
			        <DialogActions>
			        	<Button color="primary" style={{margin: '5px'}} 
			        	  onClick={() => setEditDialog(false)}>		          			
		          			Cancel
		          		</Button>
		          		<Button color="secondary" onClick={handleEdit}>		          			
		          			UPDATE
		          		</Button>
			        </DialogActions>		        
			    </Dialog>
	  		}
	  		{
	  			<Dialog onClose={() => {setDeleteDialog(false); setCopyMsg('');}} 
				  		open={deleteDialog}
		  				BackdropProps={{style: 
		  					{backgroundColor: 'rgba(0,0,0,0.7)'}
		  				}} 
		  				PaperProps={{style: 
		  					{boxShadow: 'none', width: '-webkit-fill-available'}
		  				}}>
			        <DialogTitle disableTypography className={classes.dialogTitle}>
			          <Typography variant="h6" className={classes.dTitle}>
			            CapShare
			          </Typography>
			          <IconButton onClick={() => {setDeleteDialog(false); setCopyMsg('');}}>
			          	<CloseIcon />
			          </IconButton>
			        </DialogTitle>
			        <DialogContent dividers>
			        	<Typography gutterBottom style={{textAlign: 'center', fontSize: '20px'}}>
			        		Are you sure you want to delete this caption?
			        	</Typography>			        					        
			        </DialogContent>
			        <DialogActions>			        
			        	<Button color="primary" style={{margin: '5px'}}
			        	  onClick={() => setDeleteDialog(false)}>		          			
		          			Cancel
		          		</Button>
		          		<Button color="secondary" onClick={handleDelete}>		          			
		          			OK
		          		</Button>
			        </DialogActions>
			    </Dialog>
	  		}
	  		</></div>
	  	);
	}

	const handleLike = (event) => {  
	  	let like_id = parseInt(event.currentTarget.id); 
	  	let newCaptions = JSON.parse(JSON.stringify(captions));
	  	let resok = false;
	  	if(!btnClick[like_id]) {
	  		setBtnClick((prev) => ({
	  			...prev,
	  			[like_id]: true
	  		}));
	  		//eslint-disable-next-line
	  		newCaptions.map(object => {	  			
	  			if(object.id === like_id) {	  				
	  				object.like_count = object.like_count + 1;		
	  			}
	  		});
	  		setCaptions(newCaptions);	  				
			fetch(`https://capshare.herokuapp.com/caption/like/${like_id}`, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},			
			}).then((response) => {
				resok = response.ok;
				return response.json();
			  }).then((data) => {			  	
			  	resok ? console.log(data.message) : setErrorMsg(data.message);		  	
			  }).catch((error) => {				  		  
			  	error.message.includes('fetch') ? setErrorMsg('Failed to connect to the server.')
			  	 : setErrorMsg(error.message);		  	
			  });
	  	}
	  	else {
	  		setBtnClick((prev) => ({
	  			...prev,
	  			[like_id]: false
	  		}));  	
	  		//eslint-disable-next-line
	  		newCaptions.map(object => {
	  			if(object.id === like_id) {
	  				object.like_count = object.like_count - 1;
	  			}
	  		});	  			  		
	  		setCaptions(newCaptions);
	  		fetch(`https://capshare.herokuapp.com/captions/like/${like_id}`, {
				method: 'delete',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},			
			}).then((response) => {
				resok = response.ok;
				return response.json();
			  }).then((data) => {			  	
			  	resok ? console.log(data.message) : setErrorMsg(data.message);		  	
			  }).catch((error) => {				  		  
			  	error.message.includes('fetch') ? setErrorMsg('Failed to connect to the server.')
			  	 : setErrorMsg(error.message);		  	
			  });
	  	}	  	
	  }	  

	const handleCopy = (event) => {
		var caption_text = document.getElementById("caption-text");		
		caption_text.focus();
		caption_text.setSelectionRange(0, caption_text.value.length);
		document.execCommand('copy');
		setCopyMsg('Caption text copied successfully!');
	}

	const handleEdit = (event) => {		
		let updated_caption_text = document.getElementById('updated-caption-text').value;
		var values = {'caption_text': updated_caption_text};
		let resok = false;
		fetch(`https://capshare.herokuapp.com/caption/${captionId}`, {
			method: 'put',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify(values)
		}).then((response) => {
			resok = response.ok;
			return response.json();
		  }).then((data) => {
		  	setEditDialog(false);
		  	resok ? window.location.replace('/view/captions?edit=1') : setErrorMsg(data.message);
		  }).catch((error) => {
		  	setEditDialog(false);				  		  
		  	error.message.includes('fetch') ? setErrorMsg('Failed to connect to the server.')
		  	 : setErrorMsg(error.message);		  	
		  });		
	}

	const handleDelete = (event) => {		
		let resok = false;
		fetch(`https://capshare.herokuapp.com/caption/${captionId}`, {
			method: 'delete',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},			
		}).then((response) => {
			resok = response.ok;
			return response.json();
		  }).then((data) => {
		  	if(resok) {
		  		window.location.replace('/view/captions?delete=1');
		  	}
		  	else {
		  		setDeleteDialog(false);
		  		setErrorMsg(data.message);		  		
		  	}		  	
		  }).catch((error) => {
		  	setDeleteDialog(false);
		  	error.message.includes('fetch') ? setErrorMsg('Failed to connect to the server.')
		  	 : setErrorMsg(error.message);
		  });		
	}

	return (	
		<Grid container direction="column" 
		  	className={`${isMedia ? classes.mediaGridContainer : classes.gridContainer}`}>
		  <Grid item xs={12}>
			<Paper elevation={1} 
			  className={`${isMedia ? classes.mediaPaper : classes.paper}`} >					
				<AccountCircle style={{width: '60px', height: '60px', color: '#282c34'}}/> 					
				<h2>VIEW CAPTIONS</h2>	
				<Grid container spacing={5} style={{marginTop: '40px', marginBottom: '40px'}}>
					<Grid item xs={12} sm={6}>
						<TextField label="First Name" 
						  name="fname" fullWidth defaultValue={user.first_name}
						  variant="outlined" InputProps={{readOnly: true}} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField label="Last Name" 
						  name="lname" fullWidth defaultValue={user.last_name}
						  variant="outlined" InputProps={{readOnly: true}} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField label="Username" 
						  name="username" fullWidth defaultValue={user.username}
						  variant="outlined" InputProps={{readOnly: true}} />
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField label="Email" 
						  name="email" fullWidth defaultValue={user.email_id}
						  variant="outlined" InputProps={{readOnly: true}} />
					</Grid>
				</Grid>	
				<Typography variant="h5" gutterBottom>
					User Captions
				</Typography>					
				{
					alertMsg.length > 0 && <Alert 
						style={{backgroundColor: '#d3f5d3'}} severity="success" 
						onClose={() => setAlertMsg('')}>
							{alertMsg}
						</Alert>
				}
				{
					errorMsg.length > 0 && <Alert 
						style={{backgroundColor: '#f9c4cc'}} severity="error" 
						onClose={() => setErrorMsg('')}>
							{errorMsg}
						</Alert>
				}
				<Divider variant="middle" style={{marginTop: '20px', marginBottom: '20px'}} />
				{
					loading ? <CircularProgress size="2rem" color="inherit" />
					  : (captions.length > 0 ? captionView(captions)
					 	: <Typography gutterBottom>No captions posted.</Typography>)
				}					
			</Paper>
		  </Grid>
		</Grid>					
	);
}