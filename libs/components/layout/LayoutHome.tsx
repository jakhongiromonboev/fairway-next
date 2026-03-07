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

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Fairway</title>
						<meta name={'title'} content={`Fairway`} />
						<meta name={'description'} content={'Premium golf equipment, expert coaching, and exciting tournaments'} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>
						<Stack id={'main'}>
							{/** ── MOBILE HERO ── **/}
							<Stack className={'hero-section'}>
								<Box className={'hero-overlay'} />
								<Stack className={'hero-content'}>
									<Box className={'hero-left'}>
										{/* <h1 className={'hero-title'}>ELEVATE YOUR GOLF GAME</h1> */}
										<div className={'hero-subtitle'}>
											<p>PREMIUM EQUIPMENT</p>
											<p>EXPERT COACHING</p>
											<p>EXCITING TOURNAMENTS</p>
										</div>
									</Box>
									<Box className={'hero-right'}>
										<div className={'hero-link'} onClick={() => router.push('/product')}>
											PRODUCTS <span className={'arrow'}>→</span>
										</div>
										<div className={'hero-link'} onClick={() => router.push('/events')}>
											EVENTS <span className={'arrow'}>→</span>
										</div>
									</Box>
								</Stack>
							</Stack>
							<Component {...props} />
						</Stack>
						<Chat />
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
						<title>Fairway</title>
						<meta name={'title'} content={`Fairway`} />
						<meta name={'description'} content={'Premium golf equipment, expert coaching, and exciting tournaments'} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>
						<Stack className={'hero-section'}>
							<Box className={'hero-overlay'} />
							<Stack className={'hero-content'}>
								<Box className={'hero-left'}>
									<h1 className={'hero-title'}>ELEVATE YOUR GOLF GAME</h1>
									<div className={'hero-subtitle'}>
										<p>PREMIUM EQUIPMENT</p>
										<p>EXPERT COACHING</p>
										<p>EXCITING TOURNAMENTS</p>
									</div>
								</Box>
								<Box className={'hero-right'}>
									<div className={'hero-link'} onClick={() => router.push('/product')}>
										PRODUCTS <span className={'arrow'}>→</span>
									</div>
									<div className={'hero-link'} onClick={() => router.push('/events')}>
										EVENTS <span className={'arrow'}>→</span>
									</div>
								</Box>
							</Stack>
						</Stack>
						<Stack id={'main'}>
							<Component {...props} />
						</Stack>
						<Chat />
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
