"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Wand2 } from "lucide-react";

export default function CreateWithAiPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [structuredDetails, setStructuredDetails] = useState({
        title: '',
        eventType: '',
        category: '',
    });

    // State to track which tab is active
    const [generationType, setGenerationType] = useState('prompt');

    const handleStructuredChange = (key, value) => {
        setStructuredDetails(prev => ({ ...prev, [key]: value }));
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        let requestBody = {};
        let originalTitle = '';
        
        if (generationType === 'prompt') { //'prompt'
            if (!prompt) {
                toast.error("Please enter a prompt.");
                setIsLoading(false);
                return;
            }
            requestBody = { 
                generationType: 'prompt', 
                prompt: prompt 
            };
            originalTitle = prompt;
        } else { // 'structured'
            if (!structuredDetails.title || !structuredDetails.eventType || !structuredDetails.category) {
                toast.error("Please fill in all details.");
                setIsLoading(false);
                return;
            }
            requestBody = { 
                generationType: 'structured', 
                details: structuredDetails 
            };
            originalTitle = structuredDetails.title;
        }

        try {
            const response = await axios.post('/api/admin/create-event', requestBody);
            
            if (response.data?.success) {
                toast.success("Event details generated! Redirecting...");
                
                const aiData = response.data.data;
                //aiData.title = originalTitle;        //Preserve user's original title

                const queryString = encodeURIComponent(JSON.stringify(aiData));
                router.push(`/admin/createEvent?data=${queryString}`);
            } else {
                throw new Error(response.data?.error || "Failed to generate event.");
            }
        } catch (error) {
            console.error("Generation failed:", error);
            const errorMessage = error.response?.data?.error || error.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Create Event with AI ✨
                    </h1>
                    <p className="text-gray-400 mt-2">Generate event details and edit them on the next page.</p>
                </div>
                {/* Use onValueChange to update the active generation type */}
                <Tabs defaultValue="prompt" className="w-full" onValueChange={(value) => setGenerationType(value)}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800 border border-purple-500/20">
                        <TabsTrigger value="prompt">From a Prompt</TabsTrigger>
                        <TabsTrigger value="details">With Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="prompt">
                        <div className="p-6 bg-gray-900/80 border border-purple-500/20 rounded-lg mt-4 space-y-4">
                            <Label htmlFor="prompt" className="text-lg">Event Idea or Title</Label>
                            <Textarea id="prompt" placeholder="e.g., A three-day music festival in Goa..." value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-[120px] bg-gray-800 border-gray-600 text-white" />
                            <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg">
                                {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" /> Generate & Continue</>}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="details">
                         <div className="p-6 bg-gray-900/80 border border-purple-500/20 rounded-lg mt-4 space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="title" className="text-lg">Event Title</Label>
                                <Input id="title" placeholder="e.g., Annual Marketing Summit" value={structuredDetails.title} onChange={(e) => handleStructuredChange('title', e.target.value)} className="bg-gray-800 border-gray-600 text-white h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-lg">Event Type</Label>
                                <Select onValueChange={(value) => handleStructuredChange('eventType', value)}>
                                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white h-11"><SelectValue placeholder="Select an event type" /></SelectTrigger>
                                    <SelectContent className="bg-gray-800 text-white border-gray-600">
                                        <SelectItem value="conference">Conference</SelectItem>
                                        <SelectItem value="workshop">Workshop</SelectItem>
                                        <SelectItem value="seminar">Seminar</SelectItem>
                                        <SelectItem value="networking">Networking</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                           <div className="space-y-2">
                                <Label className="text-lg">Category</Label>
                                <Select onValueChange={(value) => handleStructuredChange('category', value)}>
                                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white h-11"><SelectValue placeholder="Select a category" /></SelectTrigger>
                                    <SelectContent className="bg-gray-800 text-white border-gray-600">
                                        <SelectItem value="technology">Technology</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                        <SelectItem value="design">Design</SelectItem>
                                        <SelectItem value="marketing">Marketing</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleGenerate} disabled={isLoading} className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg">
                                 {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" /> Generate & Continue</>}
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}