import React, { useEffect, useState } from 'react';
import { Pagination, Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar, useMutation } from '@apollo/client';
import { GET_EVENTS, GET_MY_RESERVATIONS } from '../../../apollo/user/query';
import { LIKE_TARGET_EVENT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { Event } from '../../types/event/event';
import { EventReservation } from '../../types/event-reservation/event-reservation';
import { EventReservationsInquiry } from '../../types/event-reservation/event-reservation.input';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Direction, Message } from '../../enums/common.enum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import moment from 'moment';

interface MemberEventsProps {
	initialInput: {
		page: number;
		limit: number;
		sort: string;
		direction: string;
		search: Record<string, string>;
	};
}

const MemberEvents = ({ initialInput }: MemberEventsProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { memberId } = router.query;
	const isOwnProfile = !memberId || memberId === user._id;
	const memberType = isOwnProfile ? user.memberType : null;

	const [events, setEvents] = useState<Event[]>([]);
	const [reservations, setReservations] = useState<EventReservation[]>([]);
	const [total, setTotal] = useState<number>(0);

	const [searchFilter, setSearchFilter] = useState({
		...initialInput,
		search: { memberId: memberId as string },
	});

	const [reservationFilter, setReservationFilter] = useState<EventReservationsInquiry>({
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	});

	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { refetch: refetchEvents } = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		skip: !memberId || memberType === 'USER',
		onCompleted: (data: T) => {
			setEvents(data?.getEvents?.list || []);
			setTotal(data?.getEvents?.metaCounter[0]?.total || 0);
		},
	});

	useQuery(GET_MY_RESERVATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: reservationFilter },
		skip: memberType !== 'USER' || !isOwnProfile,
		onCompleted: (data: T) => {
			setReservations(data?.getMyReservations?.list || []);
			setTotal(data?.getMyReservations?.metaCounter[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (memberId) {
			setSearchFilter((prev) => ({ ...prev, search: { memberId: memberId as string } }));
		}
	}, [memberId]);

	const likeHandler = async (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetEvent({ variables: { input: id } });
			await refetchEvents();
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	if (memberType === 'USER' && isOwnProfile) {
		return (
			<div id="member-events">
				<Stack className="section-header">
					<Typography className="section-title">My Reservations</Typography>
					<Typography className="section-count">{total} reservations</Typography>
				</Stack>

				{reservations.length === 0 && (
					<Stack className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="" />
						<Typography>No reservations yet!</Typography>
					</Stack>
				)}

				<Stack className="events-blocks">
					{reservations.map((reservation: EventReservation) => {
						const event = reservation.eventData;
						const img = event?.eventImages?.[0] ? `${event.eventImages[0]}` : '/img/banner/hero_shop6.jpg';

						return (
							<Stack
								key={reservation._id}
								className="event-block"
								onClick={() => router.push(`/event/detail?id=${event?._id}`)}
							>
								<Box className="block-image">
									<img src={img} alt={event?.eventTitle} />
									<Box className={`reservation-status ${reservation.reservationStatus?.toLowerCase()}`}>
										{reservation.reservationStatus}
									</Box>
								</Box>
								<Stack className="block-info">
									<Typography className="block-name">{event?.eventTitle}</Typography>
									<Stack className="block-meta-row">
										<LocationOnIcon />
										<span>{event?.eventLocation}</span>
									</Stack>
									<Stack className="block-meta-row">
										<CalendarTodayIcon />
										<span>{moment(reservation.participationDate).format('MMM DD, YYYY')}</span>
									</Stack>
									<Stack className="block-meta-row">
										<PeopleIcon />
										<span>{reservation.numberOfPeople} people</span>
									</Stack>
								</Stack>
							</Stack>
						);
					})}
				</Stack>

				{total > reservationFilter.limit && (
					<Stack className="pagination-config">
						<Pagination
							count={Math.ceil(total / reservationFilter.limit)}
							page={reservationFilter.page}
							shape="circular"
							color="primary"
							onChange={(_e, val) => setReservationFilter({ ...reservationFilter, page: val })}
						/>
					</Stack>
				)}
			</div>
		);
	}

	return (
		<div id="member-events">
			<Stack className="section-header">
				<Typography className="section-title">Events</Typography>
				<Typography className="section-count">{total} events</Typography>
			</Stack>

			{events.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No events found!</Typography>
				</Stack>
			)}

			<Stack className="events-blocks">
				{events.map((event: Event) => {
					const img = event.eventImages?.[0] ? `${event.eventImages[0]}` : '/img/banner/hero_shop6.jpg';
					const isLiked = event?.meLiked?.[0]?.myFavorite;

					return (
						<Stack key={event._id} className="event-block" onClick={() => router.push(`/event/detail?id=${event._id}`)}>
							<Box className="block-image">
								<img src={img} alt={event.eventTitle} />
								<Box
									className={`block-like ${isLiked ? 'liked' : ''}`}
									onClick={(e: React.MouseEvent) => likeHandler(e, event._id)}
								>
									{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
									<span>{event.eventLikes}</span>
								</Box>
							</Box>
							<Stack className="block-info">
								<Typography className="block-name">{event.eventTitle}</Typography>
								<Stack className="block-meta-row">
									<LocationOnIcon />
									<span>{event.eventLocation}</span>
								</Stack>
								<Stack className="block-meta-row">
									<CalendarTodayIcon />
									<span>
										{moment(event.eventPeriod?.startDate).format('MMM DD')} -{' '}
										{moment(event.eventPeriod?.endDate).format('MMM DD, YYYY')}
									</span>
								</Stack>
							</Stack>
						</Stack>
					);
				})}
			</Stack>

			{total > searchFilter.limit && (
				<Stack className="pagination-config">
					<Pagination
						count={Math.ceil(total / searchFilter.limit)}
						page={searchFilter.page}
						shape="circular"
						color="primary"
						onChange={(_e, val) => setSearchFilter({ ...searchFilter, page: val })}
					/>
				</Stack>
			)}
		</div>
	);
};

MemberEvents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MemberEvents;
