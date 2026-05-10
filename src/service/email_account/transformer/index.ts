import { EmailAccount } from "../../../entity/email_account";
import { userResponseDatumToUserEntity } from "../../user/transformer";

export function emailAccountResponseDatumToEmailAccountEntity(emailAccountInfo: any) {
    let emailAccount = new EmailAccount();

    if (emailAccountInfo === null) {
        return emailAccount = null;
    }

    if (emailAccountInfo.id) {
        emailAccount.id = emailAccountInfo.id;
    }

    if (emailAccountInfo.user) {
        emailAccount.user = userResponseDatumToUserEntity(emailAccountInfo.user);
    }

    if (emailAccountInfo.email) {
        emailAccount.email = emailAccountInfo.email;
    }

    if (emailAccountInfo.refreshToken) {
        emailAccount.refreshToken = emailAccountInfo.refreshToken;
    }

    if (emailAccountInfo.accessToken) {
        emailAccount.accessToken = emailAccountInfo.accessToken;
    }

    return emailAccount;
}

export function emailAccountsResponseDataToEmailAccountsEntities(emailAccountsInfo: any[]): EmailAccount[] {
    if (!emailAccountsInfo || emailAccountsInfo.length === 0) {
        return [];
    }

    return emailAccountsInfo.map(emailAccountResponseDatumToEmailAccountEntity);
}