import { adminRouting } from '../elements/adminRouting';
import { privateRouting } from '../elements/privateRouting';
import { publicRouting } from '../elements/publicRouting';

export const allRouting = [...adminRouting, ...privateRouting, ...publicRouting];