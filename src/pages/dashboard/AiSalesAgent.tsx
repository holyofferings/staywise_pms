import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  User, 
  Key, 
  Wand, 
  Save, 
  Send
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface KnowledgeBaseItem {
  keywords: string[];
  answer: string;
  priority: number;
}

const AISalesAgent: React.FC = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI sales assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [botName, setBotName] = useState("Staywise Assistant");
  const [apiKey, setApiKey] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [script, setScript] = useState(
    "Hello! I'm your AI sales assistant from Staywise. How can I help you with your hotel booking today?"
  );
  const [features, setFeatures] = useState({
    leadQualification: true,
    roomRecommendations: true,
    pricing: true,
    promotions: false,
    bookingAssistance: true,
    faq: true,
  });
  const [personality, setPersonality] = useState<
    "professional" | "friendly" | "helpful" | "concise"
  >("professional");

  // Bot knowledge base
  const knowledgeBase: KnowledgeBaseItem[] = [
    {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        answer: "Hello! How can I help you with Staywise Hotel Manager Pro today?",
        priority: 1
    },
    {
        keywords: ['bye', 'goodbye', 'see you', 'thanks', 'thank you'],
        answer: "You're welcome! Feel free to ask if you have more questions. Goodbye!",
        priority: 1
    },
    {
        keywords: ['staywise', 'what is staywise', 'tell me about', 'your product'],
        answer: "Staywise Hotel Manager Pro is an all-in-one software solution designed to help hotel managers streamline operations, manage bookings, track finances, and enhance guest experiences.",
        priority: 2
    },
    {
        keywords: ['features', 'capabilities', 'what can it do', 'functions'],
        answer: "Staywise includes features like: Booking Management, Channel Manager Integration (OTAs), Guest Profiles (CRM), Housekeeping Management, Reporting & Analytics, Direct Booking Engine integration, and more. Is there a specific feature you'd like to know more about?",
        priority: 3
    },
    {
        keywords: ['booking management', 'reservations'],
        answer: "Our booking management system provides a visual calendar, easy drag-and-drop for reservation changes, group booking handling, and tracking of booking sources.",
        priority: 4 
    },
    {
        keywords: ['channel manager', 'ota', 'booking.com', 'expedia'],
        answer: "Yes, Staywise integrates with major Online Travel Agencies (OTAs) via a built-in channel manager. This automatically syncs rates and availability to prevent overbookings and save you time.",
        priority: 4
    },
    {
        keywords: ['pricing', 'cost', 'how much', 'plans', 'price'],
        answer: "We offer flexible pricing plans based on the size and needs of your hotel. For detailed information and a personalized quote, please visit our Pricing page or contact our sales team via the 'Request a Demo' button.",
        priority: 3
    },
    {
        keywords: ['demo', 'trial', 'try it', 'see it work'],
        answer: "We'd love to show you Staywise in action! You can request a personalized demo through the 'Request a Demo' button on our website. We might also offer a free trial period, check our website for current offers.",
        priority: 3
    },
    {
        keywords: ['support', 'help', 'assistance', 'contact'],
        answer: "We offer customer support through various channels. Please check the 'Support' or 'Contact Us' section on our website for details on how to reach our support team.",
        priority: 2
    },
    {
        keywords: ['security', 'data safety', 'secure'],
        answer: "Data security is a top priority. We use industry-standard security measures, including encryption and regular backups, to protect your hotel and guest data. More details can be found in our Privacy Policy.",
        priority: 3
    },
     {
        keywords: ['housekeeping', 'cleaning', 'room status'],
        answer: "Staywise includes a housekeeping module that allows you to track room cleaning status (clean, dirty, inspected), assign tasks to staff, and get real-time updates.",
        priority: 4
    },
     {
        keywords: ['reporting', 'analytics', 'reports'],
        answer: "Our reporting tools give you insights into key metrics like occupancy rates, RevPAR, ADR, booking sources, financial summaries, and more, helping you make data-driven decisions.",
        priority: 4
    }
  ];

  // Fallback responses when no match is found
  const fallbackResponses = [
    "That's a great question! I don't have the specific answer right now, but you can find more details on our website or contact our support team.",
    "I'm still learning about that specific topic. Could you try rephrasing, or check our FAQ page?",
    "Interesting point. For detailed information on that, I recommend contacting our sales or support team directly through the website.",
    "I can help with questions about Staywise features, pricing, and general information. For more specific queries, please reach out via our contact form."
  ];

  // Preprocess text function - similar to the Python version
  const preprocessText = (text: string): string[] => {
    const lowerText = text.toLowerCase();
    const withoutPunctuation = lowerText.replace(/[^\w\s]/g, '');
    return withoutPunctuation.split(/\s+/);
  };

  // Find best match function
  const findBestMatch = (userInputTokens: string[]): string | null => {
    let bestMatch = null;
    let highestScore = 0;
    let highestPriority = 0;
    
    const userInputText = userInputTokens.join(' ');

    for (const item of knowledgeBase) {
      let score = 0;
      const priority = item.priority || 0;

      for (const keyword of item.keywords) {
        if (userInputText.includes(keyword)) {
          score += 1;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        highestPriority = priority;
        bestMatch = item;
      } else if (score === highestScore && score > 0) {
        if (priority > highestPriority) {
          highestPriority = priority;
          bestMatch = item;
        }
      }
    }

    return bestMatch ? bestMatch.answer : null;
  };

  // Get bot response
  const getBotResponse = (userMessage: string): string => {
    const processedMessage = preprocessText(userMessage);

    if (processedMessage.length === 0) {
      return "Could you please provide more details?";
    }

    const response = findBestMatch(processedMessage);

    if (response) {
      return response;
    } else {
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Get AI response based on knowledge base
    const botResponse = getBotResponse(newMessage);
    setNewMessage("");

    // Add bot response with a slight delay for natural feeling
    setTimeout(() => {
      const botResponseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponseMessage]);
    }, 800);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your AI sales agent has been updated.",
    });
  };

  const handleSetApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey);
      setNewApiKey("");
      setIsApiKeyDialogOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your API key has been securely stored.",
      });
    }
  };

  const handleGenerateWithAI = (field: string) => {
    // This would normally make an API call to generate content
    // For demo purposes, we'll just simulate it with predefined responses
    const sampleResponses: Record<string, string> = {
      roomQuery: "Thank you for your interest in our rooms. We currently have deluxe rooms and suites available for your selected dates. Our deluxe rooms feature king-sized beds, en-suite bathrooms, and city views, starting at $189 per night. Our premium suites include separate living areas and private balconies, starting at $289 per night. Would you like me to check availability for either option?",
      upsellScript: "I notice you're booking our standard room. For just $50 more per night, you can upgrade to our deluxe suite which includes a private balcony, complimentary breakfast, and access to our premium spa facilities. This is one of our most popular options for guests looking to make their stay special. Would you be interested in this upgrade?"
    };

    // Find the textarea by id and update its value
    const textarea = document.getElementById(field) as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = sampleResponses[field] || "Generated content would appear here";
      
      toast({
        title: "Content Generated",
        description: "AI has successfully generated content.",
      });
    }
  };

  const handleFeatureChange = (feature: keyof typeof features) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (!showApiKey) {
      return "•".repeat(Math.min(key.length, 20));
    }
    return key;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">AI Sales Agent</h1>
          <p className="text-subtle">Automate your sales process with AI</p>
        </div>

        <div className="flex justify-end gap-2 mb-6">
          <Button 
            variant="outline" 
            onClick={() => setIsApiKeyDialogOpen(true)}
          >
            <Key className="mr-2 h-4 w-4" /> API Key
          </Button>
          <Button 
            onClick={handleSaveChanges}
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        {apiKey && (
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">API Key:</span>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {maskApiKey(apiKey)}
                  </code>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">Bot Settings</TabsTrigger>
                <TabsTrigger value="scripts">Conversation Scripts</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Configuration</CardTitle>
                    <CardDescription>
                      Configure your AI sales assistant's basic settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="botName">Bot Name</Label>
                      <Input 
                        id="botName" 
                        value={botName} 
                        onChange={(e) => setBotName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Bot Personality</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button 
                          variant={personality === "professional" ? "default" : "outline"}
                          onClick={() => setPersonality("professional")}
                          className="justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Professional
                        </Button>
                        <Button 
                          variant={personality === "friendly" ? "default" : "outline"}
                          onClick={() => setPersonality("friendly")}
                          className="justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Friendly
                        </Button>
                        <Button 
                          variant={personality === "helpful" ? "default" : "outline"}
                          onClick={() => setPersonality("helpful")}
                          className="justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Helpful
                        </Button>
                        <Button 
                          variant={personality === "concise" ? "default" : "outline"}
                          onClick={() => setPersonality("concise")}
                          className="justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Concise
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Features</CardTitle>
                    <CardDescription>
                      Enable or disable specific capabilities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(features).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </Label>
                          <Switch 
                            id={key}
                            checked={value}
                            onCheckedChange={() => handleFeatureChange(key as keyof typeof features)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Model</CardTitle>
                    <CardDescription>
                      Configure the AI model powering your agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Model</Label>
                          <p className="font-medium">GPT-4</p>
                        </div>
                        <div>
                          <Label className="text-sm">Context Size</Label>
                          <p className="font-medium">8k tokens</p>
                        </div>
                        <div>
                          <Label className="text-sm">Temperature</Label>
                          <p className="font-medium">0.7</p>
                        </div>
                        <div>
                          <Label className="text-sm">Max Response</Label>
                          <p className="font-medium">500 tokens</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scripts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Message</CardTitle>
                    <CardDescription>
                      Customize the initial message your bot sends to users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Room Inquiry Response</CardTitle>
                    <CardDescription>
                      How your bot responds to room availability questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Textarea 
                      id="roomQuery"
                      placeholder="Enter response template for room inquiries"
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => handleGenerateWithAI("roomQuery")}
                      >
                        <Wand className="mr-2 h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upsell Script</CardTitle>
                    <CardDescription>
                      Template for suggesting upgrades to customers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Textarea 
                      id="upsellScript"
                      placeholder="Enter your upsell script template"
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => handleGenerateWithAI("upsellScript")}
                      >
                        <Wand className="mr-2 h-4 w-4" />
                        Generate with AI
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Preview Panel */}
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="mr-2 h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>
                  Test your AI sales agent
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow p-0">
                <div className="chat-container flex flex-col h-[400px] overflow-y-auto px-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`max-w-[80%] mb-3 ${
                        message.sender === "user" ? "self-end" : "self-start"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user" ? "text-right" : ""
                        }`}
                      >
                        {message.sender === "user" ? "You" : botName} •{" "}
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <div className="flex w-full gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* API Key Dialog */}
      <AlertDialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Enter your API key to enable AI features. Your key is stored securely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={newApiKey}
              onChange={(e) => setNewApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSetApiKey}>Save Key</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AISalesAgent;
