// CommunityCard.tsx
import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';

interface CommunityCardProps {
	article: BoardArticle;
	variant?: 'small' | 'large'; // To support different card sizes
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article, variant = 'small' } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const articleImage = article?.articleImage || '/img/events/event-example2.webp';

	/** HANDLERS **/
	const handleArticleClick = () => {
		router.push(`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Stack className={`community-card ${variant}`} onClick={handleArticleClick}>
				<Box component={'div'} className={'card-image'} style={{ backgroundImage: `url(${articleImage})` }}>
					<Box component={'div'} className={'card-overlay'}>
						<Box component={'div'} className={'card-content'}>
							<h3 className={'card-title'}>{article.articleTitle}</h3>
							<span className={'read-more'}>Read more</span>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default CommunityCard;
