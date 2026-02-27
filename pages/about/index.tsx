import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';
import { useRouter } from 'next/router';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BoltIcon from '@mui/icons-material/Bolt';

const About: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	}

	return (
		<Stack className={'about-page'}>
			<Stack className={'about-hero'}>
				<Box className={'hero-bg'} />
				<Stack className={'container'}>
					<Stack className={'hero-content'}>
						<span className={'hero-label'}>ABOUT FAIRWAY</span>
						<h1 className={'hero-title'}>
							Where Passion
							<br />
							Meets the <em>Fairway</em>
						</h1>
						<p className={'hero-desc'}>
							Fairway is Korea's premier golf community platform — connecting players, coaches, and pro shops in one
							seamless experience.
						</p>
						<Stack className={'hero-actions'}>
							<Box className={'btn-primary'} onClick={() => router.push('/product')}>
								Shop Equipment <ArrowForwardIcon />
							</Box>
							<Box className={'btn-secondary'} onClick={() => router.push('/events')}>
								Explore Events
							</Box>
						</Stack>
					</Stack>
					<Box className={'hero-image'}>
						<img src="/img/banner/hero2.jpg" alt="Fairway Golf" />
					</Box>
				</Stack>
			</Stack>

			{/** ── STATS ── **/}
			<Stack className={'about-stats'}>
				<Stack className={'container'}>
					{[
						{ value: '10K+', label: 'Active Players', icon: <PeopleIcon /> },
						{ value: '500+', label: 'Premium Products', icon: <StorefrontIcon /> },
						{ value: '200+', label: 'Events Hosted', icon: <EmojiEventsIcon /> },
						{ value: '50+', label: 'Pro Shops', icon: <GolfCourseIcon /> },
					].map((stat, i) => (
						<Stack key={i} className={'stat-item'}>
							<Box className={'stat-icon'}>{stat.icon}</Box>
							<strong className={'stat-value'}>{stat.value}</strong>
							<span className={'stat-label'}>{stat.label}</span>
						</Stack>
					))}
				</Stack>
			</Stack>

			{/** ── MISSION ── **/}
			<Stack className={'about-mission'}>
				<Stack className={'container'}>
					<Stack className={'mission-left'}>
						<span className={'section-label'}>OUR MISSION</span>
						<h2 className={'section-title'}>Elevating the Golf Experience for Everyone</h2>
						<p className={'section-desc'}>
							At Fairway, we believe golf is more than a sport — it's a lifestyle, a community, and a journey of
							constant improvement. We built this platform to make premium golf accessible to every player in Korea,
							from weekend enthusiasts to seasoned pros.
						</p>
						<p className={'section-desc'}>
							From sourcing the finest equipment to hosting world-class tournaments, we're committed to building the
							most vibrant golf community in Asia.
						</p>
						<Stack className={'mission-points'}>
							{[
								'Premium curated equipment from top global brands',
								'Expert coaching and tutorials from certified pros',
								'Exciting tournaments and community events',
								'Trusted network of verified pro shops',
							].map((point, i) => (
								<Stack key={i} className={'point'}>
									<CheckCircleOutlineIcon />
									<span>{point}</span>
								</Stack>
							))}
						</Stack>
					</Stack>
					<Stack className={'mission-right'}>
						<Box className={'mission-img-main'}>
							<img src="/img/banner/shop_hero_main.avif" alt="Golf Equipment" />
						</Box>
						<Box className={'mission-img-secondary'}>
							<img src="/img/banner/agents-store.png" alt="Golf Course" />
						</Box>
					</Stack>
				</Stack>
			</Stack>

			{/** ── VALUES ── **/}
			<Stack className={'about-values'}>
				<Stack className={'container'}>
					<Stack className={'values-header'}>
						<span className={'section-label'}>WHY FAIRWAY</span>
						<h2 className={'section-title'}>Built for Golfers, by Golfers</h2>
					</Stack>
					<Stack className={'values-grid'}>
						{[
							{
								icon: <GolfCourseIcon />,
								title: 'Curated Selection',
								desc: 'Every product on Fairway is hand-picked for quality, performance, and value. No compromises.',
							},
							{
								icon: <EmojiEventsIcon />,
								title: 'Elite Events',
								desc: 'From local meetups to national championships — we host events for every skill level.',
							},
							{
								icon: <PeopleIcon />,
								title: 'Trusted Community',
								desc: 'Connect with fellow golfers, follow your favorite pros, and share your journey.',
							},
							{
								icon: <VerifiedIcon />,
								title: 'Verified Pro Shops',
								desc: 'Every agent on our platform is verified, ensuring authentic products and expert advice.',
							},
							{
								icon: <MenuBookIcon />,
								title: 'Expert Knowledge',
								desc: "Access tutorials, tips, and insights from Korea's top golf professionals.",
							},
							{
								icon: <BoltIcon />,
								title: 'Fast & Reliable',
								desc: 'Seamless shopping, instant booking, and real-time updates — all in one platform.',
							},
						].map((val, i) => (
							<Stack key={i} className={'value-card'}>
								<Box className={'value-icon'}>{val.icon}</Box>
								<strong className={'value-title'}>{val.title}</strong>
								<p className={'value-desc'}>{val.desc}</p>
							</Stack>
						))}
					</Stack>
				</Stack>
			</Stack>

			{/** ── CTA ── **/}
			<Stack className={'about-cta'}>
				<Stack className={'container'}>
					<Stack className={'cta-content'}>
						<span className={'section-label'}>JOIN THE COMMUNITY</span>
						<h2 className={'cta-title'}>Ready to Elevate Your Game?</h2>
						<p className={'cta-desc'}>
							Join thousands of golfers already on Fairway. Shop premium gear, book events, and connect with the best
							golf community in Korea.
						</p>
						<Stack className={'cta-actions'}>
							<Box className={'btn-primary'} onClick={() => router.push('/account/join')}>
								Get Started Today <ArrowForwardIcon />
							</Box>
							<Box className={'btn-outline'} onClick={() => router.push('/cs')}>
								Contact Us
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(About);
