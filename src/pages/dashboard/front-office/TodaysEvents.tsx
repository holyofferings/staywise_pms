import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Calendar, 
  CheckCircle2, 
  ClipboardList, 
  Search,
  UserCheck,
  UserMinus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Event {
  id: string;
  guestName: string;
  roomNumber: string;
  time: Date;
  status: "confirmed" | "pending" | "cancelled";
  type: "check-in" | "check-out";
}

const TodaysEvents: React.FC = () => {
  const { toast } = useToast();
  const today = new Date();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [checkInModal, setCheckInModal] = useState(false);
  const [checkOutModal, setCheckOutModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Sample data for today's events
  const events: Event[] = [
    {
      id: "1",
      guestName: "Rajesh Kumar",
      roomNumber: "101",
      time: new Date(today.setHours(14, 0, 0, 0)),
      status: "confirmed",
      type: "check-in"
    },
    {
      id: "2",
      guestName: "Priya Sharma",
      roomNumber: "202",
      time: new Date(today.setHours(12, 0, 0, 0)),
      status: "confirmed",
      type: "check-out"
    },
    {
      id: "3",
      guestName: "Anil Verma",
      roomNumber: "305",
      time: new Date(today.setHours(15, 30, 0, 0)),
      status: "pending",
      type: "check-in"
    },
    {
      id: "4",
      guestName: "Sarah Johnson",
      roomNumber: "401",
      time: new Date(today.setHours(11, 0, 0, 0)),
      status: "confirmed",
      type: "check-out"
    },
    {
      id: "5",
      guestName: "Vikram Mehta",
      roomNumber: "203",
      time: new Date(today.setHours(16, 0, 0, 0)),
      status: "cancelled",
      type: "check-in"
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.roomNumber.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const checkIns = filteredEvents.filter(event => event.type === "check-in");
  const checkOuts = filteredEvents.filter(event => event.type === "check-out");

  const handleCheckIn = (event: Event) => {
    setSelectedEvent(event);
    setCheckInModal(true);
  };

  const handleCheckOut = (event: Event) => {
    setSelectedEvent(event);
    setCheckOutModal(true);
  };

  const completeCheckIn = () => {
    toast({
      title: "Check-in Completed",
      description: `${selectedEvent?.guestName} has been checked in to room ${selectedEvent?.roomNumber}`,
    });
    setCheckInModal(false);
  };

  const completeCheckOut = () => {
    toast({
      title: "Check-out Completed",
      description: `${selectedEvent?.guestName} has been checked out from room ${selectedEvent?.roomNumber}`,
    });
    setCheckOutModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-amber-600 bg-amber-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Today's Events</h1>
            <p className="text-muted-foreground">
              Manage today's check-ins, check-outs, and other guest activities
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0 gap-2">
            <span className="text-sm text-muted-foreground">
              {format(today, "EEEE, MMMM d, yyyy")}
            </span>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or room..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="check-ins">Check-ins</TabsTrigger>
            <TabsTrigger value="check-outs">Check-outs</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  All scheduled check-ins and check-outs for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.guestName}</TableCell>
                            <TableCell>{event.roomNumber}</TableCell>
                            <TableCell>{format(event.time, "h:mm a")}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={event.type === "check-in" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                                {event.type === "check-in" ? "Check-in" : "Check-out"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {event.type === "check-in" ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCheckIn(event)}
                                  disabled={event.status === "cancelled"}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Check-in
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCheckOut(event)}
                                  disabled={event.status === "cancelled"}
                                >
                                  <UserMinus className="mr-2 h-4 w-4" />
                                  Check-out
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No events found for today
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="check-ins">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownToLine className="h-5 w-5" />
                  Today's Check-ins
                </CardTitle>
                <CardDescription>
                  All scheduled check-ins for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkIns.length > 0 ? (
                        checkIns.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.guestName}</TableCell>
                            <TableCell>{event.roomNumber}</TableCell>
                            <TableCell>{format(event.time, "h:mm a")}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCheckIn(event)}
                                disabled={event.status === "cancelled"}
                              >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Check-in
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No check-ins found for today
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="check-outs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpFromLine className="h-5 w-5" />
                  Today's Check-outs
                </CardTitle>
                <CardDescription>
                  All scheduled check-outs for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Guest Name</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkOuts.length > 0 ? (
                        checkOuts.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium">{event.guestName}</TableCell>
                            <TableCell>{event.roomNumber}</TableCell>
                            <TableCell>{format(event.time, "h:mm a")}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCheckOut(event)}
                                disabled={event.status === "cancelled"}
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Check-out
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No check-outs found for today
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Check-in Dialog */}
        <Dialog open={checkInModal} onOpenChange={setCheckInModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Check-in</DialogTitle>
              <DialogDescription>
                Process check-in for the guest to assign the room.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="py-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Guest Name:</span>
                      <span className="font-medium">{selectedEvent.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Room Number:</span>
                      <span className="font-medium">{selectedEvent.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Check-in Time:</span>
                      <span className="font-medium">{format(selectedEvent.time, "h:mm a")}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-verification">ID Verification</Label>
                    <Select defaultValue="verified">
                      <SelectTrigger id="id-verification">
                        <SelectValue placeholder="Select verification status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select defaultValue="paid">
                      <SelectTrigger id="payment-status">
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Fully Paid</SelectItem>
                        <SelectItem value="partial">Partially Paid</SelectItem>
                        <SelectItem value="pending">Payment Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setCheckInModal(false)}>
                Cancel
              </Button>
              <Button onClick={completeCheckIn}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Check-in
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Check-out Dialog */}
        <Dialog open={checkOutModal} onOpenChange={setCheckOutModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Check-out</DialogTitle>
              <DialogDescription>
                Process check-out for the guest and release the room.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="py-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Guest Name:</span>
                      <span className="font-medium">{selectedEvent.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Room Number:</span>
                      <span className="font-medium">{selectedEvent.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Check-out Time:</span>
                      <span className="font-medium">{format(selectedEvent.time, "h:mm a")}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room-condition">Room Condition</Label>
                    <Select defaultValue="good">
                      <SelectTrigger id="room-condition">
                        <SelectValue placeholder="Select room condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-status">Payment Status</Label>
                    <Select defaultValue="completed">
                      <SelectTrigger id="payment-status">
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">All Charges Paid</SelectItem>
                        <SelectItem value="pending">Pending Charges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setCheckOutModal(false)}>
                Cancel
              </Button>
              <Button onClick={completeCheckOut}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Complete Check-out
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TodaysEvents; 