import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Eye, PlusCircle, Search, Trash2, UserPlus, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  address: string;
  nationality: string;
  visits: number;
  status: "active" | "inactive";
}

const GuestProfiles: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    name: "",
    email: "",
    phone: "",
    idType: "aadhar",
    idNumber: "",
    address: "",
    nationality: "Indian",
    status: "active"
  });

  const guests: Guest[] = [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      idType: "Aadhar Card",
      idNumber: "XXXX XXXX 1234",
      address: "123 Park Street, Mumbai, MH 400001",
      nationality: "Indian",
      visits: 3,
      status: "active"
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel@example.com",
      phone: "+91 87654 32109",
      idType: "Passport",
      idNumber: "J8765432",
      address: "456 MG Road, Bangalore, KA 560001",
      nationality: "Indian",
      visits: 1,
      status: "active"
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+1 212-555-1234",
      idType: "Passport",
      idNumber: "US789456123",
      address: "789 Broadway, New York, NY 10003",
      nationality: "American",
      visits: 5,
      status: "active"
    },
    {
      id: "4",
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 415-555-6789",
      idType: "Passport",
      idNumber: "UK456789123",
      address: "321 Park Avenue, London, UK",
      nationality: "British",
      visits: 2,
      status: "inactive"
    },
    {
      id: "5",
      name: "Anil Kumar",
      email: "anil.kumar@example.com",
      phone: "+91 76543 21098",
      idType: "Driving License",
      idNumber: "DL-987654321",
      address: "78 Civil Lines, New Delhi, DL 110001",
      nationality: "Indian",
      visits: 4,
      status: "active"
    }
  ];

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guest.phone.includes(searchQuery)
  );

  const handleAddGuest = () => {
    toast({
      title: "Guest Added",
      description: "New guest profile has been created successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditGuest = () => {
    toast({
      title: "Guest Updated",
      description: "Guest profile has been updated successfully.",
    });
    setIsEditDialogOpen(false);
  };

  const handleDeleteGuest = (id: string) => {
    toast({
      title: "Guest Deleted",
      description: "Guest profile has been deleted successfully.",
    });
  };

  const handleViewGuest = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsViewDialogOpen(true);
  };

  const handleEditGuestOpen = (guest: Guest) => {
    setSelectedGuest(guest);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Guest Profiles</h1>
            <p className="text-muted-foreground">
              Manage guest information and view stay history
            </p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Guest
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search guests..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Directory
            </CardTitle>
            <CardDescription>View and manage all guest profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>ID Type</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell className="font-medium">{guest.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm">{guest.email}</div>
                            <div className="text-xs text-muted-foreground">{guest.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>{guest.idType}</TableCell>
                        <TableCell>{guest.nationality}</TableCell>
                        <TableCell>{guest.visits}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={guest.status === "active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-700"}
                          >
                            {guest.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewGuest(guest)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditGuestOpen(guest)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteGuest(guest.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No guests found. Try a different search term.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add Guest Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Guest</DialogTitle>
              <DialogDescription>
                Enter guest details to create a new profile
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter guest's full name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={newGuest.email}
                    onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="Phone number"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="id-type">ID Type</Label>
                  <Select
                    value={newGuest.idType}
                    onValueChange={(value) => setNewGuest({ ...newGuest, idType: value })}
                  >
                    <SelectTrigger id="id-type">
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
                <div className="grid gap-2">
                  <Label htmlFor="id-number">ID Number</Label>
                  <Input
                    id="id-number"
                    placeholder="Enter ID number"
                    value={newGuest.idNumber}
                    onChange={(e) => setNewGuest({ ...newGuest, idNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select
                  value={newGuest.nationality}
                  onValueChange={(value) => setNewGuest({ ...newGuest, nationality: value })}
                >
                  <SelectTrigger id="nationality">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="Australian">Australian</SelectItem>
                    <SelectItem value="Canadian">Canadian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter full address"
                  value={newGuest.address}
                  onChange={(e) => setNewGuest({ ...newGuest, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGuest}>Add Guest</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Guest Dialog */}
        {selectedGuest && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Guest Profile</DialogTitle>
                <DialogDescription>
                  View detailed guest information
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Profile Details</TabsTrigger>
                  <TabsTrigger value="history">Stay History</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="py-4">
                  <div className="space-y-4">
                    <div className="flex gap-2 items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {selectedGuest.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedGuest.name}</h3>
                        <Badge
                          variant="outline"
                          className={selectedGuest.status === "active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-700"}
                        >
                          {selectedGuest.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Email:</div>
                      <div>{selectedGuest.email}</div>
                      <div className="text-muted-foreground">Phone:</div>
                      <div>{selectedGuest.phone}</div>
                      <div className="text-muted-foreground">ID Type:</div>
                      <div>{selectedGuest.idType}</div>
                      <div className="text-muted-foreground">ID Number:</div>
                      <div>{selectedGuest.idNumber}</div>
                      <div className="text-muted-foreground">Nationality:</div>
                      <div>{selectedGuest.nationality}</div>
                      <div className="text-muted-foreground">Total Visits:</div>
                      <div>{selectedGuest.visits}</div>
                    </div>

                    <div className="text-sm">
                      <div className="text-muted-foreground mb-1">Address:</div>
                      <div className="p-2 bg-muted rounded-md">
                        {selectedGuest.address}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="py-4">
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Visit Date</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>15 Feb 2024</TableCell>
                          <TableCell>101</TableCell>
                          <TableCell>3 nights</TableCell>
                          <TableCell>₹7,500</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>12 Dec 2023</TableCell>
                          <TableCell>204</TableCell>
                          <TableCell>2 nights</TableCell>
                          <TableCell>₹5,000</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>03 Jun 2023</TableCell>
                          <TableCell>305</TableCell>
                          <TableCell>5 nights</TableCell>
                          <TableCell>₹12,500</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    handleEditGuestOpen(selectedGuest);
                  }}
                >
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Guest Dialog */}
        {selectedGuest && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Guest Profile</DialogTitle>
                <DialogDescription>
                  Update guest profile information
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={selectedGuest.name}
                    onChange={(e) => setSelectedGuest({ ...selectedGuest, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedGuest.email}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={selectedGuest.phone}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-id-type">ID Type</Label>
                    <Select
                      value={selectedGuest.idType}
                      onValueChange={(value) => setSelectedGuest({ ...selectedGuest, idType: value })}
                    >
                      <SelectTrigger id="edit-id-type">
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                        <SelectItem value="PAN Card">PAN Card</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Driving License">Driving License</SelectItem>
                        <SelectItem value="Voter ID">Voter ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-id-number">ID Number</Label>
                    <Input
                      id="edit-id-number"
                      value={selectedGuest.idNumber}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, idNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-nationality">Nationality</Label>
                  <Select
                    value={selectedGuest.nationality}
                    onValueChange={(value) => setSelectedGuest({ ...selectedGuest, nationality: value })}
                  >
                    <SelectTrigger id="edit-nationality">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="British">British</SelectItem>
                      <SelectItem value="Australian">Australian</SelectItem>
                      <SelectItem value="Canadian">Canadian</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={selectedGuest.address}
                    onChange={(e) => setSelectedGuest({ ...selectedGuest, address: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedGuest.status}
                    onValueChange={(value: "active" | "inactive") => setSelectedGuest({ ...selectedGuest, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditGuest}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GuestProfiles; 