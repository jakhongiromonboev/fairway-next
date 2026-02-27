import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Moment from 'react-moment';
import { Member } from '../../../types/member/member';
import { REACT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';

const headCells = [
	{ id: 'nickname', label: 'MEMBER', numeric: true },
	{ id: 'phone', label: 'PHONE', numeric: true },
	{ id: 'type', label: 'TYPE', numeric: false },
	{ id: 'warnings', label: 'WARNINGS', numeric: false },
	{ id: 'blocks', label: 'BLOCKS', numeric: false },
	{ id: 'created', label: 'JOINED', numeric: true },
	{ id: 'state', label: 'STATUS', numeric: false },
];

const statusClass: Record<string, string> = {
	ACTIVE: 'badge success',
	BLOCK: 'badge error',
	DELETE: 'badge delete',
};

const typeClass: Record<string, string> = {
	USER: 'badge up',
	AGENT: 'badge warning',
	ADMIN: 'badge block',
};

interface MemberPanelListType {
	members: Member[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateMemberHandler: any;
}

export const MemberPanelList = (props: MemberPanelListType) => {
	const { members, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateMemberHandler } = props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} size="medium">
					<TableHead>
						<TableRow>
							{headCells.map((cell) => (
								<TableCell key={cell.id} align={cell.numeric ? 'left' : 'center'}>
									{cell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{members.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className="no-data">No members found</span>
								</TableCell>
							</TableRow>
						)}
						{members.map((member: Member, index: number) => {
							const memberImage = member.memberImage ? `${member.memberImage}` : '/img/profile/defaultUser.svg';
							return (
								<TableRow hover key={member._id}>
									<TableCell align="left">
										<Stack direction="row" alignItems="center" gap={1.5}>
											<Avatar src={memberImage} sx={{ width: 36, height: 36 }} />
											<Stack>
												<Link href={`/member?memberId=${member._id}`}>
													<Typography
														sx={{
															fontSize: 14,
															fontWeight: 600,
															color: '#181a20',
															cursor: 'pointer',
															'&:hover': { color: '#2d5016' },
														}}
													>
														{member.memberNick}
													</Typography>
												</Link>
												<Typography sx={{ fontSize: 12, color: '#9ca3af' }}>{member.memberFullName ?? '—'}</Typography>
											</Stack>
										</Stack>
									</TableCell>
									<TableCell align="left">{member.memberPhone}</TableCell>
									<TableCell align="center">
										<Button
											onClick={(e: any) => menuIconClickHandler(e, `type_${index}`)}
											className={typeClass[member.memberType] ?? 'badge'}
										>
											{member.memberType}
										</Button>
										<Menu
											anchorEl={anchorEl[`type_${index}`]}
											open={Boolean(anchorEl[`type_${index}`])}
											onClose={menuIconCloseHandler}
											TransitionComponent={Fade}
										>
											{Object.values(MemberType)
												.filter((t) => t !== member.memberType)
												.map((type) => (
													<MenuItem
														key={type}
														onClick={() => updateMemberHandler({ _id: member._id, memberType: type })}
													>
														<Typography variant="subtitle1">{type}</Typography>
													</MenuItem>
												))}
										</Menu>
									</TableCell>
									<TableCell align="center">{member.memberWarnings ?? 0}</TableCell>
									<TableCell align="center">{member.memberBlocks ?? 0}</TableCell>
									<TableCell align="left">
										<Moment format="DD.MM.YY">{member.createdAt}</Moment>
									</TableCell>
									<TableCell align="center">
										<Button
											onClick={(e: any) => menuIconClickHandler(e, `status_${member._id}`)}
											className={statusClass[member.memberStatus] ?? 'badge'}
										>
											{member.memberStatus}
										</Button>
										<Menu
											anchorEl={anchorEl[`status_${member._id}`]}
											open={Boolean(anchorEl[`status_${member._id}`])}
											onClose={menuIconCloseHandler}
											TransitionComponent={Fade}
										>
											{Object.values(MemberStatus)
												.filter((s) => s !== member.memberStatus)
												.map((status) => (
													<MenuItem
														key={status}
														onClick={() => updateMemberHandler({ _id: member._id, memberStatus: status })}
													>
														<Typography variant="subtitle1">{status}</Typography>
													</MenuItem>
												))}
										</Menu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
