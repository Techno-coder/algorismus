import {SubmissionStub} from "../problem";

export function clear_submission_stubs() {
    document.getElementById("submissions_card").hidden = true;
    document.getElementById("submissions_list").innerHTML = "";
}

export function render_submission_stubs(stubs: SubmissionStub[]) {
    clear_submission_stubs();
    if (stubs.length == 0) return;

    for (let stub of stubs) {
        let score: string;
        if (stub.score == null) score = `<i>Pending</i>`;
        else if (stub.score == 100) score = `<b>100</b>`;
        else score = `${stub.score}`;

        let element = `
            <div class="submission-stub" onclick="window.open('${stub.link}', '_blank')">
                ${stub.date}<span style="float: right">${score}</span>
            </div>
            `;
        document.getElementById("submissions_list").innerHTML += element;
    }

    document.getElementById("submissions_card").hidden = false;
}

export function notify_submission(problem_name: string, submission: SubmissionStub) {
    let notification = new Notification(`${problem_name}`, {
        body: `Score: ${submission.score}`,
        requireInteraction: true,
    });

    notification.onclick = () => window.open(submission.link, "_blank");
}
