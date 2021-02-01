import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function Footer () {

	const footer = {
		backgroundColor: '#282c34',
		color: 'white',
		textAlign: 'center',
		padding: '30px',
		marginTop: 'auto',		
	};

	return (
		<div style={footer}>
			<Typography>
				Copyright &copy; {new Date().getFullYear()} CapShare. All rights reserved.
			</Typography>
		</div>
	);
}