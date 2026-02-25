import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Advertisement = () => {
	const device = useDeviceDetect();

	const videoSrc =
		'https://res.cloudinary.com/dcqedfoc8/video/upload/v1771934498/5455877-uhd_3840_2160_30fps_fcoiqh.mp4';

	if (device === 'mobile') {
		return (
			<Stack className={'advertisement'}>
				<video className={'ad-video'} autoPlay muted loop playsInline>
					<source src={videoSrc} type="video/mp4" />
				</video>
			</Stack>
		);
	} else {
		return (
			<Stack className={'advertisement'}>
				<video className={'ad-video'} autoPlay muted loop playsInline>
					<source src={videoSrc} type="video/mp4" />
				</video>
			</Stack>
		);
	}
};

export default Advertisement;
