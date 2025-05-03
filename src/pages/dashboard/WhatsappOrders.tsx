import React, { useState } from 'react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Check, X, Clock, Phone, Send, RefreshCw } from "lucide-react";

// Define interfaces for our data types
interface WhatsAppOrder {
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
  phoneNumber: string;
  messageHistory: {
    sender: "guest" | "hotel";
    message: string;
    timestamp: Date;
  }[];
}

const WhatsappOrders = () => {
  // Sample data for demonstration
  const [orders, setOrders] = useState<WhatsAppOrder[]>([
    {
      id: "WA1001",
      guestName: "John Smith",
      roomNumber: "101",
      phoneNumber: "+91 9876543210",
      items: [
        { name: "Breakfast Platter", quantity: 2, price: 25 },
        { name: "Coffee", quantity: 2, price: 5 },
      ],
      specialInstructions: "Extra hot coffee, please",
      status: "pending",
      timestamp: new Date(),
      totalAmount: 60,
      messageHistory: [
        {
          sender: "guest",
          message: "Hello, I'd like to order breakfast for two people.",
          timestamp: new Date(Date.now() - 1000 * 60 * 10)
        },
        {
          sender: "hotel",
          message: "Good morning! What would you like to order?",
          timestamp: new Date(Date.now() - 1000 * 60 * 9)
        },
        {
          sender: "guest",
          message: "2 breakfast platters and 2 coffees please. Make the coffee extra hot.",
          timestamp: new Date(Date.now() - 1000 * 60 * 8)
        },
        {
          sender: "hotel",
          message: "Order received! 2 breakfast platters and 2 extra hot coffees. Your total is $60. We'll deliver to Room 101 shortly.",
          timestamp: new Date(Date.now() - 1000 * 60 * 7)
        },
        {
          sender: "guest",
          message: "Thank you!",
          timestamp: new Date(Date.now() - 1000 * 60 * 6)
        }
      ]
    },
    {
      id: "WA1002",
      guestName: "Sarah Johnson",
      roomNumber: "205",
      phoneNumber: "+91 8765432109",
      items: [
        { name: "Room Service Dinner", quantity: 1, price: 45 },
        { name: "Wine", quantity: 1, price: 30 },
      ],
      specialInstructions: "No onions in the dinner",
      status: "preparing",
      timestamp: new Date(Date.now() - 3600000),
      totalAmount: 75,
      messageHistory: [
        {
          sender: "guest",
          message: "I'd like to order dinner to my room please",
          timestamp: new Date(Date.now() - 1000 * 60 * 45)
        },
        {
          sender: "hotel",
          message: "Of course, what would you like to order?",
          timestamp: new Date(Date.now() - 1000 * 60 * 44)
        },
        {
          sender: "guest",
          message: "The dinner special and a bottle of wine. Please no onions in the food.",
          timestamp: new Date(Date.now() - 1000 * 60 * 43)
        },
        {
          sender: "hotel",
          message: "We've received your order: 1 dinner special (no onions) and 1 bottle of wine. Total is $75. We'll deliver to Room 205 soon.",
          timestamp: new Date(Date.now() - 1000 * 60 * 42)
        }
      ]
    },
    {
      id: "WA1003",
      guestName: "Raj Patel",
      roomNumber: "310",
      phoneNumber: "+91 7654321098",
      items: [
        { name: "Late Night Snack Platter", quantity: 1, price: 35 },
        { name: "Soda", quantity: 2, price: 5 },
      ],
      specialInstructions: "Extra spicy snacks please",
      status: "delivered",
      timestamp: new Date(Date.now() - 7200000),
      totalAmount: 45,
      messageHistory: [
        {
          sender: "guest",
          message: "Can I order a late night snack?",
          timestamp: new Date(Date.now() - 1000 * 60 * 120)
        },
        {
          sender: "hotel",
          message: "Certainly! Our kitchen is open 24/7. What would you like?",
          timestamp: new Date(Date.now() - 1000 * 60 * 119)
        },
        {
          sender: "guest",
          message: "I'll take a snack platter with extra spice and 2 sodas",
          timestamp: new Date(Date.now() - 1000 * 60 * 118)
        },
        {
          sender: "hotel",
          message: "Order confirmed: 1 spicy snack platter and 2 sodas for $45. Will be delivered to Room 310 shortly.",
          timestamp: new Date(Date.now() - 1000 * 60 * 117)
        },
        {
          sender: "hotel",
          message: "Your order has been delivered. Enjoy!",
          timestamp: new Date(Date.now() - 1000 * 60 * 100)
        },
        {
          sender: "guest",
          message: "Got it, thanks!",
          timestamp: new Date(Date.now() - 1000 * 60 * 99)
        }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<WhatsAppOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  // Function to handle sending a new message
  const handleSendMessage = () => {
    if (!selectedOrder || !newMessage.trim()) return;

    const updatedOrder = {
      ...selectedOrder,
      messageHistory: [
        ...selectedOrder.messageHistory,
        {
          sender: "hotel" as const,
          message: newMessage,
          timestamp: new Date()
        }
      ]
    };

    setOrders(orders.map(order => 
      order.id === selectedOrder.id ? updatedOrder : order
    ));
    
    setSelectedOrder(updatedOrder);
    setNewMessage("");
  };

  // Function to update order status
  const handleUpdateStatus = (orderId: string, newStatus: WhatsAppOrder["status"]) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { 
          ...order, 
          status: newStatus,
          messageHistory: [
            ...order.messageHistory,
            {
              sender: "hotel" as const,
              message: getStatusUpdateMessage(newStatus),
              timestamp: new Date()
            }
          ]
        };
        
        // If this is the currently selected order, update it
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
  };

  // Helper to get status message
  const getStatusUpdateMessage = (status: WhatsAppOrder["status"]): string => {
    switch (status) {
      case "preparing":
        return "We're now preparing your order and will deliver it soon.";
      case "delivered":
        return "Your order has been delivered. Enjoy!";
      case "cancelled":
        return "We're sorry, but your order has been cancelled. Please contact reception for assistance.";
      default:
        return "Your order status has been updated.";
    }
  };

  // Function to get a badge for the status
  const getStatusBadge = (status: WhatsAppOrder["status"]) => {
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

  // Filter orders based on status
  const filteredOrders = filterStatus === "all"
    ? orders
    : orders.filter(order => order.status === filterStatus);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">WhatsApp Orders</h1>
            <p className="text-subtle">Manage room service orders made via WhatsApp</p>
          </div>
          <Button onClick={() => setActiveTab("analytics")} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh Data
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="orders">Orders Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-end">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px] bg-card border-border">
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

            <Card className="card-custom">
              <CardHeader>
                <CardTitle>WhatsApp Order List</CardTitle>
                <CardDescription>View and manage orders received through WhatsApp</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.guestName}</TableCell>
                          <TableCell>{order.roomNumber}</TableCell>
                          <TableCell>
                            <div className="max-w-[200px] truncate">
                              {order.items.map(item => `${item.quantity}x ${item.name}`).join(", ")}
                            </div>
                          </TableCell>
                          <TableCell>${order.totalAmount}</TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
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
                                title="View conversation"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              {order.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUpdateStatus(order.id, "preparing")}
                                    title="Mark as preparing"
                                  >
                                    <Clock className="h-4 w-4 text-blue-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleUpdateStatus(order.id, "cancelled")}
                                    title="Cancel order"
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
                                  title="Mark as delivered"
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Call guest"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          No orders matching the current filter
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-custom">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{orders.length}</div>
                  <p className="text-sm text-subtle mt-1">Last 24 hours</p>
                </CardContent>
              </Card>
              
              <Card className="card-custom">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.2 min</div>
                  <p className="text-sm text-subtle mt-1">Across all conversations</p>
                </CardContent>
              </Card>
              
              <Card className="card-custom">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Breakfast Platter</span>
                      <Badge>5 orders</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Coffee</span>
                      <Badge>4 orders</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="card-custom">
              <CardHeader>
                <CardTitle>Order Volume by Time</CardTitle>
                <CardDescription>Distribution of orders throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Order volume chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-custom">
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Current order status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Pending</span>
                      </div>
                      <span>{orders.filter(o => o.status === "pending").length} orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Preparing</span>
                      </div>
                      <span>{orders.filter(o => o.status === "preparing").length} orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Delivered</span>
                      </div>
                      <span>{orders.filter(o => o.status === "delivered").length} orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Cancelled</span>
                      </div>
                      <span>{orders.filter(o => o.status === "cancelled").length} orders</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-custom">
                <CardHeader>
                  <CardTitle>Most Active Rooms</CardTitle>
                  <CardDescription>Rooms with highest WhatsApp order activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Room 101</span>
                      <span>3 orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Room 205</span>
                      <span>2 orders</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Room 310</span>
                      <span>1 order</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* View Order Dialog */}
        {selectedOrder && (
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>WhatsApp Conversation</DialogTitle>
                <DialogDescription>
                  Order #{selectedOrder.id} with {selectedOrder.guestName} (Room {selectedOrder.roomNumber})
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Order details sidebar */}
                <div className="space-y-4 border-r pr-4">
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  
                  <div>
                    <Label>Contact</Label>
                    <p className="text-sm mt-1">{selectedOrder.phoneNumber}</p>
                  </div>
                  
                  <div>
                    <Label>Order Items</Label>
                    <div className="mt-1 space-y-1">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="border-t pt-1 mt-1">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${selectedOrder.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedOrder.specialInstructions && (
                    <div>
                      <Label>Special Instructions</Label>
                      <p className="text-sm mt-1">{selectedOrder.specialInstructions}</p>
                    </div>
                  )}
                  
                  <div className="pt-4 space-y-2">
                    {selectedOrder.status === "pending" && (
                      <>
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => handleUpdateStatus(selectedOrder.id, "preparing")}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Mark as Preparing
                        </Button>
                        <Button 
                          className="w-full" 
                          variant="destructive"
                          onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel Order
                        </Button>
                      </>
                    )}
                    
                    {selectedOrder.status === "preparing" && (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as Delivered
                      </Button>
                    )}
                    
                    <Button 
                      className="w-full" 
                      variant="default"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Guest
                    </Button>
                  </div>
                </div>
                
                {/* Chat messages */}
                <div className="col-span-2 flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto bg-card/30 rounded-lg p-4 space-y-3">
                    {selectedOrder.messageHistory.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.sender === 'guest' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.sender === 'guest' 
                              ? 'bg-muted text-foreground' 
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p>{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'guest' 
                              ? 'text-foreground/60' 
                              : 'text-primary-foreground/80'
                          }`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message input */}
                  <div className="mt-4 flex gap-2">
                    <Input 
                      placeholder="Type your reply..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
          </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WhatsappOrders;
