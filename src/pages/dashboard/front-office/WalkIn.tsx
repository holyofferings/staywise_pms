import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  rate: number;
  status: "available" | "occupied" | "reserved" | "maintenance";
}

const WalkIn: React.FC = () => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 1)));
  const { toast } = useToast();

  const availableRooms: Room[] = [
    { id: "1", number: "101", type: "Standard", capacity: 2, rate: 2500, status: "available" },
    { id: "2", number: "102", type: "Standard", capacity: 2, rate: 2500, status: "available" },
    { id: "3", number: "201", type: "Deluxe", capacity: 2, rate: 3500, status: "available" },
    { id: "4", number: "301", type: "Suite", capacity: 4, rate: 5500, status: "available" },
    { id: "5", number: "302", type: "Suite", capacity: 4, rate: 5500, status: "available" },
  ];

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleWalkInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Walk-in check-in complete",
      description: `Guest has been checked in to room ${selectedRoom?.number}`,
    });
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Walk-In Check-In</h1>
            <p className="text-muted-foreground">
              Process immediate check-ins for walk-in guests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
                <CardDescription>
                  Select a room for immediate check-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Rate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {availableRooms.map((room) => (
                        <TableRow key={room.id} className={selectedRoom?.id === room.id ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">{room.number}</TableCell>
                          <TableCell>{room.type}</TableCell>
                          <TableCell>{room.capacity} persons</TableCell>
                          <TableCell>₹{room.rate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {room.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRoomSelect(room)}
                            >
                              Select
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
                <CardDescription>
                  Enter guest details for walk-in check-in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWalkInSubmit}>
                  <div className="grid gap-6">
                    {selectedRoom ? (
                      <div className="p-4 bg-muted/30 rounded-md">
                        <h3 className="font-medium mb-2">Selected Room</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-muted-foreground text-sm">Room Number:</span>
                            <p className="font-medium">{selectedRoom.number}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Type:</span>
                            <p className="font-medium">{selectedRoom.type}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Capacity:</span>
                            <p className="font-medium">{selectedRoom.capacity} persons</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-sm">Rate:</span>
                            <p className="font-medium">₹{selectedRoom.rate}/night</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800">
                        <p>Please select a room from the available rooms list</p>
                      </div>
                    )}

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
                              onSelect={(date) => date && setFromDate(date)}
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
                              onSelect={(date) => date && setToDate(date)}
                              initialFocus
                              disabled={(date) => date < fromDate}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guest-name">Guest Name</Label>
                        <Input id="guest-name" placeholder="Enter guest's full name" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="guest-email">Email</Label>
                          <Input id="guest-email" type="email" placeholder="Email address" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guest-phone">Phone</Label>
                          <Input id="guest-phone" placeholder="Phone number" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guest-id-type">ID Type</Label>
                        <Select>
                          <SelectTrigger id="guest-id-type">
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
                        <Input id="guest-id-number" placeholder="Enter ID number" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select>
                          <SelectTrigger id="payment-method">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="debit">Debit Card</SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="advance-amount">Advance Amount</Label>
                        <Input id="advance-amount" type="number" placeholder="₹0" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea id="notes" placeholder="Any special requests or notes" />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button 
                  type="submit" 
                  onClick={handleWalkInSubmit}
                  disabled={!selectedRoom}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Complete Check-In
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WalkIn; 