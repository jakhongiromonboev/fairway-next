import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_EVENT, UPDATE_EVENT } from '../../../apollo/user/mutation';
import { GET_EVENT } from '../../../apollo/user/query';
import { EventInput } from '../../types/event/event.input';
import { EventUpdate } from '../../types/event/event.update';
import { EventType, EventLocation } from '../../enums/event.enum';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import axios from 'axios';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';

const EVENT_TYPES = Object.values(EventType);
const LOCATIONS = Object.values(EventLocation);

const AddEvent = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const inputRef = useRef<any>(null);
	const eventId = router.query?.eventId as string;

	const [insertEventData, setInsertEventData] = useState<EventInput>(initialValues);
	const [loading, setLoading] = useState<boolean>(false);

	/** APOLLO REQUESTS **/
	const [createEvent] = useMutation(CREATE_EVENT);
	const [updateEvent] = useMutation(UPDATE_EVENT);

	const {
		loading: getEventLoading,
		data: getEventData,
		error: getEventError,
		refetch: getEventRefetch,
	} = useQuery(GET_EVENT, {
		fetchPolicy: 'cache-and-network',
		variables: { input: eventId },
		skip: !eventId,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (getEventData?.getEvent) {
			const e = getEventData.getEvent;
			setInsertEventData({
				...insertEventData,
				eventType: e.eventType,
				eventTitle: e.eventTitle,
				eventLocation: e.eventLocation,
				eventAddress: e.eventAddress,
				eventDesc: e.eventDesc || '',
				eventImages: e.eventImages || [],
				eventPeriod: {
					startDate: new Date(e.eventPeriod.startDate),
					endDate: new Date(e.eventPeriod.endDate),
				},
				dailyCapacity: e.eventAvailableDates[0]?.capacity || 50,
				dailyStartTime: e.eventAvailableDates[0]?.startTime || '09:00',
				dailyEndTime: e.eventAvailableDates[0]?.endTime || '17:00',
			});
		}
	}, [getEventLoading, getEventData]);

	/** HANDLERS **/
	const doDisabledCheck = () => {
		if (
			insertEventData.eventTitle === '' ||
			insertEventData.eventAddress === '' ||
			(insertEventData.eventImages || []).length === 0 ||
			!insertEventData.eventPeriod.startDate ||
			!insertEventData.eventPeriod.endDate ||
			insertEventData.dailyCapacity === 0 ||
			insertEventData.dailyStartTime === '' ||
			insertEventData.dailyEndTime === ''
		)
			return true;
		return false;
	};

	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length === 0) return false;
			if ((insertEventData.eventImages || []).length + selectedFiles.length > 5) {
				throw new Error('Maximum 5 images allowed!');
			}

			setLoading(true);

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: [null, null, null, null, null],
						target: 'event',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages: string[] = response.data.data.imagesUploader;
			console.log('+responseImages:', responseImages);

			setInsertEventData({
				...insertEventData,
				eventImages: [...(insertEventData.eventImages || []), ...responseImages],
			});
		} catch (err: any) {
			console.log('err:', err.message);
			await sweetMixinErrorAlert(err.message);
		} finally {
			setLoading(false);
		}
	}

	const removeImage = (index: number) => {
		const updated = (insertEventData.eventImages || []).filter((_: string, i: number) => i !== index);
		setInsertEventData({ ...insertEventData, eventImages: updated });
	};

	const insertEventHandler = useCallback(async () => {
		try {
			if (user?.memberType !== 'AGENT') throw new Error('Only agents can create events!');
			await createEvent({ variables: { input: insertEventData } });
			await sweetTopSmallSuccessAlert('Event created!', 800);
			setInsertEventData(initialValues);
			await router.push({ pathname: '/mypage', query: { category: 'myEvents' } });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [insertEventData]);

	const updateEventHandler = useCallback(async () => {
		try {
			const updateInput: EventUpdate = {
				_id: eventId,
				eventTitle: insertEventData.eventTitle,
				eventLocation: insertEventData.eventLocation,
				eventAddress: insertEventData.eventAddress,
				eventDesc: insertEventData.eventDesc,
				eventImages: insertEventData.eventImages,
				eventPeriod: insertEventData.eventPeriod,
				dailyCapacity: insertEventData.dailyCapacity,
				dailyStartTime: insertEventData.dailyStartTime,
				dailyEndTime: insertEventData.dailyEndTime,
			};
			await updateEvent({ variables: { input: updateInput } });
			await sweetTopSmallSuccessAlert('Event updated!', 800);
			await router.push({ pathname: '/mypage', query: { category: 'myEvents' } });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [insertEventData]);

	console.log('+insertEventData:', insertEventData);

	if (user?.memberType !== 'AGENT') {
		router.back();
		return null;
	}

	if (device === 'mobile') {
		return <div>ADD EVENT MOBILE</div>;
	}

	return (
		<div id="add-event-page">
			<Stack className="page-header">
				<Stack className="header-left">
					<Typography className="page-title">{eventId ? 'Edit Event' : 'Add Event'}</Typography>
					<Typography className="page-subtitle">
						{eventId ? 'Update your event details' : 'Create a new golf event'}
					</Typography>
				</Stack>
			</Stack>

			<Stack className="form-container">
				<Stack className="form-left">
					<Typography className="section-title">Event Images</Typography>
					<Typography className="section-hint">Upload up to 5 images. First image is the cover.</Typography>

					<Stack className="image-grid">
						{(insertEventData.eventImages || []).map((img: string, index: number) => (
							<Box key={index} className={`image-slot filled ${index === 0 ? 'cover' : ''}`}>
								<img src={img} alt={`product-${index}`} />
								{index === 0 && <Box className="cover-badge">Cover</Box>}
								<Box className="remove-btn" onClick={() => removeImage(index)}>
									<CloseIcon />
								</Box>
							</Box>
						))}
						{(insertEventData.eventImages || []).length < 5 && (
							<Box className="image-slot empty" onClick={() => inputRef.current.click()}>
								<AddPhotoAlternateOutlinedIcon />
								<Typography>Add Photo</Typography>
								<input
									ref={inputRef}
									type="file"
									hidden={true}
									onChange={uploadImages}
									multiple={true}
									accept="image/jpg, image/jpeg, image/png"
								/>
							</Box>
						)}
					</Stack>
				</Stack>

				<Stack className="form-right">
					<Stack className="form-group">
						<Typography className="form-label">Event Type</Typography>
						<Stack className="category-grid">
							{EVENT_TYPES.map((type) => (
								<Box
									key={type}
									className={`category-chip ${insertEventData.eventType === type ? 'active' : ''}`}
									onClick={() => setInsertEventData({ ...insertEventData, eventType: type })}
								>
									{type}
								</Box>
							))}
						</Stack>
					</Stack>

					<Stack className="form-group">
						<Typography className="form-label">Event Title *</Typography>
						<input
							className="form-input"
							type="text"
							placeholder="e.g. Summer Golf Tournament 2025"
							value={insertEventData.eventTitle}
							onChange={({ target: { value } }) => setInsertEventData({ ...insertEventData, eventTitle: value })}
						/>
					</Stack>

					<Stack className="form-row">
						<Stack className="form-group flex-1">
							<Typography className="form-label">Location *</Typography>
							<select
								className="form-select"
								value={insertEventData.eventLocation}
								onChange={({ target: { value } }) =>
									setInsertEventData({ ...insertEventData, eventLocation: value as EventLocation })
								}
							>
								{LOCATIONS.map((loc) => (
									<option key={loc} value={loc}>
										{loc}
									</option>
								))}
							</select>
						</Stack>
						<Stack className="form-group flex-1">
							<Typography className="form-label">Address *</Typography>
							<input
								className="form-input"
								type="text"
								placeholder="Venue address"
								value={insertEventData.eventAddress}
								onChange={({ target: { value } }) => setInsertEventData({ ...insertEventData, eventAddress: value })}
							/>
						</Stack>
					</Stack>

					<Stack className="form-group">
						<Typography className="form-label">Event Period *</Typography>
						<Stack className="form-row">
							<Stack className="form-group flex-1">
								<input
									className="form-input"
									type="date"
									value={
										insertEventData.eventPeriod.startDate
											? new Date(insertEventData.eventPeriod.startDate).toISOString().split('T')[0]
											: ''
									}
									onChange={({ target: { value } }) =>
										setInsertEventData({
											...insertEventData,
											eventPeriod: { ...insertEventData.eventPeriod, startDate: new Date(value) },
										})
									}
								/>
							</Stack>
							<Typography className="form-separator">to</Typography>
							<Stack className="form-group flex-1">
								<input
									className="form-input"
									type="date"
									value={
										insertEventData.eventPeriod.endDate
											? new Date(insertEventData.eventPeriod.endDate).toISOString().split('T')[0]
											: ''
									}
									onChange={({ target: { value } }) =>
										setInsertEventData({
											...insertEventData,
											eventPeriod: { ...insertEventData.eventPeriod, endDate: new Date(value) },
										})
									}
								/>
							</Stack>
						</Stack>
					</Stack>

					<Stack className="form-group">
						<Typography className="form-label">Daily Schedule *</Typography>
						<Stack className="form-row">
							<Stack className="form-group flex-1">
								<Typography className="form-sublabel">Start Time</Typography>
								<input
									className="form-input"
									type="time"
									value={insertEventData.dailyStartTime}
									onChange={({ target: { value } }) =>
										setInsertEventData({ ...insertEventData, dailyStartTime: value })
									}
								/>
							</Stack>
							<Stack className="form-group flex-1">
								<Typography className="form-sublabel">End Time</Typography>
								<input
									className="form-input"
									type="time"
									value={insertEventData.dailyEndTime}
									onChange={({ target: { value } }) => setInsertEventData({ ...insertEventData, dailyEndTime: value })}
								/>
							</Stack>
							<Stack className="form-group flex-1">
								<Typography className="form-sublabel">Daily Capacity</Typography>
								<input
									className="form-input"
									type="number"
									placeholder="50"
									min={1}
									value={insertEventData.dailyCapacity || ''}
									onChange={({ target: { value } }) =>
										setInsertEventData({ ...insertEventData, dailyCapacity: parseInt(value) || 0 })
									}
								/>
							</Stack>
						</Stack>
					</Stack>

					<Stack className="form-group">
						<Typography className="form-label">Description</Typography>
						<textarea
							className="form-textarea"
							placeholder="Describe your event — schedule, requirements, what to bring..."
							value={insertEventData.eventDesc || ''}
							onChange={({ target: { value } }) => setInsertEventData({ ...insertEventData, eventDesc: value })}
						/>
					</Stack>

					<Box
						className={`submit-btn ${doDisabledCheck() || loading ? 'disabled' : ''}`}
						onClick={!doDisabledCheck() && !loading ? (eventId ? updateEventHandler : insertEventHandler) : undefined}
					>
						{loading ? 'Saving...' : eventId ? 'Update Event' : 'Publish Event'}
					</Box>
				</Stack>
			</Stack>
		</div>
	);
};

AddEvent.defaultProps = {
	initialValues: {
		eventType: EventType.TOURNAMENT,
		eventTitle: '',
		eventLocation: EventLocation.SEOUL,
		eventAddress: '',
		eventDesc: '',
		eventImages: [],
		eventPeriod: {
			startDate: new Date(),
			endDate: new Date(),
		},
		dailyCapacity: 50,
		dailyStartTime: '09:00',
		dailyEndTime: '17:00',
	},
};

export default AddEvent;
