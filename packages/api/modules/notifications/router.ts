import { getPreferences } from "./procedures/get-preferences";
import { list } from "./procedures/list";
import { markAllAsRead } from "./procedures/mark-all-as-read";
import { markAsRead } from "./procedures/mark-as-read";
import { updatePreferences } from "./procedures/update-preferences";

export const notificationsRouter = {
	list,
	markAsRead,
	markAllAsRead,
	getPreferences,
	updatePreferences,
};
