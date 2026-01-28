export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	EVENT_JOINED = 'EVENT_JOINED',
	EVENT_REMINDER = 'EVENT_REMINDER',
	EVENT_UPDATED = 'EVENT_UPDATED',
	EVENT_CANCELLED = 'EVENT_CANCELLED',
}

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	EVENT = 'EVENT',
}
