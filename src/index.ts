import "./style.css"

import 'katex';
import 'clipboard';
import 'hotkeys-js';
import 'js-cookie';

import 'prismjs';
import "prismjs/plugins/toolbar/prism-toolbar.min";
import "prismjs/plugins/line-numbers/prism-line-numbers.min";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min";

import {register_shortcuts} from "./shortcut";
import {on_open, on_submit} from "./request";
import {on_session_cookie_save} from "./authentication";

document.addEventListener("DOMContentLoaded", on_load);

export function on_load() {
    register_shortcuts();
    register_button("open_button", on_open);
    register_button("session_cookie_save_button", on_session_cookie_save);
    register_submission();
}

export function register_button(identifier: string, callback: any) {
    document.getElementById(identifier).addEventListener("click", callback);
}

export function register_submission() {
    let submission_file = document.getElementById("submission_file") as HTMLInputElement;
    submission_file.onchange = () => {
        if (submission_file.files.length > 0) {
            on_submit(submission_file.files[0]);
            submission_file.value = null;
        }
    };
}
