export class Problem {
    name: string;
    auxiliary: Auxiliary;
    statement: string;
    input: string;
    output: string;
    hints: string;
    explanation: string;
    samples: Sample[];
    subtasks: string;
}

export class Sample {
    input: string;
    output: string;
}

export class Auxiliary {
    input_method: string;
    output_method: string;
    memory_limit: string;
    time_limit: string;
}
