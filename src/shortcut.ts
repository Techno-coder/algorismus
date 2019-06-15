import hotkeys from "hotkeys-js";

export function register_shortcuts() {
    register_modal("shift+/", "help_modal");
    register_modal("a", "authenticate_modal");
    register_modal("o", "open_problem_modal", () => {
        let field = document.getElementById("problem_link") as HTMLInputElement;
        setTimeout(() => {
            field.setSelectionRange(0, field.value.length);
            field.focus()
        }, 10);
    });
}

export function register_modal(shortcut: string, modal_identifier: string, callback?: () => void) {
    hotkeys(shortcut, () => {
        let modal = document.getElementById(modal_identifier);
        let modal_is_hidden = modal.hidden;

        hide_all_modals();
        modal.hidden = !modal_is_hidden;

        if (callback != undefined) {
            callback();
        }
    });
}

export function hide_all_modals() {
    let modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
        if (modal instanceof HTMLElement) {
            modal.hidden = true;
        }
    }
}
