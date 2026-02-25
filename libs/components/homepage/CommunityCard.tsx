import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { BoardArticle } from '../../types/board-article/board-article';
import { useRouter } from 'next/router';
import moment from 'moment';

interface CommunityCardProps {
	article: BoardArticle;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { article } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const articleImage = article?.articleImage;

	/** HANDLERS **/
	const handleArticleClick = () => {
		router.push(`/community/detail?articleCategory=${article.articleCategory}&id=${article._id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className={'community-card-mobile'} onClick={handleArticleClick}>
				<Box component={'div'} className={'card-image'} style={{ backgroundImage: `url(${articleImage})` }} />
				<Box component={'div'} className={'card-info'}>
					<span className={'card-category'}>{article.articleCategory}</span>
					<h3 className={'card-title'}>{article.articleTitle}</h3>
					<span className={'card-date'}>{moment(article.createdAt).format('MMM DD, YYYY')}</span>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className={'community-card'} onClick={handleArticleClick}>
				<Box component={'div'} className={'card-image'} style={{ backgroundImage: `url(${articleImage})` }} />

				<Box component={'div'} className={'card-info'}>
					<span className={'card-category'}>{article.articleCategory}</span>
					<h3 className={'card-title'}>{article.articleTitle}</h3>
					<p className={'card-desc'}>{article.articleContent}</p>
					<Box component={'div'} className={'card-footer'}>
						<span className={'card-date'}>{moment(article.createdAt).format('MMM DD, YYYY')}</span>
						<span className={'read-more'}>Read more →</span>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default CommunityCard;
