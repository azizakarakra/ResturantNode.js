import { roles } from "../../Middleware/auth.middleware.js";

export const endpoint = {

    create:[roles.User],
    update:[roles.Admin],
    get:[roles.User, roles.Admin],
    cancel:[roles.User],
}