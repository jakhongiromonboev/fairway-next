import React from 'react';
import { Modal, Stack, Box, Button, Typography, IconButton } from '@mui/material';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import StorefrontIcon from '@mui/icons-material/Storefront';

interface ContactAgentModalProps {
	open: boolean;
	onClose: () => void;
	agent: Member;
}

const ContactAgentModal = (props: ContactAgentModalProps) => {
	const { open, onClose, agent } = props;
	const router = useRouter();

	const agentImage = agent?.agentStoreImage
		? `${REACT_APP_API_URL}/${agent.agentStoreImage}`
		: agent?.memberImage
		? `${REACT_APP_API_URL}/${agent.memberImage}`
		: '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const handleVisitStore = () => {
		router.push(`/agent/detail?id=${agent._id}`);
		onClose();
	};

	const handleKakaoChat = () => {
		const phoneNumber = agent.memberPhone.replace(/[^0-9]/g, '');
		window.open(`https://open.kakao.com/o/${phoneNumber}`, '_blank');
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					position: 'relative',
					width: '480px',
					bgcolor: 'white',
					borderRadius: '16px',
					padding: '40px',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
					outline: 'none',
				}}
			>
				<IconButton
					onClick={onClose}
					sx={{
						position: 'absolute',
						top: 16,
						right: 16,
						width: 36,
						height: 36,
					}}
				>
					<CloseIcon sx={{ color: '#8f8f8f' }} />
				</IconButton>

				<Typography
					sx={{
						color: '#181a20',
						fontSize: '24px',
						fontWeight: 600,
						marginBottom: '30px',
						textAlign: 'center',
					}}
				>
					Contact Agent
				</Typography>

				{/* Agent Info */}
				<Stack
					sx={{
						alignItems: 'center',
						gap: '16px',
						paddingBottom: '30px',
						borderBottom: '1px solid #e5e5e5',
						marginBottom: '30px',
					}}
				>
					<Box
						sx={{
							width: '80px',
							height: '80px',
							borderRadius: '50%',
							overflow: 'hidden',
							border: '2px solid #e5e5e5',
						}}
					>
						<img
							src={agentImage}
							alt={agent.memberNick}
							style={{ width: '100%', height: '100%', objectFit: 'cover' }}
						/>
					</Box>
					<Stack sx={{ alignItems: 'center', gap: '4px' }}>
						<Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#181a20' }}>
							{agent.memberNick || agent.memberFullName}
						</Typography>
						<Typography sx={{ fontSize: '14px', color: '#8f8f8f' }}>{agent.agentStoreName}</Typography>
					</Stack>
				</Stack>

				{/* Contact Details */}
				<Stack sx={{ gap: '20px', marginBottom: '30px' }}>
					<Stack sx={{ flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }}>
						<EmailIcon sx={{ width: '24px', height: '24px', color: '#2d5016', marginTop: '4px' }} />
						<Stack sx={{ flex: 1, gap: '4px' }}>
							<Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#8f8f8f', textTransform: 'uppercase' }}>
								Email
							</Typography>
							<Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#181a20' }}>{agent.memberEmail}</Typography>
						</Stack>
					</Stack>

					<Stack sx={{ flexDirection: 'row', gap: '16px', alignItems: 'flex-start' }}>
						<PhoneIcon sx={{ width: '24px', height: '24px', color: '#2d5016', marginTop: '4px' }} />
						<Stack sx={{ flex: 1, gap: '4px' }}>
							<Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#8f8f8f', textTransform: 'uppercase' }}>
								Phone
							</Typography>
							<Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#181a20' }}>{agent.memberPhone}</Typography>
						</Stack>
					</Stack>
				</Stack>

				{/* Action Buttons */}
				<Stack sx={{ gap: '12px' }}>
					<Button
						onClick={handleKakaoChat}
						sx={{
							width: '100%',
							height: '52px',
							background: '#fee500',
							color: '#000000',
							fontSize: '15px',
							fontWeight: 600,
							textTransform: 'none',
							borderRadius: '8px',
							'&:hover': {
								background: '#fdd835',
							},
						}}
					>
						<img
							src="/img/icons/kakao.svg"
							alt="KakaoTalk"
							style={{ width: '20px', height: '20px', marginRight: '10px' }}
						/>
						KakaoTalk Chat
					</Button>

					<Button
						onClick={handleVisitStore}
						sx={{
							width: '100%',
							height: '52px',
							background: '#181a20',
							color: '#ffffff',
							fontSize: '15px',
							fontWeight: 600,
							textTransform: 'none',
							borderRadius: '8px',
							'&:hover': {
								background: '#2d5016',
							},
						}}
					>
						<StorefrontIcon sx={{ marginRight: '8px' }} />
						Visit Agent Store
					</Button>
				</Stack>
			</Box>
		</Modal>
	);
};

export default ContactAgentModal;
