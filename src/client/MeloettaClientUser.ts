

export class MeloettaClientUser {
	constructor(private _data: MeloettaClientUserData) {}

	public get username() { return this._data.username; }
	public get avatar() { return this._data.avatar; }
	public get userId() { return this._data.userid; }
	
}

type MeloettaClientUserData = {
	userid: string;
	usernum: string;
	username: string;
	email: string | null;
	registertime: string;
	group: string;
	banstate: string;
	ip: string;
	avatar: string;
	account: string | null;
	logintime: string;
	loginip: string;
	loggedin: boolean;
	outdatedpassword: boolean;
};