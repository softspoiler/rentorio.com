export enum GlobalNotificationType {
    PUBLISHED, DRAFT, TEMPLATE
}

export class GlobalNotification implements GlobalNotification {
    id: Number;
    type: GlobalNotificationType;
    message: String;
    isArchived: Boolean;
    isDeleted: Boolean;
    timestamp: number;
 }