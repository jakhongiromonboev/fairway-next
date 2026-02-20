import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, IconButton, Backdrop, Stack, Typography, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import dynamic from 'next/dynamic';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLE } from '../../apollo/user/query';
import { GET_COMMENTS } from '../../apollo/admin/query';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { CommentUpdate } from '../../libs/types/comment/comment.update';

const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const TABS = [
	{ value: BoardArticleCategory.GENERAL, label: 'General' },
	{ value: BoardArticleCategory.TIPS, label: 'Tips & Tricks' },
	{ value: BoardArticleCategory.NEWS, label: 'News' },
	{ value: BoardArticleCategory.REVIEW, label: 'Reviews' },
	{ value: BoardArticleCategory.HUMOR, label: 'Humor' },
];

const CATEGORY_STYLES: Record<string, { bg: string; color: string }> = {
	GENERAL: { bg: '#f0f4ef', color: '#2d5016' },
	TIPS: { bg: '#e8f4ff', color: '#0066cc' },
	NEWS: { bg: '#fff4e6', color: '#e07b00' },
	REVIEW: { bg: '#fff0f5', color: '#c7254e' },
	HUMOR: { bg: '#fff9e6', color: '#d6a800' },
};

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;

	const articleId = query?.id as string;
	const articleCategory = query?.articleCategory as string;

	const [comment, setComment] = useState<string>('');
	const [wordsCnt, setWordsCnt] = useState<number>(0);
	const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({ ...initialInput });
	const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const [boardArticle, setBoardArticle] = useState<BoardArticle>();

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const { refetch: boardArticleRefetch } = useQuery(GET_BOARD_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setBoardArticle(data?.getBoardArticle);
			if (data?.getBoardArticle?.memberData?.memberImage) {
				setMemberImage(`${data?.getBoardArticle.memberData?.memberImage}`);
			}
		},
	});

	const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted(data: any) {
			setComments(data.getComments.list);
			setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
	}, [articleId]);

	const tabChangeHandler = (value: string) => {
		router.push({ pathname: '/community', query: { articleCategory: value } });
	};

	const likeBoardArticleHandler = async (user: any, id: any) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			setLikeLoading(true);
			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const creteCommentHandler = async () => {
		if (!comment) return;
		try {
			if (!user._id) throw new Error(Messages.error2);
			const commentInput: CommentInput = {
				commentGroup: CommentGroup.ARTICLE,
				commentRefId: articleId,
				commentContent: comment,
			};
			await createComment({ variables: { input: commentInput } });
			await getCommentsRefetch({ input: searchFilter });
			await boardArticleRefetch({ input: articleId });
			setComment('');
			setWordsCnt(0);
			await sweetMixinSuccessAlert('Successfully commented!');
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (!commentId) throw new Error('Select a comment to update');
			if (updatedComment === comments?.find((c) => c?._id === commentId)?.commentContent) return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus }),
				...(updatedComment && { commentContent: updatedComment }),
			};

			if (!updateData?.commentContent && !updateData?.commentStatus)
				throw new Error('Provide data to update your comment');

			if (commentStatus) {
				if (await sweetConfirmAlert('Do you want to delete your comment?')) {
					await updateComment({ variables: { input: updateData } });
					await sweetMixinSuccessAlert('Successfully deleted');
				} else return;
			} else {
				await updateComment({ variables: { input: updateData } });
				await sweetMixinSuccessAlert('Successfully updated!');
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		} finally {
			setOpenBackdrop(false);
			setUpdatedComment('');
			setUpdatedCommentWordsCnt(0);
			setUpdatedCommentId('');
		}
	};

	const getCommentMemberImage = (imageUrl: string | undefined) => {
		if (imageUrl) return imageUrl;
		return '/img/community/articleImg.png';
	};

	const goMemberPage = (id: any) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentWordsCnt(0);
	};

	const updateCommentInputHandler = (value: string) => {
		if (value.length > 100) return;
		setUpdatedCommentWordsCnt(value.length);
		setUpdatedComment(value);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const catStyle = CATEGORY_STYLES[articleCategory] || CATEGORY_STYLES.GENERAL;
	const hasImage = !!boardArticle?.articleImage;

	if (device === 'mobile') return <div>COMMUNITY DETAIL PAGE MOBILE</div>;

	return (
		<div id="community-detail-page">
			{/* TOP NAV */}
			<div className="detail-topbar">
				<div className="topbar-inner">
					<button className="back-btn" onClick={() => router.push('/community')}>
						<ArrowBackIcon sx={{ fontSize: 15 }} />
						<span>Community</span>
					</button>
					<nav className="tab-nav">
						{TABS.map((tab) => (
							<button
								key={tab.value}
								className={`tab-btn ${articleCategory === tab.value ? 'active' : ''}`}
								onClick={() => tabChangeHandler(tab.value)}
							>
								{tab.label}
							</button>
						))}
					</nav>
					<button
						className="write-btn"
						onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
					>
						<EditOutlinedIcon sx={{ fontSize: 14 }} />
						<span>Write</span>
					</button>
				</div>
			</div>

			<div className="detail-container">
				{/* MAGAZINE HERO — image left, content right */}
				{hasImage ? (
					<div className="article-magazine-hero">
						<div className="hero-image-wrap">
							<img src={boardArticle.articleImage} alt={boardArticle?.articleTitle} />
						</div>
						<div className="hero-content">
							<span className="article-category" style={{ background: catStyle.bg, color: catStyle.color }}>
								{articleCategory}
							</span>
							<h1 className="article-title">{boardArticle?.articleTitle}</h1>
							<div className="article-meta">
								<img
									src={memberImage}
									alt=""
									className="author-avatar"
									onClick={() => goMemberPage(boardArticle?.memberData?._id)}
								/>
								<div className="author-info">
									<span className="author-name" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
										{boardArticle?.memberData?.memberNick}
									</span>
									<Moment className="article-date" format="MMMM DD, YYYY · HH:mm">
										{boardArticle?.createdAt}
									</Moment>
								</div>
							</div>
							<div className="article-stats">
								<span className="stat">
									<FavoriteBorderIcon sx={{ fontSize: 16 }} />
									<span>{boardArticle?.articleLikes}</span>
								</span>
								<span className="stat">
									<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
									<span>{boardArticle?.articleViews}</span>
								</span>
								<span className="stat">
									<ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
									<span>{total}</span>
								</span>
							</div>
						</div>
					</div>
				) : (
					/* NO IMAGE — full width simple header */
					<div className="article-header-simple">
						<span className="article-category" style={{ background: catStyle.bg, color: catStyle.color }}>
							{articleCategory}
						</span>
						<h1 className="article-title">{boardArticle?.articleTitle}</h1>
						<div className="article-meta">
							<img
								src={memberImage}
								alt=""
								className="author-avatar"
								onClick={() => goMemberPage(boardArticle?.memberData?._id)}
							/>
							<div className="author-info">
								<span className="author-name" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
									{boardArticle?.memberData?.memberNick}
								</span>
								<Moment className="article-date" format="MMMM DD, YYYY · HH:mm">
									{boardArticle?.createdAt}
								</Moment>
							</div>
							<div className="article-stats">
								<span className="stat">
									<FavoriteBorderIcon sx={{ fontSize: 15 }} />
									<span>{boardArticle?.articleLikes}</span>
								</span>
								<span className="stat">
									<VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
									<span>{boardArticle?.articleViews}</span>
								</span>
								<span className="stat">
									<ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
									<span>{total}</span>
								</span>
							</div>
						</div>
					</div>
				)}

				{/* ARTICLE BODY */}
				<div className="article-body">
					<ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
				</div>

				{/* LIKE */}
				<div className="article-like-row">
					<button
						className={`like-btn ${boardArticle?.meLiked?.[0]?.myFavorite ? 'liked' : ''}`}
						onClick={() => likeBoardArticleHandler(user, boardArticle?._id)}
					>
						{boardArticle?.meLiked?.[0]?.myFavorite ? (
							<FavoriteIcon sx={{ fontSize: 18 }} />
						) : (
							<FavoriteBorderIcon sx={{ fontSize: 18 }} />
						)}
						<span>{boardArticle?.articleLikes}</span>
					</button>
				</div>

				{/* COMMENTS */}
				<div className="comments-section">
					<p className="comments-heading">
						Comments <span className="count">({total})</span>
					</p>

					<div className="comment-input-box">
						<img
							src={user?.memberImage ? `${user.memberImage}` : '/img/community/articleImg.png'}
							alt=""
							className="comment-avatar"
						/>
						<div className="comment-input-wrap">
							<input
								type="text"
								placeholder="Share your thoughts..."
								value={comment}
								onChange={(e) => {
									if (e.target.value.length > 100) return;
									setWordsCnt(e.target.value.length);
									setComment(e.target.value);
								}}
								onKeyDown={(e) => e.key === 'Enter' && creteCommentHandler()}
							/>
							<div className="input-footer">
								<span className="word-count">{wordsCnt}/100</span>
								<Button className="submit-btn" onClick={creteCommentHandler}>
									Post
								</Button>
							</div>
						</div>
					</div>

					<div className="comments-list">
						{comments?.map((commentData) => (
							<div className="comment-item" key={commentData?._id}>
								<img
									src={getCommentMemberImage(commentData?.memberData?.memberImage)}
									alt=""
									className="comment-avatar"
									onClick={() => goMemberPage(commentData?.memberData?._id)}
								/>
								<div className="comment-body">
									<div className="comment-header">
										<span className="comment-nick" onClick={() => goMemberPage(commentData?.memberData?._id)}>
											{commentData?.memberData?.memberNick}
										</span>
										<Moment className="comment-date" format="MMM DD, YYYY · HH:mm">
											{commentData?.createdAt}
										</Moment>
										{commentData?.memberId === user?._id && (
											<div className="comment-actions">
												<IconButton
													size="small"
													onClick={() => {
														setUpdatedCommentId(commentData?._id);
														updateButtonHandler(commentData?._id, CommentStatus.DELETE);
													}}
												>
													<DeleteForeverIcon sx={{ fontSize: 15, color: '#ccc' }} />
												</IconButton>
												<IconButton
													size="small"
													onClick={() => {
														setUpdatedComment(commentData?.commentContent);
														setUpdatedCommentWordsCnt(commentData?.commentContent?.length);
														setUpdatedCommentId(commentData?._id);
														setOpenBackdrop(true);
													}}
												>
													<EditIcon sx={{ fontSize: 15, color: '#ccc' }} />
												</IconButton>
											</div>
										)}
									</div>
									<p className="comment-content">{commentData?.commentContent}</p>
								</div>

								{commentData?.memberId === user?._id && (
									<Backdrop
										sx={{
											top: '35%',
											right: '20%',
											left: '20%',
											width: 'auto',
											height: 'fit-content',
											borderRadius: '8px',
											zIndex: 999,
										}}
										open={openBackdrop && updatedCommentId === commentData?._id}
									>
										<Stack
											sx={{
												width: '100%',
												background: '#fff',
												border: '1px solid #e8e5e0',
												padding: '24px',
												gap: '16px',
												borderRadius: '8px',
												boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
											}}
										>
											<Typography sx={{ fontWeight: 500, fontSize: 15, color: '#111' }}>Edit Comment</Typography>
											<input
												autoFocus
												value={updatedComment}
												onChange={(e) => updateCommentInputHandler(e.target.value)}
												type="text"
												style={{
													border: '1px solid #e0ddd8',
													outline: 'none',
													height: '44px',
													padding: '0 12px',
													borderRadius: '6px',
													fontSize: '14px',
													color: '#111',
													background: '#fafaf8',
												}}
											/>
											<Stack flexDirection="row" justifyContent="space-between" alignItems="center">
												<Typography fontSize={11} color="#ccc">
													{updatedCommentWordsCnt}/100
												</Typography>
												<Stack flexDirection="row" gap="8px">
													<Button
														variant="outlined"
														onClick={cancelButtonHandler}
														sx={{
															textTransform: 'none',
															borderColor: '#e0ddd8',
															color: '#888',
															fontSize: 13,
															borderRadius: '8px',
														}}
													>
														Cancel
													</Button>
													<Button
														variant="contained"
														onClick={() => updateButtonHandler(updatedCommentId, undefined)}
														sx={{
															textTransform: 'none',
															background: '#2d5016',
															color: '#fff',
															fontSize: 13,
															borderRadius: '8px',
															boxShadow: 'none',
															'&:hover': { background: '#4a6e46', boxShadow: 'none' },
														}}
													>
														Update
													</Button>
												</Stack>
											</Stack>
										</Stack>
									</Backdrop>
								)}
							</div>
						))}
					</div>

					{total > 0 && (
						<div className="comments-pagination">
							<Pagination
								count={Math.ceil(total / searchFilter.limit) || 1}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);
