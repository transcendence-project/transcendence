export interface IChannel{
	id: number;
	name: number;
	messages: null; // will be message intergace 
	owner: null; // will be user interface
	admins: null; // will be user interface
	memebers: null; // will be user interface
	invites: null;  // will be user interface
	password: string;
	isGroupChan: boolean;
	isPrivate: boolean;
	isProtected: boolean;

	// banned
	// muted
}