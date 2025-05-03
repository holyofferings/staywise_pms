import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Mail, Send, MessageSquare, Instagram, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "social";
  status: "draft" | "scheduled" | "sent";
  date: Date;
  audience: string;
  engagement?: number;
}

const Marketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Summer Promotion",
      type: "email",
      status: "sent",
      date: new Date(2023, 5, 15),
      audience: "All Customers",
      engagement: 68,
    },
    {
      id: "2",
      name: "Weekend Getaway",
      type: "sms",
      status: "scheduled",
      date: new Date(2023, 6, 1),
      audience: "Previous Guests",
    },
    {
      id: "3",
      name: "Holiday Special",
      type: "social",
      status: "draft",
      date: new Date(2023, 11, 1),
      audience: "Instagram Followers",
    },
  ]);

  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: "",
    type: "email",
    status: "draft",
    date: new Date(),
    audience: "All Customers",
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleCreateCampaign = () => {
    if (newCampaign.name && date) {
      const campaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        type: newCampaign.type as "email" | "sms" | "social",
        status: newCampaign.status as "draft" | "scheduled" | "sent",
        date: date,
        audience: newCampaign.audience || "All Customers",
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({
        name: "",
        type: "email",
        status: "draft",
        date: new Date(),
        audience: "All Customers",
      });
      setIsCreateDialogOpen(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-500/20 text-yellow-500";
      case "scheduled":
        return "bg-blue-500/20 text-blue-500";
      case "sent":
        return "bg-green-500/20 text-green-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "social":
        return <Instagram className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1200px]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Marketing & Campaigns</h1>
            <p className="text-muted-foreground">Reach your guests with targeted campaigns</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>Design and schedule your marketing campaign</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Campaign name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value as "email" | "sms" | "social" })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={newCampaign.status}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, status: value as "draft" | "scheduled" | "sent" })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="audience" className="text-right">Audience</Label>
                  <Select
                    value={newCampaign.audience}
                    onValueChange={(value) => setNewCampaign({ ...newCampaign, audience: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Customers">All Customers</SelectItem>
                      <SelectItem value="Previous Guests">Previous Guests</SelectItem>
                      <SelectItem value="Newsletter Subscribers">Newsletter Subscribers</SelectItem>
                      <SelectItem value="Instagram Followers">Instagram Followers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="message" className="text-right">Message</Label>
                  <Textarea
                    id="message"
                    className="col-span-3"
                    placeholder="Enter your campaign message"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign}>
                  Create Campaign
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Campaigns</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
                <CardDescription>Manage all your marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>{campaign.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getTypeIcon(campaign.type)}
                            <span className="ml-2 capitalize">{campaign.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(campaign.status)}`}>
                            {campaign.status}
                          </span>
                        </TableCell>
                        <TableCell>{format(campaign.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{campaign.audience}</TableCell>
                        <TableCell>
                          {campaign.engagement ? `${campaign.engagement}%` : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={campaign.status === "sent"}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaigns</CardTitle>
                <CardDescription>Manage your email marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns
                      .filter((campaign) => campaign.type === "email")
                      .map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </TableCell>
                          <TableCell>{format(campaign.date, "MMM d, yyyy")}</TableCell>
                          <TableCell>{campaign.audience}</TableCell>
                          <TableCell>
                            {campaign.engagement ? `${campaign.engagement}%` : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={campaign.status === "sent"}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sms">
            {/* Similar content for SMS campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Campaigns</CardTitle>
                <CardDescription>Manage your SMS marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns
                      .filter((campaign) => campaign.type === "sms")
                      .map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </TableCell>
                          <TableCell>{format(campaign.date, "MMM d, yyyy")}</TableCell>
                          <TableCell>{campaign.audience}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={campaign.status === "sent"}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="social">
            {/* Similar content for Social Media campaigns */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Campaigns</CardTitle>
                <CardDescription>Manage your social media marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns
                      .filter((campaign) => campaign.type === "social")
                      .map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell>{campaign.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </TableCell>
                          <TableCell>{format(campaign.date, "MMM d, yyyy")}</TableCell>
                          <TableCell>{campaign.audience}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={campaign.status === "sent"}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Instagram className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Facebook className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Marketing; 