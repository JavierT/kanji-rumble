import { FirebaseId } from './fb-key';

export class Player {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  difficulty?: number;
  mode?: number;
}


export class PlayerUpdate {
  emailVerified?: boolean;
  email?: string;
  displayName?: string;
  photoURL?: string;
  difficulty?: number;
  mode?: number;
}

