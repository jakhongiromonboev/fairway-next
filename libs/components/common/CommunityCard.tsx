import React from 'react';
import { useRouter } from 'next/router';
import { BoardArticle } from '../../types/board-article/board-article';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import Moment from 'react-moment';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	likeArticleHandler: (e: any, user: any, id: string) => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
	GENERAL: { bg: '#f0f4ef', color: '#4a6e46' },
	TIPS: { bg: '#e8f4ff', color: '#0066cc' },
	NEWS: { bg: '#fff4e6', color: '#e07b00' },
	REVIEW: { bg: '#fff0f5', color: '#c7254e' },
	HUMOR: { bg: '#fff9e6', color: '#d6a800' },
};

const CommunityCard = ({ boardArticle, likeArticleHandler }: CommunityCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const catStyle = CATEGORY_STYLES[boardArticle.articleCategory] || CATEGORY_STYLES.GENERAL;
	const memberImage = boardArticle?.memberData?.memberImage || '/img/profile/defaultUser.svg';

	const goToDetail = () => {
		router.push({
			pathname: '/community/detail',
			query: {
				id: boardArticle._id,
				articleCategory: boardArticle.articleCategory,
			},
		});
	};

	return (
		<div className="community-card" onClick={goToDetail}>
			{/* COVER */}
			<div className="card-cover">
				{boardArticle?.articleImage ? (
					<img src={boardArticle.articleImage} alt={boardArticle.articleTitle} />
				) : (
					<div className="card-cover-placeholder">
						<GolfCourseIcon />
					</div>
				)}
				<span className="category-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
					{boardArticle.articleCategory}
				</span>
			</div>

			{/* BODY */}
			<div className="card-body">
				<p className="card-title">{boardArticle.articleTitle}</p>

				{boardArticle.articleContent && (
					<p className="card-excerpt">
						{boardArticle.articleContent.replace(/[#*`_>\[\]!]/g, '').substring(0, 100)}...
					</p>
				)}

				{/* AUTHOR */}
				<div className="card-author">
					<img src={memberImage} alt={boardArticle?.memberData?.memberNick} className="author-avatar" />
					<div className="author-info">
						<span className="author-name">{boardArticle?.memberData?.memberNick}</span>
						<Moment className="article-date" format="MMM DD, YYYY">
							{boardArticle?.createdAt}
						</Moment>
					</div>
				</div>

				{/* STATS */}
				<div className="card-stats">
					<div
						className={`stat-item like ${boardArticle?.meLiked?.[0]?.myFavorite ? 'liked' : ''}`}
						onClick={(e) => likeArticleHandler(e, user, boardArticle._id)}
					>
						{boardArticle?.meLiked?.[0]?.myFavorite ? (
							<FavoriteIcon sx={{ fontSize: 14 }} />
						) : (
							<FavoriteBorderIcon sx={{ fontSize: 14 }} />
						)}
						<span>{boardArticle?.articleLikes}</span>
					</div>
					<div className="stat-item">
						<VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
						<span>{boardArticle?.articleViews}</span>
					</div>
					<div className="stat-item">
						<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
						<span>{boardArticle?.articleComments}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CommunityCard;
