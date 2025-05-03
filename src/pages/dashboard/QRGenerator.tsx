import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Download, Copy, Trash2 } from "lucide-react";

interface QRCode {
  id: string;
  roomNumber: string;
  url: string;
  generatedAt: Date;
}

const QRGenerator: React.FC = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([
    {
      id: "1",
      roomNumber: "101",
      url: "https://staywise.com/order/101",
      generatedAt: new Date(),
    },
    {
      id: "2",
      roomNumber: "102",
      url: "https://staywise.com/order/102",
      generatedAt: new Date(Date.now() - 3600000),
    },
  ]);

  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [selectedQR, setSelectedQR] = useState<QRCode | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleGenerateQR = () => {
    if (newRoomNumber) {
      const qrCode: QRCode = {
        id: Date.now().toString(),
        roomNumber: newRoomNumber,
        url: `https://staywise.com/order/${newRoomNumber}`,
        generatedAt: new Date(),
      };
      setQRCodes([qrCode, ...qrCodes]);
      setNewRoomNumber("");
      setIsGenerateDialogOpen(false);
    }
  };

  const handleDeleteQR = (id: string) => {
    setQRCodes(qrCodes.filter(qr => qr.id !== id));
  };

  const handleCopyURL = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleDownloadQR = (qrCode: QRCode) => {
    // In a real implementation, this would generate and download the actual QR code image
    // For now, we'll just simulate it with a text file
    const blob = new Blob([qrCode.url], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-code-room-${qrCode.roomNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">QR Code Generator</h1>
          <p className="text-white/70">Generate QR codes for room service orders</p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#512FEB] hover:bg-[#512FEB]/90">
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Generate New QR Code</DialogTitle>
              <DialogDescription>Create a QR code for a specific room</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input
                  id="room-number"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="Enter room number"
                  className="bg-[#1A1A1A] border-white/10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerateQR} className="bg-[#512FEB] hover:bg-[#512FEB]/90">Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)]">
        <CardHeader>
          <CardTitle className="text-white">QR Codes</CardTitle>
          <CardDescription className="text-white/60">View and manage all generated QR codes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Room Number</TableHead>
                <TableHead className="text-white">URL</TableHead>
                <TableHead className="text-white">Generated At</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrCodes.map((qr) => (
                <TableRow key={qr.id}>
                  <TableCell className="text-white">{qr.roomNumber}</TableCell>
                  <TableCell className="text-white">
                    <div className="max-w-[300px] truncate">{qr.url}</div>
                  </TableCell>
                  <TableCell className="text-white">
                    {qr.generatedAt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedQR(qr);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <QrCode className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyURL(qr.url)}
                      >
                        <Copy className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadQR(qr)}
                      >
                        <Download className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQR(qr.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View QR Code Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-[#0A0A0A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>QR Code Details</DialogTitle>
            <DialogDescription>View and manage QR code information</DialogDescription>
          </DialogHeader>
          {selectedQR && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Room Number</Label>
                  <p className="text-white">{selectedQR.roomNumber}</p>
                </div>
                <div>
                  <Label className="text-white/70">Generated At</Label>
                  <p className="text-white">{selectedQR.generatedAt.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-white/70">QR Code URL</Label>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-white flex-1">{selectedQR.url}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyURL(selectedQR.url)}
                  >
                    <Copy className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center p-4 bg-[#1A1A1A] rounded-lg">
                <div className="text-center">
                  <QrCode className="h-32 w-32 text-white/50 mx-auto" />
                  <p className="text-white/70 mt-2">QR Code Preview</p>
                </div>
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
            <Button
              onClick={() => selectedQR && handleDownloadQR(selectedQR)}
              className="bg-[#512FEB] hover:bg-[#512FEB]/90"
            >
              Download QR Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRGenerator; 