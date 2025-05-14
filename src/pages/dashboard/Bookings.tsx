import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar as CalendarIcon, List, Users, FileText, Hotel, Grid, Info, RefreshCw, ExternalLink, MessageSquare, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend } from 'recharts';
import { ScrollArea } from "@/components/ui/scroll-area";

interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  status: "confirmed" | "pending" | "cancelled";
  price?: number;
  notes?: string;
}

interface Room {
  id: string;
  number: string;
  type: "single" | "double" | "suite";
  status: "occupied" | "available" | "maintenance" | "reserved";
  price: number;
  capacity: number;
  currentGuest?: string;
}

const Bookings: React.FC = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      guestName: "John Smith",
      roomNumber: "101",
      checkIn: new Date("2024-02-15"),
      checkOut: new Date("2024-02-18"),
      status: "confirmed",
    },
    {
      id: "2",
      guestName: "Sarah Johnson",
      roomNumber: "205",
      checkIn: new Date("2024-02-20"),
      checkOut: new Date("2024-02-25"),
      status: "pending",
    },
    {
      id: "3",
      guestName: "Michael Brown",
      roomNumber: "304",
      checkIn: new Date("2024-02-17"),
      checkOut: new Date("2024-02-19"),
      status: "confirmed",
    },
    {
      id: "4",
      guestName: "Emily Wilson",
      roomNumber: "102",
      checkIn: new Date("2024-02-10"),
      checkOut: new Date("2024-02-12"),
      status: "cancelled",
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newBooking, setNewBooking] = useState<Partial<Booking>>({
    guestName: "",
    roomNumber: "",
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: "pending"
  });
  const [activeView, setActiveView] = useState<"grid" | "calendar" | "room-management" | "guest-management" | "booking-management">("grid");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isRoomHistoryOpen, setIsRoomHistoryOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [roomHistory, setRoomHistory] = useState<Array<{date: string, guest: string, action: string}>>([
    { date: "2024-02-15", guest: "John Smith", action: "Check-in" },
    { date: "2024-02-18", guest: "John Smith", action: "Check-out" },
    { date: "2024-03-01", guest: "Emily Wilson", action: "Check-in" },
    { date: "2024-03-05", guest: "Emily Wilson", action: "Check-out" },
  ]);
  
  // Sample rooms data
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", number: "101", type: "single", status: "occupied", price: 2500, capacity: 1, currentGuest: "John Smith" },
    { id: "2", number: "102", type: "single", status: "available", price: 2500, capacity: 1 },
    { id: "3", number: "103", type: "single", status: "maintenance", price: 2500, capacity: 1 },
    { id: "4", number: "104", type: "double", status: "occupied", price: 3900, capacity: 2, currentGuest: "Sarah Johnson" },
    { id: "5", number: "105", type: "double", status: "available", price: 3900, capacity: 2 },
    { id: "6", number: "106", type: "double", status: "reserved", price: 3900, capacity: 2, currentGuest: "Michael Brown" },
    { id: "7", number: "201", type: "single", status: "available", price: 2500, capacity: 1 },
    { id: "8", number: "202", type: "single", status: "available", price: 2500, capacity: 1 },
    { id: "9", number: "203", type: "double", status: "occupied", price: 3900, capacity: 2, currentGuest: "Emily Wilson" },
    { id: "10", number: "204", type: "suite", status: "available", price: 6500, capacity: 4 },
    { id: "11", number: "205", type: "suite", status: "occupied", price: 6500, capacity: 4, currentGuest: "Robert Johnson" },
    { id: "12", number: "206", type: "suite", status: "reserved", price: 6500, capacity: 4 },
  ]);

  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [googlePassword, setGooglePassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [isAutoSync, setIsAutoSync] = useState(false);
  const [isSyncStatus, setIsSyncStatus] = useState(false);

  // Add this new state for the reservation dialog
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [newReservation, setNewReservation] = useState<Partial<Booking>>({
    guestName: "",
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: "confirmed",
    notes: "",
    price: undefined,
  });

  // Booking trends data
  const bookingTrendsData = {
    monthly: [
      { name: 'Jan', bookings: 45, occupancy: 75 },
      { name: 'Feb', bookings: 52, occupancy: 82 },
      { name: 'Mar', bookings: 48, occupancy: 78 },
      { name: 'Apr', bookings: 55, occupancy: 85 },
      { name: 'May', bookings: 60, occupancy: 88 },
      { name: 'Jun', bookings: 65, occupancy: 92 },
      { name: 'Jul', bookings: 70, occupancy: 95 },
      { name: 'Aug', bookings: 68, occupancy: 93 },
      { name: 'Sep', bookings: 62, occupancy: 90 },
      { name: 'Oct', bookings: 58, occupancy: 87 },
      { name: 'Nov', bookings: 65, occupancy: 91 },
      { name: 'Dec', bookings: 75, occupancy: 98 },
    ],
    yearly: [
      { name: '2020', bookings: 580, occupancy: 75 },
      { name: '2021', bookings: 620, occupancy: 78 },
      { name: '2022', bookings: 680, occupancy: 82 },
      { name: '2023', bookings: 720, occupancy: 85 },
      { name: '2024', bookings: 750, occupancy: 88 },
    ],
    festivals: [
      { name: 'New Year', bookings: 95, occupancy: 100 },
      { name: 'Valentine\'s', bookings: 85, occupancy: 95 },
      { name: 'Holi', bookings: 90, occupancy: 98 },
      { name: 'Easter', bookings: 80, occupancy: 92 },
      { name: 'Diwali', bookings: 92, occupancy: 99 },
      { name: 'Christmas', bookings: 88, occupancy: 96 },
    ],
  };

  const handleAddBooking = () => {
    if (newBooking.guestName && newBooking.roomNumber && newBooking.checkIn && newBooking.checkOut) {
      const booking: Booking = {
        id: Date.now().toString(),
        guestName: newBooking.guestName,
        roomNumber: newBooking.roomNumber,
        checkIn: newBooking.checkIn,
        checkOut: newBooking.checkOut,
        status: newBooking.status as "confirmed" | "pending" | "cancelled",
        price: newBooking.price,
        notes: newBooking.notes
      };
      setBookings([...bookings, booking]);
      setNewBooking({
        guestName: "",
        roomNumber: "",
        checkIn: new Date(),
        checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
        status: "pending"
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Booking added",
        description: "New booking has been created successfully.",
      });
    }
  };

  const handleEditBooking = () => {
    if (selectedBooking) {
      setBookings(bookings.map(booking => 
        booking.id === selectedBooking.id ? selectedBooking : booking
      ));
      setIsEditDialogOpen(false);
      
      toast({
        title: "Booking updated",
        description: `${selectedBooking.guestName}'s booking has been updated.`,
      });
    }
  };

  const handleDeleteBooking = (id: string) => {
    const bookingToDelete = bookings.find(b => b.id === id);
    setBookings(bookings.filter(booking => booking.id !== id));
    
    toast({
      title: "Booking deleted",
      description: bookingToDelete ? `${bookingToDelete.guestName}'s booking has been removed.` : "Booking has been removed.",
    });
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsRoomDetailsOpen(true);
    setNewReservation(prev => ({
      ...prev,
      price: room.price
    }));
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-500/20 border-red-500";
      case "available":
        return "bg-green-500/20 border-green-500";
      case "maintenance":
        return "bg-yellow-500/20 border-yellow-500";
      case "reserved":
        return "bg-blue-500/20 border-blue-500";
      default:
        return "bg-gray-500/20 border-gray-500";
    }
  };

  const getRoomStatusText = (status: string) => {
    switch (status) {
      case "occupied":
        return "text-red-500";
      case "available":
        return "text-green-500";
      case "maintenance":
        return "text-yellow-500";
      case "reserved":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const handleGoogleConnect = () => {
    if (googleEmail && googlePassword) {
      setIsConnecting(true);
      
      // Simulate API connection
      setTimeout(() => {
        setIsGoogleConnected(true);
        setIsConnecting(false);
        setIsConnectDialogOpen(false);
        setLastSyncTime(new Date().toLocaleTimeString());
        
        toast({
          title: "Google Calendar Connected",
          description: `Successfully connected to ${googleEmail}`,
        });
      }, 1500);
    } else {
      toast({
        title: "Connection Failed",
        description: "Please enter both email and password",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setIsGoogleConnected(false);
    setGoogleEmail("");
    setGooglePassword("");
    setIsAutoSync(false);
    setIsSyncStatus(false);
    
    toast({
      title: "Disconnected",
      description: "Google Calendar has been disconnected",
    });
  };

  const handleRefreshCalendar = () => {
    setLastSyncTime(new Date().toLocaleTimeString());
    
    toast({
      title: "Calendar Refreshed",
      description: "Calendar has been synced with Google",
    });
  };

  const handleCheckOutGuest = (roomId: string) => {
    // Find the room
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        // Change status to available and remove current guest
        return { ...room, status: "available" as const, currentGuest: undefined };
      }
      return room;
    });
    setRooms(updatedRooms);
    setIsRoomDetailsOpen(false);
    
    // Update the selected room to reflect changes
    const updatedRoom = updatedRooms.find(room => room.id === roomId);
    if (updatedRoom) {
      setSelectedRoom(updatedRoom);
    }
    
    toast({
      title: "Guest checked out",
      description: `Guest has been checked out from room ${selectedRoom?.number}`,
    });
  };

  const handleToggleMaintenance = (roomId: string) => {
    // Find the room
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        // Toggle between maintenance and available
        const newStatus = room.status === "maintenance" ? "available" as const : "maintenance" as const;
        return { 
          ...room, 
          status: newStatus, 
          // If setting to maintenance, remove current guest
          currentGuest: newStatus === "maintenance" ? undefined : room.currentGuest 
        };
      }
      return room;
    });
    setRooms(updatedRooms);
    
    // Update the selected room to reflect changes
    const updatedRoom = updatedRooms.find(room => room.id === roomId);
    if (updatedRoom) {
      setSelectedRoom(updatedRoom);
    }
    
    toast({
      title: selectedRoom?.status === "maintenance" ? "Room Available" : "Room Under Maintenance",
      description: selectedRoom?.status === "maintenance" 
        ? `Room ${selectedRoom?.number} is now available` 
        : `Room ${selectedRoom?.number} is now under maintenance`,
    });
  };

  const handleUpdateRoomInfo = (roomId: string, updatedInfo: Partial<Room>) => {
    // Find and update the room
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, ...updatedInfo };
      }
      return room;
    });
    setRooms(updatedRooms);
    
    // Update the selected room to reflect changes
    const updatedRoom = updatedRooms.find(room => room.id === roomId);
    if (updatedRoom) {
      setSelectedRoom(updatedRoom);
    }
    
    setIsEditRoomOpen(false);
    
    toast({
      title: "Room updated",
      description: `Room ${selectedRoom?.number} information has been updated`,
    });
  };

  // Add API integration functions
  const fetchReservationsData = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const data = await response.json();
      
      // Update state with data from API
      if (data.reservations) {
        // Convert string dates to Date objects
        const formattedBookings = data.reservations.map((booking: any) => ({
          ...booking,
          checkIn: new Date(booking.checkIn),
          checkOut: new Date(booking.checkOut),
        }));
        setBookings(formattedBookings);
      }
      
      if (data.rooms) {
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load reservations and rooms data",
        variant: "destructive",
      });
    }
  };

  // Create a reservation on the backend
  const createReservation = async (reservation: {
    guestName: string;
    roomNumber: string;
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
    price?: number;   // Optional custom price
    notes?: string;   // Optional notes
  }) => {
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservation),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create reservation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  };

  // Update the handleMakeReservation function to use the API
  const handleMakeReservation = async () => {
    if (selectedRoom && newReservation.guestName) {
      try {
        // Format dates for API
        const reservation = {
          guestName: newReservation.guestName as string,
          roomNumber: selectedRoom.number,
          checkIn: (newReservation.checkIn as Date).toISOString(),
          checkOut: (newReservation.checkOut as Date).toISOString(),
          price: newReservation.price,     // Include custom price if set
          notes: newReservation.notes      // Include notes if added
        };
        
        // Call API to create reservation
        const result = await createReservation(reservation);
        
        if (result && result.reservation) {
          // Convert string dates back to Date objects for UI
          const newBooking: Booking = {
            id: result.reservation.id,
            guestName: result.reservation.guestName,
            roomNumber: result.reservation.roomNumber,
            checkIn: result.reservation.checkIn,
            checkOut: result.reservation.checkOut,
            status: result.reservation.status as "confirmed" | "pending" | "cancelled",
            price: result.reservation.price,
            notes: result.reservation.notes
          };
          
          // Add to local state
          setBookings([...bookings, newBooking]);
          
          // Update room status locally
          if (result.room) {
            const updatedRooms = rooms.map(room => {
              if (room.id === selectedRoom.id) {
                return { 
                  ...room, 
                  status: result.room.status as any, 
                  currentGuest: result.room.currentGuest 
                };
              }
              return room;
            });
            setRooms(updatedRooms);
            
            // Update the selected room
            const updatedRoom = updatedRooms.find(room => room.id === selectedRoom.id);
            if (updatedRoom) {
              setSelectedRoom(updatedRoom);
            }
          }
          
          // Reset form and close dialogs
          setNewReservation({
            guestName: "",
            checkIn: new Date(),
            checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
            status: "confirmed",
            notes: "",
            price: undefined,
          });
          setIsReservationDialogOpen(false);
          setIsRoomDetailsOpen(false);
          
          toast({
            title: "Reservation created",
            description: `Room ${selectedRoom.number} has been reserved for ${newReservation.guestName}`,
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create reservation",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter a guest name",
        variant: "destructive",
      });
    }
  };

  // Load initial data when component mounts
  useEffect(() => {
    fetchReservationsData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Room Bookings</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your hotel room bookings and reservations</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsManualBookingOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Booking
            </Button>
          </div>
        </div>

        <div className="flex justify-center mb-2">
          <Tabs defaultValue="grid" className="w-full" onValueChange={(value) => {
            if (value === "grid" || value === "calendar" || value === "room-management" || 
                value === "guest-management" || value === "booking-management") {
              setActiveView(value as "grid" | "calendar" | "room-management" | "guest-management" | "booking-management");
            }
          }}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="w-full grid-cols-5 inline-flex min-w-[600px] max-w-[1200px] mx-auto mb-2">
                <TabsTrigger value="grid" className="flex-1 px-2 md:px-3">
                  <Grid className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Room Grid</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex-1 px-2 md:px-3">
                  <CalendarIcon className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="room-management" className="flex-1 px-2 md:px-3">
                  <Hotel className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Room Management</span>
                </TabsTrigger>
                <TabsTrigger value="guest-management" className="flex-1 px-2 md:px-3">
                  <Users className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Guest Management</span>
                </TabsTrigger>
                <TabsTrigger value="booking-management" className="flex-1 px-2 md:px-3">
                  <FileText className="mr-1 md:mr-2 h-4 w-4" />
                  <span>Booking Management</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calendar" className="mt-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5" />
                      Booking Calendar
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="google-calendar" />
                      <Label htmlFor="google-calendar">Sync with Google Calendar</Label>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    View all bookings on a calendar and sync with Google Calendar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <div className="flex flex-col items-center">
                        <Calendar
                          mode="multiple"
                          selected={bookings.map(booking => booking.checkIn)}
                          className="w-full max-w-3xl mx-auto rounded-md border p-6 shadow-md"
                          classNames={{
                            day_selected: "bg-primary text-primary-foreground",
                            day_today: "bg-accent text-accent-foreground",
                            day: "h-12 w-12 text-base",
                            head_cell: "text-muted-foreground font-medium",
                            cell: "text-center text-sm p-0",
                            row: "flex w-full",
                            month: "space-y-6"
                          }}
                        />
                        <Button className="mt-4" variant="outline" size="sm" onClick={handleRefreshCalendar} disabled={!isGoogleConnected}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Refresh Calendar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <Card className="h-full">
                        <CardHeader>
                          <CardTitle className="text-base">Google Calendar</CardTitle>
                          <CardDescription>
                            Sync your bookings with Google Calendar
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <p className="text-sm">Status: 
                              <span className={`font-medium ${isGoogleConnected ? "text-green-500" : "text-yellow-500"}`}>
                                {isGoogleConnected ? " Connected" : " Not Connected"}
                              </span>
                            </p>
                            <p className="text-sm text-subtle">
                              {isGoogleConnected 
                                ? `Connected as ${googleEmail}` 
                                : "Connect your Google account to automatically sync bookings"}
                            </p>
                          </div>
                          
                          <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
                            <DialogTrigger asChild>
                              <Button className="w-full" size="sm">
                                {isGoogleConnected ? "Manage Connection" : "Connect Google Calendar"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{isGoogleConnected ? "Google Calendar Connection" : "Connect to Google Calendar"}</DialogTitle>
                                <DialogDescription>
                                  {isGoogleConnected 
                                    ? "Manage your Google Calendar connection" 
                                    : "Enter your Google account credentials to connect"}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {isGoogleConnected ? (
                                <div className="space-y-4 py-4">
                                  <div className="bg-muted p-3 rounded-md">
                                    <p className="text-sm font-medium">Connected Account</p>
                                    <p className="text-sm">{googleEmail}</p>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Disconnecting will stop all synchronization with Google Calendar
                                  </p>
                                  <Button 
                                    variant="destructive" 
                                    className="w-full" 
                                    onClick={handleDisconnect}
                                  >
                                    Disconnect
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="google-email">Google Email</Label>
                                    <Input 
                                      id="google-email" 
                                      value={googleEmail} 
                                      onChange={(e) => setGoogleEmail(e.target.value)} 
                                      placeholder="your.email@gmail.com"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="google-password">Password</Label>
                                    <Input 
                                      id="google-password" 
                                      type="password" 
                                      value={googlePassword} 
                                      onChange={(e) => setGooglePassword(e.target.value)} 
                                      placeholder="Enter your password"
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Note: In a production app, you would use OAuth instead of password authentication
                                  </p>
                                </div>
                              )}
                              
                              <DialogFooter>
                                {!isGoogleConnected && (
                                  <>
                                    <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>Cancel</Button>
                                    <Button 
                                      onClick={handleGoogleConnect} 
                                      disabled={isConnecting}
                                    >
                                      {isConnecting ? "Connecting..." : "Connect"}
                                    </Button>
                                  </>
                                )}
                                {isGoogleConnected && (
                                  <Button 
                                    variant="outline" 
                                    onClick={() => setIsConnectDialogOpen(false)}
                                  >
                                    Close
                                  </Button>
                                )}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <div className="space-y-2 pt-4 border-t">
                            <h4 className="text-sm font-medium">Sync Options</h4>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="auto-sync" className="text-sm">Auto-sync new bookings</Label>
                              <Switch 
                                id="auto-sync" 
                                disabled={!isGoogleConnected}
                                checked={isAutoSync}
                                onCheckedChange={setIsAutoSync}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sync-status" className="text-sm">Sync status changes</Label>
                              <Switch 
                                id="sync-status" 
                                disabled={!isGoogleConnected}
                                checked={isSyncStatus}
                                onCheckedChange={setIsSyncStatus}
                              />
                            </div>
                          </div>
                          
                          {isGoogleConnected && (
                            <a 
                              href="https://calendar.google.com" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs flex items-center justify-center text-primary mt-4"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open in Google Calendar
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="mt-8 grid gap-3">
                    <h3 className="font-medium text-lg">Today's Check-ins</h3>
                    {bookings.filter(booking => 
                      booking.checkIn.toDateString() === new Date().toDateString()
                    ).length > 0 ? (
                      bookings.filter(booking => 
                        booking.checkIn.toDateString() === new Date().toDateString()
                      ).map(booking => (
                        <div key={booking.id} className="p-3 border rounded-md flex justify-between items-center">
                          <div>
                            <p className="font-medium">{booking.guestName}</p>
                            <p className="text-sm text-subtle">Room {booking.roomNumber}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === "confirmed" ? "bg-green-500/20 text-green-500" :
                            booking.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                            "bg-red-500/20 text-red-500"
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-subtle">No check-ins scheduled for today</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <p>Last synced: {lastSyncTime || "Never"}</p>
                  <Button variant="link" size="sm" className="p-0" disabled={!isGoogleConnected}>
                    View Sync History
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="grid" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Room Status Grid</CardTitle>
                  <CardDescription>
                    View all rooms and their current status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {rooms.map((room) => (
                      <div 
                        key={room.id} 
                        className={`aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${getRoomStatusColor(room.status)}`}
                        onClick={() => handleViewRoom(room)}
                      >
                        <div className="text-xl font-bold">{room.number}</div>
                        <div className={`text-xs ${getRoomStatusText(room.status)} uppercase font-semibold mt-1`}>
                          {room.status}
                        </div>
                        <div className="text-xs mt-1 text-center">
                          {room.type} ({room.capacity} {room.capacity > 1 ? 'persons' : 'person'})
                        </div>
                        {room.currentGuest && (
                          <div className="text-xs mt-1 text-center truncate max-w-full">
                            {room.currentGuest}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Price per night</span>
                          <span className="font-medium">₹{room.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-8">
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500/20 border border-green-500 rounded mr-2"></div>
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded mr-2"></div>
                        <span className="text-sm">Occupied</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500/20 border border-blue-500 rounded mr-2"></div>
                        <span className="text-sm">Reserved</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500 rounded mr-2"></div>
                        <span className="text-sm">Maintenance</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="room-management" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hotel className="mr-2 h-5 w-5" />
                    Room Management
                  </CardTitle>
                  <CardDescription>
                    Manage room status, maintenance, and room details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Room Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <Card className="col-span-1 md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Room Status Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Available</p>
                              <p className="text-2xl font-bold text-green-500">
                                {rooms.filter(r => r.status === "available").length}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Occupied</p>
                              <p className="text-2xl font-bold text-red-500">
                                {rooms.filter(r => r.status === "occupied").length}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Reserved</p>
                              <p className="text-2xl font-bold text-blue-500">
                                {rooms.filter(r => r.status === "reserved").length}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Maintenance</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {rooms.filter(r => r.status === "maintenance").length}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Room Type Distribution</p>
                            <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ 
                                width: `${Math.round((rooms.filter(r => r.type === "single").length / rooms.length) * 100)}%`,
                                float: 'left'
                              }} />
                              <div className="h-full bg-indigo-500" style={{ 
                                width: `${Math.round((rooms.filter(r => r.type === "double").length / rooms.length) * 100)}%`,
                                float: 'left'
                              }} />
                              <div className="h-full bg-purple-500" style={{ 
                                width: `${Math.round((rooms.filter(r => r.type === "suite").length / rooms.length) * 100)}%`,
                                float: 'left'
                              }} />
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                              <span>Single ({rooms.filter(r => r.type === "single").length})</span>
                              <span>Double ({rooms.filter(r => r.type === "double").length})</span>
                              <span>Suite ({rooms.filter(r => r.type === "suite").length})</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="col-span-1 md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Maintenance & Cleaning</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[220px]">
                            <div className="space-y-3">
                              {rooms.filter(r => r.status === "maintenance").map(room => (
                                <div key={room.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex justify-between items-center">
                                  <div>
                                    <span className="font-medium">Room {room.number}</span>
                                    <p className="text-xs text-muted-foreground">{room.type} room</p>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleToggleMaintenance(room.id)}
                                  >
                                    Mark Available
                                  </Button>
                                </div>
                              ))}
                              
                              {rooms.filter(r => r.status === "maintenance").length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No rooms under maintenance</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                          
                          <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Plus className="mr-1 h-3 w-3" />
                              Schedule Maintenance
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Room List */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Room List</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Current Guest</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {rooms.map(room => (
                                <TableRow key={room.id}>
                                  <TableCell className="font-medium">{room.number}</TableCell>
                                  <TableCell className="capitalize">{room.type}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      room.status === "occupied" ? "bg-red-500/20 text-red-500" :
                                      room.status === "available" ? "bg-green-500/20 text-green-500" :
                                      room.status === "maintenance" ? "bg-yellow-500/20 text-yellow-500" :
                                      "bg-blue-500/20 text-blue-500"
                                    }`}>
                                      {room.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>₹{room.price}</TableCell>
                                  <TableCell>{room.capacity}</TableCell>
                                  <TableCell>{room.currentGuest || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleViewRoom(room)}>
                                      <Info className="h-4 w-4" />
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guest-management" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Guest Management
                  </CardTitle>
                  <CardDescription>
                    Manage guest information, check-ins, and check-outs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Today's Activities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Today's Check-ins</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                              {bookings.filter(booking => 
                                booking.checkIn.toDateString() === new Date().toDateString() &&
                                booking.status !== "cancelled"
                              ).length > 0 ? (
                                bookings.filter(booking => 
                                  booking.checkIn.toDateString() === new Date().toDateString() &&
                                  booking.status !== "cancelled"
                                ).map(booking => (
                                  <div key={booking.id} className="p-3 border rounded-md flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{booking.guestName}</p>
                                      <p className="text-sm text-muted-foreground">Room {booking.roomNumber}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Check In</Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No check-ins scheduled for today</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Today's Check-outs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-[200px]">
                            <div className="space-y-3">
                              {bookings.filter(booking => 
                                booking.checkOut.toDateString() === new Date().toDateString() &&
                                booking.status === "confirmed"
                              ).length > 0 ? (
                                bookings.filter(booking => 
                                  booking.checkOut.toDateString() === new Date().toDateString() &&
                                  booking.status === "confirmed"
                                ).map(booking => (
                                  <div key={booking.id} className="p-3 border rounded-md flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{booking.guestName}</p>
                                      <p className="text-sm text-muted-foreground">Room {booking.roomNumber}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Check Out</Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No check-outs scheduled for today</p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Guest List */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Current Guests</CardTitle>
                          <Input placeholder="Search guests..." className="max-w-xs" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Check-in</TableHead>
                                <TableHead>Check-out</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bookings.filter(b => b.status === "confirmed").map(booking => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">{booking.guestName}</TableCell>
                                  <TableCell>{booking.roomNumber}</TableCell>
                                  <TableCell>{format(booking.checkIn, 'dd MMM yyyy')}</TableCell>
                                  <TableCell>{format(booking.checkOut, 'dd MMM yyyy')}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      booking.status === "confirmed" ? "bg-green-500/20 text-green-500" :
                                      booking.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                                      "bg-red-500/20 text-red-500"
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="icon" onClick={() => {
                                        setSelectedBooking(booking);
                                        setIsEditDialogOpen(true);
                                      }}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="booking-management" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Booking Management
                  </CardTitle>
                  <CardDescription>
                    Manage and track all bookings and reservations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Booking Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Booking Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Total Bookings</p>
                              <p className="text-2xl font-bold">{bookings.length}</p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Confirmed</p>
                              <p className="text-2xl font-bold text-green-500">
                                {bookings.filter(b => b.status === "confirmed").length}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Pending</p>
                              <p className="text-2xl font-bold text-yellow-500">
                                {bookings.filter(b => b.status === "pending").length}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Cancelled</p>
                              <p className="text-2xl font-bold text-red-500">
                                {bookings.filter(b => b.status === "cancelled").length}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <Button variant="outline" className="w-full" onClick={() => setIsManualBookingOpen(true)}>
                              <Plus className="mr-2 h-4 w-4" /> New Booking
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="col-span-1 md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Booking Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={bookingTrendsData.monthly.slice(0, 6)}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="bookings" fill="#0088FE" name="Bookings" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* All Bookings */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">All Bookings</CardTitle>
                          <div className="flex gap-2">
                            <Select defaultValue="all">
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Filter by status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input placeholder="Search..." className="max-w-xs" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Guest</TableHead>
                                <TableHead>Room</TableHead>
                                <TableHead>Check-in</TableHead>
                                <TableHead>Check-out</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Notes</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bookings.map(booking => (
                                <TableRow key={booking.id}>
                                  <TableCell className="font-medium">{booking.guestName}</TableCell>
                                  <TableCell>{booking.roomNumber}</TableCell>
                                  <TableCell>{format(booking.checkIn, 'dd MMM yyyy')}</TableCell>
                                  <TableCell>{format(booking.checkOut, 'dd MMM yyyy')}</TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      booking.status === "confirmed" ? "bg-green-500/20 text-green-500" :
                                      booking.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                                      "bg-red-500/20 text-red-500"
                                    }`}>
                                      {booking.status}
                                    </span>
                                  </TableCell>
                                  <TableCell className="max-w-[150px] truncate">{booking.notes || "-"}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="icon" onClick={() => {
                                        setSelectedBooking(booking);
                                        setIsEditDialogOpen(true);
                                      }}>
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(booking.id)}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Booking Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>
                Update the booking details
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-guest-name" className="text-right">Guest Name</Label>
                  <Input
                    id="edit-guest-name"
                    value={selectedBooking.guestName}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, guestName: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-room-number" className="text-right">Room Number</Label>
                  <Input
                    id="edit-room-number"
                    value={selectedBooking.roomNumber}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, roomNumber: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-check-in" className="text-right">Check-in Date</Label>
                  <Input
                    id="edit-check-in"
                    type="date"
                    value={selectedBooking.checkIn.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, checkIn: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-check-out" className="text-right">Check-out Date</Label>
                  <Input
                    id="edit-check-out"
                    type="date"
                    value={selectedBooking.checkOut.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, checkOut: new Date(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">Status</Label>
                  <Select
                    value={selectedBooking.status}
                    onValueChange={(value) => setSelectedBooking({ ...selectedBooking, status: value as "confirmed" | "pending" | "cancelled" })}
                  >
                    <SelectTrigger className="col-span-3">
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
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditBooking}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Room Details Dialog */}
        <Dialog open={isRoomDetailsOpen} onOpenChange={setIsRoomDetailsOpen}>
          <DialogContent>
            {selectedRoom && (
              <>
                <DialogHeader>
                  <DialogTitle>Room {selectedRoom.number}</DialogTitle>
                  <DialogDescription>
                    Room details and current status
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      selectedRoom.status === "occupied" ? "bg-red-500/20 text-red-500" :
                      selectedRoom.status === "available" ? "bg-green-500/20 text-green-500" :
                      selectedRoom.status === "maintenance" ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-blue-500/20 text-blue-500"
                    }`}>
                      {selectedRoom.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Type:</span>
                    <span>{selectedRoom.type.charAt(0).toUpperCase() + selectedRoom.type.slice(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Capacity:</span>
                    <span>{selectedRoom.capacity} {selectedRoom.capacity > 1 ? 'persons' : 'person'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Price per night:</span>
                    <span>₹{selectedRoom.price.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                  </div>
                  {selectedRoom.currentGuest && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Current Guest:</span>
                      <span>{selectedRoom.currentGuest}</span>
                    </div>
                  )}
                  
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-medium mb-2">Room Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRoom.status === "available" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsReservationDialogOpen(true)}
                        >
                          Make Reservation
                        </Button>
                      )}
                      {selectedRoom.status === "occupied" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCheckOutGuest(selectedRoom.id)}
                        >
                          Check Out Guest
                        </Button>
                      )}
                      {selectedRoom.status === "reserved" && (
                        <Button variant="outline" size="sm">
                          Check In Guest
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsRoomHistoryOpen(true)}
                      >
                        View Room History
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleMaintenance(selectedRoom.id)}
                        className={selectedRoom.status === "maintenance" ? "bg-green-500/20" : "bg-yellow-500/20"}
                      >
                        {selectedRoom.status === "maintenance" ? "Mark as Available" : "Mark for Maintenance"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditRoomOpen(true)}
                      >
                        Edit Room Info
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRoomDetailsOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Room History Dialog */}
        <Dialog open={isRoomHistoryOpen} onOpenChange={setIsRoomHistoryOpen}>
          <DialogContent>
            {selectedRoom && (
              <>
                <DialogHeader>
                  <DialogTitle>Room {selectedRoom.number} History</DialogTitle>
                  <DialogDescription>
                    Past guest records and activity
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Activity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roomHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.guest}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              record.action === "Check-in" ? "bg-green-500/20 text-green-500" :
                              "bg-blue-500/20 text-blue-500"
                            }`}>
                              {record.action}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRoomHistoryOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Room Dialog */}
        <Dialog open={isEditRoomOpen} onOpenChange={setIsEditRoomOpen}>
          <DialogContent>
            {selectedRoom && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Room {selectedRoom.number}</DialogTitle>
                  <DialogDescription>
                    Update room information
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room-number" className="text-right">Room Number</Label>
                    <Input
                      id="room-number"
                      value={selectedRoom.number}
                      onChange={(e) => setSelectedRoom({ ...selectedRoom, number: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room-type" className="text-right">Room Type</Label>
                    <Select
                      value={selectedRoom.type}
                      onValueChange={(value) => setSelectedRoom({ ...selectedRoom, type: value as "single" | "double" | "suite" })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="double">Double</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room-price" className="text-right">Price per Night</Label>
                    <div className="col-span-3 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="room-price"
                        type="number"
                        value={selectedRoom.price}
                        onChange={(e) => setSelectedRoom({ ...selectedRoom, price: Number(e.target.value) })}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room-capacity" className="text-right">Capacity</Label>
                    <Input
                      id="room-capacity"
                      type="number"
                      value={selectedRoom.capacity}
                      onChange={(e) => setSelectedRoom({ ...selectedRoom, capacity: Number(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditRoomOpen(false)}>Cancel</Button>
                  <Button onClick={() => handleUpdateRoomInfo(selectedRoom.id, {
                    number: selectedRoom.number,
                    type: selectedRoom.type,
                    price: selectedRoom.price,
                    capacity: selectedRoom.capacity
                  })}>
                    Update Room
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* New Reservation Dialog */}
        <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
          <DialogContent className="max-w-md overflow-hidden">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-xl flex items-center gap-2">
                {selectedRoom && (
                  <span className={`w-3 h-3 rounded-full ${getRoomStatusColor(selectedRoom.status)}`}></span>
                )}
                New Reservation
              </DialogTitle>
              <DialogDescription>
                {selectedRoom && `Create a reservation for Room ${selectedRoom.number}`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 pt-2">
              {selectedRoom && (
                <div className={`p-3 rounded-md border-l-4 ${getRoomStatusColor(selectedRoom.status)} bg-background shadow-sm`}>
                  <h4 className="font-medium text-sm mb-1">Room Details</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Number</p>
                      <p className="font-medium">{selectedRoom.number}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{selectedRoom.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">₹{selectedRoom.price}/night</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="guest-name" className="text-sm font-medium mb-1.5 block">Guest Name</Label>
                <Input
                  id="guest-name"
                  placeholder="Enter guest name"
                  value={newReservation.guestName}
                  onChange={(e) => setNewReservation({ ...newReservation, guestName: e.target.value })}
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="check-in" className="text-sm font-medium mb-1.5 block">Check-in Date</Label>
                  <Input
                    id="check-in"
                    type="date"
                    value={newReservation.checkIn ? format(newReservation.checkIn, 'yyyy-MM-dd') : ''}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      setNewReservation({ 
                        ...newReservation, 
                        checkIn: date,
                        checkOut: date > newReservation.checkOut ? 
                          new Date(date.getTime() + 86400000) : newReservation.checkOut
                      });
                    }}
                    className="w-full"
                  />
                </div>
                <div>
                  <Label htmlFor="check-out" className="text-sm font-medium mb-1.5 block">Check-out Date</Label>
                  <Input
                    id="check-out"
                    type="date"
                    value={newReservation.checkOut ? format(newReservation.checkOut, 'yyyy-MM-dd') : ''}
                    min={newReservation.checkIn ? format(new Date(newReservation.checkIn.getTime() + 86400000), 'yyyy-MM-dd') : format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : new Date();
                      setNewReservation({ ...newReservation, checkOut: date });
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="price-per-night" className="text-sm font-medium mb-1.5 block">Price Per Night</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    id="price-per-night"
                    type="number"
                    placeholder={selectedRoom ? selectedRoom.price.toString() : "0"}
                    value={newReservation.price?.toString() || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseFloat(e.target.value) : undefined;
                      setNewReservation({ ...newReservation, price: value });
                    }}
                    className="w-full pl-7"
                    min="0"
                    step="1"
                  />
                </div>
                {selectedRoom && !newReservation.price && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Using room's default price: ₹{selectedRoom.price}/night
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="reservation-notes" className="text-sm font-medium mb-1.5 block">Notes (Optional)</Label>
                <Input
                  id="reservation-notes"
                  placeholder="Any special requests or notes"
                  onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                  className="w-full"
                />
              </div>
              
              {newReservation.checkIn && newReservation.checkOut && (
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium">Reservation Summary</p>
                  <p className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{Math.ceil(
                      ((newReservation.checkOut as Date).getTime() - (newReservation.checkIn as Date).getTime()) / 
                      (1000 * 60 * 60 * 24)
                    )} nights</span>
                  </p>
                  {selectedRoom && (
                    <p className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Total price:</span>
                      <span className="font-medium">₹{(newReservation.price || selectedRoom.price) * Math.ceil(
                        ((newReservation.checkOut as Date).getTime() - (newReservation.checkIn as Date).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      )}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter className="mt-4 gap-2">
              <Button variant="outline" onClick={() => setIsReservationDialogOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleMakeReservation} 
                disabled={!newReservation.guestName || !newReservation.checkIn || !newReservation.checkOut}
                className="relative overflow-hidden"
              >
                <span>Make Reservation</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manual Booking Dialog */}
        <Dialog open={isManualBookingOpen} onOpenChange={setIsManualBookingOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Booking</DialogTitle>
              <DialogDescription>
                Enter the guest information and booking details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="guest-name" className="text-right">Guest Name</Label>
                <Input
                  id="guest-name"
                  value={newBooking.guestName}
                  onChange={(e) => setNewBooking({ ...newBooking, guestName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room-number" className="text-right">Room Number</Label>
                <Input
                  id="room-number"
                  value={newBooking.roomNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="check-in" className="text-right">Check-in Date</Label>
                <div className="col-span-3">
                  <Calendar
                    mode="single"
                    selected={newBooking.checkIn}
                    onSelect={(date) => setNewBooking({ ...newBooking, checkIn: date || new Date() })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="check-out" className="text-right">Check-out Date</Label>
                <div className="col-span-3">
                  <Calendar
                    mode="single"
                    selected={newBooking.checkOut}
                    onSelect={(date) => setNewBooking({ ...newBooking, checkOut: date || new Date() })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select
                  value={newBooking.status}
                  onValueChange={(value: "confirmed" | "pending" | "cancelled") =>
                    setNewBooking({ ...newBooking, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsManualBookingOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBooking}>Add Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Bookings; 