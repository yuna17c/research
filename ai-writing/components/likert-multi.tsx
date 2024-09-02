export const questions = [
    { id: 1, text: "1. How socially distant do you feel with the receiver of the email? Social distance refers to how close or familiar two people feel with each other. It's often based on how often they interact and what they exchange, like help, favours, or emotional support." },
    { id: 2, text: "2. How do you perceive the power dynamic between you and the receiver? Power dynamic refers to how much one person can control or influence another. This can involve control over resources (like money or authority) or the ability to shape others' beliefs and actions." },
    { id: 3, text: "3. How demanding you think your request is to the receiver? The level that a task is demanding can be determined based on two factors: 1) the services requested (like time or effort) and 2) the goods requested (including non-material goods like information or expressions of respect)." }
]

export const labels = {
    'lower': ['Close','I\'m more powerful','Undemanding'],
    'upper': ['Distant','Receiver is more powerful','Demanding']
}

interface LikertScaleProps {
    scenarioId: number;
    questionId: number;
    options: number[];
    onChange: (scenarioId: number, questionId: number, value: number) => void;
    value: number;
    label1: string;
    label2: string;
}

const LikertScaleMulti: React.FC<LikertScaleProps> = ({ scenarioId, questionId, options, onChange, value, label1, label2 }) => {
    return (
        <div className='likert-container'>
            <div className='likert-labels'>
                <p>{label1}</p>
                <p>{label2}</p>
            </div>
            <div className="likert">
                {options.map((val) => (
                <label key={val}>
                <input
                    type="radio"
                    name={`scenario-${scenarioId}-question-${questionId}`}
                    value={val}
                    checked={value === val}
                    onChange={() => onChange(scenarioId, questionId, val)}
                    required
                />
                {val}
                </label>
            ))}
            </div>
        </div>
    );
};
export default LikertScaleMulti;