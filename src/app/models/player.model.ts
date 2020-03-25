import { FirebaseId } from './fb-key';

export class Player {
  id?: string; 
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}
