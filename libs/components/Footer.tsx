import React from 'react';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/router';

const Footer = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="Fairway" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Customer Support</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Email Us</span>
							<p>support@fairway.com</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Shop</strong>
								<span onClick={() => router.push('/products')}>Golf Clubs</span>
								<span onClick={() => router.push('/products')}>Golf Balls</span>
								<span onClick={() => router.push('/products')}>Apparel</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span onClick={() => router.push('/about')}>About Us</span>
								<span onClick={() => router.push('/events')}>Events</span>
								<span onClick={() => router.push('/agents')}>Pro Shops</span>
								<span onClick={() => router.push('/cs')}>Contact</span>
							</div>
							<div>
								<strong>Locations</strong>
								<span>Seoul</span>
								<span>Busan</span>
								<span>Incheon</span>
								<span>Daegu</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Fairway - All rights reserved. {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/Fairway-logo_main.png" alt="Fairway" className={'logo'} />
							<p className={'tagline'}>Premium golf equipment and experiences</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Customer Support</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>Email Us</span>
							<p>support@fairway.com</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>Follow Us</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'top'}>
							<strong>Stay Updated</strong>
							<div className={'newsletter-box'}>
								<input type="text" placeholder={'Your Email'} />
								<span>Subscribe</span>
							</div>
						</Box>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Shop</strong>
								<span onClick={() => router.push('/products?category=CLUB')}>Golf Clubs</span>
								<span onClick={() => router.push('/products?category=BALL')}>Golf Balls</span>
								<span onClick={() => router.push('/products?category=BAG')}>Golf Bags</span>
								<span onClick={() => router.push('/products?category=CLOTHING')}>Apparel</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span onClick={() => router.push('/about')}>About Us</span>
								<span onClick={() => router.push('/events')}>Events</span>
								<span onClick={() => router.push('/agents')}>Pro Shops</span>
								<span onClick={() => router.push('/community')}>Community</span>
								<span onClick={() => router.push('/cs')}>Contact</span>
							</div>
							<div>
								<strong>Locations</strong>
								<span>Seoul</span>
								<span>Busan</span>
								<span>Incheon</span>
								<span>Daegu</span>
								<span>Gyeonggi-do</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Fairway {moment().year()} - All rights reserved.</span>
					<span>Privacy • Terms • Sitemap</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
