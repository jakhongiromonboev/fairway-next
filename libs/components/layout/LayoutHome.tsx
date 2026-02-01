import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import Chat from '../Chat';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const router = useRouter();

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/
		const handleNavigation = (path: string) => {
			router.push(path);
		};

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Fairway - Premium Golf Equipment & Events</title>
						<meta name={'title'} content={`Fairway`} />
						<meta name={'description'} content={'Premium golf equipment, expert coaching, and exciting tournaments'} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>
						<Stack id={'main'}>
							<Component {...props} />
						</Stack>
						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Fairway - Premium Golf Equipment & Events</title>
						<meta name={'title'} content={`Fairway`} />
						<meta name={'description'} content={'Premium golf equipment, expert coaching, and exciting tournaments'} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{/* HERO SECTION */}
						<Stack className={'hero-section'}>
							<Box className={'hero-overlay'} />
							<Stack className={'container hero-content'}>
								<h1 className={'hero-title'}>Elevate Your Golf Game</h1>
								<p className={'hero-subtitle'}>Premium Equipment • Expert Coaching • Exciting Tournaments</p>
								<Box className={'hero-links'}>
									<span className={'hero-link'} onClick={() => handleNavigation('/products')}>
										Products
									</span>
									<span className={'hero-divider'}>•</span>
									<span className={'hero-link'} onClick={() => handleNavigation('/events')}>
										Events
									</span>
								</Box>
							</Stack>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{user?._id && <Chat />}

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutMain;
