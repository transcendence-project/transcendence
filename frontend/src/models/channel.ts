export interface IChannel{
	id: number;
	name: string;
	// messages: null; // will be message intergace 
	owner: null;
	admins: null;
	members: [];
	invites: null;
	// state: string;
	// isGroupChan: boolean;
	isPrivate: boolean;
	isProtected: boolean;
	isPublic: boolean;

	// banned
	// muted
}