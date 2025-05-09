import React, { useState } from 'react';
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const MarketingTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleGenerateTemplate = async () => {
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsGenerating(true);
    
    // TODO: Implement actual API call to generate template
    // This is a mock implementation
    setTimeout(() => {
      const generatedContent = `Here's a ${selectedCategory} template based on your request:\n\n${prompt}\n\n[Generated content will appear here]`;
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generatedContent,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Add to templates
      const newTemplate: Template = {
        id: Date.now().toString(),
        title: `Template ${templates.length + 1}`,
        content: generatedContent,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      };
      setTemplates([...templates, newTemplate]);
      setPrompt('');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 lg:ml-[240px]">
        {/* Top navigation */}
        <Header />
        
        {/* Page content */}
        <main className="p-4 sm:p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Marketing Templates</h1>
            <p className="text-subtle">Create and manage marketing materials for your hotel</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Generation Section */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Generate New Template</h2>
              <div className="space-y-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="email">Email Marketing</SelectItem>
                    <SelectItem value="website">Website Content</SelectItem>
                    <SelectItem value="brochure">Brochure</SelectItem>
                  </SelectContent>
                </Select>
                
                <Textarea
                  placeholder="Describe your marketing needs (e.g., 'Create a social media post for our summer promotion')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px]"
                />
                
                <Button 
                  onClick={handleGenerateTemplate}
                  disabled={!prompt || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? 'Generating...' : 'Generate Template'}
                </Button>
              </div>

              {/* Generated Messages Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Conversation History</h3>
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <p className="text-sm">Generating template...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </Card>

            {/* Templates List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Templates</h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {templates.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No templates generated yet. Start by creating one!
                    </p>
                  ) : (
                    templates.map((template) => (
                      <Card key={template.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{template.title}</h3>
                            <p className="text-sm text-muted-foreground">{template.category}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                        <p className="mt-2 text-sm whitespace-pre-wrap">{template.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created: {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MarketingTemplates;
