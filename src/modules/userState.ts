import { UserData } from "~system/Players"
import * as utils from '@dcl-sdk/utils'

export const User: UserState[] = []

export class UserState {
    public name: string | undefined
    public address: string
    public avatar: string | undefined
    public adminStatus: boolean = false;
    
    constructor(userData: UserData | undefined) {
        this.address = "";
        if (userData?.publicKey) {
            this.name = userData.displayName;
            this.address = userData.publicKey;
            this.avatar = userData.avatar?.snapshots?.face256;
        }
        User.push(this);
    }

}