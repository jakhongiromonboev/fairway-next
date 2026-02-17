import React, { useState } from 'react';
import { Stack, Typography, Box, Pagination } from '@mui/material';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_AGENT_EVENTS } from '../../../apollo/user/query';
import { UPDATE_EVENT } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { Event } from '../../types/event/event';
import { EventsInquiry } from '../../types/event/event.input';
import { EventStatus } from '../../enums/event.enum';
import { T } from '../../types/common';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import moment from 'moment';

const MyEvents = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [events, setEvents] = useState<Event[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<EventsInquiry>(initialInput);
	const [activeStatus, setActiveStatus] = useState<EventStatus>(EventStatus.UPCOMING);

	/** APOLLO REQUEST **/
	const [updateEvent] = useMutation(UPDATE_EVENT);

	const {
		loading: getAgentEventsLoading,
		data: getAgentEventsData,
		refetch: getAgentEventsRefetch,
	} = useQuery(GET_AGENT_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEvents(data?.getAgentEvents?.list || []);
			setTotal(data?.getAgentEvents?.metaCounter[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const changeStatusHandler = (status: EventStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { eventStatus: status },
		});
	};

	const updateEventHandler = async (id: string, status: EventStatus) => {
		try {
			const confirm = await sweetConfirmAlert(status === EventStatus.ENDED ? 'Mark as ended?' : 'Delete this event?');
			if (!confirm) return;

			await updateEvent({
				variables: {
					input: {
						_id: id,
						eventStatus: status,
					},
				},
			});

			await getAgentEventsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const editEventHandler = (id: string) => {
		router.push({
			pathname: '/mypage',
			query: { category: 'addEvent', eventId: id },
		});
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
		return null;
	}

	if (device === 'mobile') {
		return <div>MY EVENTS MOBILE</div>;
	}

	return (
		<div id="my-events-page">
			<Stack className="page-header">
				<Stack className="header-left">
					<Typography className="page-title">My Events</Typography>
					<Typography className="page-subtitle">{total} events total</Typography>
				</Stack>
				<Box className="add-btn" onClick={() => router.push({ pathname: '/mypage', query: { category: 'addEvent' } })}>
					+ Add Event
				</Box>
			</Stack>

			<Stack className="status-tabs">
				{[EventStatus.UPCOMING, EventStatus.ACTIVE, EventStatus.ENDED].map((status) => (
					<Box
						key={status}
						className={`status-tab ${searchFilter.search.eventStatus === status ? 'active' : ''}`}
						onClick={() => changeStatusHandler(status)}
					>
						{status}
					</Box>
				))}
			</Stack>

			{events.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No events found!</Typography>
				</Stack>
			)}

			{events.length > 0 && (
				<Stack className="events-grid">
					{events.map((event: Event) => {
						const img = event.eventImages?.[0] ? event.eventImages[0] : '/img/banner/event.webp';

						const startDate = moment(event.eventPeriod.startDate).format('MMM DD');
						const endDate = moment(event.eventPeriod.endDate).format('MMM DD, YYYY');

						return (
							<Stack key={event._id} className="event-card">
								<Box className="card-image">
									<img src={img} alt={event.eventTitle} />
									<Box className={`card-status ${event.eventStatus.toLowerCase()}`}>{event.eventStatus}</Box>
								</Box>

								<Stack className="card-info">
									<Typography className="card-name">{event.eventTitle}</Typography>
									<Typography className="card-meta">
										{event.eventType} · {event.eventLocation}
									</Typography>
									<Typography className="card-date">
										{startDate} - {endDate}
									</Typography>
									<Stack className="card-bottom">
										<Stack className="card-stats">
											<Stack className="stat">
												<VisibilityOutlinedIcon />
												<span>{event.eventViews ?? 0}</span>
											</Stack>
											<Stack className="stat">
												<FavoriteBorderIcon />
												<span>{event.eventLikes ?? 0}</span>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								<Stack className="card-actions">
									<Box className="action-btn edit" onClick={() => editEventHandler(event._id)}>
										<EditOutlinedIcon />
										<Typography>Edit</Typography>
									</Box>
									{event.eventStatus === EventStatus.UPCOMING && (
										<Box className="action-btn ended" onClick={() => updateEventHandler(event._id, EventStatus.ENDED)}>
											<Typography>Mark Ended</Typography>
										</Box>
									)}
									<Box className="action-btn delete" onClick={() => updateEventHandler(event._id, EventStatus.DELETE)}>
										<DeleteOutlineIcon />
									</Box>
								</Stack>
							</Stack>
						);
					})}
				</Stack>
			)}

			{/* PAGINATION */}
			{total > searchFilter.limit && (
				<Stack className="pagination-config">
					<Pagination
						page={searchFilter.page}
						count={Math.ceil(total / searchFilter.limit)}
						shape="circular"
						color="primary"
						onChange={(_e, val) => setSearchFilter({ ...searchFilter, page: val })}
					/>
				</Stack>
			)}
		</div>
	);
};

MyEvents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MyEvents;
