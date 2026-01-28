import { MemberAuthType, MemberStatus, MemberType, AgentStoreRegion } from '../../enums/member.enum';
import { MeLiked, TotalCounter } from '../product/product';
import { MeFollowed } from '../follow/follow';

export interface Member {
	_id: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberAuthType: MemberAuthType;
	memberPhone: string;
	memberEmail?: string;
	memberNick: string;
	memberPassword?: string;
	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;

	/** Agent Store Info **/
	agentStoreName?: string;
	agentStoreAddress?: string;
	agentStoreLocation?: AgentStoreRegion;
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
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;

	/** Enable for authentications **/
	meLiked?: MeLiked[];
	meFollowed?: MeFollowed[];
	accessToken?: string;
}

export interface Members {
	list: Member[];
	metaCounter: TotalCounter[];
}
