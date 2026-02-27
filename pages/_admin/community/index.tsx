import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import CommunityArticleList from '../../../libs/components/admin/community/CommunityArticleList';
import { Box, List, ListItem, Stack, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { AllBoardArticlesInquiry } from '../../../libs/types/board-article/board-article.input';
import { BoardArticle } from '../../../libs/types/board-article/board-article';
import { BoardArticleCategory, BoardArticleStatus } from '../../../libs/enums/board-article.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { BoardArticleUpdate } from '../../../libs/types/board-article/board-article.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_BOARD_ARTICLES_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_BOARD_ARTICLE_BY_ADMIN, REMOVE_BOARD_ARTICLE_BY_ADMIN } from '../../../apollo/admin/mutation';

const AdminCommunity: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<any>([]);
	const [communityInquiry, setCommunityInquiry] = useState<AllBoardArticlesInquiry>(initialInquiry);
	const [articles, setArticles] = useState<BoardArticle[]>([]);
	const [articleTotal, setArticleTotal] = useState<number>(0);
	const [value, setValue] = useState('ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const { refetch } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: communityInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setArticles(data?.getAllBoardArticlesByAdmin?.list ?? []);
			setArticleTotal(data?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const [updateBoardArticleByAdmin] = useMutation(UPDATE_BOARD_ARTICLE_BY_ADMIN);
	const [removeBoardArticleByAdmin] = useMutation(REMOVE_BOARD_ARTICLE_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		refetch({ input: communityInquiry });
	}, [communityInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		communityInquiry.page = newPage + 1;
		setCommunityInquiry({ ...communityInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		communityInquiry.limit = parseInt(event.target.value, 10);
		communityInquiry.page = 1;
		setCommunityInquiry({ ...communityInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => setAnchorEl([]);

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		const inquiry = { ...communityInquiry, page: 1, sort: 'createdAt' };
		switch (newValue) {
			case 'ACTIVE':
				inquiry.search = { articleStatus: BoardArticleStatus.ACTIVE };
				break;
			case 'DELETE':
				inquiry.search = { articleStatus: BoardArticleStatus.DELETE };
				break;
			default:
				delete inquiry.search?.articleStatus;
				break;
		}
		setCommunityInquiry(inquiry);
	};

	const searchTypeHandler = async (newValue: string) => {
		setSearchType(newValue);
		if (newValue !== 'ALL') {
			setCommunityInquiry({
				...communityInquiry,
				page: 1,
				search: { ...communityInquiry.search, articleCategory: newValue as BoardArticleCategory },
			});
		} else {
			const updated = { ...communityInquiry };
			delete updated?.search?.articleCategory;
			setCommunityInquiry(updated);
		}
	};

	const updateArticleHandler = async (updateData: BoardArticleUpdate) => {
		try {
			await updateBoardArticleByAdmin({ variables: { input: updateData } });
			menuIconCloseHandler();
			await refetch({ input: communityInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeArticleHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure you want to permanently delete this article?')) {
				await removeBoardArticleByAdmin({ variables: { input: id } });
				await refetch({ input: communityInquiry });
			}
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box className={'admin-page-content'}>
			<Stack className={'page-header'}>
				<Typography className={'page-title'}>Article List</Typography>
				<Typography className={'page-count'}>{articleTotal} total articles</Typography>
			</Stack>

			<Box className={'admin-table-wrap'}>
				<Box sx={{ width: '100%' }}>
					<TabContext value={value}>
						<Stack className={'tab-header'}>
							<List className={'admin-tab-menu'}>
								{['ALL', 'ACTIVE', 'DELETE'].map((tab) => (
									<ListItem
										key={tab}
										onClick={(e: any) => tabChangeHandler(e, tab)}
										className={value === tab ? 'tab-item active' : 'tab-item'}
									>
										{tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
									</ListItem>
								))}
							</List>
						</Stack>
						<Divider />
						<Stack className={'admin-search-area'}>
							<Select value={searchType} className={'admin-select'} onChange={(e) => searchTypeHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Categories</MenuItem>
								{Object.values(BoardArticleCategory).map((cat) => (
									<MenuItem value={cat} key={cat}>
										{cat}
									</MenuItem>
								))}
							</Select>
						</Stack>
						<Divider />

						<CommunityArticleList
							articles={articles}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateArticleHandler={updateArticleHandler}
							removeArticleHandler={removeArticleHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={articleTotal}
							rowsPerPage={communityInquiry?.limit}
							page={communityInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminCommunity.defaultProps = {
	initialInquiry: { page: 1, limit: 10, sort: 'createdAt', direction: 'DESC', search: {} },
};

export default withAdminLayout(AdminCommunity);
