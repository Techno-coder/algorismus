import * as Cookies from "js-cookie";
import {hide_all_modals} from "./shortcut";

const SESSION_IDENTIFIER_KEY = "_session_id";

export function on_session_cookie_save() {
    let field_element = document.getElementById("session_cookie_field");
    let session_identifier = (field_element as HTMLInputElement).value;
    Cookies.set(SESSION_IDENTIFIER_KEY, session_identifier);
    hide_all_modals();
}

export function get_session_identifier(): string | null {
    return Cookies.get(SESSION_IDENTIFIER_KEY);
}
