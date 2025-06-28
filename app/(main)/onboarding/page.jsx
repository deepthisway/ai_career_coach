import { getUserOnboardingStatus } from '@/actions/user';
import { industries } from '@/data/industries';
import React from 'react'
import OnboardingForm from './_components/onboarding-form';

const OnboardingPage = async () => {
    // check if the user is already onboarded
    // if not, redirect to the onboarding form
    const {isOnboarded} = await getUserOnboardingStatus();
    if(isOnboarded) {
        redirect('/dashboard');
    }

  return (
    <OnboardingForm industies = {industries}/>
    // this sepereate component is used beauce the componenet has to use the 'use-client' directive

)
}

export default OnboardingPage;;