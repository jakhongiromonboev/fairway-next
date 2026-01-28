import { AgentStoreRegion } from '../../enums/member.enum';

export interface AgentStoreInput {
	agentStoreName: string;
	agentStoreAddress: string;
	agentStoreLocation: AgentStoreRegion;
	agentStoreDesc?: string;
	agentStoreImage?: string;
}

export interface AgentStoreUpdate {
	agentStoreName?: string;
	agentStoreAddress?: string;
	agentStoreLocation?: AgentStoreRegion;
	agentStoreDesc?: string;
	agentStoreImage?: string;
}
