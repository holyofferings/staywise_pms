import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Check, X, Clock } from "lucide-react";

interface Order {
  id: string;
  guestName: string;
  roomNumber: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  specialInstructions: string;
  status: "pending" | "preparing" | "delivered" | "cancelled";
  timestamp: Date;
  totalAmount: number;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      guestName: "John Smith",
      roomNumber: "101",
      items: [
        { name: "Breakfast Platter", quantity: 2, price: 25 },
        { name: "Coffee", quantity: 2, price: 5 },
      ],
      specialInstructions: "Extra hot coffee, please",
      status: "pending",
      timestamp: new Date(),
      totalAmount: 60,
    },
    {
      id: "2",
      guestName: "Sarah Johnson",
      roomNumber: "205",
      items: [
        { name: "Room Service Dinner", quantity: 1, price: 45 },
        { name: "Wine", quantity: 1, price: 30 },
      ],
      specialInstructions: "No onions in the dinner",
      status: "preparing",
      timestamp: new Date(Date.now() - 3600000),
      totalAmount: 75,
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleUpdateStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case "preparing":
        return <Badge variant="secondary" className="bg-blue-500/20 text-blue-500">Preparing</Badge>;
      case "delivered":
        return <Badge variant="secondary" className="bg-green-500/20 text-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="secondary" className="bg-red-500/20 text-red-500">Cancelled</Badge>;
    }
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">WhatsApp Orders</h1>
          <p className="text-white/70">Manage food and service orders from guests</p>
        </div>
        <div className="flex gap-4">
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px] bg-[#1A1A1A] border-white/10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
        <CardHeader>
          <CardTitle className="text-white">Order List</CardTitle>
          <CardDescription className="text-white/60">View and manage all orders</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Order ID</TableHead>
                <TableHead className="text-white">Guest</TableHead>
                <TableHead className="text-white">Room</TableHead>
                <TableHead className="text-white">Items</TableHead>
                <TableHead className="text-white">Total</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Time</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-white">#{order.id}</TableCell>
                  <TableCell className="text-white">{order.guestName}</TableCell>
                  <TableCell className="text-white">{order.roomNumber}</TableCell>
                  <TableCell className="text-white">
                    <div className="max-w-[200px] truncate">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">${order.totalAmount}</TableCell>
                  <TableCell className="text-white">
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 text-white" />
                      </Button>
                      {order.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(order.id, "preparing")}
                          >
                            <Clock className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateStatus(order.id, "cancelled")}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                      {order.status === "preparing" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(order.id, "delivered")}
                        >
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>View complete order information</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Guest Name</Label>
                  <p className="text-white">{selectedOrder.guestName}</p>
                </div>
                <div>
                  <Label className="text-white/70">Room Number</Label>
                  <p className="text-white">{selectedOrder.roomNumber}</p>
                </div>
              </div>
              <div>
                <Label className="text-white/70">Order Items</Label>
                <div className="mt-2 space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-white">${item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-white">Total</span>
                      <span className="text-white">${selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedOrder.specialInstructions && (
                <div>
                  <Label className="text-white/70">Special Instructions</Label>
                  <p className="text-white mt-1">{selectedOrder.specialInstructions}</p>
                </div>
              )}
              <div>
                <Label className="text-white/70">Order Status</Label>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div>
                <Label className="text-white/70">Order Time</Label>
                <p className="text-white mt-1">
                  {selectedOrder.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders; 