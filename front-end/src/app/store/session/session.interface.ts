import { User } from './../../model/user.model';
import { UploadedImage } from './../../model/uploaded.image.model';
import { GlobalNotification } from 'app/model/global.notifications';

export interface ISession {
    isAuthenticated: boolean;
    currentUser?: User;
    avatar?: UploadedImage;
    notificationsNumber?: Number;
    globalNotifications?: GlobalNotification[];
}
