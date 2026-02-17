import React, { useState } from 'react';
import { Stack, Typography, Box, Pagination } from '@mui/material';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_MY_RESERVATIONS } from '../../../apollo/user/query';
import { CANCEL_RESERVATION } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { EventReservation } from '../../types/event-reservation/event-reservation';
import { EventReservationsInquiry } from '../../types/event-reservation/event-reservation.input';
import { ReservationStatus } from '../../enums/event.enum';
import { T } from '../../types/common';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import moment from 'moment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CancelIcon from '@mui/icons-material/Cancel';

const MyReservations = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [reservations, setReservations] = useState<EventReservation[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<EventReservationsInquiry>(initialInput);

	/** APOLLO REQUESTS **/
	const [cancelReservation] = useMutation(CANCEL_RESERVATION);

	const {
		loading: getMyReservationsLoading,
		data: getMyReservationsData,
		refetch: getMyReservationsRefetch,
	} = useQuery(GET_MY_RESERVATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setReservations(data?.getMyReservations?.list || []);
			setTotal(data?.getMyReservations?.metaCounter[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const changeStatusHandler = (status: ReservationStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { reservationStatus: status },
		});
	};

	const cancelReservationHandler = async (id: string) => {
		try {
			const confirm = await sweetConfirmAlert('Cancel this reservation?');
			if (!confirm) return;

			await cancelReservation({ variables: { input: id } });
			await getMyReservationsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Reservation cancelled', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const viewEventHandler = (eventId: string) => {
		router.push({
			pathname: '/event/detail',
			query: { id: eventId },
		});
	};

	if (device === 'mobile') {
		return <div>MY RESERVATIONS MOBILE</div>;
	}

	return (
		<div id="my-reservations-page">
			<Stack className="page-header">
				<Stack className="header-left">
					<Typography className="page-title">My Reservations</Typography>
					<Typography className="page-subtitle">{total} reservations total</Typography>
				</Stack>
			</Stack>

			<Stack className="status-tabs">
				{[ReservationStatus.CONFIRMED, ReservationStatus.ATTENDED, ReservationStatus.CANCELLED].map((status) => (
					<Box
						key={status}
						className={`status-tab ${searchFilter.search.reservationStatus === status ? 'active' : ''}`}
						onClick={() => changeStatusHandler(status)}
					>
						{status}
					</Box>
				))}
			</Stack>

			{reservations.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No reservations found!</Typography>
				</Stack>
			)}

			{reservations.length > 0 && (
				<Stack className="reservations-grid">
					{reservations.map((reservation: EventReservation) => {
						const event = reservation.eventData;
						if (!event) return null;

						const img = event.eventImages?.[0] ? event.eventImages[0] : '/img/banner/event.webp';
						const participationDate = moment(reservation.participationDate).format('MMM DD, YYYY');

						return (
							<Stack key={reservation._id} className="reservation-card">
								<Box className="card-image" onClick={() => viewEventHandler(event._id)}>
									<img src={img} alt={event.eventTitle} />
									<Box className={`card-status ${reservation.reservationStatus.toLowerCase()}`}>
										{reservation.reservationStatus}
									</Box>
								</Box>

								<Stack className="card-info">
									<Typography className="card-name">{event.eventTitle}</Typography>
									<Typography className="card-meta">
										{event.eventType} · {event.eventLocation}
									</Typography>
									<Stack className="card-details">
										<Stack className="detail-row">
											<EventAvailableIcon />
											<Typography>{participationDate}</Typography>
										</Stack>
										<Stack className="detail-row">
											<Typography className="people-count">
												{reservation.numberOfPeople} {reservation.numberOfPeople > 1 ? 'people' : 'person'}
											</Typography>
										</Stack>
									</Stack>
								</Stack>

								<Stack className="card-actions">
									<Box className="action-btn view" onClick={() => viewEventHandler(event._id)}>
										<Typography>View Event</Typography>
									</Box>
									{reservation.reservationStatus === ReservationStatus.CONFIRMED && (
										<Box className="action-btn cancel" onClick={() => cancelReservationHandler(reservation._id)}>
											<CancelIcon />
										</Box>
									)}
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

MyReservations.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: { reservationStatus: ReservationStatus.CONFIRMED },
	},
};

export default MyReservations;
