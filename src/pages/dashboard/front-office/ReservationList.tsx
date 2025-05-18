import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Check, ClipboardList, Edit, Eye, Filter, Printer, Search, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  status: "confirmed" | "pending" | "cancelled";
  paymentStatus: "paid" | "partial" | "unpaid";
  amount: number;
  source: {
    type: "direct" | "online" | "phone" | "walkin" | "travel-agent";
    name?: string; // Name of OTA or travel agent
  };
}

const ReservationList: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date>();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sample reservations data
  const reservations: Reservation[] = [
    {
      id: "RES-001",
      guestName: "Vikram Mehta",
      roomNumber: "101",
      checkIn: new Date(2024, 2, 25),
      checkOut: new Date(2024, 2, 28),
      adults: 2,
      children: 0,
      status: "confirmed",
      paymentStatus: "paid",
      amount: 7500,
      source: {
        type: "online",
        name: "Booking.com"
      }
    },
    {
      id: "RES-002",
      guestName: "Priya Sharma",
      roomNumber: "205",
      checkIn: new Date(2024, 3, 1),
      checkOut: new Date(2024, 3, 5),
      adults: 2,
      children: 1,
      status: "confirmed",
      paymentStatus: "partial",
      amount: 12000,
      source: {
        type: "phone"
      }
    },
    {
      id: "RES-003",
      guestName: "Rahul Singh",
      roomNumber: "302",
      checkIn: new Date(2024, 2, 22),
      checkOut: new Date(2024, 2, 23),
      adults: 1,
      children: 0,
      status: "pending",
      paymentStatus: "unpaid",
      amount: 4500,
      source: {
        type: "direct"
      }
    },
    {
      id: "RES-004",
      guestName: "Aditi Joshi",
      roomNumber: "401",
      checkIn: new Date(2024, 3, 10),
      checkOut: new Date(2024, 3, 15),
      adults: 2,
      children: 2,
      status: "confirmed",
      paymentStatus: "paid",
      amount: 15000,
      source: {
        type: "online",
        name: "MakeMyTrip"
      }
    },
    {
      id: "RES-005",
      guestName: "Michael Brown",
      roomNumber: "504",
      checkIn: new Date(2024, 2, 28),
      checkOut: new Date(2024, 3, 2),
      adults: 2,
      children: 0,
      status: "cancelled",
      paymentStatus: "partial",
      amount: 10000,
      source: {
        type: "travel-agent",
        name: "TravelXperts Inc."
      }
    },
    {
      id: "RES-006",
      guestName: "Ananya Patel",
      roomNumber: "203",
      checkIn: new Date(2024, 3, 5),
      checkOut: new Date(2024, 3, 8),
      adults: 2,
      children: 1,
      status: "confirmed",
      paymentStatus: "paid",
      amount: 9000,
      source: {
        type: "online",
        name: "Expedia"
      }
    },
    {
      id: "RES-007",
      guestName: "David Wilson",
      roomNumber: "305",
      checkIn: new Date(2024, 3, 12),
      checkOut: new Date(2024, 3, 15),
      adults: 1,
      children: 0,
      status: "confirmed",
      paymentStatus: "paid",
      amount: 6500,
      source: {
        type: "walkin"
      }
    }
  ];

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reservation.roomNumber.includes(searchQuery) ||
                          reservation.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    
    const matchesSource = sourceFilter === "all" || reservation.source.type === sourceFilter;
    
    const matchesDate = !dateFilter || 
                       (reservation.checkIn <= dateFilter && reservation.checkOut >= dateFilter);
    
    return matchesSearch && matchesStatus && matchesSource && matchesDate;
  });

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsViewDialogOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditDialogOpen(true);
  };

  const handleConfirmReservation = () => {
    if (selectedReservation) {
      toast({
        title: "Reservation Updated",
        description: `Reservation ${selectedReservation.id} has been confirmed.`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const handleCancelReservation = () => {
    if (selectedReservation) {
      toast({
        title: "Reservation Cancelled",
        description: `Reservation ${selectedReservation.id} has been cancelled.`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "partial":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getSourceIcon = (source: { type: string; name?: string }) => {
    switch (source.type) {
      case "online":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Online</Badge>;
      case "phone":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Phone</Badge>;
      case "direct":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Direct</Badge>;
      case "walkin":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Walk-in</Badge>;
      case "travel-agent":
        return <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">Travel Agent</Badge>;
      default:
        return null;
    }
  };

  const getSourceTypeLabel = (type: string) => {
    switch (type) {
      case "online":
        return "Online";
      case "direct":
        return "Direct Booking";
      case "phone":
        return "Phone";
      case "walkin":
        return "Walk-in";
      case "travel-agent":
        return "Travel Agent";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getSourceBadgeColor = (type: string) => {
    switch (type) {
      case "online":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "direct":
        return "bg-green-50 text-green-700 border-green-200";
      case "phone":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "walkin":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "travel-agent":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setDateFilter(undefined);
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reservation List</h1>
            <p className="text-muted-foreground">
              View and manage all current and upcoming reservations
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button>
              <ClipboardList className="mr-2 h-4 w-4" />
              New Reservation
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, room, or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Reservations</h4>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Status</h5>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
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
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Source</h5>
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="direct">Direct Booking</SelectItem>
                        <SelectItem value="online">Online (OTAs)</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="walkin">Walk-in</SelectItem>
                        <SelectItem value="travel-agent">Travel Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Date (Stay Period)</h5>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateFilter && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFilter}
                          onSelect={setDateFilter}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {filteredReservations.length} {filteredReservations.length === 1 ? "reservation" : "reservations"} found
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Reservations
            </CardTitle>
            <CardDescription>
              All current and upcoming reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.id}</TableCell>
                        <TableCell>{reservation.guestName}</TableCell>
                        <TableCell>{reservation.roomNumber}</TableCell>
                        <TableCell>{format(reservation.checkIn, "dd MMM yyyy")}</TableCell>
                        <TableCell>{format(reservation.checkOut, "dd MMM yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(reservation.status)}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <Badge variant="outline" className={getSourceBadgeColor(reservation.source.type)}>
                              {getSourceTypeLabel(reservation.source.type)}
                            </Badge>
                            {reservation.source.name && (
                              <span className="text-xs text-muted-foreground">{reservation.source.name}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">₹{reservation.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewReservation(reservation)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditReservation(reservation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No reservations found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* View Reservation Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" /> 
                Reservation Details
              </DialogTitle>
              <DialogDescription>
                Viewing details for reservation {selectedReservation?.id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedReservation && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{selectedReservation.guestName}</h3>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(selectedReservation.status)}
                  >
                    {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Check-in</p>
                    <p className="font-medium">{format(selectedReservation.checkIn, "EEE, dd MMM yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Check-out</p>
                    <p className="font-medium">{format(selectedReservation.checkOut, "EEE, dd MMM yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Room</p>
                    <p className="font-medium">{selectedReservation.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Guests</p>
                    <p className="font-medium">{selectedReservation.adults} Adults, {selectedReservation.children} Children</p>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-3 rounded-lg space-y-3 mt-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Booking Source</h4>
                    <Badge 
                      variant="outline" 
                      className={getSourceBadgeColor(selectedReservation.source.type)}
                    >
                      {getSourceTypeLabel(selectedReservation.source.type)}
                    </Badge>
                  </div>
                  
                  {selectedReservation.source.name && (
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">Platform/Agency</p>
                      <p className="font-medium">{selectedReservation.source.name}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Payment Status</p>
                    <Badge 
                      variant="outline" 
                      className={getPaymentStatusColor(selectedReservation.paymentStatus)}
                    >
                      {selectedReservation.paymentStatus === "paid" ? "Paid" : 
                      selectedReservation.paymentStatus === "partial" ? "Partial" : "Unpaid"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">₹{selectedReservation.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end mt-4">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEditReservation(selectedReservation);
                    }}
                  >
                    Edit
                  </Button>
                  <Button onClick={() => setIsViewDialogOpen(false)}>
                    Print
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Reservation Dialog */}
        {selectedReservation && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Reservation</DialogTitle>
                <DialogDescription>
                  Update or cancel this reservation
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Reservation Status</h3>
                  <Select
                    value={selectedReservation.status}
                    onValueChange={(value: "confirmed" | "pending" | "cancelled") => 
                      setSelectedReservation({ ...selectedReservation, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Payment Status</h3>
                  <Select
                    value={selectedReservation.paymentStatus}
                    onValueChange={(value: "paid" | "partial" | "unpaid") => 
                      setSelectedReservation({ ...selectedReservation, paymentStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                      <SelectItem value="partial">Partially Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    className="gap-2" 
                    onClick={handleCancelReservation}
                    disabled={selectedReservation.status === "cancelled"}
                  >
                    <X className="h-4 w-4" />
                    Cancel Reservation
                  </Button>
                  <Button 
                    className="gap-2" 
                    onClick={handleConfirmReservation}
                    disabled={selectedReservation.status === "cancelled"}
                  >
                    <Check className="h-4 w-4" />
                    Confirm Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReservationList; 