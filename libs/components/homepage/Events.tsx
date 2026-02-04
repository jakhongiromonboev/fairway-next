import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import EventCard from './EventCard';
import { Event } from '../../types/event/event';
import { EventType, EventStatus, EventLocation } from '../../enums/event.enum';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

// TODO: Uncomment after Apollo setup
// import { GET_EVENTS } from '../../../apollo/user/query';
// import { LIKE_TARGET_EVENT } from '../../../apollo/user/mutation';

const UpcomingEvents = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	// STATIC MOCK DATA - Remove after Apollo integration
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
		{
			_id: '1',
			eventType: EventType.TOURNAMENT,
			eventStatus: EventStatus.UPCOMING,
			eventTitle: 'Pebble Beach Pro-Am Championship',
			eventLocation: EventLocation.BUSAN,
			eventAddress: 'Pebble Beach Golf Links, Monterey, CA',
			eventDesc:
				'Join us for the prestigious Pebble Beach Pro-Am, featuring professional and amateur golfers competing on one of the most iconic courses in the world.',
			eventImages: ['/img/events/event-example1.jpg', '/img/events/event-example2.webp'],
			eventPeriod: {
				startDate: new Date('2026-03-15'),
				endDate: new Date('2026-03-18'),
			},
			eventAvailableDates: [],
			eventViews: 4520,
			eventLikes: 892,
			eventComments: 124,
			eventRank: 28,
			memberId: 'agent1',
			createdAt: new Date('2026-02-01'),
			updatedAt: new Date('2026-02-01'),
		},
		{
			_id: '2',
			eventType: EventType.WORKSHOP,
			eventStatus: EventStatus.UPCOMING,
			eventTitle: 'Golf Swing Masterclass with Tiger Woods',
			eventLocation: EventLocation.BUSAN,
			eventAddress: 'TPC Sawgrass, Ponte Vedra Beach, FL',
			eventDesc:
				'Learn from the legend himself! Tiger Woods will be hosting an exclusive 2-day masterclass covering swing mechanics, mental game, and course strategy.',
			eventImages: ['/img/events/event-example1.webp', '/img/events/event-example2.webp'],
			eventPeriod: {
				startDate: new Date('2026-04-10'),
				endDate: new Date('2026-04-11'),
			},
			eventAvailableDates: [],
			eventViews: 6234,
			eventLikes: 1456,
			eventComments: 203,
			eventRank: 32,
			memberId: 'agent2',
			createdAt: new Date('2026-01-28'),
			updatedAt: new Date('2026-01-28'),
		},
		{
			_id: '3',
			eventType: EventType.TOURNAMENT,
			eventStatus: EventStatus.UPCOMING,
			eventTitle: 'Augusta National Member-Guest Tournament',
			eventLocation: EventLocation.BUSAN,
			eventAddress: 'Augusta National Golf Club, Augusta, GA',
			eventDesc:
				'Experience the beauty and challenge of Augusta National in this exclusive member-guest tournament. Limited spots available.',
			eventImages: ['/img/events/event-example1.jpg', '/img/events/event-example2.webp'],
			eventPeriod: {
				startDate: new Date('2026-05-20'),
				endDate: new Date('2026-05-22'),
			},
			eventAvailableDates: [],
			eventViews: 5890,
			eventLikes: 1123,
			eventComments: 178,
			eventRank: 30,
			memberId: 'agent3',
			createdAt: new Date('2026-01-25'),
			updatedAt: new Date('2026-01-25'),
		},
		{
			_id: '4',
			eventType: EventType.MEETUP,
			eventStatus: EventStatus.UPCOMING,
			eventTitle: 'Junior Golf Development Camp',
			eventLocation: EventLocation.BUSAN,
			eventAddress: 'Colonial Country Club, Fort Worth, TX',
			eventDesc:
				'A week-long camp for junior golfers aged 10-18 to develop their skills, learn from PGA professionals, and make lifelong friends.',
			eventImages: ['/img/events/event-example1.jpg', '/img/events/event-example2.webp'],
			eventPeriod: {
				startDate: new Date('2026-06-15'),
				endDate: new Date('2026-06-21'),
			},
			eventAvailableDates: [],
			eventViews: 3421,
			eventLikes: 678,
			eventComments: 95,
			eventRank: 22,
			memberId: 'agent4',
			createdAt: new Date('2026-01-22'),
			updatedAt: new Date('2026-01-22'),
		},
	]);

	/** APOLLO REQUESTS **/
	// TODO: Uncomment and configure after backend connection
	// const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	// const {
	// 	loading: getEventsLoading,
	// 	data: getEventsData,
	// 	error: getEventsError,
	// 	refetch: getEventsRefetch,
	// } = useQuery(GET_EVENTS, {
	// 	fetchPolicy: 'cache-and-network',
	// 	variables: {
	//		input: {
	//			page: 1,
	//			limit: 8,
	//			sort: 'eventViews',
	//			direction: 'DESC',
	//			search: {},
	//		}
	//	},
	// 	notifyOnNetworkStatusChange: true,
	// 	onCompleted: (data: T) => {
	// 		setUpcomingEvents(data?.getEvents?.list);
	// 	},
	// });

	/** HANDLERS **/
	const likeEventHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// TODO: Uncomment after Apollo setup
			// await likeTargetEvent({ variables: { input: id } });
			// await getEventsRefetch({ input: initialInput });

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
									<EventCard event={event} likeEventHandler={likeEventHandler} />
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
									<EventCard event={event} likeEventHandler={likeEventHandler} />
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
