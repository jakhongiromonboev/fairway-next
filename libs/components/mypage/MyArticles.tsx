import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box } from '@mui/material';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { UPDATE_BOARD_ARTICLE } from '../../../apollo/user/mutation';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { BoardArticlesInquiry } from '../../types/board-article/board-article.input';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { T } from '../../types/common';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useRouter } from 'next/router';

const MyArticles: NextPage = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	const [searchFilter, setSearchFilter] = useState<BoardArticlesInquiry>({
		page: 1,
		limit: 6,
		search: {
			memberId: user?._id,
		},
	});
	const [articles, setArticles] = useState<BoardArticle[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO **/
	const [updateBoardArticle] = useMutation(UPDATE_BOARD_ARTICLE);

	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		refetch: getArticlesRefetch,
	} = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		onCompleted: (data: T) => {
			setArticles(data?.getBoardArticles?.list || []);
			setTotal(data?.getBoardArticles?.metaCounter[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = useCallback(
		async (event: React.ChangeEvent<unknown>, value: number) => {
			searchFilter.page = value;
			setSearchFilter({ ...searchFilter });
			await getArticlesRefetch({ input: searchFilter });
		},
		[searchFilter],
	);

	const deleteArticleHandler = useCallback(
		async (articleId: string) => {
			try {
				const confirm = await sweetConfirmAlert('Are you sure you want to delete this article?');
				if (!confirm) return;

				await updateBoardArticle({
					variables: {
						input: {
							_id: articleId,
							articleStatus: BoardArticleStatus.DELETE,
						},
					},
				});
				await sweetTopSmallSuccessAlert('Article deleted!', 800);
				await getArticlesRefetch({ input: searchFilter });
			} catch (err: any) {
				await sweetErrorHandling(err);
			}
		},
		[searchFilter],
	);

	const editArticleHandler = useCallback(
		(articleId: string) => {
			router.push(`/mypage?tab=writeArticle&articleId=${articleId}`);
		},
		[router],
	);

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	console.log('+articles:', articles);

	if (device === 'mobile') {
		return <div>MY ARTICLES MOBILE</div>;
	}

	return (
		<div id="my-articles-page">
			<Stack className="page-header">
				<Typography className="page-title">My Articles</Typography>
				<Box className="write-btn" onClick={() => router.push('/mypage?category=writeArticle')}>
					+ Write Article
				</Box>
			</Stack>

			{articles.length === 0 ? (
				<Stack className="no-data">
					<img src="/img/icons/no-data.svg" alt="no data" />
					<p>No articles yet. Start writing!</p>
				</Stack>
			) : (
				<Stack className="articles-list">
					{articles.map((article: BoardArticle) => (
						<Stack key={article._id} className="article-card">
							{/* IMAGE */}
							{article.articleImage && (
								<Box className="article-image">
									<img src={article.articleImage} alt={article.articleTitle} />
								</Box>
							)}

							{/* CONTENT */}
							<Stack className="article-content">
								<Stack className="article-top">
									<span className="article-category">{article.articleCategory}</span>
									<Typography className="article-date">{formatDate(article.createdAt)}</Typography>
								</Stack>

								<Typography className="article-title">{article.articleTitle}</Typography>
								<Typography className="article-text">{article.articleContent}</Typography>

								<Stack className="article-bottom">
									<Stack className="article-stats">
										<Stack className="stat">
											<VisibilityOutlinedIcon />
											<span>{article.articleViews}</span>
										</Stack>
										<Stack className="stat">
											<FavoriteBorderOutlinedIcon />
											<span>{article.articleLikes}</span>
										</Stack>
										<Stack className="stat">
											<ChatBubbleOutlineIcon />
											<span>{article.articleComments}</span>
										</Stack>
									</Stack>
									<Stack className="article-actions">
										<Box className="btn-edit" onClick={() => editArticleHandler(article._id)}>
											<EditOutlinedIcon />
										</Box>
										<Box className="btn-delete" onClick={() => deleteArticleHandler(article._id)}>
											<DeleteOutlineIcon />
										</Box>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					))}
				</Stack>
			)}

			{total > 6 && (
				<Stack className="pagination-config">
					<Pagination
						count={Math.ceil(total / searchFilter.limit)}
						page={searchFilter.page}
						shape="circular"
						color="primary"
						onChange={paginationHandler}
						renderItem={(item) => (
							<PaginationItem components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }} {...item} />
						)}
					/>
				</Stack>
			)}
		</div>
	);
};

export default MyArticles;
