import { JwtPayload } from 'jwt-decode';

export interface CustomJwtPayload extends JwtPayload {
	_id: string;
	memberType: string;
	memberStatus: string;
	memberAuthType: string;
	memberPhone: string;
	memberEmail?: string;
	memberNick: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;

	/** AGENT STORE INFO (if AGENT) **/
	agentStoreName?: string;
	agentStoreAddress?: string;
	agentStoreLocation?: string;
	agentStoreDesc?: string;
	agentStoreImage?: string;

	memberProducts: number;
	memberEvents: number;
	memberArticles: number;
	memberFollowers: number;
	memberFollowings: number;
	memberLikes: number;
	memberViews: number;
	memberComments: number;
	memberRank: number;
	memberWarnings: number;
	memberBlocks: number;
}
