import { makeVar } from '@apollo/client';
import { CustomJwtPayload } from '../libs/types/customJwtPayload';

export const themeVar = makeVar({});

export const userVar = makeVar<CustomJwtPayload>({
	_id: '',
	memberType: '',
	memberStatus: '',
	memberAuthType: '',
	memberPhone: '',
	memberNick: '',
	memberFullName: '',
	memberImage: '',
	memberAddress: '',
	memberDesc: '',

	/** AGENT STORE INFO (if AGENT) **/
	agentStoreName: '',
	agentStoreAddress: '',
	agentStoreLocation: '',
	agentStoreDesc: '',
	agentStoreImage: '',

	memberProducts: 0,
	memberEvents: 0,
	memberArticles: 0,
	memberFollowers: 0,
	memberFollowings: 0,
	memberLikes: 0,
	memberViews: 0,
	memberComments: 0,
	memberRank: 0,
	memberWarnings: 0,
	memberBlocks: 0,
});
