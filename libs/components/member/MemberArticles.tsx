import React, { useEffect, useState } from 'react';
import { Pagination, Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { BoardArticle } from '../../types/board-article/board-article';
import moment from 'moment';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const MemberArticles = ({ initialInput }: any) => {
	const router = useRouter();
	const { memberId } = router.query;
	const [articles, setArticles] = useState<BoardArticle[]>([]);
	const [total, setTotal] = useState(0);
	const [searchFilter, setSearchFilter] = useState({
		...initialInput,
		search: { memberId: memberId as string },
	});

	useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		skip: !memberId,
		onCompleted: (data: T) => {
			setArticles(data?.getBoardArticles?.list || []);
			setTotal(data?.getBoardArticles?.metaCounter[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (memberId) setSearchFilter((prev: any) => ({ ...prev, search: { memberId } }));
	}, [memberId]);

	return (
		<div id="member-articles">
			<Stack className="section-header">
				<Typography className="section-title">Articles</Typography>
				<Typography className="section-count">{total} articles</Typography>
			</Stack>

			<Stack className="content-list">
				{articles.length === 0 && (
					<Stack className="no-data">
						<img src="/img/icons/icoAlert.svg" alt="" />
						<Typography>No articles found!</Typography>
					</Stack>
				)}

				{articles.map((article: BoardArticle) => {
					const img = article?.articleImage ? `${article.articleImage}` : '/img/banner/golf-hero.jpg';
					return (
						<Stack
							key={article._id}
							className="content-row"
							onClick={() => router.push(`/community/detail?id=${article._id}`)}
						>
							<Box className="row-image">
								<img src={img} alt={article.articleTitle} />
							</Box>
							<Stack className="row-info">
								<Typography className="row-name">{article.articleTitle}</Typography>
								<Typography className="row-meta">{article.articleCategory}</Typography>
								<Typography className="row-date">{moment(article.createdAt).format('MMM DD, YYYY')}</Typography>
							</Stack>
							<Stack className="row-stats-simple">
								<Stack direction="row" alignItems="center" gap={0.5}>
									<VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
									<span>{article.articleViews}</span>
								</Stack>

								<Stack direction="row" alignItems="center" gap={0.5}>
									<FavoriteBorderIcon sx={{ fontSize: 14 }} />
									<span>{article.articleLikes}</span>
								</Stack>

								<Stack direction="row" alignItems="center" gap={0.5}>
									<ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
									<span>{article.articleComments}</span>
								</Stack>
							</Stack>
						</Stack>
					);
				})}
			</Stack>

			{total > searchFilter.limit && (
				<Stack className="pagination-config">
					<Pagination
						count={Math.ceil(total / searchFilter.limit)}
						page={searchFilter.page}
						shape="circular"
						color="primary"
						onChange={(e, val) => setSearchFilter({ ...searchFilter, page: val })}
					/>
				</Stack>
			)}
		</div>
	);
};

MemberArticles.defaultProps = {
	initialInput: { page: 1, limit: 6, sort: 'createdAt', direction: 'DESC', search: {} },
};

export default MemberArticles;
