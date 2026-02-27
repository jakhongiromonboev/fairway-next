import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box } from '@mui/material';
import axios from 'axios';
import { getJwtToken, updateUserInfo, setJwtToken } from '../../auth';
import { useReactiveVar, useMutation } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { AgentStoreInput } from '../../types/member/agent-store.input';
import { MemberType, AgentStoreRegion } from '../../enums/member.enum';
import { UPDATE_MEMBER, COMPLETE_AGENT_STORE } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const REGIONS = Object.values(AgentStoreRegion);

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);

	const [memberData, setMemberData] = useState<MemberUpdate>(initialValues);
	const [storeData, setStoreData] = useState<AgentStoreInput>({
		agentStoreName: '',
		agentStoreAddress: '',
		agentStoreLocation: AgentStoreRegion.SEOUL,
		agentStoreDesc: '',
		agentStoreImage: '',
	});
	const [loading, setLoading] = useState<boolean>(false);

	/** APOLLO **/
	const [updateMember] = useMutation(UPDATE_MEMBER);
	const [completeAgentStore] = useMutation(COMPLETE_AGENT_STORE);

	/** LIFECYCLES **/
	useEffect(() => {
		if (user?._id) {
			setMemberData({
				...memberData,
				_id: user._id,
				memberNick: user.memberNick || '',
				memberFullName: user.memberFullName || '',
				memberPhone: user.memberPhone || '',
				memberEmail: user.memberEmail || '',
				memberAddress: user.memberAddress || '',
				memberDesc: user.memberDesc || '',
				memberImage: user.memberImage || '',
			});

			if (user.memberType === MemberType.AGENT) {
				setStoreData({
					agentStoreName: user.agentStoreName || '',
					agentStoreAddress: user.agentStoreAddress || '',
					agentStoreLocation: (user.agentStoreLocation as AgentStoreRegion) || AgentStoreRegion.SEOUL,
					agentStoreDesc: user.agentStoreDesc || '',
					agentStoreImage: user.agentStoreImage || '',
				});
			}
		}
	}, [user]);

	/** COMPUTED **/
	const isAgent = user?.memberType === MemberType.AGENT;
	const storeIncomplete = isAgent && (!user?.agentStoreName || !user?.agentStoreLocation || !user?.agentStoreAddress);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			if (!image) return;
			setLoading(true);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
					}`,
					variables: { file: null, target: 'member' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+responseImage:', responseImage);

			setMemberData((prev) => ({ ...prev, memberImage: responseImage }));
			const result = await updateMember({
				variables: {
					input: {
						_id: user._id,
						memberImage: responseImage,
					},
				},
			});

			const { accessToken } = result.data.updateMember;
			setJwtToken(accessToken);
			updateUserInfo(accessToken);
		} catch (err: any) {
			console.log('Error, uploadImage:', err);
			await sweetMixinErrorAlert(err.message);
		} finally {
			setLoading(false);
		}
	};

	const uploadStoreImage = async (e: any) => {
		try {
			const image = e.target.files[0];
			if (!image) return;
			setLoading(true);

			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
					}`,
					variables: { file: null, target: 'store' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			console.log('+storeImage:', responseImage);
			setStoreData((prev) => ({ ...prev, agentStoreImage: responseImage }));
		} catch (err: any) {
			console.log('Error, uploadStoreImage:', err);
			await sweetMixinErrorAlert(err.message);
		} finally {
			setLoading(false);
		}
	};

	const doDisabledCheck = () => {
		if (memberData.memberNick === '' || memberData.memberPhone === '') return true;
		return false;
	};

	const updateMemberHandler = useCallback(async () => {
		try {
			setLoading(true);
			const result = await updateMember({ variables: { input: memberData } });
			const { accessToken } = result.data.updateMember;
			setJwtToken(accessToken);
			updateUserInfo(accessToken);
			await sweetTopSmallSuccessAlert('Profile updated!', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		} finally {
			setLoading(false);
		}
	}, [memberData]);

	const updateStoreHandler = useCallback(async () => {
		try {
			setLoading(true);
			await completeAgentStore({ variables: { input: storeData } });
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			await sweetTopSmallSuccessAlert('Store updated!', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		} finally {
			setLoading(false);
		}
	}, [storeData]);

	console.log('+memberData:', memberData);
	console.log('+storeData:', storeData);

	if (device === 'mobile') {
		return <>MY PROFILE PAGE MOBILE</>;
	}

	return (
		<div id="my-profile-page">
			{storeIncomplete && (
				<Stack className="store-warning">
					<WarningAmberIcon />
					<Typography>
						Your store profile is incomplete! Complete it below to start listing products and events.
					</Typography>
				</Stack>
			)}

			<Stack className="profile-section">
				<Typography className="section-title">Profile Information</Typography>

				<Stack className="top-box">
					<Stack className="photo-box">
						<Typography className="title">Photo</Typography>
						<Stack className="image-big-box">
							<Box className="image-box">
								<img
									src={memberData?.memberImage ? memberData.memberImage : '/img/profile/defaultUser.svg'}
									alt="avatar"
								/>
								<Box className="avatar-overlay" onClick={() => document.getElementById('hidden-input')?.click()}>
									<CameraAltOutlinedIcon />
								</Box>
								<input
									type="file"
									hidden
									id="hidden-input"
									onChange={uploadImage}
									accept="image/jpg, image/jpeg, image/png"
								/>
							</Box>
							<Typography className="upload-text">A photo must be in JPG, JPEG or PNG format!</Typography>
						</Stack>
					</Stack>

					<Stack className="form-fields">
						<Stack className="form-row">
							<Stack className="input-box">
								<Typography className="title">Username *</Typography>
								<input
									type="text"
									placeholder="Your username"
									value={memberData.memberNick || ''}
									onChange={({ target: { value } }) => setMemberData({ ...memberData, memberNick: value })}
								/>
							</Stack>
							<Stack className="input-box">
								<Typography className="title">Full Name</Typography>
								<input
									type="text"
									placeholder="Your full name"
									value={memberData.memberFullName || ''}
									onChange={({ target: { value } }) => setMemberData({ ...memberData, memberFullName: value })}
								/>
							</Stack>
						</Stack>

						<Stack className="form-row">
							<Stack className="input-box">
								<Typography className="title">Phone *</Typography>
								<input
									type="text"
									placeholder="Your phone"
									value={memberData.memberPhone || ''}
									onChange={({ target: { value } }) => setMemberData({ ...memberData, memberPhone: value })}
								/>
							</Stack>
							<Stack className="input-box">
								<Typography className="title">Email</Typography>
								<input
									type="email"
									placeholder="Your email"
									value={memberData.memberEmail || ''}
									onChange={({ target: { value } }) => setMemberData({ ...memberData, memberEmail: value })}
								/>
							</Stack>
						</Stack>

						<Stack className="input-box full-width">
							<Typography className="title">Address</Typography>
							<input
								type="text"
								placeholder="Your address"
								value={memberData.memberAddress || ''}
								onChange={({ target: { value } }) => setMemberData({ ...memberData, memberAddress: value })}
							/>
						</Stack>

						<Stack className="input-box full-width">
							<Typography className="title">Bio</Typography>
							<textarea
								placeholder="Tell us about yourself..."
								value={memberData.memberDesc || ''}
								onChange={({ target: { value } }) => setMemberData({ ...memberData, memberDesc: value })}
							/>
						</Stack>
					</Stack>
				</Stack>

				<Box
					className={`update-button ${doDisabledCheck() || loading ? 'disabled' : ''}`}
					onClick={!doDisabledCheck() && !loading ? updateMemberHandler : undefined}
				>
					<Typography>{loading ? 'Saving...' : 'Update Profile'}</Typography>
				</Box>
			</Stack>

			{/* STORE SECTION — AGENTS ONLY */}
			{isAgent && (
				<Stack className="store-section">
					<Typography className="section-title">
						Store Information
						{storeIncomplete && <span className="incomplete-badge">Incomplete</span>}
					</Typography>

					<Stack className="photo-box">
						<Typography className="title">Store Photo</Typography>
						<Stack className="image-big-box">
							<Box className="image-box store-image-box">
								<img
									src={storeData.agentStoreImage ? storeData.agentStoreImage : '/img/banner/hero_shop6.jpg'}
									alt="store"
								/>
								<Box className="avatar-overlay" onClick={() => document.getElementById('hidden-store-input')?.click()}>
									<CameraAltOutlinedIcon />
								</Box>
								<input
									type="file"
									hidden
									id="hidden-store-input"
									onChange={uploadStoreImage}
									accept="image/jpg, image/jpeg, image/png"
								/>
							</Box>
							<Typography className="upload-text">Click on photo to update</Typography>
						</Stack>
					</Stack>

					<Stack className="form-fields">
						<Stack className="form-row">
							<Stack className="input-box">
								<Typography className="title">Store Name *</Typography>
								<input
									type="text"
									placeholder="Your store name"
									value={storeData.agentStoreName || ''}
									onChange={({ target: { value } }) => setStoreData({ ...storeData, agentStoreName: value })}
								/>
							</Stack>
							<Stack className="input-box">
								<Typography className="title">Location *</Typography>
								<select
									value={storeData.agentStoreLocation}
									onChange={({ target: { value } }) =>
										setStoreData({
											...storeData,
											agentStoreLocation: AgentStoreRegion[value as keyof typeof AgentStoreRegion],
										})
									}
								>
									{REGIONS.map((region) => (
										<option key={region} value={region}>
											{region}
										</option>
									))}
								</select>
							</Stack>
						</Stack>

						<Stack className="input-box full-width">
							<Typography className="title">Store Address *</Typography>
							<input
								type="text"
								placeholder="Full store address"
								value={storeData.agentStoreAddress || ''}
								onChange={({ target: { value } }) => setStoreData({ ...storeData, agentStoreAddress: value })}
							/>
						</Stack>

						<Stack className="input-box full-width">
							<Typography className="title">Store Description</Typography>
							<textarea
								placeholder="Describe your store..."
								value={storeData.agentStoreDesc || ''}
								onChange={({ target: { value } }) => setStoreData({ ...storeData, agentStoreDesc: value })}
							/>
						</Stack>
					</Stack>

					<Box
						className={`update-button ${loading ? 'disabled' : ''}`}
						onClick={!loading ? updateStoreHandler : undefined}
					>
						<Typography>{loading ? 'Saving...' : 'Save Store Info'}</Typography>
					</Box>
				</Stack>
			)}
		</div>
	);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberFullName: '',
		memberPhone: '',
		memberEmail: '',
		memberAddress: '',
		memberDesc: '',
	},
};

export default MyProfile;
