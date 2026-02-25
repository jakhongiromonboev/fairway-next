import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import UpcomingEventCard from './EventCard';
import { Event } from '../../types/event/event';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { GET_EVENTS } from '../../../apollo/user/query';
import { LIKE_TARGET_EVENT } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { Messages } from '../../config';

const UpcomingEvents = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT, {
		refetchQueries: [GET_EVENTS],
	});

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 8,
				sort: 'eventViews',
				direction: 'DESC',
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setUpcomingEvents(data?.getEvents?.list);
		},
	});

	/** HANDLERS **/
	const likeEventHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetEvent({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error: likeEventHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleViewAll = () => {
		router.push('/events');
	};

	if (device === 'mobile') {
		return (
			<Stack className={'upcoming-events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Upcoming Events</span>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'upcoming-event-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{upcomingEvents.map((event: Event) => (
								<SwiperSlide key={event._id} className={'upcoming-event-slide'}>
									<UpcomingEventCard event={event} likeEventHandler={likeEventHandler} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'upcoming-events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Upcoming Events</span>
							<p>Join exclusive golf tournaments and workshops</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Stack className={'pagination-box'}>
								<WestIcon className={'swiper-events-prev'} />
								<EastIcon className={'swiper-events-next'} />
							</Stack>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'upcoming-event-swiper'}
							slidesPerView={'auto'}
							spaceBetween={30}
							modules={[Autoplay, Navigation, Mousewheel]}
							navigation={{
								nextEl: '.swiper-events-next',
								prevEl: '.swiper-events-prev',
							}}
							mousewheel={{
								forceToAxis: true,
								sensitivity: 1,
								releaseOnEdges: true,
							}}
							grabCursor={true}
						>
							{upcomingEvents.map((event: Event) => (
								<SwiperSlide key={event._id} className={'upcoming-event-slide'}>
									<UpcomingEventCard event={event} likeEventHandler={likeEventHandler} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default UpcomingEvents;
