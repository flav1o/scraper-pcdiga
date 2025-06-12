import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET;

@Injectable()
export class GoogleAuthService {
  constructor() {}

  async getUserPayload(code: string) {
    const client = new OAuth2Client(clientId, clientSecret);

    const data = await client.getToken({
      client_id: clientId,
      code,
      redirect_uri: 'http://localhost:5173',
    });

    const funcs = await client.verifyIdToken({
      idToken: data.tokens.id_token,
      audience: clientId,
    });

    return funcs.getPayload();
  }
}
