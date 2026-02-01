import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import TrendingProducts from '../libs/components/homepage/TrendingProducts';
import Advertisement from '../libs/components/homepage/Advertisement';
import Events from '../libs/components/homepage/Events';
import TopAgents from '../libs/components/homepage/TopAgents';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendingProducts />
				<Advertisement />
				<Events />
				<TopAgents />
				<CommunityBoards />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				{/* TRENDING PRODUCTS - Manors style cards */}
				<TrendingProducts />

				{/* ADVERTISEMENT VIDEO */}
				<Advertisement />

				{/* UPCOMING EVENTS - Manors journal style */}
				<Events />

				{/* TOP AGENTS */}
				<TopAgents />

				{/* COMMUNITY BOARDS */}
				<CommunityBoards />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
