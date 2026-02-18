// libs/components/product/AgentInfoCard.tsx
import React from 'react';
import { Stack, Box, Button, Typography, Icon } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

interface AgentInfoCardProps {
	agent: Member;
}

const AgentInfoCard = (props: AgentInfoCardProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const agentImage = agent?.agentStoreImage ? `${agent.agentStoreImage}` : '/img/agents/default.webp';

	/** HANDLERS **/
	const handleVisitStore = () => {
		router.push(`/agent/detail?id=${agent._id}`);
	};

	if (device === 'mobile') {
		return <div>AGENT INFO CARD (MOBILE)</div>;
	}

	return (
		<Stack className="agent-info-card">
			<Typography className="card-title">Sold by</Typography>

			<Stack className="agent-content">
				<Box className="agent-image">
					<img src={agentImage} alt={agent.agentStoreName} />
				</Box>

				<Stack className="agent-details">
					<Typography className="store-name">{agent.agentStoreName || agent.memberNick}</Typography>

					{agent.agentStoreLocation && (
						<Stack className="location">
							<LocationOnIcon />
							<span>{agent.agentStoreLocation}</span>
						</Stack>
					)}

					<Stack className="agent-stats">
						<Stack className="stat-item">
							<StorefrontIcon />
							<span>{agent.memberProducts} products</span>
						</Stack>
						<Stack className="stat-item">
							<PeopleIcon />
							<span>{agent.memberFollowers} followers</span>
						</Stack>
					</Stack>
				</Stack>
			</Stack>

			<Button variant="outlined" className="visit-store-btn" onClick={handleVisitStore}>
				Visit Store
			</Button>
		</Stack>
	);
};

export default AgentInfoCard;
