"use client";
import React, { useState } from 'react';
import JobApplicationModal from './JobApplicationModal';
import { Button } from '@/components/ui/button';

const ApplyNowAction = ({ job, className = '' }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsModalOpen(true)}
                className={`inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-full text-white bg-white hover:bg-primary text-primary hover:text-white border border-primary ${className}`}
            >
                I'm interested
            </Button>

            <JobApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                job={job}
            />
        </>
    );
};

export default ApplyNowAction;
