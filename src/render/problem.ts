import {Problem, Sample} from "../problem";
import * as Prism from "prismjs";
import {clear_submission_stubs} from "./submission";

export function render_problem(problem: Problem) {
    set_and_expose_identifier("information", problem.name);
    set_and_expose_identifier("statement", problem.statement);
    set_and_expose_identifier("input", problem.input);
    set_and_expose_identifier("output", problem.output);
    set_and_expose_identifier("hints", problem.hints);
    set_and_expose_identifier("explanation", problem.explanation);
    set_and_expose_identifier("constraints", problem.constraints);
    set_and_expose_identifier("subtasks", problem.subtasks);

    document.getElementById("auxiliary_card").hidden = true;
    if (problem.auxiliary != undefined) {
        set_auxiliary("input", problem.auxiliary.input_method);
        set_auxiliary("output", problem.auxiliary.output_method);
        set_auxiliary("memory", problem.auxiliary.memory_limit);
        set_auxiliary("time", problem.auxiliary.time_limit);
        document.getElementById("auxiliary_card").hidden = false;
    }

    if (problem.samples != undefined) {
        render_samples(problem.samples);
    }

    clear_submission_stubs();
    Prism.highlightAll();
}

export function render_samples(samples: Sample[]) {
    document.getElementById("sample_cases").innerHTML = "";
    for (let index in samples) {
        let sample = samples[index];
        let element = `
                <div class="card">
                    <div class="card-heading">Sample Case - ${index}</div>
                    <div class="flex flex-row">
                        <div class="w-1/2 mr-2">
                            <div class="font-bold mb-2">Input</div>
                            <pre><code class="language-none">${sample.input}</code></pre>
                        </div>
                        <div class="w-1/2 ml-2">
                            <div class="font-bold mb-2">Output</div>
                            <pre><code class="language-none">${sample.output}</code></pre>
                        </div>
                    </div>
                </div>
            `;
        document.getElementById("sample_cases").innerHTML += element;
    }
}

export function set_and_expose_identifier(identifier: string, text?: string) {
    document.getElementById(identifier + "_card").hidden = true;
    if (text != undefined) {
        document.getElementById(identifier + "_body").innerHTML = text;
        document.getElementById(identifier + "_card").hidden = false;
    }
}

export function set_auxiliary(field: string, value?: string) {
    document.getElementById("auxiliary_" + field).textContent = value || "None";
}
