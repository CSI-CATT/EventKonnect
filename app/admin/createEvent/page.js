"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import EventForm from "@/components/create-event-form-manual";

//initialize AI generated data in the form if available
function CreateEventContent() {
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');
    let initialData = null;

    if (dataString) {
        try {
            initialData = JSON.parse(decodeURIComponent(dataString));
        } catch (error) {
            console.error("Failed to parse event data from URL", error);
        }
    }
    
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto p-4 space-y-4">
                <div className="space-y-2 text-center py-8">
                    <h1 className="text-3xl font-bold text-purple-400">
                        {initialData ? "🤖 Review Your AI-Generated Event" : "📝 Create a New Event"}
                    </h1>
                    <p className="text-gray-400">
                        {initialData ? "Review and edit the details below, then click create!" : "Fill in the details manually to create your event."}
                    </p>
                </div>
                <EventForm initialData={initialData} />
            </div>
        </div>
    );
}

export default function CreateEventPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Form...</div>}>
            <CreateEventContent />
        </Suspense>
    )
}