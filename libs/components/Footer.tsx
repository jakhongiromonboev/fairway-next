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
							<img src="/img/logo/Fairway-logo_main.png" alt="Fairway" className={'logo'} />
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
					{/* LEFT: BRAND + SOCIAL ONLY */}
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box logo-section'}>
							<img src="/img/logo/Fairway-logo_main.png" alt="Fairway" className={'logo'} />
							<p className={'tagline'}>
								Premium golf equipment, expert coaching, and unforgettable tournament experiences.
							</p>
						</Box>

						<Box component={'div'} className={'footer-box social-section'}>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>

					{/* RIGHT: COLUMNS FIRST, NEWSLETTER AT BOTTOM */}
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div className={'footer-column'}>
								<strong>Shop</strong>
								<span onClick={() => router.push('/products?productCategory=CLUB')}>Golf Clubs</span>
								<span onClick={() => router.push('/products?productCategory=BALL')}>Golf Balls</span>
								<span onClick={() => router.push('/products?productCategory=BAG')}>Golf Bags</span>
								<span onClick={() => router.push('/products?productCategory=CLOTHING')}>Apparel</span>
								<span onClick={() => router.push('/products')}>Accessories</span>
							</div>
							<div className={'footer-column'}>
								<strong>Discover</strong>
								<span onClick={() => router.push('/about')}>About Us</span>
								<span onClick={() => router.push('/events')}>Events</span>
								<span onClick={() => router.push('/agents')}>Pro Shops</span>
								<span onClick={() => router.push('/community')}>Community</span>
								<span onClick={() => router.push('/cs')}>Contact</span>
							</div>
							<div className={'footer-column'}>
								<strong>Locations</strong>
								<span>Seoul</span>
								<span>Busan</span>
								<span>Incheon</span>
								<span>Daegu</span>
								<span>Gyeonggi-do</span>
							</div>
							<div className={'footer-column'}>
								<strong>Contact</strong>
								<p className={'contact-info'}>
									<span className={'contact-label'}>Customer Support</span>
									+82 10 4867 2909
								</p>
								<p className={'contact-info'}>
									<span className={'contact-label'}>Email Us</span>
									support@fairway.com
								</p>
							</div>
						</Box>

						<Box component={'div'} className={'newsletter-box'}>
							<strong className={'section-title'}>Stay Updated</strong>
							<div className={'newsletter-input'}>
								<input type="email" placeholder="your@email.com" />
								<button className={'subscribe-btn'}>Subscribe</button>
							</div>
						</Box>
					</Stack>
				</Stack>

				{/* FOOTER BOTTOM */}
				<Stack className={'second'}>
					<span>© Fairway {moment().year()} - All rights reserved.</span>
					<div className={'footer-bottom-links'}>
						<span onClick={() => router.push('/privacy')}>Privacy</span>
						<span onClick={() => router.push('/terms')}>Terms</span>
						<span onClick={() => router.push('/sitemap')}>Sitemap</span>
					</div>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
