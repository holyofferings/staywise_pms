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
import { MoreHorizontal, Info } from "lucide-react";

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
}

interface RoomFeature {
  id: string;
  name: string;
}

export default function RoomsManagement() {
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
      features: ["wifi", "tv"]
    },
    {
      id: "2",
      number: "201",
      floor: 2,
      type: "deluxe",
      status: "occupied",
      pricePerNight: 149.99,
      features: ["wifi", "tv", "minibar"]
    },
    {
      id: "3",
      number: "301",
      floor: 3,
      type: "suite",
      status: "maintenance",
      pricePerNight: 299.99,
      features: ["wifi", "tv", "minibar", "jacuzzi"]
    },
    {
      id: "4",
      number: "102",
      floor: 1,
      type: "standard",
      status: "cleaning",
      pricePerNight: 99.99,
      features: ["wifi", "tv"]
    },
    {
      id: "5",
      number: "202",
      floor: 2,
      type: "deluxe",
      status: "available",
      pricePerNight: 149.99,
      features: ["wifi", "tv", "minibar"]
    },
    {
      id: "6",
      number: "302",
      floor: 3,
      type: "suite",
      status: "occupied",
      pricePerNight: 299.99,
      features: ["wifi", "tv", "minibar", "jacuzzi"]
    },
    {
      id: "7",
      number: "103",
      floor: 1, 
      type: "standard",
      status: "available",
      pricePerNight: 99.99,
      features: ["wifi", "tv"]
    },
    {
      id: "8",
      number: "203",
      floor: 2,
      type: "deluxe",
      status: "maintenance",
      pricePerNight: 149.99,
      features: ["wifi", "tv", "minibar"]
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
  
  // New and selected room states
  const [newRoom, setNewRoom] = useState<Omit<Room, "id">>({
    number: "",
    floor: 1,
    type: "standard",
    status: "available",
    pricePerNight: 99.99,
    features: []
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
      features: []
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

  return (
    <DashboardLayout>
      <div className="max-w-[1200px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Rooms Management</h1>
          <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
            Add New Room
          </Button>
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
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
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
                  className={`aspect-square border-2 rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md ${getStatusColor(room.status)}`}
                  onClick={() => handleViewRoomDetails(room)}
                >
                  <div className="text-xl font-bold">{room.number}</div>
                  <div className={`text-xs ${getStatusTextColor(room.status)} uppercase font-semibold mt-1`}>
                    {formatRoomStatus(room.status)}
                  </div>
                  <div className="text-xs mt-1 text-center">
                    {formatRoomType(room.type)} (Floor {room.floor})
                  </div>
                  <div className="text-xs mt-1 text-center font-medium">
                    ${room.pricePerNight.toFixed(2)}/night
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 h-7 px-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRoom(room);
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

        {/* Add Room Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                  onClick={() => setIsAddDialogOpen(false)}
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
              <form onSubmit={handleUpdateRoom}>
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
                        setSelectedRoom({ ...selectedRoom, type: value as RoomType })
                      }
                    >
                      <SelectTrigger id="edit-room-type">
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
                    <Label htmlFor="edit-room-status">Status</Label>
                    <Select
                      value={selectedRoom.status}
                      onValueChange={(value) =>
                        setSelectedRoom({ ...selectedRoom, status: value as RoomStatus })
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
                      value={selectedRoom.pricePerNight}
                      onChange={(e) =>
                        setSelectedRoom({
                          ...selectedRoom,
                          pricePerNight: parseFloat(e.target.value) || 0,
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
