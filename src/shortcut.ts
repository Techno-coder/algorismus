import hotkeys from "hotkeys-js";

export function register_shortcuts() {
    document.getElementById("help_activation").onclick = () => toggle_modal("help_modal");

    register_modal("shift+/", "help");
    register_modal("a", "authenticate");
    register_modal("o", "open_problem", () => {
        let field = document.getElementById("problem_link") as HTMLInputElement;
        setTimeout(() => {
            field.setSelectionRange(0, field.value.length);
            field.focus()
        }, 10);
    });
}

export function register_modal(shortcut: string, modal_identifier: string, callback?: () => void) {
    let activation = () => toggle_modal(modal_identifier + "_modal", callback);
    document.getElementById("help_" + modal_identifier).onclick = activation;
    hotkeys(shortcut, activation)
}

export function hide_all_modals() {
    let modals = document.getElementsByClassName("modal");
    for (let modal of modals) {
        if (modal instanceof HTMLElement) {
            modal.hidden = true;
        }
    }
}

export function toggle_modal(modal_identifier: string, callback?: () => void) {
    let modal = document.getElementById(modal_identifier);
    let modal_is_hidden = modal.hidden;

    hide_all_modals();
    modal.hidden = !modal_is_hidden;

    if (callback != undefined) {
        callback();
    }
}
