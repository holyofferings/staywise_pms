import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Upload, Info, Wand, Loader2, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { parseRooms, ParsedRoom } from "@/lib/roomParserService";

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  availability: "available" | "occupied" | "maintenance" | "cleaning";
  images: string[];
  checkedIn: boolean;
  floor: number;
  features: string[];
}

interface RoomFeature {
  id: string;
  name: string;
}

const Rooms: React.FC = () => {
  // Sample room features
  const roomFeatures: RoomFeature[] = [
    { id: "wifi", name: "WiFi" },
    { id: "tv", name: "TV" },
    { id: "minibar", name: "Mini Bar" },
    { id: "jacuzzi", name: "Jacuzzi" },
    { id: "balcony", name: "Balcony" },
    { id: "kitchen", name: "Kitchenette" }
  ];

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      number: "101",
      type: "Deluxe",
      price: 150,
      availability: "available",
      images: [],
      checkedIn: false,
      floor: 1,
      features: ["wifi", "tv"]
    },
    {
      id: "2",
      number: "102",
      type: "Standard",
      price: 100,
      availability: "occupied",
      images: [],
      checkedIn: true,
      floor: 1,
      features: ["wifi", "tv"]
    },
    {
      id: "3",
      number: "103",
      type: "Suite",
      price: 250,
      availability: "maintenance",
      images: [],
      checkedIn: false,
      floor: 1,
      features: ["wifi", "tv", "minibar", "jacuzzi"]
    },
    {
      id: "4",
      number: "104",
      type: "Standard",
      price: 100,
      availability: "cleaning",
      images: [],
      checkedIn: false,
      floor: 1,
      features: ["wifi", "tv"]
    },
    {
      id: "5",
      number: "201",
      type: "Deluxe",
      price: 160,
      availability: "available",
      images: [],
      checkedIn: false,
      floor: 2,
      features: ["wifi", "tv", "minibar"]
    },
    {
      id: "6",
      number: "202",
      type: "Suite",
      price: 280,
      availability: "available",
      images: [],
      checkedIn: false,
      floor: 2,
      features: ["wifi", "tv", "minibar", "jacuzzi", "balcony"]
    },
    {
      id: "7",
      number: "203",
      type: "Standard",
      price: 110,
      availability: "occupied",
      images: [],
      checkedIn: true,
      floor: 2,
      features: ["wifi", "tv"]
    },
    {
      id: "8",
      number: "301",
      type: "Penthouse",
      price: 500,
      availability: "available",
      images: [],
      checkedIn: false,
      floor: 3,
      features: ["wifi", "tv", "minibar", "jacuzzi", "balcony", "kitchen"]
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: "",
    type: "",
    price: 0,
    availability: "available",
    images: [],
    checkedIn: false,
    floor: 1,
    features: []
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string>("");

  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRooms, setParsedRooms] = useState<ParsedRoom[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [bulkAddStep, setBulkAddStep] = useState<"prompt" | "preview" | "editing">("prompt");
  
  // Filter rooms based on search and filters
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.availability === statusFilter;
    const matchesType = typeFilter === "all" || room.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddRoom = () => {
    if (newRoom.number && newRoom.type && newRoom.price) {
      const room: Room = {
        id: Date.now().toString(),
        number: newRoom.number,
        type: newRoom.type,
        price: newRoom.price,
        availability: newRoom.availability as "available" | "occupied" | "maintenance" | "cleaning",
        images: newRoom.images || [],
        checkedIn: false,
        floor: newRoom.floor || 1,
        features: newRoom.features || []
      };
      setRooms([...rooms, room]);
      setNewRoom({
        number: "",
        type: "",
        price: 0,
        availability: "available",
        images: [],
        checkedIn: false,
        floor: 1,
        features: []
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleEditRoom = () => {
    if (selectedRoom) {
      setRooms(rooms.map(room => 
        room.id === selectedRoom.id ? selectedRoom : room
      ));
      setIsEditDialogOpen(false);
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      if (selectedRoom) {
        setSelectedRoom({ ...selectedRoom, images: [...selectedRoom.images, ...imageUrls] });
      } else {
        setNewRoom({ ...newRoom, images: [...(newRoom.images || []), ...imageUrls] });
      }
    }
  };

  const handleViewRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsRoomDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
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

  const getStatusTextColor = (status: string) => {
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

  const formatRoomStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Function to handle the quick add submission
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
    setBulkAddStep("preview");
    
    try {
      // Use the roomParserService instead of direct API call
      const data = await parseRooms(promptText);
      console.log("Parsed rooms data:", data); // Debug log
      setParsedRooms(data);
      setIsPreviewMode(true);
    } catch (error) {
      console.error('Error parsing rooms:', error);
      toast({
        title: "Error",
        description: "Failed to parse room information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsParsing(false);
    }
  };

  // Function to add the parsed rooms to the actual room list
  const handleAddParsedRooms = () => {
    console.log("handleAddParsedRooms called, parsedRooms:", parsedRooms); // Debug log
    
    const newRoomsToAdd = parsedRooms.map(parsedRoom => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      number: parsedRoom.room_no.toString(),
      type: parsedRoom.type,
      price: parsedRoom.price,
      availability: parsedRoom.availability.toLowerCase() as "available" | "occupied" | "maintenance" | "cleaning",
      images: [],
      checkedIn: false,
      floor: parsedRoom.floor || 1,
      features: parsedRoom.features || []
    }));
    
    console.log("Current rooms:", rooms); // Debug log
    console.log("New rooms to add:", newRoomsToAdd); // Debug log
    
    setRooms([...rooms, ...newRoomsToAdd]);
    console.log("Updated rooms array after setting:", [...rooms, ...newRoomsToAdd]); // Debug log
    
    setIsQuickAddDialogOpen(false);
    setPromptText("");
    setParsedRooms([]);
    setIsPreviewMode(false);
    setBulkAddStep("prompt");
    
    toast({
      title: "Success",
      description: `Added ${newRoomsToAdd.length} rooms successfully!`,
    });
  };

  // Function to update a specific parsed room before final addition
  const handleUpdateParsedRoom = (index: number, field: keyof ParsedRoom, value: any) => {
    const updatedRooms = [...parsedRooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value
    };
    setParsedRooms(updatedRooms);
  };
  
  // Function to reset the quick add dialog
  const handleResetQuickAdd = () => {
    setPromptText("");
    setParsedRooms([]);
    setIsPreviewMode(false);
    setBulkAddStep("prompt");
  };
  
  // Example prompts for the user
  const examplePrompts = [
    "Add rooms 101-110 as Standard rooms at $99 per night on floor 1",
    "Create 5 Deluxe rooms numbered 201-205 at $149 per night, all available",
    "Add Suite rooms 301, 302, 303 at $299 with features wifi, minibar, jacuzzi"
  ];

  return (
    <DashboardLayout>
      <div className="container px-4 py-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsQuickAddDialogOpen(true)}
              className="whitespace-nowrap"
            >
              <Wand className="mr-2 h-4 w-4" /> Quick Add Rooms
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Room
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                  <DialogDescription>
                    Choose how you want to add a new room
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-32 flex flex-col items-center justify-center gap-2"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setIsQuickAddDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="h-8 w-8" />
                      <span className="font-medium">Add by Prompt</span>
                      <span className="text-sm text-muted-foreground text-center">
                        Use AI to help you create rooms
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-32 flex flex-col items-center justify-center gap-2"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setIsManualAddOpen(true);
                      }}
                    >
                      <Edit className="h-8 w-8" />
                      <span className="font-medium">Add Manually</span>
                      <span className="text-sm text-muted-foreground text-center">
                        Fill out the room form yourself
                      </span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
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
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Deluxe">Deluxe</SelectItem>
              <SelectItem value="Suite">Suite</SelectItem>
              <SelectItem value="Penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Room Status Grid</CardTitle>
            <CardDescription>
              View all rooms and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredRooms.map((room) => (
                <div 
                  key={room.id} 
                  className={`aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${getStatusColor(room.availability)}`}
                  onClick={() => handleViewRoomDetails(room)}
                >
                  <div className="text-xl font-bold">{room.number}</div>
                  <div className={`text-xs ${getStatusTextColor(room.availability)} uppercase font-semibold mt-1`}>
                    {formatRoomStatus(room.availability)}
                  </div>
                  <div className="text-xs mt-1 text-center">
                    {room.type} (Floor {room.floor})
                  </div>
                  <div className="text-xs mt-1 text-center font-medium">
                    ${room.price.toFixed(2)}/night
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-7 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom(room);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
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
                <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500 rounded mr-2"></div>
                <span className="text-sm">Maintenance</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500/20 border border-purple-500 rounded mr-2"></div>
                <span className="text-sm">Cleaning</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Add Room Dialog */}
        <Dialog open={isManualAddOpen} onOpenChange={setIsManualAddOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Enter the details for the new room.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); handleAddRoom(); }}>
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
                      setNewRoom({ ...newRoom, type: value })
                    }
                  >
                    <SelectTrigger id="room-type">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="room-status">Status</Label>
                  <Select
                    value={newRoom.availability}
                    onValueChange={(value) =>
                      setNewRoom({ ...newRoom, availability: value as "available" | "occupied" | "maintenance" | "cleaning" })
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
                  <Label htmlFor="price">Price per Night (₹)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                    <Input
                      id="price"
                      type="number"
                      value={newRoom.price}
                      onChange={(e) =>
                        setNewRoom({
                          ...newRoom,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="features">Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roomFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`feature-${feature.id}`}
                          checked={newRoom.features?.includes(feature.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewRoom({
                                ...newRoom,
                                features: [...(newRoom.features || []), feature.id],
                              });
                            } else {
                              setNewRoom({
                                ...newRoom,
                                features: (newRoom.features || []).filter(
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

        {/* Edit Room Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>
                Update the room details.
              </DialogDescription>
            </DialogHeader>
            {selectedRoom && (
              <form onSubmit={(e) => { e.preventDefault(); handleEditRoom(); }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-room-number">Room Number</Label>
                      <Input
                        id="edit-room-number"
                        value={selectedRoom.number}
                        onChange={(e) =>
                          setSelectedRoom({ ...selectedRoom, number: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-floor">Floor</Label>
                      <Input
                        id="edit-floor"
                        type="number"
                        value={selectedRoom.floor}
                        onChange={(e) =>
                          setSelectedRoom({
                            ...selectedRoom,
                            floor: parseInt(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-room-type">Room Type</Label>
                    <Select
                      value={selectedRoom.type}
                      onValueChange={(value) =>
                        setSelectedRoom({ ...selectedRoom, type: value })
                      }
                    >
                      <SelectTrigger id="edit-room-type">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-room-status">Status</Label>
                    <Select
                      value={selectedRoom.availability}
                      onValueChange={(value) =>
                        setSelectedRoom({ ...selectedRoom, availability: value as "available" | "occupied" | "maintenance" | "cleaning" })
                      }
                    >
                      <SelectTrigger id="edit-room-status">
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
                    <Label htmlFor="edit-price">Price per Night ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={selectedRoom.price}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-features">Features</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {roomFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-feature-${feature.id}`}
                            checked={selectedRoom.features.includes(feature.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRoom({
                                  ...selectedRoom,
                                  features: [...selectedRoom.features, feature.id],
                                });
                              } else {
                                setSelectedRoom({
                                  ...selectedRoom,
                                  features: selectedRoom.features.filter(
                                    (id) => id !== feature.id
                                  ),
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`edit-feature-${feature.id}`}>
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
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            )}
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
                  <div className={`h-24 w-24 rounded-full ${getStatusColor(selectedRoom.availability)} flex items-center justify-center`}>
                    <span className="text-3xl font-bold">{selectedRoom.number}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{selectedRoom.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-medium">{selectedRoom.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`font-medium ${getStatusTextColor(selectedRoom.availability)}`}>
                      {formatRoomStatus(selectedRoom.availability)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price per Night</p>
                    <p className="font-medium">${selectedRoom.price.toFixed(2)}</p>
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

                {selectedRoom.images.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Images</p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedRoom.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Room ${selectedRoom.number}`}
                          className="h-20 w-full object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsRoomDetailsOpen(false);
                      setIsEditDialogOpen(true);
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

        {/* Quick Add Rooms Dialog */}
        <Dialog 
          open={isQuickAddDialogOpen} 
          onOpenChange={(open) => {
            if (!open) {
              handleResetQuickAdd();
            }
            setIsQuickAddDialogOpen(open);
          }}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Quick Add Multiple Rooms</DialogTitle>
              <DialogDescription>
                Describe the rooms you want to add in natural language, and we'll parse the information for you.
              </DialogDescription>
            </DialogHeader>
            
            {bulkAddStep === "prompt" && (
              <div className="space-y-4 py-4">
                <Textarea 
                  placeholder="Example: Add rooms 101-110 as Standard rooms at $99 per night on floor 1"
                  className="min-h-[120px]"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Example prompts:</h4>
                  <div className="flex flex-col gap-2">
                    {examplePrompts.map((prompt, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        className="justify-start h-auto py-2 px-3 text-left"
                        onClick={() => setPromptText(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsQuickAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleQuickAddSubmit}
                    disabled={isParsing || !promptText.trim()}
                  >
                    {isParsing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      "Parse & Preview"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {bulkAddStep === "preview" && (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Preview Parsed Rooms</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setBulkAddStep("prompt")}
                  >
                    Edit Prompt
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  <ScrollArea className="h-[300px]">
                    <div className="p-4">
                      {parsedRooms.length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Room No</th>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Price</th>
                              <th className="text-left p-2">Status</th>
                              <th className="text-left p-2">Floor</th>
                              <th className="text-left p-2">Features</th>
                              <th className="text-left p-2">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {parsedRooms.map((room, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">
                                  <Input 
                                    value={room.room_no} 
                                    onChange={(e) => handleUpdateParsedRoom(index, 'room_no', parseInt(e.target.value))}
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Select
                                    value={room.type}
                                    onValueChange={(value) => handleUpdateParsedRoom(index, 'type', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Standard">Standard</SelectItem>
                                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                                      <SelectItem value="Suite">Suite</SelectItem>
                                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2">
                                  <Input 
                                    type="number" 
                                    value={room.price} 
                                    onChange={(e) => handleUpdateParsedRoom(index, 'price', parseFloat(e.target.value))}
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Select
                                    value={room.availability}
                                    onValueChange={(value) => handleUpdateParsedRoom(index, 'availability', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Available">Available</SelectItem>
                                      <SelectItem value="Occupied">Occupied</SelectItem>
                                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                                      <SelectItem value="Cleaning">Cleaning</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2">
                                  <Input 
                                    type="number" 
                                    value={room.floor || 1} 
                                    onChange={(e) => handleUpdateParsedRoom(index, 'floor', parseInt(e.target.value))}
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <div className="flex flex-wrap gap-1">
                                    {(room.features || []).map((feature, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                    {(!room.features || room.features.length === 0) && (
                                      <span className="text-muted-foreground text-xs">None</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-8 p-0 px-2"
                                    onClick={() => {
                                      const updatedRooms = [...parsedRooms];
                                      updatedRooms.splice(index, 1);
                                      setParsedRooms(updatedRooms);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : isParsing ? (
                        <div className="flex items-center justify-center h-[200px]">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                          No rooms parsed. Please try a different prompt.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                <div className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsQuickAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddParsedRooms}
                    disabled={parsedRooms.length === 0}
                  >
                    Add {parsedRooms.length} Rooms
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Rooms; 