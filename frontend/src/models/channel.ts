export interface IChannel{
	id: number;
	name: string;
	messages: null; // will be message intergace 
	owner: null; // will be user interface
	admins: null; // will be user interface
	members: null; // will be user interface
	invites: null;  // will be user interface
	password: string;
	state: string;
	// isGroupChan: boolean;
	// isPrivate: boolean;
	// isProtected: boolean;

	// banned
	// muted
}