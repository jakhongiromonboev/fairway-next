import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_EVENT_RESERVATION } from '../../../apollo/user/mutation';
import { Event } from '../../types/event/event';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { Messages } from '../../config';
import { useRouter } from 'next/router';
import Moment from 'react-moment';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

interface ReservationModalProps {
	event: Event;
	open: boolean;
	onClose: () => void;
	memberId: string;
}

const ReservationModal = ({ event, open, onClose, memberId }: ReservationModalProps) => {
	const router = useRouter();
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
	const [reserving, setReserving] = useState<boolean>(false);

	const [createReservation] = useMutation(CREATE_EVENT_RESERVATION);

	useEffect(() => {
		if (open) {
			setSelectedDate(null);
			setNumberOfPeople(1);
		}
	}, [open]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [onClose]);

	useEffect(() => {
		if (open) document.body.style.overflow = 'hidden';
		else document.body.style.overflow = '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	const availableDates = [...(event.eventAvailableDates ?? [])].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	const selectedSlot = selectedDate
		? availableDates.find((d) => {
				const s = new Date(d.date);
				s.setUTCHours(0, 0, 0, 0);
				const sel = new Date(selectedDate);
				sel.setUTCHours(0, 0, 0, 0);
				return s.getTime() === sel.getTime();
		  })
		: null;

	const maxPeople = selectedSlot ? selectedSlot.capacity - selectedSlot.booked : 1;

	const reserveHandler = async () => {
		try {
			if (!memberId) throw new Error(Messages.error2);
			if (!selectedDate) throw new Error('Please select a date');
			if (reserving) return;
			setReserving(true);

			await createReservation({
				variables: {
					input: {
						eventId: event._id,
						participationDate: new Date(selectedDate),
						numberOfPeople,
					},
				},
			});

			await sweetMixinSuccessAlert('Reservation confirmed!');
			onClose();
			router.push('/mypage?tab=reservations');
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setReserving(false);
		}
	};

	if (!open) return null;

	return (
		<div className="reservation-modal-overlay" onClick={onClose}>
			<div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<div className="modal-header-info">
						<p className="modal-event-type">{event.eventType}</p>
						<h2 className="modal-event-title">{event.eventTitle}</h2>
						<div className="modal-event-meta">
							<span>
								<LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
								{event.eventLocation}
							</span>
							<span>
								<CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
								<Moment format="MMM DD">{event.eventPeriod?.startDate}</Moment>
								{' – '}
								<Moment format="MMM DD, YYYY">{event.eventPeriod?.endDate}</Moment>
							</span>
						</div>
					</div>
					<button className="modal-close-btn" onClick={onClose}>
						<CloseIcon sx={{ fontSize: 20 }} />
					</button>
				</div>

				<div className="modal-body">
					<div className="modal-section">
						<p className="modal-section-label">Select Date</p>
						<div className="modal-date-grid">
							{availableDates.map((slot, idx) => {
								const spotsLeft = slot.capacity - slot.booked;
								const isFull = spotsLeft <= 0;
								const dateStr = new Date(slot.date).toISOString().split('T')[0];
								const isSelected = selectedDate === dateStr;

								return (
									<button
										key={idx}
										className={`modal-date-btn ${isSelected ? 'selected' : ''} ${isFull ? 'full' : ''}`}
										onClick={() => {
											if (!isFull) {
												setSelectedDate(dateStr);
												setNumberOfPeople(1);
											}
										}}
										disabled={isFull}
									>
										<span className="modal-date-day">
											<Moment format="ddd">{slot.date}</Moment>
										</span>
										<span className="modal-date-num">
											<Moment format="MMM DD">{slot.date}</Moment>
										</span>
										<span className="modal-date-spots">{isFull ? 'Full' : `${spotsLeft} left`}</span>
									</button>
								);
							})}
						</div>
					</div>

					{selectedDate && (
						<div className="modal-section">
							<p className="modal-section-label">
								Number of People
								<span className="modal-section-sub"> · {maxPeople} spots available</span>
							</p>
							<div className="modal-people-row">
								<div className="modal-counter">
									<button
										className="modal-counter-btn"
										onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
										disabled={numberOfPeople <= 1}
									>
										<RemoveIcon sx={{ fontSize: 16 }} />
									</button>
									<span className="modal-counter-val">{numberOfPeople}</span>
									<button
										className="modal-counter-btn"
										onClick={() => setNumberOfPeople(Math.min(maxPeople, numberOfPeople + 1))}
										disabled={numberOfPeople >= maxPeople}
									>
										<AddIcon sx={{ fontSize: 16 }} />
									</button>
								</div>
								<div className="modal-summary">
									<PeopleOutlineIcon sx={{ fontSize: 14 }} />
									<span>
										{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'} on{' '}
										<Moment format="MMM DD, YYYY">{selectedDate}</Moment>
									</span>
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="modal-footer">
					<button className="modal-cancel-btn" onClick={onClose}>
						Cancel
					</button>
					<button
						className={`modal-confirm-btn ${!selectedDate || reserving ? 'disabled' : ''}`}
						onClick={reserveHandler}
						disabled={!selectedDate || reserving}
					>
						{reserving ? 'Confirming...' : 'Confirm Reservation'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ReservationModal;
