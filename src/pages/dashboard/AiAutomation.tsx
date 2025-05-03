import React, { useState, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Zap, 
  ArrowLeft,
  ChevronRight, 
  Search, 
  Settings, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Tag, 
  Bell, 
  Send, 
  Grid
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { nanoid } from 'nanoid';

interface Automation {
  id: string;
  name: string;
  status: "active" | "draft" | "inactive";
  lastEdited: string;
  triggerCount: number;
  actionCount: number;
}

// Node Types and Interfaces
interface Position {
  x: number;
  y: number;
}

interface NodeInterface {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  data: {
    id: string;
    name: string;
    icon: React.ReactNode;
    [key: string]: any;
  };
  position: Position;
  parentId?: string;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'main' | 'branch' | 'merge';
}

interface EditorState {
  nodes: NodeInterface[];
  connections: Connection[];
  selectedNodeId: string | null;
}

// After node interfaces but before component definition:
const NODE_TYPE = {
  TRIGGER: 'trigger' as const,
  ACTION: 'action' as const,
  CONDITION: 'condition' as const,
  DELAY: 'delay' as const
};

// Workflow Builder as a standalone component
const WorkflowBuilder: React.FC<{
  onBack: () => void;
  workflowId: string;
  workflowName: string;
}> = ({ onBack, workflowId, workflowName }) => {
  const [currentWorkflowName, setCurrentWorkflowName] = useState(workflowName);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarTab, setActiveSidebarTab] = useState("triggers");
  const [showSidebar, setShowSidebar] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [editorState, setEditorState] = useState<EditorState>({
    nodes: [],
    connections: [],
    selectedNodeId: null
  });
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isNodeDragging = useRef(false);
  const draggedNodeId = useRef<string | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const canvasPosition = useRef({ x: 0, y: 0 });
  const nodeRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  // Memoized selectors
  const selectedNode = useMemo(() => 
    editorState.nodes.find(node => node.id === editorState.selectedNodeId),
    [editorState.selectedNodeId, editorState.nodes]
  );
  
  const triggers = useMemo(() => 
    editorState.nodes.filter(node => node.type === 'trigger'),
    [editorState.nodes]
  );
  
  const actions = useMemo(() => 
    editorState.nodes.filter(node => node.type === 'action'),
    [editorState.nodes]
  );

  // Trigger and Action categories
  const triggerCategories = [
    {
      id: "contact",
      name: "Contact Triggers",
      items: [
        { id: "contact_created", name: "Contact Created", icon: <Plus size={16} /> },
        { id: "contact_updated", name: "Contact Updated", icon: <Edit size={16} /> },
        { id: "tag_added", name: "Tag Added", icon: <Tag size={16} /> },
        { id: "birthday", name: "Birthday", icon: <Calendar size={16} /> }
      ]
    },
    {
      id: "messaging",
      name: "Messaging Triggers",
      items: [
        { id: "email_opened", name: "Email Opened", icon: <Mail size={16} /> },
        { id: "sms_received", name: "SMS Received", icon: <MessageSquare size={16} /> },
        { id: "form_submitted", name: "Form Submitted", icon: <Send size={16} /> },
        { id: "webhook", name: "Webhook Received", icon: <Zap size={16} /> }
      ]
    },
    {
      id: "hotel",
      name: "Hotel Triggers",
      items: [
        { id: "booking_created", name: "Booking Created", icon: <Calendar size={16} /> },
        { id: "guest_checkin", name: "Guest Check-in", icon: <Clock size={16} /> },
        { id: "guest_checkout", name: "Guest Check-out", icon: <Clock size={16} /> },
        { id: "review_added", name: "Review Added", icon: <MessageSquare size={16} /> }
      ]
    }
  ];

  const actionCategories = [
    {
      id: "messaging",
      name: "Messaging Actions",
      items: [
        { id: "send_email", name: "Send Email", icon: <Mail size={16} /> },
        { id: "send_sms", name: "Send SMS", icon: <MessageSquare size={16} /> },
        { id: "send_notification", name: "Send Notification", icon: <Bell size={16} /> }
      ]
    },
    {
      id: "contact",
      name: "Contact Actions",
      items: [
        { id: "update_contact", name: "Update Contact", icon: <Edit size={16} /> },
        { id: "add_tag", name: "Add Tag", icon: <Tag size={16} /> },
        { id: "remove_tag", name: "Remove Tag", icon: <Tag size={16} /> }
      ]
    },
    {
      id: "utility",
      name: "Utility Actions",
      items: [
        { id: "delay", name: "Delay", icon: <Clock size={16} /> },
        { id: "condition", name: "Condition", icon: <Settings size={16} /> },
        { id: "http_request", name: "HTTP Request", icon: <Zap size={16} /> }
      ]
    }
  ];

  // Node Management Functions
  const addNode = (type: 'trigger' | 'action' | 'condition' | 'delay', data: any, position: Position, parentId?: string) => {
    const newNode: NodeInterface = {
      id: `${type}-${Date.now()}`,
      type,
      data,
      position,
      parentId
    };
    
    // Add the node to the state
    setEditorState(prev => {
      const updatedNodes = [...prev.nodes, newNode];
      
      // If there's a parent, create a connection
      let updatedConnections = [...prev.connections];
      if (parentId) {
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          source: parentId,
          target: newNode.id,
          type: 'main'
        };
        updatedConnections = [...updatedConnections, newConnection];
      }
      
      return {
        ...prev,
        nodes: updatedNodes,
        connections: updatedConnections,
        selectedNodeId: newNode.id
      };
    });
    
    setShowSidebar(false);
  };
  
  const removeNode = (nodeId: string) => {
    setEditorState(prev => {
      // Filter out the selected node
      const updatedNodes = prev.nodes.filter(node => node.id !== nodeId);
      
      // Filter out connections that involve this node
      const updatedConnections = prev.connections.filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      );
      
      return {
        ...prev,
        nodes: updatedNodes,
        connections: updatedConnections,
        selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId
      };
    });
  };
  
  const updateNodePosition = (nodeId: string, position: Position) => {
    setEditorState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, position } : node
      )
    }));
  };
  
  const selectNode = (nodeId: string | null) => {
    setEditorState(prev => ({
      ...prev,
      selectedNodeId: nodeId
    }));
    
    if (nodeId) {
      const node = editorState.nodes.find(n => n.id === nodeId);
      if (node) {
        setActiveSidebarTab(node.type === 'trigger' ? 'triggers' : 'actions');
        setShowSidebar(true);
      }
    }
  };

  // Handlers for adding nodes
  const handleAddTrigger = (triggerId: string, triggerName: string, icon: React.ReactNode) => {
    // For the first trigger, place it left of center
    // For subsequent triggers, position them in a staggered arrangement
    const triggerCount = triggers.length;
    let xPosition: number;
    
    if (triggerCount === 0) {
      // First trigger goes on the left
      xPosition = 150;
    } else if (triggerCount % 2 === 0) {
      // Even count - place on the left with offset
      xPosition = 150 - (triggerCount * 20);
    } else {
      // Odd count - place on the right with offset
      xPosition = 530 + ((triggerCount - 1) * 20);
    }
    
    addNode(
      'trigger',
      { id: triggerId, name: triggerName, icon },
      { x: xPosition, y: 150 }
    );
  };
  
  const handleAddAction = (actionId: string, actionName: string, icon: React.ReactNode, parentId?: string) => {
    // Position below the merge point or below the last action
    const actionCount = actions.length;
    const baseY = 400; // Starting point below the merge
    const yPosition = baseY + (actionCount * 150);
    
    addNode(
      'action',
      { id: actionId, name: actionName, icon },
      { x: 500, y: yPosition },
      parentId || 'merge-point' // Default to merge point if no parent specified
    );
  };
  
  // Handle canvas panning and zooming
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Space key or middle mouse drag pans the canvas
      if (e.button === 1 || e.altKey) {
        isDragging.current = true;
        lastPosition.current = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
        e.preventDefault();
      }
      
      // Handle node dragging
      const target = e.target as HTMLElement;
      const nodeElement = target.closest('[data-node-id]') as HTMLElement;
      
      if (nodeElement && !e.altKey) {
        const nodeId = nodeElement.getAttribute('data-node-id');
        if (nodeId) {
          isNodeDragging.current = true;
          draggedNodeId.current = nodeId;
          lastPosition.current = { x: e.clientX, y: e.clientY };
          e.stopPropagation();
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Handle node dragging
      if (isNodeDragging.current && draggedNodeId.current) {
        const node = editorState.nodes.find(n => n.id === draggedNodeId.current);
        if (node) {
          const dx = (e.clientX - lastPosition.current.x) / zoomLevel;
          const dy = (e.clientY - lastPosition.current.y) / zoomLevel;
          
          // Get node type to implement snapping for certain node types
          if (node.type === 'trigger') {
            // Triggers only move horizontally
            updateNodePosition(node.id, {
              x: node.position.x + dx,
              y: node.position.y // Keep y fixed for triggers
            });
          } else {
            updateNodePosition(node.id, {
              x: node.position.x + dx,
              y: node.position.y + dy
            });
          }
          
          lastPosition.current = { x: e.clientX, y: e.clientY };
        }
        return;
      }
      
      // Handle canvas panning
      if (isDragging.current) {
        const dx = e.clientX - lastPosition.current.x;
        const dy = e.clientY - lastPosition.current.y;
        
        canvasPosition.current = {
          x: canvasPosition.current.x + dx,
          y: canvasPosition.current.y + dy
        };
        
        canvas.style.transform = `translate(${canvasPosition.current.x}px, ${canvasPosition.current.y}px) scale(${zoomLevel})`;
        lastPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      isNodeDragging.current = false;
      draggedNodeId.current = null;
      canvas.style.cursor = 'default';
    };

    const handleWheel = (e: WheelEvent) => {
      // Zoom with ctrl+wheel
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newZoom = Math.min(Math.max(0.5, zoomLevel + delta), 2);
        setZoomLevel(newZoom);
        
        canvas.style.transform = `translate(${canvasPosition.current.x}px, ${canvasPosition.current.y}px) scale(${newZoom})`;
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [editorState.nodes, zoomLevel]);

  // Add a new trigger/action node at a specific position
  const handleAddNode = () => {
    // By default, if no nodes exist, start with triggers tab
    // If nodes exist, prefer actions tab when adding new nodes
    setEditorState(prevState => ({
      ...prevState,
      activeSidebarTab: prevState.nodes.length === 0 ? "triggers" : "actions",
      selectedNodeId: null
    }));
    setShowSidebar(true);
  };

  const filteredTriggers = triggerCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const filteredActions = actionCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  // Add a new trigger/action node from UI
  const handleAddNodeClick = (parentId?: string) => {
    setActiveSidebarTab(editorState.nodes.length === 0 ? "triggers" : "actions");
    setShowSidebar(true);
    selectNode(null);
  };

  // Helper function to get node center point for connections
  const getNodeCenter = (node: NodeInterface): Position => {
    const nodeEl = nodeRefs.current[node.id];
    if (!nodeEl) {
      // Fallback to position data if element ref isn't available
      return {
        x: node.position.x + 165, // Half of the node width
        y: node.position.y + 50 // Half of the node height
      };
    }
    
    const rect = nodeEl.getBoundingClientRect();
    return {
      x: node.position.x + rect.width / 2,
      y: node.position.y + rect.height / 2
    };
  };
  
  // Render connection paths between nodes
  const renderConnections = () => {
    // If no nodes, skip rendering
    if (editorState.nodes.length === 0) return null;
    
    // For each trigger, create a horizontal line to the merge point
    const triggerConnections = triggers.map(trigger => {
      const triggerCenter = getNodeCenter(trigger);
      
      return (
        <div 
          key={`conn-trigger-${trigger.id}`} 
          className="absolute bg-slate-300" 
          style={{
            top: `${triggerCenter.y}px`,
            left: `${trigger.position.x + 330}px`, // Right edge of trigger
            height: '2px',
            width: `${530 - (trigger.position.x + 330)}px` // To center merge point
          }}
        />
      );
    });
    
    // Vertical line from merge point to actions
    const verticalLine = actions.length > 0 && (
      <div 
        key="conn-vertical" 
        className="absolute bg-slate-300" 
        style={{
          top: '200px',
          left: '530px',
          width: '2px',
          height: `${actions[0].position.y - 200}px` // To first action
        }}
      />
    );
    
    // Connections between actions
    const actionConnections = actions.map((action, index) => {
      if (index === actions.length - 1) return null; // Skip last action
      
      const nextAction = actions[index + 1];
      
      return (
        <div 
          key={`conn-action-${action.id}`} 
          className="absolute bg-slate-300" 
          style={{
            top: `${action.position.y + 50}px`, // Bottom of action
            left: '530px',
            width: '2px',
            height: `${nextAction.position.y - (action.position.y + 50)}px`
          }}
        />
      );
    });
    
    // Connection to END node
    const endConnection = actions.length > 0 && (
      <div 
        key="conn-end" 
        className="absolute bg-slate-300" 
        style={{
          top: `${actions[actions.length - 1].position.y + 50}px`, // Bottom of last action
          left: '530px',
          width: '2px',
          height: '60px'
        }}
      />
    );
    
    return (
      <>
        {triggerConnections}
        {verticalLine}
        {actionConnections}
        {endConnection}
      </>
    );
  };
  
  // Render the merge point (+ button)
  const renderMergePoint = () => {
    if (editorState.nodes.length === 0) return null;
    
    return (
      <div 
        className="absolute" 
        style={{
          top: '180px',
          left: '530px',
          transform: 'translateX(-50%)',
          zIndex: 20
        }}
      >
        <Button
          onClick={() => handleAddNodeClick('merge-point')}
          className="bg-white hover:bg-slate-50 rounded-full h-10 w-10 flex items-center justify-center shadow-sm border border-blue-300"
        >
          <Plus className="h-5 w-5 text-blue-500" />
        </Button>
      </div>
    );
  };
  
  // Render END node
  const renderEndNode = () => {
    if (editorState.nodes.length === 0) return null;
    
    const yPosition = actions.length > 0 
      ? actions[actions.length - 1].position.y + 110 
      : 400;
    
    return (
      <div 
        className="absolute" 
        style={{
          top: `${yPosition}px`,
          left: '530px',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
      >
        <div className="bg-slate-300 rounded-md px-6 py-2 text-slate-600 text-sm font-medium">
          END
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white text-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <Input 
              className="font-semibold text-lg border-none bg-transparent h-9 px-2 focus-visible:ring-0 w-[300px] text-slate-900"
              value={currentWorkflowName}
              onChange={(e) => setCurrentWorkflowName(e.target.value)}
              placeholder="Workflow Name"
            />
            <span className="text-xs text-slate-500">ID: {workflowId}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-full hover:bg-slate-50 border-slate-200 text-slate-700"
          >
            Test Workflow
          </Button>
          <div className="flex items-center gap-2 mr-2">
            <span className="text-slate-600 text-sm">Draft</span>
            <div className="w-10 h-6 bg-slate-200 rounded-full flex items-center p-1">
              <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
            </div>
            <span className="text-slate-600 text-sm">Publish</span>
          </div>
          <Button 
            className="rounded-full font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex max-w-screen-xl mx-auto">
          <button 
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              "border-blue-500 text-blue-600"
            )}
          >
            Builder
          </button>
          <button 
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            Settings
          </button>
          <button 
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            Enrollment History
          </button>
          <button 
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            Execution Logs
          </button>
        </div>
      </div>

      <div className="flex flex-1 w-full overflow-hidden relative">
        {/* Main Canvas */}
        <div className="flex-1 bg-gray-50 relative overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-40 pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
               }}>
          </div>
          
          {/* Canvas with zoom and pan */}
          <div 
            ref={canvasRef}
            className="w-full h-full relative origin-center"
            style={{ 
              transform: `translate(${canvasPosition.current.x}px, ${canvasPosition.current.y}px) scale(${zoomLevel})`,
              transition: isDragging.current ? 'none' : 'transform 0.1s ease'
            }}
          >
            {/* Render connections */}
            {renderConnections()}
            
            {/* Render merge point */}
            {renderMergePoint()}
            
            {/* Render END node */}
            {renderEndNode()}

            {/* Empty state - Add first trigger */}
            {editorState.nodes.length === 0 && (
              <div className="absolute top-40 left-1/2 -translate-x-1/2">
                <div 
                  className="w-[250px] h-[70px] border border-dashed border-blue-300 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleAddNodeClick()}
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <Plus className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Add New Trigger</span>
                </div>
              </div>
            )}

            {/* "Add New Trigger" Button when triggers exist */}
            {editorState.nodes.length > 0 && (
              <div className="absolute" style={{ top: '150px', left: '530px' }}>
                <div 
                  className="w-[250px] h-[70px] border border-dashed border-blue-300 rounded-md flex items-center justify-center text-blue-600 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleAddNodeClick()}
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                    <Plus className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-medium">Add New Trigger</span>
                </div>
              </div>
            )}

            {/* Render nodes */}
            {editorState.nodes.map((node) => (
              <div 
                key={node.id}
                ref={(el: HTMLDivElement | null) => {
                  nodeRefs.current[node.id] = el;
                }}
                data-node-id={node.id}
                className="absolute"
                style={{
                  top: `${node.position.y}px`,
                  left: `${node.position.x}px`,
                  cursor: node.type === 'trigger' ? 'move' : 'move',
                  zIndex: editorState.selectedNodeId === node.id ? 30 : 10
                }}
              >
                <div 
                  className={cn(
                    "bg-white shadow-sm rounded-md border w-[330px]",
                    editorState.selectedNodeId === node.id ? "border-blue-500" : "border-slate-200",
                    "transition-all duration-150 hover:shadow-md"
                  )}
                  onClick={() => selectNode(node.id)}
                >
                  <div className="p-4 flex items-center">
                    <div className={cn(
                      "h-16 w-16 rounded-md flex items-center justify-center mr-4",
                      node.type === 'trigger' ? "bg-blue-100 text-blue-500" : 
                      node.type === 'action' ? "bg-purple-100 text-purple-500" :
                      node.type === 'condition' ? "bg-yellow-100 text-yellow-500" :
                      "bg-green-100 text-green-500"
                    )}>
                      <div className="h-8 w-8">
                        {node.data.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className={cn(
                        "font-medium text-lg",
                        node.type === 'trigger' ? "text-blue-600" : 
                        node.type === 'action' ? "text-purple-600" :
                        node.type === 'condition' ? "text-yellow-600" :
                        "text-green-600"
                      )}>
                        {node.type === 'trigger' ? 'Trigger' : 
                         node.type === 'action' ? 'Action' :
                         node.type === 'condition' ? 'Condition' : 'Delay'}
                      </h3>
                      <p className="text-gray-600">
                        {node.data.name}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open node editor/settings
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNode(node.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Add button below each node (except triggers) */}
                {node.type !== 'trigger' && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddNodeClick(node.id);
                      }}
                      className="bg-white hover:bg-slate-50 rounded-full h-8 w-8 flex items-center justify-center shadow-sm border border-slate-200"
                    >
                      <Plus className="h-4 w-4 text-indigo-500" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Canvas Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 shadow-sm"
              onClick={() => {
                setZoomLevel(prev => Math.min(prev + 0.1, 2));
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 shadow-sm"
              onClick={() => {
                setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
              }}
            >
              <div className="h-4 w-4 flex items-center justify-center">-</div>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 shadow-sm"
              onClick={() => {
                canvasPosition.current = { x: 0, y: 0 };
                setZoomLevel(1);
              }}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-slate-950 border-l border-slate-800 overflow-y-auto flex flex-col transition-all duration-300 ease-in-out">
            {/* Sidebar Header */}
            <div className="border-b border-slate-800 p-4 flex justify-between items-center">
              <h3 className="text-slate-200 font-medium">
                {editorState.selectedNodeId 
                  ? `Edit ${editorState.nodes.find(n => n.id === editorState.selectedNodeId)?.type}`
                  : 'Add Node'
                }
              </h3>
              <Button 
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                onClick={() => setShowSidebar(false)}
              >
                &times;
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
              <button 
                className={cn(
                  "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeSidebarTab === "triggers" 
                    ? "border-indigo-500 text-indigo-500" 
                    : "border-transparent text-slate-400 hover:text-slate-300"
                )}
                onClick={() => setActiveSidebarTab("triggers")}
              >
                Triggers
              </button>
              <button 
                className={cn(
                  "flex-1 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeSidebarTab === "actions" 
                    ? "border-indigo-500 text-indigo-500" 
                    : "border-transparent text-slate-400 hover:text-slate-300"
                )}
                onClick={() => setActiveSidebarTab("actions")}
              >
                Actions
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-800">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-9 bg-slate-800 border-slate-700 text-slate-200 focus-visible:ring-slate-700" 
                  placeholder={`Search ${activeSidebarTab === "triggers" ? "triggers" : "actions"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeSidebarTab === "triggers" ? (
                <TriggersList 
                  searchQuery={searchQuery} 
                  triggerCategories={triggerCategories}
                  onSelectTrigger={handleAddTrigger}
                />
              ) : (
                <ActionsList 
                  searchQuery={searchQuery} 
                  actionCategories={actionCategories}
                  onSelectAction={(id, name, icon) => handleAddAction(id, name, icon, editorState.selectedNodeId || undefined)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for Triggers list
const TriggersList: React.FC<{
  searchQuery: string;
  triggerCategories: any[];
  onSelectTrigger: (id: string, name: string, icon: React.ReactNode) => void;
}> = ({ searchQuery, triggerCategories, onSelectTrigger }) => {
  const filteredCategories = triggerCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      {filteredCategories.map(category => (
        <div key={category.id} className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">{category.name}</h3>
          <div className="space-y-1">
            {category.items.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-slate-800 text-left"
                onClick={() => onSelectTrigger(item.id, item.name, item.icon)}
              >
                <div className="h-9 w-9 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm text-slate-200">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No matching triggers found
        </div>
      )}
    </>
  );
};

// Helper component for Actions list
const ActionsList: React.FC<{
  searchQuery: string;
  actionCategories: any[];
  onSelectAction: (id: string, name: string, icon: React.ReactNode) => void;
}> = ({ searchQuery, actionCategories, onSelectAction }) => {
  const filteredCategories = actionCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      {filteredCategories.map(category => (
        <div key={category.id} className="mb-6">
          <h3 className="text-sm font-medium text-slate-400 mb-2">{category.name}</h3>
          <div className="space-y-1">
            {category.items.map(item => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-slate-800 text-left"
                onClick={() => onSelectAction(item.id, item.name, item.icon)}
              >
                <div className="h-9 w-9 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-sm text-slate-200">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No matching actions found
        </div>
      )}
    </>
  );
};

const AIAutomation: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: "wf-1704316261697",
      name: "Welcome Message on Booking",
      status: "active",
      lastEdited: "2023-12-28",
      triggerCount: 1,
      actionCount: 2
    },
    {
      id: "wf-1704316298123",
      name: "Check-out Feedback Request",
      status: "draft",
      lastEdited: "2024-01-02",
      triggerCount: 1,
      actionCount: 1
    },
  ]);

  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<{id: string, name: string} | null>(null);

  const handleCreateWorkflow = () => {
    const newId = `wf-${Date.now()}`;
    setCurrentWorkflow({
      id: newId,
      name: "New Workflow"
    });
    setShowWorkflowBuilder(true);
  };

  const handleEditWorkflow = (workflow: Automation) => {
    setCurrentWorkflow({
      id: workflow.id,
      name: workflow.name
    });
    setShowWorkflowBuilder(true);
  };

  const handleDeleteWorkflow = (id: string) => {
    setAutomations(automations.filter(automation => automation.id !== id));
  };

  const handleToggleWorkflow = (id: string) => {
    setAutomations(automations.map(automation =>
      automation.id === id 
        ? { ...automation, status: automation.status === "active" ? "inactive" : "active" } 
        : automation
    ));
  };

  // Show the workflow builder as a standalone overlay if active
  if (showWorkflowBuilder && currentWorkflow) {
    return (
      <WorkflowBuilder
        onBack={() => setShowWorkflowBuilder(false)}
        workflowId={currentWorkflow.id}
        workflowName={currentWorkflow.name}
      />
    );
  }

  // Otherwise show the automation list
  return (
    <DashboardLayout>
      <div className="w-full px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">AI Automation</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage automated workflows for your hotel</p>
          </div>
          <Button onClick={handleCreateWorkflow} className="rounded-full font-medium px-5">
                <Plus className="mr-2 h-4 w-4" />
            Create Workflow
              </Button>
        </div>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Workflows</CardTitle>
            <CardDescription>Manage your automated workflow sequences</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="border-collapse w-full">
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow className="border-b-slate-200 dark:border-b-slate-800">
                  <TableHead className="py-3 w-[30%]">Name</TableHead>
                  <TableHead className="py-3 w-[15%]">ID</TableHead>
                  <TableHead className="py-3 w-[10%]">Triggers</TableHead>
                  <TableHead className="py-3 w-[10%]">Actions</TableHead>
                  <TableHead className="py-3 w-[15%]">Last Edited</TableHead>
                  <TableHead className="py-3 w-[10%]">Status</TableHead>
                  <TableHead className="text-right py-3 w-[10%]">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {automations.map((automation) => (
                  <TableRow 
                    key={automation.id} 
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <TableCell className="font-medium py-3">{automation.name}</TableCell>
                    <TableCell className="text-xs text-slate-500 dark:text-slate-400 py-3">{automation.id}</TableCell>
                    <TableCell className="py-3">{automation.triggerCount}</TableCell>
                    <TableCell className="py-3">{automation.actionCount}</TableCell>
                    <TableCell className="py-3">{automation.lastEdited}</TableCell>
                    <TableCell className="py-3">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", 
                        automation.status === "active" ? "bg-green-500/10 text-green-600" : 
                        automation.status === "draft" ? "bg-yellow-500/10 text-yellow-700" :
                        "bg-slate-500/10 text-slate-600"
                      )}>
                        {automation.status === "active" ? "Active" : 
                         automation.status === "draft" ? "Draft" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditWorkflow(automation)}
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleWorkflow(automation.id)}
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Zap className={cn("h-4 w-4", automation.status === "active" ? "text-green-500" : "text-slate-400")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteWorkflow(automation.id)}
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAutomation;
