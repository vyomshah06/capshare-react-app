import React, {useState, useEffect} from 'react';
import {
	Grid, 
	Paper, 
	Typography, 
	Link, 
	Divider, 
	TextField, 
	InputAdornment, 
	Button, 
	FormControlLabel, 
	Checkbox, 
	Tabs, 
	Tab, 
	CircularProgress, 
	Dialog, 
	DialogTitle, 
	DialogContent, 
	DialogActions, 
	useMediaQuery, 	
	makeStyles} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteOutlinedIcon from '@material-ui/icons/FavoriteOutlined';
import CategoryOutlinedIcon from '@material-ui/icons/CategoryOutlined';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  
  faFacebook,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles(theme => ({	
	paper: {
		width: '90%',
		margin: '0px auto',
		padding: '30px',
		paddingTop: '50px',
		textAlign: 'center'
	},
	mediaPaper: {			
		margin: '0px auto',
		padding: '10px',
		paddingTop: '50px',
		textAlign: 'center'
	},
	gridItem: {
		borderRight: '1px solid #0000001f',
		paddingLeft: '20px',	
		paddingRight: '20px',	
	},
	mediaGridItem: {
		width: 'inherit',
	},
	indicator: {
		backgroundColor: '#282c34',
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
	paginationUL: {
		justifyContent: 'center'
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
	}
}));

export default function Home (props) {

	const classes = useStyles();
	const history = useHistory();
	const isMedia = useMediaQuery("(max-width: 600px)"); 	
	let user = JSON.parse(localStorage.getItem('user'));
	const token = user.access_token;

	var tabindex = '0';
	const [captions, setCaptions] = useState([]);
	const [btnClick, setBtnClick] = useState({});	
	const [categories, setCategories] = useState([]);
	const [filterCategory, setFilterCategory] = useState(false);
	const [searchQuery, setSearchQuery] = useState();
	const [categoryChecked, setCategoryChecked] = useState({});
	const [checkedAll, setCheckedAll] = useState(false);	
	const [tabValue, setTabValue] = useState(0);
	const [alertMsg, setAlertMsg] = useState();
	const [catLoading, setCatLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [captionText, setCaptionText] = useState();
	const [openDialog, setOpenDialog] = useState(false);
	const [copyMsg, setCopyMsg] = useState();
	const [page, setPage] = useState(1);	

	useEffect(() => {		
		let res1 = false;
		setCatLoading(true);
		fetch('https://capshare.herokuapp.com/categories', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},			
		}).then((response) => {
			res1 = response.ok;
			return response.json();
		  }).then((data) => {
		  	setCatLoading(false);	
		  	res1 ? setCategories(data.category) : setAlertMsg(data.message);		  	
		  }).catch((error) => {	
		  	setCatLoading(false);		  	
		  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
		  	 : setAlertMsg(error.message);		  	
		  });
		let res2 = false;
		setLoading(true);
		fetch('https://capshare.herokuapp.com/captions', {
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
		  	res2 ? setCaptions(data.captions) : setAlertMsg(data.message);		  	
		  }).catch((error) => {	
		  	setLoading(false);
		  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
		  	 : setAlertMsg(error.message);		  	
		  });
		let res3 = false;
		setLoading(true);
		fetch('https://capshare.herokuapp.com/caption/like', {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},			
		}).then((response) => {
			res3 = response.ok;
			return response.json();
		  }).then((data) => {
		  	setLoading(false);
		  	if(res3) {
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
		  		setAlertMsg(data.message);
		  	}		
		  }).catch((error) => {	
		  	setLoading(false);
		  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
		  	 : setAlertMsg(error.message);		  	
		  });
	}, [token]);

	useEffect(() => {
		var query = new URLSearchParams(window.location.search);
		if(query.get('categories')) {					
			let cat_list = query.get('categories');			
			let arr = cat_list.split(',').map(Number);			
			arr.map((item) => 
				setCategoryChecked((prev) => ({
					...prev,
					[item]: true
				}))
			);	
			if(arr.length === categories.length) {
				setCheckedAll(true);
			}		
			var categories_list = {'categories': arr};			
			let resok = false;			
			setFilterCategory(true);
			setLoading(true);
			fetch('https://capshare.herokuapp.com/category/captions', {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},			
				body: JSON.stringify(categories_list)
			}).then((response) => {
				resok = response.ok;
				return response.json();
			  }).then((data) => {
			  	setLoading(false);	
			  	resok ? setCaptions(data.captions) : setAlertMsg(data.message);		  	
			  }).catch((error) => {	
			  	setLoading(false);		  	
			  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
			  	 : setAlertMsg(error.message);		  	
			  });
		}
		else if(query.get('search')) {				
			let searchQuery = query.get('search');
			let toggle = 0;
			var cat_list = [];
			setSearchQuery(searchQuery);
			//eslint-disable-next-line
			categories.map(cat => {				
				if(cat.category_name === searchQuery) {
					toggle = 1;					
					cat_list.push(cat.id);
				}
			});
			if(toggle === 1) {
				setLoading(true);
				var category_list = {'categories': cat_list};
				let resok = false;				
				fetch('https://capshare.herokuapp.com/category/captions', {
					method: 'post',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},
					body: JSON.stringify(category_list)
				}).then((response) => {
					resok = response.ok;
					return response.json();
				  }).then((data) => {
				  	setLoading(false);	
				  	resok ? setCaptions(data.captions) : setAlertMsg(data.message);		  	
				  }).catch((error) => {	
				  	setLoading(false);					  	
				  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
				  	 : setAlertMsg(error.message);		  	
				  });
			}
			else {
				setLoading(true);
				let resok = false;
				fetch(`https://capshare.herokuapp.com/captions/search/${searchQuery}`, {
					method: 'get',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					},			
				}).then((response) => {
					resok = response.ok;
					return response.json();
				  }).then((data) => {
				  	setLoading(false);	
				  	resok ? setCaptions(data.captions) : setAlertMsg(data.message);		  	
				  }).catch((error) => {	
				  	setLoading(false);		  	
				  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
				  	 : setAlertMsg(error.message);		  	
				  });
			}
		}
	}, [token, history, categories]);

	const handleSearch = (event) => {
		event.preventDefault();		
		var inputValue = document.getElementById('search').value;				
		if(inputValue.length > 0) {
			window.location.replace(`/home?search=${inputValue}`);
		}		
	}

	const handleTabs = (event, value) => {		
		setTabValue(value);
	}

	const latestCaptions = (tabIndex, captions) => {	
		tabindex = tabIndex;		
		let sortCaptions = JSON.parse(JSON.stringify(captions));
		sortCaptions.reverse();			
		return captionView(tabindex, sortCaptions);
	}

	const mostLikedCaptions = (tabIndex, captions) => {			
		tabindex = tabIndex;
		let likedCaptions = JSON.parse(JSON.stringify(captions));
		likedCaptions.sort((a, b) => b.like_count - a.like_count);		
		return captionView(tabindex, likedCaptions);
	}

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

	const captionView = (tabIndex, captions) => {		
		tabindex = tabIndex;
		var startIndex = ((page - 1) * 10);
		var endIndex = (page * 10);
	  	return (
	  		<div>
	  		{
	  			loading && <CircularProgress size="2rem" color="inherit" />
	  		}
	  		{
	  			(!loading && captions.length === 0) ? <Typography gutterBottom>
	  					No captions posted</Typography> : <Typography gutterBottom></Typography>
	  		}
	  		{
	  			!loading && captions.slice(startIndex,endIndex).map(caption => {
	  				return ( 
	  				  <div key={caption.id} className={classes.captionView}> 				
				      	<div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
				          	<AccountCircle style={{fontSize: '2.5rem'}}/>
							<span style={{fontStyle: 'normal', fontWeight: 'bold'}}>
								&nbsp;{caption.username} &nbsp;
							</span>
							{printPostTime(caption.timestamp)}							
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
				          		<Button id={caption.id} variant="contained" color="secondary" onClick={handleLike}>
				          			{btnClick[caption.id] ? <FavoriteOutlinedIcon /> : <FavoriteBorder />}
				          			Like
				          		</Button>
				          		<Button id={caption.id} variant="contained" color="primary"
				          		  onClick={() => {setOpenDialog(true); setCaptionText(caption.caption)}}>
				          			<ShareIcon />
				          			Share
				          		</Button>				          		
				          	</Typography>
				      	</div>
				      	<Divider variant="middle" style={{marginTop: '20px', marginBottom: '20px'}}/>
				      </div>	
				    );		    
	  			})
	  		}
	  		{
	  			<Dialog onClose={() => {setOpenDialog(false); setCopyMsg('');}} 
				  		open={openDialog}
		  				BackdropProps={{style: 
		  					{backgroundColor: 'rgba(0,0,0,0.5)'}
		  				}} 
		  				PaperProps={{style: 
		  					{boxShadow: 'none', width: '-webkit-fill-available'}
		  				}}>
			        <DialogTitle disableTypography className={classes.dialogTitle}>
			          <Typography variant="h6" className={classes.dTitle}>
			            CapShare
			          </Typography>
			          <IconButton onClick={() => {setOpenDialog(false); setCopyMsg('');}}>
			          	<CloseIcon />
			          </IconButton>
			        </DialogTitle>
			        <DialogContent dividers>
			        	<Typography gutterBottom>Caption Text: </Typography>
			        	<Grid container justifycontent='center' alignItems='center'
			        	  style={{padding: '5px'}}>
			        		<Grid item xs={12} sm={9}>				        	
						        <TextField id={'tab-' + tabindex} defaultValue={captionText}
						          variant="outlined" fullWidth InputProps={{readOnly: true}} />
			        		</Grid>
			        		<Grid item xs={12} sm={3} style={{textAlign: 'center'}}>
				        		<Button id={tabindex} onClick={handleCopy} 
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
	  		</div>
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
			  	resok ? console.log(data.message) : setAlertMsg(data.message);		  	
			  }).catch((error) => {				  		  
			  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
			  	 : setAlertMsg(error.message);		  	
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
	  		fetch(`https://capshare.herokuapp.com/caption/like/${like_id}`, {
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
			  	resok ? console.log(data.message) : setAlertMsg(data.message);		  	
			  }).catch((error) => {				  		  
			  	error.message.includes('fetch') ? setAlertMsg('Failed to connect to the server.')
			  	 : setAlertMsg(error.message);		  	
			  });
	  	}	  	
	}	  


	const handleCopy = (event) => {		
		var captext = 'tab-' + tabindex;		
		const caption_text = document.getElementById(captext);		
		caption_text.focus();
		caption_text.setSelectionRange(0, caption_text.value.length);
		document.execCommand('copy');
		setCopyMsg('Caption text copied successfully!');		
	}	

	const categoryView = (catLoading) => {
		if(catLoading) {
			return (
				<div style={{justifyContent: 'center'}}>			
					<CircularProgress size="2rem" color="inherit" />
				</div>
			);
		}
		else {
			return (
				<div style={{display: 'flex', flexDirection: 'column', 
							width: '70%', margin: '0px auto'}}>	
					<FormControlLabel
						key="all"
				        control={
				          <Checkbox							          	
				            checked={checkedAll}
				            onChange={handleAll}
				            name="select_all"
				            color="primary"
				          />
				        }
				        label="Select All"
			    	/>															
					{
						categories.map(cat => (									
							<FormControlLabel
								key={cat.id}
						        control={
						          <Checkbox	
						          	className="catCheckBox"						          	
						            checked={categoryChecked[cat.id] ? true : false}
						            onChange={handleChange}
						            value={cat.id}
						            color="primary"
						          />
						        }
						        label={cat.category_name}
						    />									    
						))
					}
					<Button type="submit" variant="contained" onClick={handleSubmit}
					  style={{backgroundColor: '#282c34', color: 'white'}}>						    	
				    	Submit
				    </Button>
				</div>
			);
		}
	}

	const handleChange = (event) => {
		let id = parseInt(event.currentTarget.value);		
		let checked = event.target.checked;
		setCategoryChecked((prev) => ({
			...prev,
			[id]: checked
		}));		
	}

	const handleAll = (event) => {	
		let checked = event.target.checked;	
		setCheckedAll(!checkedAll);
		categories.map(cat => (
				setCategoryChecked((prev) => ({
					...prev,
					[cat.id]: checked
				}))
			)
		)		
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		var cat_list = [];
		let toggle = 0;		
		for (var x in categoryChecked) {
			if(categoryChecked[x] === true) {
				cat_list.push(x);
				toggle = 1;
			}
		}
		if(toggle === 1) {
			window.location.replace(`/home?categories=${cat_list}`);			
		}		
	}

	const handlePageChange = (event, newPage) => {
		setPage(newPage);		
	}

	return (				
		<Paper elevation={1} className={`${isMedia ? classes.mediaPaper : classes.paper}`}>
			<Grid container direction="row" justify="center">
				<Grid item sm={9} className={`${isMedia ? classes.mediaGridItem : classes.gridItem}`}>
					<Typography variant="body1" gutterBottom 
				  	  style={{fontStyle: 'italic', marginBottom: '40px'}}>
				  	  <Link href="/home">CapShare</Link> is one of the best platform for users
				  	   to post their own captions. It provides access to several captions of 
				  	   different categories through extensive search and filter operations. 
				  	   All captions from the most recent to the most liked captions are 
				  	   available to view for the users in CapShare.
					</Typography>
					<Grid container justify="center" alignItems="center" style={{marginBottom: '40px'}}>
						<Grid item xs={12} sm={9}>
							<Autocomplete
								freeSolo
						        id="search"						        
						        options={categories.map(cat => cat.category_name)}								        
						        renderInput={(params) => (
						          <TextField {...params}
						          	id="search-query" 						            
						            margin="normal" 
						            variant="outlined"
						            placeholder="Search captions by keywords or categories..."
						            fullWidth 
						            InputProps={{
						            	...params.InputProps,
						            	spellCheck: true,								            	
							            startAdornment: 
							              <InputAdornment position="start">
							              	<SearchIcon />
							              </InputAdornment>,							              
							          }} />
						        )}
						    />
						</Grid>
						<Grid item xs={12} sm={3} >
							<Button type="submit" variant="contained" onClick={handleSearch}
							  style={{backgroundColor: '#282c34', color: 'white'}}>
						    	<SearchIcon />
						    	Search
						    </Button>
						</Grid>								
					</Grid>		
					{
						alertMsg && <Alert 
								  severity="error"
								  style={{backgroundColor: '#f9c4cc'}}
								  onClose={() => setAlertMsg('')}>
									{alertMsg}
							 	</Alert>
					}
					{
						searchQuery && (<div><Typography variant="h5" gutterBottom>
							Search Results for "{searchQuery}"</Typography>
							<Divider variant="middle" style={{color: '#282c34', marginBottom: '40px'}}/>
							{
								loading ? <CircularProgress size="2rem" color="inherit" />
								: (captions.length > 0 ? captionView('0', captions) : <Typography>No results found.</Typography>)
							}
							</div>
						)
					}
					{
						filterCategory && (<div><Typography variant="h5" gutterBottom>
							Captions based on selected categories</Typography>
							<Divider variant="middle" style={{color: '#282c34', marginBottom: '40px'}}/>
							{
								loading ? <CircularProgress size="2rem" color="inherit" />
								: (captions.length > 0 ? captionView('0', captions) : <Typography>No results found.</Typography>)
							}
							</div>
						)
					}
					{
						(!searchQuery && !filterCategory) ? (<div><Tabs
					    	value={tabValue}
						    onChange={handleTabs}
						    indicatorColor="primary"
						    variant="fullWidth"							   							  
						    classes={{
						    	root: classes.tabRoot,
				    			indicator: classes.indicator
						    }}							    
							>
							    <Tab label="Latest Captions" />
							    <Tab label="All Captions" />
							    <Tab label="Most Liked Captions" />
							</Tabs>							
							<Divider variant="middle" style={{marginBottom: '40px'}} />
							<div role="tabpanel" value={tabValue} index={0}
						      hidden={tabValue !== 0} id="full-width-tabpanel-0"
						    >
						    	{		
						    		loading ? <CircularProgress size="2rem" color="inherit" />
						    		 : latestCaptions('0', captions)
						    	}
						    </div>
						    <div
						      role="tabpanel" value={tabValue} index={1}
						      hidden={tabValue !== 1} id="full-width-tabpanel-1"
						    >
						    	{
						    		loading ? <CircularProgress size="2rem" color="inherit" />
						    		 : captionView('1', captions)
						    	}
						    </div>
						    <div
						      role="tabpanel" value={tabValue} index={2}
						      hidden={tabValue !== 2} id="full-width-tabpanel-2"
						    >
						    	{						    		
						    		loading ? <CircularProgress size="2rem" color="inherit" />
						    		 : mostLikedCaptions('2', captions)
						    	}
						    </div>
						</div>
				    	) : ''
					}
					<Pagination count={captions.length%10===0 ? captions.length/10
						 : parseInt(captions.length/10) + 1}
						 page={page} shape="rounded" size="large" 
						 onChange={handlePageChange} classes={{ul: classes.paginationUL}}/>
				</Grid>							
				<Grid item sm={3}>						
					<Typography variant="h5" gutterBottom>
						Categories
					</Typography>							
					<Typography variant="body1" gutterBottom style={{fontStyle: 'italic'}}>
						Please select one or multiple categories from the below checkboxes and
						click submit button to view the captions based on the selected categories.
					</Typography>
					<Divider variant="middle"/>	
					{
						categoryView(catLoading)
					}													    
				</Grid>									
			</Grid>
		</Paper>			
	);
}