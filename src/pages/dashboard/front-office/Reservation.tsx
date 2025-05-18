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
import { CalendarIcon, Check, ChevronsUpDown, PlusCircle, UserPlus, Sparkles, CreditCard, Bed, Users, CalendarCheck, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const SectionHeader = ({ icon, title, description }: { icon: React.ReactNode, title: string, description?: string }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-base font-semibold">{title}</h3>
    </div>
    {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
  </div>
);

const Reservation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("new");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [searchValue, setSearchValue] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [bookingSource, setBookingSource] = useState("direct");

  // Sample guests data
  const guests: Guest[] = [
    { id: "G001", name: "Rahul Patel", email: "rahul.patel@example.com", phone: "+91 9876543210" },
    { id: "G002", name: "Priya Sharma", email: "priya.sharma@example.com", phone: "+91 9876543211" },
    { id: "G003", name: "Amit Kumar", email: "amit.kumar@example.com", phone: "+91 9876543212" },
    { id: "G004", name: "Sneha Singh", email: "sneha.singh@example.com", phone: "+91 9876543213" },
    { id: "G005", name: "Raj Malhotra", email: "raj.malhotra@example.com", phone: "+91 9876543214" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Reservation Created",
      description: "The reservation has been successfully created.",
    });
  };

  // Format currency consistently
  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Reservation</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage hotel reservations efficiently
            </p>
          </div>
          <Button className="mt-4 md:mt-0 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            <PlusCircle className="h-4 w-4" />
            New Reservation
          </Button>
        </div>

        {/* Restructured Tabs component with proper spacing and alignment */}
        <div className="flex flex-col w-full">
          <Tabs defaultValue="new" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="new" 
                className={cn(
                  "text-base py-3 transition-all",
                  activeTab === "new" ? "font-semibold" : "text-muted-foreground font-medium"
                )}
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                New Reservation
              </TabsTrigger>
              <TabsTrigger 
                value="group" 
                className={cn(
                  "text-base py-3 transition-all",
                  activeTab === "group" ? "font-semibold" : "text-muted-foreground font-medium"
                )}
              >
                <Users className="mr-2 h-4 w-4" />
                Group Reservation
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="new" className="space-y-8 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Booking Information Card */}
                  <Card className="md:col-span-2 border-t-4 border-t-primary shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                        <CardTitle>Booking Information</CardTitle>
                      </div>
                      <CardDescription>
                        Enter the details for this reservation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="booking-source" className="text-base">Booking Source</Label>
                              <Select value={bookingSource} onValueChange={setBookingSource}>
                                <SelectTrigger id="booking-source" className="h-11">
                                  <SelectValue placeholder="Select booking source" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="direct">Direct Booking</SelectItem>
                                  <SelectItem value="website">Website</SelectItem>
                                  <SelectItem value="booking.com">Booking.com</SelectItem>
                                  <SelectItem value="airbnb">Airbnb</SelectItem>
                                  <SelectItem value="expedia">Expedia</SelectItem>
                                  <SelectItem value="makemytrip">MakeMyTrip</SelectItem>
                                  <SelectItem value="goibibo">Goibibo</SelectItem>
                                  <SelectItem value="agoda">Agoda</SelectItem>
                                  <SelectItem value="travel-agent">Travel Agent</SelectItem>
                                  <SelectItem value="corporate">Corporate</SelectItem>
                                  <SelectItem value="phone">Phone</SelectItem>
                                  <SelectItem value="walk-in">Walk-in</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-base">Booking Status</Label>
                              <Select defaultValue="confirmed">
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {/* Improved date fields */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-base">Check-in Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal h-11 relative",
                                      !fromDate && "text-muted-foreground"
                                    )}
                                  >
                                    <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                                      <CalendarIcon className="h-4 w-4 text-primary" />
                                      <span className="ml-2 text-xs text-muted-foreground font-medium">Check-in:</span>
                                    </div>
                                    <div className="ml-[90px]">
                                      {fromDate ? format(fromDate, "EEE, dd MMM yyyy") : "Pick check-in date"}
                                    </div>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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
                              <Label className="text-base">Check-out Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal h-11 relative",
                                      !toDate && "text-muted-foreground"
                                    )}
                                  >
                                    <div className="absolute inset-0 flex items-center pl-3 pointer-events-none">
                                      <CalendarIcon className="h-4 w-4 text-primary" />
                                      <span className="ml-2 text-xs text-muted-foreground font-medium">Check-out:</span>
                                    </div>
                                    <div className="ml-[90px]">
                                      {toDate ? format(toDate, "EEE, dd MMM yyyy") : "Pick check-out date"}
                                    </div>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
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

                          <Separator />

                          {/* Standardized section header */}
                          <SectionHeader 
                            icon={<Users className="h-4 w-4 text-primary" />}
                            title="Guest Information"
                          />

                          <div className="space-y-4">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between h-11"
                                >
                                  {selectedGuest
                                    ? `${selectedGuest.name} (${selectedGuest.phone})`
                                    : "Search for guest..."}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search guests..."
                                    className="h-9"
                                    value={searchValue}
                                    onValueChange={setSearchValue}
                                  />
                                  <CommandList>
                                    <CommandEmpty>No guest found. <Button variant="link" className="p-0 h-auto">Add new guest</Button></CommandEmpty>
                                    <CommandGroup>
                                      {guests
                                        .filter(guest =>
                                          guest.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                                          guest.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                                          guest.phone.includes(searchValue)
                                        )
                                        .map(guest => (
                                          <CommandItem
                                            key={guest.id}
                                            value={guest.id}
                                            onSelect={() => {
                                              setSelectedGuest(guest);
                                              setSearchValue("");
                                            }}
                                            className="flex items-center gap-2 py-2"
                                          >
                                            <div className="flex items-center justify-center rounded-full bg-primary/10 w-8 h-8 text-primary">
                                              {guest.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                              <p className="font-medium">{guest.name}</p>
                                              <p className="text-xs text-muted-foreground">{guest.phone}</p>
                                            </div>
                                            <Check
                                              className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedGuest?.id === guest.id ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>

                          {!selectedGuest && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-muted/30 rounded-lg border border-dashed animate-in fade-in-10 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor="guest-name" className="text-base">Guest Name</Label>
                                <Input id="guest-name" placeholder="Enter guest name" className="h-11" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="guest-phone" className="text-base">Phone Number</Label>
                                <Input id="guest-phone" placeholder="Enter phone number" className="h-11" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="guest-email" className="text-base">Email Address</Label>
                                <Input id="guest-email" placeholder="Enter email address" className="h-11" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="guest-id" className="text-base">ID Type & Number</Label>
                                <div className="flex gap-2">
                                  <Select defaultValue="aadhaar">
                                    <SelectTrigger className="w-1/3 h-11">
                                      <SelectValue placeholder="ID Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="aadhaar">Aadhaar</SelectItem>
                                      <SelectItem value="passport">Passport</SelectItem>
                                      <SelectItem value="driving">Driving License</SelectItem>
                                      <SelectItem value="voter">Voter ID</SelectItem>
                                      <SelectItem value="pan">PAN Card</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input id="guest-id" placeholder="Enter ID number" className="w-2/3 h-11" />
                                </div>
                              </div>
                            </div>
                          )}

                          <Separator />

                          {/* Standardized section header */}
                          <SectionHeader 
                            icon={<Bed className="h-4 w-4 text-primary" />}
                            title="Room Details"
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="room-type" className="text-base">Room Type</Label>
                              <Select>
                                <SelectTrigger id="room-type" className="h-11">
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
                              <Label htmlFor="room-number" className="text-base">Room Number</Label>
                              <Select>
                                <SelectTrigger id="room-number" className="h-11">
                                  <SelectValue placeholder="Select room number" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="101">101 - Standard</SelectItem>
                                  <SelectItem value="102">102 - Standard</SelectItem>
                                  <SelectItem value="201">201 - Deluxe</SelectItem>
                                  <SelectItem value="202">202 - Deluxe</SelectItem>
                                  <SelectItem value="301">301 - Suite</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="adults" className="text-base">Number of Adults</Label>
                              <Select defaultValue="2">
                                <SelectTrigger id="adults" className="h-11">
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
                            <div className="space-y-2">
                              <Label htmlFor="children" className="text-base">Number of Children</Label>
                              <Select defaultValue="0">
                                <SelectTrigger id="children" className="h-11">
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
                              <Label htmlFor="payment-status" className="text-base">Payment Status</Label>
                              <Select defaultValue="pending">
                                <SelectTrigger id="payment-status" className="h-11">
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

                          {/* Special requests section */}
                          <div className="space-y-2">
                            <SectionHeader 
                              icon={<Sparkles className="h-4 w-4 text-primary" />}
                              title="Special Requests"
                            />
                            <Textarea id="special-requests" placeholder="Enter any special requests or notes" className="min-h-[100px]" />
                          </div>
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                      <Button variant="outline">Cancel</Button>
                      <Button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      >
                        Create Reservation
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Summary Card */}
                  <Card className="border-t-4 border-t-secondary shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-secondary" />
                        <CardTitle>Reservation Summary</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-semibold">Stay Duration</h3>
                        {fromDate && toDate ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Check-in:</span>
                              <span className="font-medium">{format(fromDate, "EEE, dd MMM yyyy")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Check-out:</span>
                              <span className="font-medium">{format(toDate, "EEE, dd MMM yyyy")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Nights:</span>
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))} Nights
                              </Badge>
                            </div>
                          </>
                        ) : (
                          /* Improved visual cue for the info box */
                          <div className="p-4 bg-muted/30 border border-border rounded-md text-sm flex items-center gap-2 text-foreground/80">
                            <Info className="h-4 w-4 text-primary/70 flex-shrink-0" />
                            <p>Select check-in and check-out dates to view stay details</p>
                          </div>
                        )}
                      </div>

                      <Separator />
                      
                      {/* Pricing details with improved formatting */}
                      <div className="space-y-3">
                        <h3 className="font-semibold">Pricing</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Room Rate:</span>
                          <span className="font-medium tabular-nums">{formatCurrency(5000)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Taxes (18%):</span>
                          <span className="font-medium tabular-nums">{formatCurrency(900)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Other Charges:</span>
                          <span className="font-medium tabular-nums">{formatCurrency(500)}</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="font-bold text-lg tabular-nums">{formatCurrency(6400)}</span>
                        </div>
                      </div>

                      <Separator />
                      
                      {/* Improved Quick Actions buttons */}
                      <div className="space-y-3">
                        <h3 className="font-semibold">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 h-9 transition-all hover:bg-primary/5 hover:border-primary/30"
                          >
                            <Users className="h-4 w-4 text-primary" />
                            <span>Add Guest</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 h-9 transition-all hover:bg-primary/5 hover:border-primary/30"
                          >
                            <Bed className="h-4 w-4 text-primary" />
                            <span>View Rooms</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="group" className="mt-0">
                <Card className="border-t-4 border-t-primary shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <CardTitle>Group Reservation</CardTitle>
                    </div>
                    <CardDescription>
                      Create reservations for groups or corporate bookings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted/30 rounded-lg border border-dashed p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Group Reservation Coming Soon</h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-4">
                        We're working on implementing group reservation functionality. This will allow you to book multiple rooms for groups, events, and corporate bookings.
                      </p>
                      <Button variant="outline">Get Notified When Ready</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reservation; 