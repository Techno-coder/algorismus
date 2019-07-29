export class Problem {
    name: string;
    auxiliary: Auxiliary;
    statement: string;
    input: string;
    output: string;
    hints: string;
    explanation: string;
    samples: Sample[];
    constraints: string;
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

export class SubmissionStub {
    link: string;
    date: string;
    score: number | null;
}

export class Submission {
    stub: SubmissionStub;
    test_sets: TestSet[];
    source: string;
}

export class TestSet {
    name: string;
    test_cases: TestCase[];
}

export class TestCase {
    time: string;
    memory: string;
    result: string;
    score: number | null;
}
