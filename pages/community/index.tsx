import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Messages } from '../../libs/config';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CATEGORIES = [
	{ value: BoardArticleCategory.GENERAL, label: 'General' },
	{ value: BoardArticleCategory.TIPS, label: 'Tips & Tricks' },
	{ value: BoardArticleCategory.NEWS, label: 'News' },
	{ value: BoardArticleCategory.REVIEW, label: 'Reviews' },
	{ value: BoardArticleCategory.HUMOR, label: 'Humor' },
];

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { query } = router;
	const articleCategory = query?.articleCategory as string;

	const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>(initialInput);
	const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);

	if (articleCategory) initialInput.search.articleCategory = articleCategory as BoardArticleCategory;

	const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

	const { refetch: boardArticleRefetch } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBoardArticles(data?.getBoardArticles?.list);
			setTotalCount(data?.getBoardArticles?.metaCounter[0]?.total ?? 0);
		},
	});

	useEffect(() => {
		if (!query?.articleCategory) {
			router.push(
				{ pathname: router.pathname, query: { articleCategory: BoardArticleCategory.GENERAL } },
				router.pathname,
				{ shallow: true },
			);
		}
	}, []);

	const categoryChangeHandler = async (value: BoardArticleCategory) => {
		setSearchCommunity({ ...searchCommunity, page: 1, search: { articleCategory: value } });
		await router.push({ pathname: '/community', query: { articleCategory: value } }, router.pathname, {
			shallow: true,
		});
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const likeArticleHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetBoardArticle({ variables: { input: id } });
			await boardArticleRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') return <h1>COMMUNITY PAGE MOBILE</h1>;

	const activeCategory = searchCommunity.search.articleCategory;

	return (
		<div id="community-page">
			{/* HERO */}
			<div className="community-hero">
				<span className="hero-eyebrow">FAIRWAY COMMUNITY</span>
				<h1 className="hero-title">The Clubhouse</h1>
				<p className="hero-sub">Where golfers connect, share, and inspire</p>
			</div>

			{/* FILTER BAR - horizontal, full width */}
			<div className="community-filterbar">
				<div className="filterbar-inner">
					<nav className="category-tabs">
						{CATEGORIES.map((cat) => (
							<button
								key={cat.value}
								className={`cat-tab ${activeCategory === cat.value ? 'active' : ''}`}
								onClick={() => categoryChangeHandler(cat.value)}
							>
								{cat.label}
							</button>
						))}
					</nav>
					<button className="write-btn" onClick={() => router.push('/mypage?category=writeArticle')}>
						<EditOutlinedIcon sx={{ fontSize: 15 }} />
						<span>Write</span>
					</button>
				</div>
			</div>

			{/* CONTENT */}
			<div className="community-content">
				{totalCount > 0 ? (
					<>
						<div className="articles-grid">
							{boardArticles?.map((boardArticle: BoardArticle) => (
								<CommunityCard
									boardArticle={boardArticle}
									key={boardArticle?._id}
									likeArticleHandler={likeArticleHandler}
								/>
							))}
						</div>

						{totalCount > searchCommunity.limit && (
							<div className="pagination-wrap">
								<Pagination
									count={Math.ceil(totalCount / searchCommunity.limit)}
									page={searchCommunity.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</div>
						)}
					</>
				) : (
					<div className="empty-state">
						<ForumOutlinedIcon className="empty-icon" />
						<p className="empty-title">No articles yet</p>
						<p className="empty-sub">Be the first to share something</p>
						<button className="empty-write-btn" onClick={() => router.push('/mypage?category=writeArticle')}>
							Write Article
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: { articleCategory: BoardArticleCategory.GENERAL },
	},
};

export default withLayoutBasic(Community);
