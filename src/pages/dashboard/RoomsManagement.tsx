import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Info, Wand, MessageSquare, Loader2, Plus, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseRooms } from "@/lib/roomParserService";
import { toast } from "@/components/ui/use-toast";
import { useToast } from "@/components/ui/use-toast";
import { ParsedRoom } from "@/lib/roomParserService";

type RoomType = "standard" | "deluxe" | "suite";
type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning";

interface Room {
  id: string;
  number: string;
  floor: number;
  type: RoomType;
  status: RoomStatus;
  pricePerNight: number;
  features: string[];
  capacity: number;
}

interface RoomFeature {
  id: string;
  name: string;
}

export default function RoomsManagement() {
  const { toast } = useToast();
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Room state
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      number: "101",
      floor: 1,
      type: "standard",
      status: "available",
      pricePerNight: 99.99,
      features: ["wifi", "tv"],
      capacity: 2
    },
    {
      id: "2",
      number: "201",
      floor: 2,
      type: "deluxe",
      status: "occupied",
      pricePerNight: 149.99,
      features: ["wifi", "tv", "minibar"],
      capacity: 4
    },
    {
      id: "3",
      number: "301",
      floor: 3,
      type: "suite",
      status: "maintenance",
      pricePerNight: 299.99,
      features: ["wifi", "tv", "minibar", "jacuzzi"],
      capacity: 6
    },
    {
      id: "4",
      number: "102",
      floor: 1,
      type: "standard",
      status: "cleaning",
      pricePerNight: 99.99,
      features: ["wifi", "tv"],
      capacity: 2
    },
    {
      id: "5",
      number: "202",
      floor: 2,
      type: "deluxe",
      status: "available",
      pricePerNight: 149.99,
      features: ["wifi", "tv", "minibar"],
      capacity: 4
    },
    {
      id: "6",
      number: "302",
      floor: 3,
      type: "suite",
      status: "occupied",
      pricePerNight: 299.99,
      features: ["wifi", "tv", "minibar", "jacuzzi"],
      capacity: 6
    },
    {
      id: "7",
      number: "103",
      floor: 1, 
      type: "standard",
      status: "available",
      pricePerNight: 99.99,
      features: ["wifi", "tv"],
      capacity: 2
    },
    {
      id: "8",
      number: "203",
      floor: 2,
      type: "deluxe",
      status: "maintenance",
      pricePerNight: 149.99,
      features: ["wifi", "tv", "minibar"],
      capacity: 4
    }
  ]);
  
  // Features list
  const roomFeatures: RoomFeature[] = [
    { id: "wifi", name: "WiFi" },
    { id: "tv", name: "TV" },
    { id: "minibar", name: "Mini Bar" },
    { id: "jacuzzi", name: "Jacuzzi" },
    { id: "balcony", name: "Balcony" },
    { id: "kitchen", name: "Kitchenette" }
  ];
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string>("");
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isPromptAddOpen, setIsPromptAddOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRooms, setParsedRooms] = useState<ParsedRoom[]>([]);
  
  // New and selected room states
  const [newRoom, setNewRoom] = useState<Omit<Room, "id">>({
    number: "",
    floor: 1,
    type: "standard",
    status: "available",
    pricePerNight: 99.99,
    features: [],
    capacity: 2
  });

  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Format functions
  const formatRoomType = (type: RoomType) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const formatRoomStatus = (status: RoomStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "bg-green-500/20 border-green-500";
      case "occupied":
        return "bg-red-500/20 border-red-500";
      case "maintenance":
        return "bg-yellow-500/20 border-yellow-500";
      case "cleaning":
        return "bg-purple-500/20 border-purple-500";
      default:
        return "";
    }
  };

  const getStatusTextColor = (status: RoomStatus) => {
    switch (status) {
      case "available":
        return "text-green-500";
      case "occupied":
        return "text-red-500";
      case "maintenance":
        return "text-yellow-500";
      case "cleaning":
        return "text-purple-500";
      default:
        return "";
    }
  };

  // API service functions
  const parseRoomPrompt = async (prompt: string): Promise<ParsedRoom[]> => {
    try {
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch('http://localhost:3001/api/rooms/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to parse rooms';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      const responseText = await response.text();
      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      try {
        const data = JSON.parse(responseText);
        return data.rooms || [];
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError, 'Raw response:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error: any) {
      // Improved error handling for network issues
      if (error.name === 'AbortError') {
        console.error('Request timed out:', error);
        throw new Error('Server request timed out. Please try again.');
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        console.error('Network error:', error);
        throw new Error('Network error: Server may be down or unreachable. Please check your connection and try again.');
      }
      
      console.error('Error parsing rooms:', error);
      throw error;
    }
  };
  
  const createRooms = async (roomsData: any[]): Promise<any> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('http://localhost:3001/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rooms: roomsData }),
        signal: controller.signal
      }).finally(() => clearTimeout(timeoutId));
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to create rooms';
        
        // Try to parse error as JSON, but handle case where it's not valid JSON
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      // Handle empty response
      const responseText = await response.text();
      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      // Parse JSON with error handling
      try {
        return JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError, 'Raw response:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Error creating rooms:', error);
      throw error;
    }
  };

  // Handle functions
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoomWithId = {
      ...newRoom,
      id: Math.random().toString(36).substr(2, 9)
    };
    setRooms([...rooms, newRoomWithId]);
    setIsAddDialogOpen(false);
    setNewRoom({
      number: "",
      floor: 1,
      type: "standard",
      status: "available",
      pricePerNight: 99.99,
      features: [],
      capacity: 2
    });
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoom) {
      setRooms(rooms.map(room => room.id === selectedRoom.id ? selectedRoom : room));
      setIsEditDialogOpen(false);
      setSelectedRoom(null);
    }
  };

  const handleDeleteRoom = (id: string) => {
    setRoomToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
    setDeleteDialogOpen(false);
  };

  const handleQuickStatusChange = (id: string, status: RoomStatus) => {
    setRooms(rooms.map(room => 
      room.id === id ? {...room, status} : room
    ));
  };

  const handleViewRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsRoomDetailsOpen(true);
  };

  // Handle functions for prompt-based room addition
  const handleQuickAddSubmit = async () => {
    if (!promptText.trim()) {
      toast({
        title: "Error",
        description: "Please enter room information text",
        variant: "destructive"
      });
      return;
    }
    
    setIsParsing(true);
    
    try {
      // Call the API to parse rooms
      const parsedRoomsData = await parseRoomPrompt(promptText);
      setParsedRooms(parsedRoomsData);
      
      if (parsedRoomsData.length > 0) {
        toast({
          title: "Success",
          description: `Generated ${parsedRoomsData.length} room${parsedRoomsData.length > 1 ? 's' : ''}`,
        });
      } else {
        toast({
          title: "Warning",
          description: "No rooms could be generated from your prompt",
          variant: "default"
        });
      }
    } catch (error: any) {
      // Improved error message display
      let errorMessage = error.message || "Failed to parse room information";
      
      // Check for common connection issues
      if (errorMessage.includes('NetworkError') || errorMessage.includes('Failed to fetch') || 
          errorMessage.includes('Network error') || errorMessage.includes('ECONNREFUSED')) {
        errorMessage = "Cannot connect to server. Please ensure the server is running and try again.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      console.error('Full error details:', error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleAddParsedRooms = async () => {
    if (parsedRooms.length === 0) return;
    
    try {
      // Convert parsed rooms to our Room type
      const newRooms = parsedRooms.map(room => ({
        id: Math.random().toString(36).substr(2, 9),
        number: room.room_no.toString(),
        type: room.type as RoomType,
        status: "available" as RoomStatus,
        floor: room.floor || 1,
        pricePerNight: room.price,
        features: room.features || [],
        capacity: room.capacity || 2
      }));

      // Save rooms to the server
      try {
        await createRooms(newRooms);
        // Add the rooms to the local state
        setRooms([...rooms, ...newRooms]);
        
        // Reset the parsed rooms and prompt
        setParsedRooms([]);
        setPromptText("");
        setIsPromptAddOpen(false);
        
        toast({
          title: "Success",
          description: `Added ${newRooms.length} new room${newRooms.length > 1 ? 's' : ''}`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create rooms",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding parsed rooms:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding rooms",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Room Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your hotel rooms and their settings</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
            <Plus className="mr-2 h-4 w-4" /> Add New Room
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex gap-2">
            <Select defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Room Status Grid</CardTitle>
            <CardDescription>
              View and manage all rooms and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <div 
                  key={room.id} 
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => handleViewRoomDetails(room)}
                >
                  <div className="aspect-video w-full bg-slate-100 dark:bg-slate-800 relative">
                    {/* Room Image Placeholder */}
                    <div className="w-full h-full bg-center bg-cover">
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge 
                          className={`px-2 py-1 ${
                            room.status === "available" ? "bg-green-100 text-green-800 border-green-300" :
                            room.status === "occupied" ? "bg-red-100 text-red-800 border-red-300" :
                            room.status === "maintenance" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                            "bg-purple-100 text-purple-800 border-purple-300"
                          }`}
                        >
                          {formatRoomStatus(room.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">Room {room.number}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{formatRoomType(room.type)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{room.pricePerNight}</p>
                        <p className="text-xs text-muted-foreground">per night</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-xs">Floor {room.floor}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {room.features.slice(0, 3).map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {room.features.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{room.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewRoomDetails(room);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredRooms.length === 0 && (
                <div className="col-span-full p-6 text-center text-muted-foreground">
                  No rooms found. Try adjusting your search or filters.
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
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
          </CardContent>
        </Card>

        {/* Options Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Choose how you want to add a new room
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsPromptAddOpen(true);
                }}
              >
                <Wand className="h-6 w-6" />
                <span>Add by Prompt</span>
                <span className="text-sm text-muted-foreground">Describe your room in natural language</span>
              </Button>
              <Button
                variant="outline"
                className="w-full h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setIsManualAddOpen(true);
                }}
              >
                <MessageSquare className="h-6 w-6" />
                <span>Add Manually</span>
                <span className="text-sm text-muted-foreground">Fill in the room details manually</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Prompt Add Dialog */}
        <Dialog open={isPromptAddOpen} onOpenChange={setIsPromptAddOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Room by Prompt</DialogTitle>
              <DialogDescription>
                Describe your room in natural language. For example: "Add a deluxe room on the 2nd floor with a balcony"
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="prompt">Room Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your room..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="h-32"
                />
              </div>
              {isParsing && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Processing your request...</span>
                </div>
              )}
              {parsedRooms.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Preview</h4>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {parsedRooms.map((room, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-lg">
                        <div className="grid gap-2">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Room Number</Label>
                              <Input
                                value={room.room_no}
                                onChange={(e) => {
                                  const updated = [...parsedRooms];
                                  updated[index].room_no = parseInt(e.target.value) || room.room_no;
                                  setParsedRooms(updated);
                                }}
                              />
                            </div>
                            <div>
                              <Label>Room Type</Label>
                              <Select
                                value={room.type}
                                onValueChange={(value) => {
                                  const updated = [...parsedRooms];
                                  updated[index].type = value;
                                  setParsedRooms(updated);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="standard">Standard</SelectItem>
                                  <SelectItem value="deluxe">Deluxe</SelectItem>
                                  <SelectItem value="suite">Suite</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Price</Label>
                              <Input
                                type="number"
                                value={room.price}
                                onChange={(e) => {
                                  const updated = [...parsedRooms];
                                  updated[index].price = parseFloat(e.target.value) || room.price;
                                  setParsedRooms(updated);
                                }}
                              />
                            </div>
                            <div>
                              <Label>Floor</Label>
                              <Input
                                type="number"
                                value={room.floor}
                                onChange={(e) => {
                                  const updated = [...parsedRooms];
                                  updated[index].floor = parseInt(e.target.value) || room.floor;
                                  setParsedRooms(updated);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPromptAddOpen(false)}>Cancel</Button>
              {parsedRooms.length > 0 ? (
                <Button onClick={handleAddParsedRooms}>
                  Add {parsedRooms.length} Room{parsedRooms.length > 1 ? 's' : ''}
                </Button>
              ) : (
                <Button onClick={handleQuickAddSubmit} disabled={!promptText || isParsing}>
                  {isParsing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Generate Room'
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manual Add Dialog */}
        <Dialog open={isManualAddOpen} onOpenChange={setIsManualAddOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Enter the details for the new room.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRoom}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="room-number">Room Number</Label>
                    <Input
                      id="room-number"
                      value={newRoom.number}
                      onChange={(e) =>
                        setNewRoom({ ...newRoom, number: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      type="number"
                      value={newRoom.floor}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          floor: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select
                    value={newRoom.type}
                    onValueChange={(value) =>
                      setNewRoom({ ...newRoom, type: value as RoomType })
                    }
                  >
                    <SelectTrigger id="room-type">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="room-status">Status</Label>
                  <Select
                    value={newRoom.status}
                    onValueChange={(value) =>
                      setNewRoom({ ...newRoom, status: value as RoomStatus })
                    }
                  >
                    <SelectTrigger id="room-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price per Night ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newRoom.pricePerNight}
                    onChange={(e) =>
                      setNewRoom({
                        ...newRoom,
                        pricePerNight: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="features">Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roomFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature.id}`}
                          checked={newRoom.features.includes(feature.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewRoom({
                                ...newRoom,
                                features: [...newRoom.features, feature.id],
                              });
                            } else {
                              setNewRoom({
                                ...newRoom,
                                features: newRoom.features.filter(
                                  (id) => id !== feature.id
                                ),
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`feature-${feature.id}`}>
                          {feature.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsManualAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Room</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Room Details Dialog */}
        <Dialog open={isRoomDetailsOpen} onOpenChange={setIsRoomDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Room Details</DialogTitle>
              <DialogDescription>
                View room information
              </DialogDescription>
            </DialogHeader>
            {selectedRoom && (
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-center my-4">
                  <div className={`h-24 w-24 rounded-full ${getStatusColor(selectedRoom.status)} flex items-center justify-center`}>
                    <span className="text-3xl font-bold">{selectedRoom.number}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{formatRoomType(selectedRoom.type)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-medium">{selectedRoom.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`font-medium ${getStatusTextColor(selectedRoom.status)}`}>
                      {formatRoomStatus(selectedRoom.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price per Night</p>
                    <p className="font-medium">${selectedRoom.pricePerNight.toFixed(2)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.features.map(featureId => {
                      const feature = roomFeatures.find(f => f.id === featureId);
                      return feature ? (
                        <Badge key={featureId} variant="outline">{feature.name}</Badge>
                      ) : null;
                    })}
                    {selectedRoom.features.length === 0 && (
                      <p className="text-sm text-muted-foreground">No features</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsRoomDetailsOpen(false);
                      handleEditRoom(selectedRoom);
                    }}
                  >
                    Edit Room
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setIsRoomDetailsOpen(false);
                      handleDeleteRoom(selectedRoom.id);
                    }}
                  >
                    Delete Room
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                room from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteConfirm(roomToDelete);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
