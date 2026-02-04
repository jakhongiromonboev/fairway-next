// CommunityCard.tsx
import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import Moment from 'react-moment';

interface CommunityCardProps {
	article: BoardArticle;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	// const articleImage = article?.articleImage
	// 	? `${process.env.REACT_APP_API_URL}/${article.articleImage}`
	// 	: '/img/community/default.webp';

	const articleImage = '/img/events/event-example2.webp';

	/** HANDLERS **/
	const handleArticleClick = () => {
		router.push(`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`);
	};

	if (device === 'mobile') {
		return <div>COMMUNITY CARD (MOBILE)</div>;
	} else {
		return (
			<Stack className="community-card" onClick={handleArticleClick}>
				<Box component={'div'} className={'card-image'} style={{ backgroundImage: `url(${articleImage})` }}>
					<Box component={'div'} className={'card-overlay'}>
						<Box component={'div'} className={'card-info'}>
							<h4 className={'card-title'}>{article.articleTitle}</h4>
							<span className={'read-more'}>Read more</span>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default CommunityCard;
