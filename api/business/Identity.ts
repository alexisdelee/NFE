export class IdentityInfo {
    public userId: number;
    public authToken: string;
}

export class Identity {
    private accounts: Map<number, IdentityInfo> = new Map<number, IdentityInfo>();

    public getAccount(userId: number): IdentityInfo {
        return this.accounts.get(userId);
    }

    public getAuthToken(userId: number): string {
        return this.getAccount(userId).authToken;
    }
}
