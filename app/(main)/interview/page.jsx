import { getAssessments } from '@/actions/interview'
import React from 'react'
import StatsCard from './_component/StatsCard';
import PerformanceChart from './_component/PerformanceChart';
import QuizList from './_component/QuizList';

const InterviewPage = async () => {
  const assessments = await getAssessments();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCard assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}

export default InterviewPage