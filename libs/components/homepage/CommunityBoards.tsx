import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { T } from '../../types/common';

const CommunityBoards = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [communityArticles, setCommunityArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		error: getArticlesError,
		refetch: getArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 6, sort: 'articleViews', direction: 'DESC', search: {} } },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setCommunityArticles(data?.getBoardArticles?.list);
		},
	});

	/** HANDLERS **/
	const handleViewAll = () => {
		router.push('/community');
	};

	if (device === 'mobile') {
		return (
			<Stack className={'community-board'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'title-box'}>
						<h2>Community Highlights</h2>
					</Box>
					<Stack className={'card-box'}>
						<Swiper
							className={'community-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={20}
							modules={[Autoplay]}
						>
							{communityArticles.map((article: BoardArticle) => (
								<SwiperSlide key={article._id} className={'community-slide'}>
									<CommunityCard article={article} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'community-board'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Community Highlights</span>
							<p>Latest stories and insights from our golf community</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Stack className={'pagination-box'}>
								<WestIcon className={'swiper-community-prev'} />
								<EastIcon className={'swiper-community-next'} />
							</Stack>
						</Box>
					</Stack>

					<Stack className={'card-box'}>
						<Swiper
							className={'community-swiper'}
							slidesPerView={'auto'}
							spaceBetween={25}
							modules={[Autoplay, Navigation, Mousewheel]}
							navigation={{
								nextEl: '.swiper-community-next',
								prevEl: '.swiper-community-prev',
							}}
							mousewheel={{
								forceToAxis: true,
								sensitivity: 1,
								releaseOnEdges: true,
							}}
							grabCursor={true}
						>
							{communityArticles.map((article: BoardArticle) => (
								<SwiperSlide key={article._id} className={'community-slide'}>
									<CommunityCard article={article} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CommunityBoards;
