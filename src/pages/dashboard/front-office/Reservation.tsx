import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Check, ChevronsUpDown, PlusCircle, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const guests: Guest[] = [
  { id: "1", name: "John Smith", email: "john.smith@example.com", phone: "+91 98765 43210" },
  { id: "2", name: "Priya Sharma", email: "priya.sharma@example.com", phone: "+91 87654 32109" },
  { id: "3", name: "Mohammed Khan", email: "mohammed.k@example.com", phone: "+91 76543 21098" },
  { id: "4", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+91 65432 10987" },
  { id: "5", name: "Rahul Patel", email: "rahul.p@example.com", phone: "+91 54321 09876" },
];

const Reservation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("new");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reservation created",
      description: "The reservation has been successfully created",
    });
  };

  const handleNewGuest = () => {
    setIsCreatingGuest(true);
  };

  const handleCancelNewGuest = () => {
    setIsCreatingGuest(false);
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reservation</h1>
            <p className="text-muted-foreground">
              Create and manage hotel reservations
            </p>
          </div>
          <Button className="mt-4 md:mt-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Reservation
          </Button>
        </div>

        <Tabs defaultValue="new" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new">New Reservation</TabsTrigger>
            <TabsTrigger value="group">Group Reservation</TabsTrigger>
          </TabsList>
          <TabsContent value="new">
            <Card>
              <CardHeader>
                <CardTitle>New Reservation</CardTitle>
                <CardDescription>
                  Create a new reservation for a single guest or family
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label>Guest</Label>
                      {!isCreatingGuest ? (
                        <div className="flex flex-col space-y-4">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="justify-between"
                              >
                                {selectedGuest
                                  ? selectedGuest.name
                                  : "Select guest..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[300px]">
                              <Command>
                                <CommandInput placeholder="Search guests..." />
                                <CommandList>
                                  <CommandEmpty>
                                    No guest found.
                                    <Button 
                                      variant="link" 
                                      className="mt-2 p-0"
                                      onClick={handleNewGuest}
                                    >
                                      Create new guest
                                    </Button>
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {guests.map((guest) => (
                                      <CommandItem
                                        key={guest.id}
                                        value={guest.id}
                                        onSelect={() => {
                                          setSelectedGuest(guest);
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedGuest?.id === guest.id
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{guest.name}</span>
                                          <span className="text-xs text-muted-foreground">{guest.email}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex items-center"
                            onClick={handleNewGuest}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Create New Guest
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 border p-4 rounded-md">
                          <div className="flex justify-between items-center">
                            <h3 className="text-base font-medium">New Guest Information</h3>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={handleCancelNewGuest}
                            >
                              Cancel
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="guest-name">Name</Label>
                              <Input id="guest-name" placeholder="Full name" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest-email">Email</Label>
                              <Input id="guest-email" type="email" placeholder="Email address" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest-phone">Phone</Label>
                              <Input id="guest-phone" placeholder="Phone number" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest-id">ID Type</Label>
                              <Select>
                                <SelectTrigger id="guest-id">
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                                  <SelectItem value="pan">PAN Card</SelectItem>
                                  <SelectItem value="passport">Passport</SelectItem>
                                  <SelectItem value="driving">Driving License</SelectItem>
                                  <SelectItem value="voter">Voter ID</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest-id-number">ID Number</Label>
                              <Input id="guest-id-number" placeholder="ID number" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="guest-address">Address</Label>
                              <Textarea id="guest-address" placeholder="Address" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Check-in Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !fromDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fromDate ? format(fromDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={fromDate}
                              onSelect={setFromDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label>Check-out Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !toDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {toDate ? format(toDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={toDate}
                              onSelect={setToDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="room-type">Room Type</Label>
                        <Select>
                          <SelectTrigger id="room-type">
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Room</SelectItem>
                            <SelectItem value="deluxe">Deluxe Room</SelectItem>
                            <SelectItem value="suite">Executive Suite</SelectItem>
                            <SelectItem value="premium">Premium Suite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="adults">Number of Adults</Label>
                        <Select>
                          <SelectTrigger id="adults">
                            <SelectValue placeholder="Select number of adults" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Adult</SelectItem>
                            <SelectItem value="2">2 Adults</SelectItem>
                            <SelectItem value="3">3 Adults</SelectItem>
                            <SelectItem value="4">4 Adults</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="children">Number of Children</Label>
                        <Select>
                          <SelectTrigger id="children">
                            <SelectValue placeholder="Select number of children" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No Children</SelectItem>
                            <SelectItem value="1">1 Child</SelectItem>
                            <SelectItem value="2">2 Children</SelectItem>
                            <SelectItem value="3">3 Children</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-status">Payment Status</Label>
                        <Select defaultValue="pending">
                          <SelectTrigger id="payment-status">
                            <SelectValue placeholder="Payment status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="partial">Partial Payment</SelectItem>
                            <SelectItem value="paid">Fully Paid</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="special-requests">Special Requests</Label>
                      <Textarea id="special-requests" placeholder="Enter any special requests or notes" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button type="submit" onClick={handleSubmit}>Create Reservation</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="group">
            <Card>
              <CardHeader>
                <CardTitle>Group Reservation</CardTitle>
                <CardDescription>
                  Create reservations for groups or corporate bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-6">
                  Group reservation functionality will be implemented soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reservation; 