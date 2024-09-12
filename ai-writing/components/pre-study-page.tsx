import React, { useState } from 'react';
import LikertScaleMulti from './likert-multi';
import { labels } from './likert-multi'
import { LIKERT_QUESTIONS, PRE_STUDY_INSTR, SCENARIOS_TYPE } from './variables';
import { changeToDic } from '@/app/utils';

interface SurveyFormProps {
    onComplete: (responses: {[key:number]:number[]}) => void;
    onBack: () => void;
    scenarios: SCENARIOS_TYPE[];
}

const PreStudyPage: React.FC<SurveyFormProps> = ({ onComplete, onBack, scenarios }) => {

    const labels_lwr = labels.lower
    const labels_upr = labels.upper
    const [answers, setAnswers] = useState<number[][]>([]);
    
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onComplete(changeToDic(answers));
    };

    const handleResponseChange = (scenarioId: number, questionId: number, value: number) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            if (!updatedAnswers[scenarioId-1]) {
                updatedAnswers[scenarioId-1] = [];
            }
            updatedAnswers[scenarioId-1][questionId-1] = value;
            return updatedAnswers;
        });
    };

    return (
        <>
            <h1 className='page-title'>Pre-study Evaluations</h1>
            <form id="pre-study" onSubmit={handleSubmit}>
                <p>{PRE_STUDY_INSTR}</p><br/>
                <div className='likerts'>
                {scenarios.map((scenario, idx) => (
                    <div key={scenario.id}>
                        <p><span className='bold'>Scenario {idx+1}</span><br/>{scenario.text}</p>
                        <br/>
                        {LIKERT_QUESTIONS.map((question, index) => (
                        <div key={question.id}>
                            <p>{question.text}</p>
                            <LikertScaleMulti
                                scenarioId={scenario.id}
                                questionId={question.id}
                                options={[1,2,3,4,5,6,7]}
                                value={answers[scenario.id-1]?.[question.id-1] || 0}
                                onChange={handleResponseChange}
                                label1={labels_lwr[index]}
                                label2={labels_upr[index]}
                            />
                        </div>
                        ))}
                        <hr/><br/>
                    </div>
                ))}
                </div>
                <div className='nav-buttons'>
                    <button className="submit-button back-button" type="button" onClick={onBack}>Back</button>
                    <button className="submit-button" type="submit">Next</button>
                </div>
            </form>
        </>
    );
};

export default PreStudyPage;
