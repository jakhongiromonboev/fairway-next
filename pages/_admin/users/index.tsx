import React, { useCallback, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { MemberPanelList } from '../../../libs/components/admin/users/MemberList';
import { Box, InputAdornment, List, ListItem, Stack, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import SearchIcon from '@mui/icons-material/Search';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { Member } from '../../../libs/types/member/member';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { MemberUpdate } from '../../../libs/types/member/member.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';

const AdminUsers: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [membersInquiry, setMembersInquiry] = useState<MembersInquiry>(initialInquiry);
	const [members, setMembers] = useState<Member[]>([]);
	const [membersTotal, setMembersTotal] = useState<number>(0);
	const [value, setValue] = useState('ALL');
	const [searchText, setSearchText] = useState('');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const { loading, data, refetch } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: membersInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setMembers(data?.getAllMembersByAdmin?.list ?? []);
			setMembersTotal(data?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		refetch({ input: membersInquiry });
	}, [membersInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		membersInquiry.page = newPage + 1;
		setMembersInquiry({ ...membersInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		membersInquiry.limit = parseInt(event.target.value, 10);
		membersInquiry.page = 1;
		setMembersInquiry({ ...membersInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => setAnchorEl([]);

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		setSearchText('');
		const inquiry: MembersInquiry = { ...membersInquiry, page: 1, sort: 'createdAt' };
		switch (newValue) {
			case 'ACTIVE':
				inquiry.search = { memberStatus: MemberStatus.ACTIVE };
				break;
			case 'BLOCK':
				inquiry.search = { memberStatus: MemberStatus.BLOCK };
				break;
			case 'DELETE':
				inquiry.search = { memberStatus: MemberStatus.DELETE };
				break;
			default:
				delete inquiry.search?.memberStatus;
				break;
		}
		setMembersInquiry(inquiry);
	};

	const updateMemberHandler = async (updateData: MemberUpdate) => {
		try {
			await updateMemberByAdmin({ variables: { input: updateData } });
			menuIconCloseHandler();
			await refetch({ input: membersInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const textHandler = useCallback((value: string) => setSearchText(value), []);

	const searchTextHandler = () => {
		setMembersInquiry({ ...membersInquiry, search: { ...membersInquiry.search, text: searchText } });
	};

	const searchTypeHandler = async (newValue: string) => {
		setSearchType(newValue);
		if (newValue !== 'ALL') {
			setMembersInquiry({
				...membersInquiry,
				page: 1,
				search: { ...membersInquiry.search, memberType: newValue as MemberType },
			});
		} else {
			const updated = { ...membersInquiry };
			delete updated?.search?.memberType;
			setMembersInquiry(updated);
		}
	};

	return (
		<Box className={'admin-page-content'}>
			<Stack className={'page-header'}>
				<Typography className={'page-title'}>Member List</Typography>
				<Typography className={'page-count'}>{membersTotal} total members</Typography>
			</Stack>

			<Box className={'admin-table-wrap'}>
				<Box sx={{ width: '100%' }}>
					<TabContext value={value}>
						<Stack className={'tab-header'}>
							<List className={'admin-tab-menu'}>
								{['ALL', 'ACTIVE', 'BLOCK', 'DELETE'].map((tab) => (
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
							<OutlinedInput
								value={searchText}
								onChange={(e) => textHandler(e.target.value)}
								placeholder="Search by nickname..."
								onKeyDown={(e) => {
									if (e.key === 'Enter') searchTextHandler();
								}}
								startAdornment={
									<InputAdornment position="start">
										<SearchIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
									</InputAdornment>
								}
								endAdornment={
									searchText && (
										<CancelRoundedIcon
											style={{ cursor: 'pointer', color: '#9ca3af', fontSize: 18 }}
											onClick={() => {
												setSearchText('');
												setMembersInquiry({ ...membersInquiry, search: { ...membersInquiry.search, text: '' } });
											}}
										/>
									)
								}
								className={'admin-search-input'}
							/>
							<Select value={searchType} className={'admin-select'} onChange={(e) => searchTypeHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Types</MenuItem>
								<MenuItem value={'USER'}>User</MenuItem>
								<MenuItem value={'AGENT'}>Agent</MenuItem>
								<MenuItem value={'ADMIN'}>Admin</MenuItem>
							</Select>
						</Stack>
						<Divider />

						<MemberPanelList
							members={members}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateMemberHandler={updateMemberHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={membersTotal}
							rowsPerPage={membersInquiry?.limit}
							page={membersInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminUsers.defaultProps = {
	initialInquiry: { page: 1, limit: 10, sort: 'createdAt', search: {} },
};

export default withAdminLayout(AdminUsers);
