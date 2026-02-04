import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);

		const memoizedValues = useMemo(() => {
			let title = '',
				bgImage = '',
				mediaType: 'image' | 'video' | 'none' = 'none',
				videoSrc = '';

			switch (router.pathname) {
				case '/products':
					title = 'DISCOVER PREMIUM EQUIPMENT';
					bgImage = '/img/banner/shop_hero_main.avif';
					mediaType = 'image';
					break;
				case '/events':
					title = 'JOIN EXCITING TOURNAMENTS';
					bgImage = '/img/banner/hero2.jpg';
					mediaType = 'video';
					videoSrc = '/video/events-hero3.mp4';
					break;
				case '/agent':
					title = 'MEET OUR PRO SHOPS';
					bgImage = '/img/banner/hero-agent1.jpg';
					mediaType = 'image';
					break;
				case '/about':
					title = 'ABOUT FAIRWAY';
					bgImage = '/img/banner/hero2.jpg';
					mediaType = 'video';
					videoSrc = '/videos/about-hero.mp4';
					break;

				case '/agent/detail':
				case '/mypage':
				case '/community':
				case '/community/detail':
				case '/cs':
				case '/account/join':
				case '/member':
				default:
					mediaType = 'none';
					break;
			}

			return { title, bgImage, mediaType, videoSrc };
		}, [router.pathname]);

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
						<title>Fairway</title>
						<meta name={'title'} content={`Fairway`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						{memoizedValues.mediaType !== 'none' && (
							<Stack
								className={`header-basic ${memoizedValues.mediaType === 'video' ? 'has-video' : ''}`}
								style={
									memoizedValues.mediaType === 'image'
										? {
												backgroundImage: `url(${memoizedValues.bgImage})`,
										  }
										: {}
								}
							>
								{memoizedValues.mediaType === 'video' && memoizedValues.videoSrc && (
									<video className="header-video" autoPlay muted loop playsInline poster={memoizedValues.bgImage}>
										<source src={memoizedValues.videoSrc} type="video/mp4" />
									</video>
								)}

								<Box className={'header-overlay'} />

								<Box className={'container'}>
									<strong>{memoizedValues.title}</strong>
								</Box>
							</Stack>
						)}

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

export default withLayoutBasic;
