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
  Grid,
  FileText,
  CreditCard,
  Bed,
  Briefcase,
  Users,
  User,
  Brain,
  CheckCircle,
  XCircle,
  BarChart,
  BedDouble,
  Building,
  CheckCheck,
  ClipboardList,
  DollarSign,
  FileUp,
  Home,
  Hotel,
  Layers,
  Lock,
  LogIn,
  MessageCircle,
  Percent,
  PhoneCall,
  Star,
  Smartphone,
  ThumbsUp,
  Timer,
  Wrench,
  Trash,
  UserPlus,
  AlertCircle,
  AlarmClock,
  RefreshCw,
  Eye,
  PlayCircle,
  Filter,
  X,
  ArrowRight,
  Database
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { nanoid } from 'nanoid';
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";

interface Automation {
  id: string;
  name: string;
  status: "active" | "draft" | "inactive";
  lastEdited: string;
  triggerCount: number;
  actionCount: number;
  createdAt?: string;
  updatedAt?: string;
  nodes?: any[];
  connections?: any[];
}

// Node Types and Interfaces
interface Position {
  x: number;
  y: number;
}

interface NodeInterface {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'branch' | 'parallel';
  data: {
    id: string;
    name: string;
    icon: React.ReactNode;
    // Conditional properties
    condition?: string;
    conditionType?: 'equals' | 'contains' | 'greater' | 'less' | 'exists' | 'not_exists' | 'custom';
    conditionValue?: string;
    conditionField?: string;
    // Parallel execution properties
    branches?: number;
    // Data mapping properties
    inputFields?: Array<{
      id: string;
      name: string;
      type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
      required: boolean;
      description?: string;
    }>;
    outputFields?: Array<{
      id: string;
      name: string;
      type: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
      description?: string;
    }>;
    // Version information
    version?: number;
    createdAt?: string;
    lastModified?: string;
    [key: string]: any;
  };
  position: Position;
  parentId?: string;
  // Branch-specific properties
  branchType?: 'true' | 'false' | 'default';
  branchIndex?: number;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'main' | 'branch' | 'merge' | 'true' | 'false' | 'parallel';
  branchIndex?: number;
  // Data mapping properties
  dataMapping?: Array<{
    sourceField: string;
    targetField: string;
    transformation?: 'direct' | 'format' | 'formula' | 'conditional';
    transformationConfig?: {
      formula?: string;
      format?: string;
      condition?: string;
      defaultValue?: any;
    };
  }>;
  metadata?: {
    status?: 'valid' | 'invalid' | 'warning';
    statusMessage?: string;
    isAnimating?: boolean;
  };
}

interface EditorState {
  nodes: NodeInterface[];
  connections: Connection[];
  selectedNodeId: string | null;
  version: number;
  history: {
    nodes: NodeInterface[];
    connections: Connection[];
    timestamp: string;
    version: number;
  }[];
}

// After node interfaces but before component definition:
const NODE_TYPE = {
  TRIGGER: 'trigger' as const,
  ACTION: 'action' as const,
  CONDITION: 'condition' as const,
  DELAY: 'delay' as const,
  BRANCH: 'branch' as const,
  PARALLEL: 'parallel' as const
};

// Add workflow tab type
type WorkflowTab = "builder" | "settings" | "enrollment" | "logs";

// Workflow templates data
const workflowTemplates = [
  {
    id: 'template-booking-confirmation',
    name: 'Booking Confirmation Sequence',
    description: 'Send confirmation messages across channels when a new booking is received',
    category: 'booking',
    nodes: [
      {
        id: 'trigger-booking',
        type: 'trigger',
        data: {
          id: 'new_booking',
          name: 'New booking received',
          icon: <Calendar size={16} />
        },
        position: { x: 150, y: 150 }
      },
      {
        id: 'action-email',
        type: 'action',
        data: {
          id: 'send_email',
          name: 'Send Email Confirmation',
          icon: <Mail size={16} />
        },
        position: { x: 500, y: 300 },
        parentId: 'trigger-booking'
      },
      {
        id: 'condition-whatsapp',
        type: 'condition',
        data: {
          id: 'condition-phone',
          name: 'Has WhatsApp Number?',
          icon: <Settings size={16} />,
          conditionType: 'exists',
          conditionField: 'phone_number',
          condition: 'phone_number exists'
        },
        position: { x: 500, y: 450 },
        parentId: 'action-email'
      },
      {
        id: 'action-whatsapp',
        type: 'action',
        data: {
          id: 'send_whatsapp',
          name: 'Send WhatsApp Confirmation',
          icon: <Smartphone size={16} />
        },
        position: { x: 350, y: 600 },
        parentId: 'condition-whatsapp',
        branchType: 'true'
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-booking',
        target: 'action-email',
        type: 'main'
      },
      {
        id: 'conn-2',
        source: 'action-email',
        target: 'condition-whatsapp',
        type: 'main'
      },
      {
        id: 'conn-3',
        source: 'condition-whatsapp',
        target: 'action-whatsapp',
        type: 'true'
      }
    ]
  },
  {
    id: 'template-lead-scoring',
    name: 'Lead Scoring Workflow',
    description: 'Score leads based on their actions and route them through appropriate nurturing sequences',
    category: 'marketing',
    nodes: [
      {
        id: 'trigger-lead',
        type: 'trigger',
        data: {
          id: 'new_contact',
          name: 'New contact added to CRM',
          icon: <UserPlus size={16} />
        },
        position: { x: 150, y: 150 }
      },
      {
        id: 'condition-previous-stay',
        type: 'condition',
        data: {
          id: 'condition-previous',
          name: 'Previously Stayed?',
          icon: <Settings size={16} />,
          conditionType: 'exists',
          conditionField: 'previous_stay',
          condition: 'previous_stay exists'
        },
        position: { x: 500, y: 300 },
        parentId: 'trigger-lead'
      },
      {
        id: 'action-high-value',
        type: 'action',
        data: {
          id: 'assign_high_value',
          name: 'Tag as High-Value Lead',
          icon: <Tag size={16} />
        },
        position: { x: 350, y: 450 },
        parentId: 'condition-previous-stay',
        branchType: 'true'
      },
      {
        id: 'action-welcome',
        type: 'action',
        data: {
          id: 'send_welcome',
          name: 'Send Welcome Series',
          icon: <Mail size={16} />
        },
        position: { x: 650, y: 450 },
        parentId: 'condition-previous-stay',
        branchType: 'false'
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-lead',
        target: 'condition-previous-stay',
        type: 'main'
      },
      {
        id: 'conn-2',
        source: 'condition-previous-stay',
        target: 'action-high-value',
        type: 'true'
      },
      {
        id: 'conn-3',
        source: 'condition-previous-stay',
        target: 'action-welcome',
        type: 'false'
      }
    ]
  },
  {
    id: 'template-personalized-message',
    name: 'Personalized Messaging Flow',
    description: 'Send different follow-up messages based on user interactions',
    category: 'communication',
    nodes: [
      {
        id: 'trigger-feedback',
        type: 'trigger',
        data: {
          id: 'feedback_submitted',
          name: 'Guest submits feedback/review',
          icon: <ThumbsUp size={16} />
        },
        position: { x: 150, y: 150 }
      },
      {
        id: 'condition-rating',
        type: 'condition',
        data: {
          id: 'condition-rating',
          name: 'Rating > 4 Stars?',
          icon: <Settings size={16} />,
          conditionType: 'greater',
          conditionField: 'rating',
          conditionValue: '4',
          condition: 'rating > 4'
        },
        position: { x: 500, y: 300 },
        parentId: 'trigger-feedback'
      },
      {
        id: 'action-positive',
        type: 'action',
        data: {
          id: 'send_thanks',
          name: 'Send Thank You Message',
          icon: <MessageSquare size={16} />
        },
        position: { x: 350, y: 450 },
        parentId: 'condition-rating',
        branchType: 'true'
      },
      {
        id: 'action-negative',
        type: 'action',
        data: {
          id: 'send_followup',
          name: 'Send Improvement Followup',
          icon: <MessageSquare size={16} />
        },
        position: { x: 650, y: 450 },
        parentId: 'condition-rating',
        branchType: 'false'
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'trigger-feedback',
        target: 'condition-rating',
        type: 'main'
      },
      {
        id: 'conn-2',
        source: 'condition-rating',
        target: 'action-positive',
        type: 'true'
      },
      {
        id: 'conn-3',
        source: 'condition-rating',
        target: 'action-negative',
        type: 'false'
      }
    ]
  }
];

// Workflow Builder as a standalone component
const WorkflowBuilder: React.FC<{
  onBack: () => void;
  workflowId: string;
  workflowName: string;
}> = ({ onBack, workflowId, workflowName }) => {
  const [currentWorkflowName, setCurrentWorkflowName] = useState(workflowName);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<WorkflowTab>("builder");
  const [editorState, setEditorState] = useState<EditorState>({
    nodes: [],
    connections: [],
    selectedNodeId: null,
    version: 1,
    history: []
  });
  
  // Add state for template selector and connection editing
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);

  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"triggers" | "actions" | "conditions" | "templates">("triggers");
  
  // Canvas zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Node refs for calculating positions
  const nodeRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  
  // Add states for the settings tab
  const [workflowDescription, setWorkflowDescription] = useState("");
  const [maxExecutionsPerDay, setMaxExecutionsPerDay] = useState(100);
  const [notifyOnSuccess, setNotifyOnSuccess] = useState(true);
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [isActive, setIsActive] = useState(false);
  
  // Add mock data for enrollment tab
  const [enrolledEntities, setEnrolledEntities] = useState([
    { id: "1", name: "All New Guests", type: "filter", enrolledOn: "2024-01-15", status: "active" },
    { id: "2", name: "Premium Room Bookings", type: "filter", enrolledOn: "2024-01-16", status: "active" },
    { id: "3", name: "Guests with Special Requests", type: "filter", enrolledOn: "2024-01-20", status: "paused" }
  ]);
  
  // Add mock data for logs tab
  const [executionLogs, setExecutionLogs] = useState([
    { id: "log-1", timestamp: "2024-01-25 09:15:23", status: "success", entity: "John Smith", duration: "1.2s", message: "Workflow executed successfully" },
    { id: "log-2", timestamp: "2024-01-25 14:32:10", status: "success", entity: "Sarah Johnson", duration: "0.9s", message: "Workflow executed successfully" },
    { id: "log-3", timestamp: "2024-01-26 10:45:32", status: "failure", entity: "Michael Brown", duration: "2.1s", message: "Failed at action 'send_email': Invalid email address" },
    { id: "log-4", timestamp: "2024-01-27 08:22:44", status: "success", entity: "Emily Wilson", duration: "1.4s", message: "Workflow executed successfully" }
  ]);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isNodeDragging = useRef(false);
  const draggedNodeId = useRef<string | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const canvasPosition = useRef({ x: 0, y: 0 });
  
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
      id: "booking",
      name: "Booking & Guest Triggers",
      items: [
        { id: "new_booking", name: "New booking received", icon: <Calendar size={16} /> },
        { id: "booking_cancel", name: "Booking cancellation", icon: <XCircle size={16} /> },
        { id: "checkin_date", name: "Check-in date reached", icon: <Calendar size={16} /> },
        { id: "checkout_date", name: "Check-out date reached", icon: <Calendar size={16} /> },
        { id: "guest_checkin", name: "Guest check-in completed", icon: <CheckCircle size={16} /> },
        { id: "guest_checkout", name: "Guest check-out completed", icon: <CheckCheck size={16} /> },
        { id: "guest_noshow", name: "Guest no-show detected", icon: <AlertCircle size={16} /> },
        { id: "booking_modified", name: "Booking modified", icon: <Edit size={16} /> }
      ]
    },
    {
      id: "communication",
      name: "Communication Triggers",
      items: [
        { id: "message_opened", name: "Guest opens WhatsApp/email message", icon: <Mail size={16} /> },
        { id: "message_reply", name: "Guest replies to a message", icon: <MessageSquare size={16} /> },
        { id: "feedback_submitted", name: "Guest submits feedback/review", icon: <ThumbsUp size={16} /> },
        { id: "new_contact", name: "New contact added to CRM", icon: <UserPlus size={16} /> }
      ]
    },
    {
      id: "finance",
      name: "Finance & Billing Triggers",
      items: [
        { id: "invoice_created", name: "Invoice created", icon: <FileText size={16} /> },
        { id: "invoice_paid", name: "Invoice paid", icon: <CreditCard size={16} /> },
        { id: "payment_failed", name: "Payment failed", icon: <XCircle size={16} /> },
        { id: "gst_added", name: "GST number added", icon: <FileUp size={16} /> }
      ]
    },
    {
      id: "housekeeping",
      name: "Housekeeping & Room Status Triggers",
      items: [
        { id: "room_dirty", name: "Room marked as dirty", icon: <Bed size={16} /> },
        { id: "room_clean", name: "Room marked as clean", icon: <CheckCircle size={16} /> },
        { id: "maintenance_request", name: "Maintenance request submitted", icon: <Wrench size={16} /> },
        { id: "room_availability", name: "Room availability changes", icon: <Hotel size={16} /> }
      ]
    },
    {
      id: "staff",
      name: "Staff & Role Triggers",
      items: [
        { id: "staff_added", name: "New staff added", icon: <UserPlus size={16} /> },
        { id: "staff_login", name: "Staff login detected", icon: <LogIn size={16} /> },
        { id: "shift_changed", name: "Shift started or ended", icon: <Clock size={16} /> },
        { id: "role_changed", name: "Role permission changed", icon: <Lock size={16} /> }
      ]
    },
    {
      id: "date_time",
      name: "Date & Time Triggers",
      items: [
        { id: "specific_day", name: "Specific day of the week", icon: <Calendar size={16} /> },
        { id: "time_based", name: "Time-based trigger", icon: <AlarmClock size={16} /> },
        { id: "before_checkin", name: "Before check-in time", icon: <Clock size={16} /> },
        { id: "after_checkout", name: "After check-out time", icon: <Clock size={16} /> }
      ]
    },
    {
      id: "analytics",
      name: "Analytics & Alerts",
      items: [
        { id: "low_occupancy", name: "Occupancy falls below threshold", icon: <BarChart size={16} /> },
        { id: "low_revenue", name: "Revenue per room below target", icon: <DollarSign size={16} /> },
        { id: "high_cancellation", name: "Cancellation rate above threshold", icon: <Percent size={16} /> },
        { id: "low_rating", name: "Guest rating drops below threshold", icon: <Star size={16} /> }
      ]
    }
  ];

  const actionCategories = [
    {
      id: "communication",
      name: "Communication Actions",
      items: [
        { id: "send_whatsapp", name: "Send WhatsApp message", icon: <Smartphone size={16} /> },
        { id: "send_email", name: "Send Email", icon: <Mail size={16} /> },
        { id: "send_sms", name: "Send SMS", icon: <MessageCircle size={16} /> },
        { id: "schedule_message", name: "Schedule follow-up message", icon: <Calendar size={16} /> },
        { id: "send_survey", name: "Send guest satisfaction survey", icon: <ClipboardList size={16} /> }
      ]
    },
    {
      id: "booking_finance",
      name: "Booking & Finance Actions",
      items: [
        { id: "generate_invoice", name: "Generate invoice", icon: <FileText size={16} /> },
        { id: "send_payment", name: "Send payment link", icon: <CreditCard size={16} /> },
        { id: "mark_booking", name: "Mark booking as paid/unpaid", icon: <CheckCircle size={16} /> },
        { id: "apply_discount", name: "Apply discount", icon: <Percent size={16} /> },
        { id: "send_invoice", name: "Send invoice to guest", icon: <Send size={16} /> }
      ]
    },
    {
      id: "room_housekeeping",
      name: "Room & Housekeeping Actions",
      items: [
        { id: "notify_housekeeping", name: "Notify housekeeping", icon: <Bell size={16} /> },
        { id: "assign_cleaner", name: "Assign room cleaner", icon: <User size={16} /> },
        { id: "log_maintenance", name: "Log maintenance task", icon: <Wrench size={16} /> },
        { id: "mark_room", name: "Mark room as clean/dirty", icon: <BedDouble size={16} /> }
      ]
    },
    {
      id: "crm",
      name: "AI/CRM Actions",
      items: [
        { id: "add_guest", name: "Add guest to CRM", icon: <UserPlus size={16} /> },
        { id: "tag_guest", name: "Tag guest", icon: <Tag size={16} /> },
        { id: "update_preferences", name: "Update guest preferences", icon: <Edit size={16} /> },
        { id: "generate_report", name: "Generate guest insights report", icon: <FileText size={16} /> }
      ]
    },
    {
      id: "workflow",
      name: "Automation/Workflow Actions",
      items: [
        { id: "add_delay", name: "Add delay", icon: <Timer size={16} /> },
        { id: "conditional_check", name: "Conditional check", icon: <Settings size={16} /> },
        { id: "branch_workflow", name: "Branch workflow path", icon: <Layers size={16} /> },
        { id: "trigger_workflow", name: "Trigger another workflow", icon: <Zap size={16} /> },
        { id: "stop_workflow", name: "Stop/terminate workflow", icon: <XCircle size={16} /> }
      ]
    },
    {
      id: "staff",
      name: "Staff Actions",
      items: [
        { id: "notify_staff", name: "Notify staff", icon: <Bell size={16} /> },
        { id: "assign_task", name: "Assign task to staff member", icon: <ClipboardList size={16} /> },
        { id: "change_role", name: "Change role/permissions", icon: <Users size={16} /> },
        { id: "generate_roster", name: "Auto-generate duty roster", icon: <Calendar size={16} /> }
      ]
    },
    {
      id: "ai",
      name: "AI Actions",
      items: [
        { id: "summarize_conversation", name: "Summarize guest conversation", icon: <Brain size={16} /> },
        { id: "suggest_upsell", name: "Suggest upsell opportunity", icon: <DollarSign size={16} /> },
        { id: "detect_cancellation", name: "Auto-detect cancellation risk", icon: <AlertCircle size={16} /> },
        { id: "draft_message", name: "Draft personalized message using AI", icon: <MessageSquare size={16} /> }
      ]
    }
  ];

  // Add condition field dropdown categories
  const conditionFields = [
    { category: 'Guest', fields: ['name', 'email', 'phone_number', 'loyalty_tier', 'previous_stay', 'nationality'] },
    { category: 'Booking', fields: ['booking_amount', 'nights', 'room_type', 'check_in_date', 'check_out_date', 'special_requests', 'payment_method'] },
    { category: 'Interaction', fields: ['last_email_opened', 'messages_responded', 'rating', 'feedback_text', 'survey_completed'] },
    { category: 'Marketing', fields: ['campaign_source', 'referral_code', 'lead_score', 'opt_in_status', 'subscription_preferences'] }
  ];

  // Add condition operator types
  const conditionOperators = [
    { value: 'equals', label: 'Equals', applicableTo: ['text', 'number', 'date'] },
    { value: 'not_equals', label: 'Does Not Equal', applicableTo: ['text', 'number', 'date'] },
    { value: 'contains', label: 'Contains', applicableTo: ['text'] },
    { value: 'greater', label: 'Greater Than', applicableTo: ['number', 'date'] },
    { value: 'less', label: 'Less Than', applicableTo: ['number', 'date'] },
    { value: 'exists', label: 'Exists', applicableTo: ['text', 'number', 'date'] },
    { value: 'not_exists', label: 'Does Not Exist', applicableTo: ['text', 'number', 'date'] }
  ];

  // Apply a workflow template
  const applyWorkflowTemplate = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    setEditorState(prev => {
      // Fix type errors by ensuring nodes conform to NodeInterface
      const typedNodes = template.nodes.map((node: any) => ({
        ...node,
        type: node.type as 'trigger' | 'action' | 'condition' | 'delay' | 'branch' | 'parallel',
        data: {
          ...node.data,
          version: 1,
          createdAt: new Date().toISOString()
        }
      }));
      
      return {
        nodes: typedNodes,
        connections: template.connections || [],
        selectedNodeId: null,
        version: prev.version + 1,
        history: [...prev.history, {
          nodes: typedNodes,
          connections: template.connections || [],
          timestamp: new Date().toISOString(),
          version: prev.version
        }].slice(-10)
      };
    });
  };

  // Test a workflow - simulate execution
  const testWorkflow = () => {
    // Start from triggers
    const startingTriggers = editorState.nodes.filter(node => node.type === 'trigger');
    if (startingTriggers.length === 0) {
      alert('No triggers to start the workflow.');
      return;
    }
    
    // Show a toast or message
    alert('Testing workflow - check browser console for details');
    
    // Trace execution path through the workflow
    console.log('Workflow Test Started');
    startingTriggers.forEach(trigger => {
      console.log(`Starting from trigger: ${trigger.data.name}`);
      traceExecutionPath(trigger.id);
    });
    
    console.log('Workflow Test Completed');
  };

  // Trace the execution path from a node
  const traceExecutionPath = (nodeId: string, depth: number = 0, branchPath: string = '') => {
    if (depth > 20) {
      console.log('Max depth reached - preventing infinite loops');
      return; // Prevent infinite loops
    }
    
    const node = editorState.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    // Log the current node
    console.log(`${' '.repeat(depth * 2)}${branchPath ? `[${branchPath}] ` : ''}Executing: ${node.type} - ${node.data.name}`);
    
    // Find outgoing connections
    const connections = editorState.connections.filter(conn => conn.source === nodeId);
    
    // Based on node type, determine which connections to follow
    if (node.type === 'condition') {
      // In a real system, evaluate the condition
      // For testing, just show both paths
      const truePath = connections.find(conn => conn.type === 'true');
      const falsePath = connections.find(conn => conn.type === 'false');
      
      if (truePath) {
        traceExecutionPath(truePath.target, depth + 1, 'True');
      }
      
      if (falsePath) {
        traceExecutionPath(falsePath.target, depth + 1, 'False');
      }
    }
    else if (node.type === 'parallel') {
      // In parallel, execute all branches concurrently
      connections.forEach(conn => {
        const branchIndex = conn.branchIndex !== undefined ? `Branch ${conn.branchIndex + 1}` : 'Branch';
        traceExecutionPath(conn.target, depth + 1, branchIndex);
      });
    }
    else {
      // For other nodes (trigger, action, delay), follow the main path
      connections.forEach(conn => {
        traceExecutionPath(conn.target, depth + 1, branchPath);
      });
    }
  };

  // Node Management Functions
  const addNode = (type: 'trigger' | 'action' | 'condition' | 'delay' | 'branch' | 'parallel', data: any, position: Position, parentId?: string, branchType?: 'true' | 'false' | 'default', branchIndex?: number) => {
    const newNode: NodeInterface = {
      id: `${type}-${Date.now()}`,
      type,
      data: {
        ...data,
        version: 1,
        createdAt: new Date().toISOString()
      },
      position,
      parentId,
      branchType,
      branchIndex
    };
    
    // Add the node to the state
    setEditorState(prev => {
      const updatedNodes = [...prev.nodes, newNode];
      
      // If there's a parent, create a connection
      let updatedConnections = [...prev.connections];
      if (parentId) {
        const connectionType = branchType ? branchType : 'main';
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          source: parentId,
          target: newNode.id,
          type: connectionType as 'main' | 'branch' | 'merge' | 'true' | 'false' | 'parallel',
          branchIndex
        };
        updatedConnections = [...updatedConnections, newConnection];
      }
      
      // Adjust existing node positions to make room for the new node
      // Only for horizontal layouts, shift nodes to the right when needed
      let adjustedNodes = updatedNodes;
      
      if (type === 'action' && parentId) {
        // Actions get added to the right of their triggers
        // No need to adjust other nodes, as they're positioned individually
      } else if (type === 'trigger') {
        // For triggers, we keep them at a fixed Y position
        // but may need to adjust existing nodes to make space
        // This is handled by the handleAddTrigger function
      }
      
      // Save this state to history for version control
      const newHistory = [...prev.history, {
        nodes: adjustedNodes,
        connections: updatedConnections,
        timestamp: new Date().toISOString(),
        version: prev.version
      }];
      
      return {
        ...prev,
        nodes: adjustedNodes,
        connections: updatedConnections,
        selectedNodeId: newNode.id,
        version: prev.version + 1,
        history: newHistory.slice(-10) // Keep last 10 versions only
      };
    });
    
    setShowSidebar(false);
  };
  
  const removeNode = (nodeId: string) => {
    setEditorState(prev => {
      // Find descendants (nodes that have this node as an ancestor)
      const nodesToRemove = new Set([nodeId]);
      let foundNew = true;
      
      // Keep looking for descendants until no new ones are found
      while (foundNew) {
        foundNew = false;
        prev.nodes.forEach(node => {
          if (node.parentId && nodesToRemove.has(node.parentId) && !nodesToRemove.has(node.id)) {
            nodesToRemove.add(node.id);
            foundNew = true;
          }
        });
      }
      
      // Filter out the selected node and all descendants
      const updatedNodes = prev.nodes.filter(node => !nodesToRemove.has(node.id));
      
      // Filter out connections that involve any of the removed nodes
      const updatedConnections = prev.connections.filter(
        conn => !nodesToRemove.has(conn.source) && !nodesToRemove.has(conn.target)
      );
      
      // Save this state to history for version control
      const newHistory = [...prev.history, {
        nodes: updatedNodes,
        connections: updatedConnections,
        timestamp: new Date().toISOString(),
        version: prev.version
      }];
      
      return {
        ...prev,
        nodes: updatedNodes,
        connections: updatedConnections,
        selectedNodeId: prev.selectedNodeId === nodeId ? null : prev.selectedNodeId,
        version: prev.version + 1,
        history: newHistory.slice(-10) // Keep last 10 versions only
      };
    });
  };
  
  const updateNodePosition = (nodeId: string, position: Position) => {
    setEditorState(prev => {
      const updatedNodes = prev.nodes.map(node => 
        node.id === nodeId ? { 
          ...node, 
          position,
          data: {
            ...node.data,
            lastModified: new Date().toISOString()
          }
        } : node
      );
      
      return {
        ...prev,
        nodes: updatedNodes
      };
    });
  };
  
  const updateNodeData = (nodeId: string, data: any) => {
    setEditorState(prev => {
      const updatedNodes = prev.nodes.map(node => 
        node.id === nodeId ? { 
          ...node, 
          data: {
            ...node.data,
            ...data,
            lastModified: new Date().toISOString()
          }
        } : node
      );
      
      // Save this state to history for version control
      const newHistory = [...prev.history, {
        nodes: updatedNodes,
        connections: prev.connections,
        timestamp: new Date().toISOString(),
        version: prev.version
      }];
      
      return {
        ...prev,
        nodes: updatedNodes,
        version: prev.version + 1,
        history: newHistory.slice(-10) // Keep last 10 versions only
      };
    });
  };

  // Version control - revert to a specific version
  const revertToVersion = (version: number) => {
    setEditorState(prev => {
      const historyEntry = prev.history.find(h => h.version === version);
      if (!historyEntry) return prev;
      
      return {
        ...prev,
        nodes: historyEntry.nodes,
        connections: historyEntry.connections,
        version: prev.version + 1,
        // Keep the history
        history: [...prev.history, {
          nodes: historyEntry.nodes,
          connections: historyEntry.connections,
          timestamp: new Date().toISOString(),
          version: prev.version
        }].slice(-10)
      };
    });
  };

  // Add a conditional branching node
  const addConditionNode = (conditionType: string, conditionField: string, conditionValue: string, position: Position, parentId?: string) => {
    addNode(
      'condition',
      { 
        id: `condition-${Date.now()}`, 
        name: `${conditionField} ${conditionType} ${conditionValue}`,
        icon: <Settings size={16} />,
        conditionType,
        conditionField,
        conditionValue,
        condition: `${conditionField} ${conditionType} ${conditionValue}`
      },
      position,
      parentId
    );
  };

  // Add branch paths from a condition
  const addBranchPaths = (conditionNodeId: string) => {
    const conditionNode = editorState.nodes.find(n => n.id === conditionNodeId);
    if (!conditionNode || conditionNode.type !== 'condition') return;
    
    // Add "True" branch
    const trueBranchPosition = {
      x: conditionNode.position.x - 150, // Position to the left
      y: conditionNode.position.y + 120  // Position below
    };
    
    addNode(
      'action',
      { id: `true-action-${Date.now()}`, name: 'True Path Action', icon: <CheckCircle size={16} /> },
      trueBranchPosition,
      conditionNodeId,
      'true'
    );
    
    // Add "False" branch
    const falseBranchPosition = {
      x: conditionNode.position.x + 150, // Position to the right
      y: conditionNode.position.y + 120  // Position below
    };
    
    addNode(
      'action',
      { id: `false-action-${Date.now()}`, name: 'False Path Action', icon: <XCircle size={16} /> },
      falseBranchPosition,
      conditionNodeId,
      'false'
    );
  };

  // Handle triggers with horizontal layout and actions with vertical layout
  const handleAddTrigger = (triggerId: string, triggerName: string, icon: React.ReactNode) => {
    // Get position based on existing triggers
    const triggerCount = triggers.length;
    const triggerXPosition = 150; // Initial X position for first trigger
    const triggerYPosition = 150; // Y position for all triggers
    
    // Add the new trigger
    addNode(
      'trigger',
      { id: triggerId, name: triggerName, icon },
      { x: triggerXPosition, y: triggerYPosition }
    );
  };

  // Position actions vertically under their trigger column
  const handleAddAction = (actionId: string, actionName: string, icon: React.ReactNode, parentId?: string) => {
    // Find parent node (trigger or action)
    const parentNode = parentId ? editorState.nodes.find(n => n.id === parentId) : null;
    const centralX = 375; // Center position of the flow
    
    // Calculate position
    const actionsCount = actions.length;
    const startY = 380; // Position below the + button
    const verticalSpacing = 100; // Space between actions
    const yPosition = startY + (actionsCount * verticalSpacing);
    
    addNode(
      'action',
      { id: actionId, name: actionName, icon },
      { x: centralX - 100, y: yPosition }, // Center the action on the flow line
      parentId || triggers[0]?.id // Connect to parent or first trigger
    );
  };

  // Helper to find the trigger id for any node
  const getTriggerId = (node: NodeInterface): string | undefined => {
    if (node.type === 'trigger') return node.id;
    
    if (!node.parentId) return undefined;
    
    const parentNode = editorState.nodes.find(n => n.id === node.parentId);
    if (!parentNode) return undefined;
    
    return getTriggerId(parentNode);
  };

  // Render the add trigger button that appears after each trigger
  const renderAddTriggerButton = () => {
    return (
      <div 
        className="absolute" 
        style={{
          top: '150px',
          left: '500px',
          zIndex: 20
        }}
      >
        <div 
          className="w-[250px] h-[80px] border-2 border-dashed border-blue-300 rounded-lg flex items-center gap-3 px-4 bg-white cursor-pointer hover:bg-blue-50"
          onClick={() => {
            setActiveSidebarTab("triggers");
            setShowSidebar(true);
          }}
        >
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-blue-600 font-medium">Add New Trigger</span>
        </div>
      </div>
    );
  };

  // Render the central connector lines and action add buttons
  const renderConnectorLines = () => {
    const centralX = 375; // Center between trigger and add button
    
    if (editorState.nodes.length === 0) {
      return null;
    }
    
    // Find all triggers
    const allTriggers = triggers;
    
    // Get positions for lines
    const triggerX = 275; // Right edge of trigger (150 + 125)
    const addButtonX = 500; // Left edge of add new trigger button
    
    return (
      <React.Fragment>
        {/* If there's at least one trigger, draw the connections */}
        {allTriggers.length > 0 && (
          <>
            {/* Line from trigger to central point (diagonal down-right) */}
            <div 
              className="absolute border-dashed border-t-2 border-r-2 rounded-tr-xl border-slate-300"
              style={{
                top: '190px', // Bottom of trigger
                left: `${triggerX}px`,
                width: `${centralX - triggerX}px`,
                height: '75px',
                borderBottomWidth: '0',
                borderLeftWidth: '0',
                zIndex: 5
              }}
            />
            
            {/* Line from add button to central point (diagonal down-left) */}
            <div 
              className="absolute border-dashed border-t-2 border-l-2 rounded-tl-xl border-slate-300"
              style={{
                top: '190px', // Bottom of add button
                left: `${centralX}px`,
                width: `${addButtonX - centralX}px`,
                height: '75px',
                borderBottomWidth: '0',
                borderRightWidth: '0',
                zIndex: 5
              }}
            />
            
            {/* Central vertical line down to + button */}
            <div 
              className="absolute border-l-2 border-dashed border-slate-300"
              style={{
                top: '265px', // Start from merge point
                left: `${centralX}px`,
                height: '85px',
                zIndex: 5
              }}
            />
            
            {/* Add action button at the center */}
            <div 
              className="absolute"
              style={{
                top: '350px',
                left: `${centralX - 15}px`,
                zIndex: 20
              }}
            >
              <Button
                onClick={() => {
                  setActiveSidebarTab("actions");
                  setSelectedParentId(allTriggers[0]?.id);
                  setShowSidebar(true);
                }}
                className="rounded-full h-8 w-8 flex items-center justify-center shadow-sm bg-white border border-slate-200 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
            
            {/* Line from + button to END */}
            <div 
              className="absolute border-l-2 border-dashed border-slate-300"
              style={{
                top: '358px', // Bottom of + button
                left: `${centralX}px`,
                height: '60px',
                zIndex: 5
              }}
            />
            
            {/* END block */}
            <div 
              className="absolute"
              style={{
                top: '418px',
                left: `${centralX - 40}px`,
                zIndex: 10
              }}
            >
              <div className="bg-slate-300 rounded-full px-6 py-2 text-slate-600 text-sm font-medium shadow-sm">
                END
              </div>
            </div>
          </>
        )}
      </React.Fragment>
    );
  };

  // Add a new state for tracking the parent when adding an action
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  // Update the empty state to not render a separate trigger button
  const renderEmptyState = () => {
    if (editorState.nodes.length > 0) return null;
    
    return (
      <div className="absolute" style={{ top: '150px', left: '150px' }}>
        <div className="w-[250px] h-[80px] border-0 rounded-lg flex items-center justify-center">
          <div className="text-slate-400 text-center">
            <p>Start by adding a trigger</p>
            <ArrowRight className="h-5 w-5 mt-2 mx-auto" />
          </div>
        </div>
      </div>
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
      // Use different widths based on node type
      const nodeWidth = node.type === 'trigger' || node.type === 'action' ? 220 : 270;
      const nodeHeight = node.type === 'trigger' || node.type === 'action' ? 70 : 80;
      
      return {
        x: node.position.x + (nodeWidth / 2), // Half of the node width
        y: node.position.y + (nodeHeight / 2) // Half of the node height
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
    
    return editorState.connections.map(connection => {
      const sourceNode = editorState.nodes.find(n => n.id === connection.source);
      const targetNode = editorState.nodes.find(n => n.id === connection.target);
      
      if (!sourceNode || !targetNode) return null;
      
      const sourceCenter = getNodeCenter(sourceNode);
      const targetCenter = getNodeCenter(targetNode);
      
      // Determine connection color and style based on type and mapping status
      let connectionColor = 'bg-slate-300'; // default
      let connectionStyle = '';
      let animationClass = '';
      
      // Use dotted line style for trigger-to-action connections
      const isDottedLine = sourceNode.type === 'trigger' && targetNode.type === 'action';
      const lineStyle = isDottedLine ? 'border-dashed border-2 bg-transparent animated-dotted-line' : '';
      
      // Connection color based on type
      if (connection.type === 'true') {
        connectionColor = isDottedLine ? 'border-green-400' : 'bg-green-400';
      } else if (connection.type === 'false') {
        connectionColor = isDottedLine ? 'border-red-400' : 'bg-red-400';
      } else if (connection.type === 'parallel') {
        connectionColor = isDottedLine ? 'border-indigo-400' : 'bg-indigo-400';
      } else {
        connectionColor = isDottedLine ? 'border-slate-400' : 'bg-slate-300';
      }
      
      // Add styling based on mapping status
      if (connection.metadata?.status === 'invalid') {
        connectionStyle = isDottedLine ? 'border-red-500' : 'bg-red-300';
        if (!isDottedLine) connectionStyle = 'border-2 border-red-500 ' + connectionStyle;
      } else if (connection.metadata?.status === 'warning') {
        connectionStyle = isDottedLine ? 'border-yellow-500' : 'bg-yellow-300';
        if (!isDottedLine) connectionStyle = 'border-2 border-yellow-500 ' + connectionStyle;
      }
      
      // Add animation for data flow
      if (connection.metadata?.isAnimating) {
        animationClass = 'data-flow-pulse';
      }
      
      // Generate mapping status tooltip content
      const mappingStatus = connection.dataMapping?.length 
        ? `${connection.dataMapping.length} field(s) mapped`
        : 'No data mapping';
      
      // For simple straight connections
      if (sourceNode.type === 'trigger' || 
          sourceNode.type === 'delay' || 
          (sourceNode.type === 'action' && targetNode.type !== 'condition') ||
          connection.type === 'main') {
        return (
          <div key={`conn-${connection.id}`} className="relative">
            <div 
              className={`absolute ${connectionColor} ${connectionStyle} ${animationClass} ${lineStyle}`} 
              style={{
                top: `${sourceCenter.y}px`,
                left: `${sourceCenter.x}px`,
                height: isDottedLine ? '0' : '2px',
                width: `${targetCenter.x - sourceCenter.x}px`,
                transform: targetCenter.x < sourceCenter.x ? 'translateX(-100%)' : '',
                zIndex: 5
              }}
            />
            
            {/* Data flow indicator */}
            {connection.dataMapping?.length > 0 && (
              <div 
                className="absolute cursor-pointer hover:scale-110 transition-transform"
                style={{
                  top: `${sourceCenter.y - 8}px`,
                  left: `${sourceCenter.x + (targetCenter.x - sourceCenter.x) / 2 - 8}px`,
                  zIndex: 6
                }}
                onClick={() => {
                  // Handle opening data mapping dialog
                  if (sourceNode && targetNode) {
                    setEditingConnection(connection);
                    setMappingDialogOpen(true);
                  }
                }}
              >
                <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200">
                  <Database className="h-3 w-3 text-blue-500" />
                </div>
                
                {/* Tooltip */}
                <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded p-1">
                  {mappingStatus}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      // For conditional branches or parallel paths - more complex with L shape
      return (
        <React.Fragment key={`conn-${connection.id}`}>
          {/* Vertical line from source */}
          <div 
            className={`absolute ${connectionColor} ${connectionStyle} ${animationClass} ${lineStyle}`} 
            style={{
              top: `${sourceCenter.y}px`,
              left: `${sourceCenter.x}px`,
              width: isDottedLine ? '0' : '2px',
              height: `${(targetCenter.y - sourceCenter.y) / 2}px`,
              zIndex: 5
            }}
          />
          
          {/* Horizontal line to target */}
          <div 
            className={`absolute ${connectionColor} ${connectionStyle} ${animationClass} ${lineStyle}`} 
            style={{
              top: `${sourceCenter.y + (targetCenter.y - sourceCenter.y) / 2}px`,
              left: Math.min(sourceCenter.x, targetCenter.x) + 'px',
              height: isDottedLine ? '0' : '2px',
              width: `${Math.abs(targetCenter.x - sourceCenter.x)}px`,
              zIndex: 5
            }}
          />
          
          {/* Vertical line to target */}
          <div 
            className={`absolute ${connectionColor} ${connectionStyle} ${animationClass} ${lineStyle}`} 
            style={{
              top: `${sourceCenter.y + (targetCenter.y - sourceCenter.y) / 2}px`,
              left: `${targetCenter.x}px`,
              width: isDottedLine ? '0' : '2px',
              height: `${(targetCenter.y - sourceCenter.y) / 2}px`,
              zIndex: 5
            }}
          />
          
          {/* Add a label for the connection type */}
          {(connection.type === 'true' || connection.type === 'false') && (
            <div 
              className={`absolute px-2 py-0.5 rounded-full text-xs font-medium
                ${connection.type === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              style={{
                top: `${sourceCenter.y + (targetCenter.y - sourceCenter.y) / 2 - 10}px`,
                left: `${(sourceCenter.x + targetCenter.x) / 2 - 15}px`,
                zIndex: 6
              }}
            >
              {connection.type === 'true' ? 'Yes' : 'No'}
            </div>
          )}
          
          {/* Data flow indicator for complex connections */}
          {connection.dataMapping?.length > 0 && (
            <div 
              className="absolute cursor-pointer hover:scale-110 transition-transform"
              style={{
                top: `${sourceCenter.y + (targetCenter.y - sourceCenter.y) / 2 - 8}px`,
                left: `${(sourceCenter.x + targetCenter.x) / 2 - 8}px`,
                zIndex: 6
              }}
              onClick={() => {
                // Handle opening data mapping dialog
                if (sourceNode && targetNode) {
                  setEditingConnection(connection);
                  setMappingDialogOpen(true);
                }
              }}
            >
              <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200">
                <Database className="h-3 w-3 text-blue-500" />
              </div>
            </div>
          )}
        </React.Fragment>
      );
    });
  };
  
  // Render the merge point (+ button)
  const renderMergePoint = () => {
    if (editorState.nodes.length === 0) return null;
    
    // Find the rightmost trigger to position the + button
    const trigger = triggers[0]; // Get the first trigger
    if (!trigger) return null;
    
    return (
      <div 
        className="absolute" 
        style={{
          top: `${trigger.position.y + 35}px`, // Centered vertically with the trigger
          left: `${trigger.position.x + 260}px`, // Right of the trigger
          transform: 'translateX(-50%)',
          zIndex: 20
        }}
      >
        <Button
          onClick={() => handleAddNodeClick(trigger.id)}
          className="bg-white hover:bg-slate-50 rounded-full h-8 w-8 flex items-center justify-center shadow-sm border border-blue-300"
        >
          <Plus className="h-4 w-4 text-blue-500" />
        </Button>
      </div>
    );
  };
  
  // Render END node
  const renderEndNode = () => {
    if (editorState.nodes.length === 0) return null;
    
    // Find the rightmost action to position the END node
    const rightmostAction = actions.reduce(
      (rightmost, action) => 
        !rightmost || action.position.x > rightmost.position.x ? action : rightmost,
      null as NodeInterface | null
    );
    
    if (!rightmostAction) return null;
    
    return (
      <div 
        className="absolute" 
        style={{
          top: `${rightmostAction.position.y + 35}px`, // Centered with the action
          left: `${rightmostAction.position.x + 260}px`, // Right of the action
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

  // Add the selectNode function back
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

  // Create a new condition
  const createNewCondition = (parentId?: string, position?: Position) => {
    const defaultPosition = position || { 
      x: 500, 
      y: editorState.nodes.filter(n => n.type === 'condition').length * 150 + 300 
    };
    
    // Create a modal or form to capture condition details
    const field = prompt('Enter condition field (e.g., rating, email, booking_amount):', 'rating');
    if (!field) return;
    
    const operator = prompt('Enter operator (equals, greater, less, contains, exists):', 'greater');
    if (!operator) return;
    
    const value = prompt('Enter comparison value (if applicable):', '4');
    
    const conditionName = `${field} ${operator} ${value || ''}`.trim();
    
    addConditionNode(
      operator,
      field,
      value || '',
      defaultPosition,
      parentId
    );
  };

  // Render condition editor (for Settings panel)
  const renderConditionEditor = () => {
    const selectedCondition = selectedNode && selectedNode.type === 'condition' ? selectedNode : null;
    if (!selectedCondition) return null;
    
    return (
      <div className="space-y-4 p-4 bg-slate-800 rounded-md">
        <h3 className="text-slate-200 font-medium">Condition Settings</h3>
        
        <div className="space-y-2">
          <Label className="text-slate-300">Field to Evaluate</Label>
          <Select 
            defaultValue={selectedCondition.data.conditionField || ''}
            onValueChange={(value) => {
              updateNodeData(selectedCondition.id, {
                conditionField: value,
                condition: `${value} ${selectedCondition.data.conditionType || 'equals'} ${selectedCondition.data.conditionValue || ''}`
              });
            }}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {conditionFields.map(category => (
                <SelectGroup key={category.category}>
                  <SelectLabel>{category.category}</SelectLabel>
                  {category.fields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-300">Operator</Label>
          <Select 
            defaultValue={selectedCondition.data.conditionType || 'equals'}
            onValueChange={(value) => {
              updateNodeData(selectedCondition.id, {
                conditionType: value,
                condition: `${selectedCondition.data.conditionField || ''} ${value} ${selectedCondition.data.conditionValue || ''}`
              });
            }}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
              <SelectValue placeholder="Select operator" />
            </SelectTrigger>
            <SelectContent>
              {conditionOperators.map(op => (
                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedCondition.data.conditionType !== 'exists' && 
         selectedCondition.data.conditionType !== 'not_exists' && (
          <div className="space-y-2">
            <Label className="text-slate-300">Value</Label>
            <Input 
              className="bg-slate-700 border-slate-600 text-slate-200" 
              value={selectedCondition.data.conditionValue || ''}
              onChange={(e) => {
                updateNodeData(selectedCondition.id, {
                  conditionValue: e.target.value,
                  condition: `${selectedCondition.data.conditionField || ''} ${selectedCondition.data.conditionType || 'equals'} ${e.target.value}`
                });
              }}
              placeholder="Enter comparison value" 
            />
          </div>
        )}
        
        <div className="pt-2">
          <Button
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none"
            onClick={() => addBranchPaths(selectedCondition.id)}
          >
            Add Yes/No Branches
          </Button>
        </div>
      </div>
    );
  };

  // Add to the toolbar a "Add Condition" button
  const renderToolbar = () => {
    return (
      <div className="absolute bottom-16 left-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
          onClick={() => createNewCondition()}
        >
          <Filter className="mr-1 h-3.5 w-3.5" />
          Add Condition
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
          onClick={() => {
            const branches = parseInt(prompt('How many parallel branches? (2-5)', '2') || '2');
            addParallelNode(Math.min(Math.max(2, branches), 5), { x: 500, y: 350 });
          }}
        >
          <Layers className="mr-1 h-3.5 w-3.5" />
          Add Parallel Path
        </Button>
      </div>
    );
  };

  // Fix for applyTemplate to resolve type issues
  const applyTemplate = (template: any) => {
    if (!template) return;
    
    setEditorState((prev: EditorState): EditorState => {
      // Fix type errors by ensuring nodes conform to NodeInterface
      const typedNodes: NodeInterface[] = template.nodes.map((node: any): NodeInterface => ({
        ...node,
        type: node.type as 'trigger' | 'action' | 'condition' | 'delay' | 'branch' | 'parallel',
        data: {
          ...node.data,
          version: 1,
          createdAt: new Date().toISOString()
        }
      }));
      
      // Ensure connections have correct typing with proper type assertion
      const typedConnections: Connection[] = (template.connections || []).map((conn: any): Connection => {
        // Get a valid connection type
        const validType = (conn.type === 'main' || 
                            conn.type === 'branch' || 
                            conn.type === 'merge' || 
                            conn.type === 'true' || 
                            conn.type === 'false' || 
                            conn.type === 'parallel') 
                            ? conn.type 
                            : 'main';
        
        // Create a properly typed connection object that matches the Connection interface
        return {
          id: conn.id,
          source: conn.source,
          target: conn.target,
          type: validType as 'main' | 'branch' | 'merge' | 'true' | 'false' | 'parallel',
          branchIndex: conn.branchIndex,
          dataMapping: conn.dataMapping,
          metadata: {
            status: 'valid' as 'valid' | 'invalid' | 'warning',
            statusMessage: conn.metadata?.statusMessage,
            isAnimating: false
          }
        };
      });
      
      // Create a properly typed history entry
      const historyEntry = {
        nodes: typedNodes,
        connections: typedConnections,
        timestamp: new Date().toISOString(),
        version: prev.version
      };
      
      // Return a properly typed EditorState
      return {
        ...prev,
        nodes: typedNodes,
        connections: typedConnections,
        selectedNodeId: null,
        version: prev.version + 1,
        history: [...prev.history, historyEntry].slice(-10)
      };
    });
  };

  // Fix for handleTemplateSelect to resolve type issues
  const handleTemplateSelect = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    // Ensure nodes have correct typing
    const typedNodes: NodeInterface[] = template.nodes.map((node: any): NodeInterface => ({
      ...node,
      type: node.type as 'trigger' | 'action' | 'condition' | 'delay' | 'branch' | 'parallel'
    }));
    
    // Ensure connections have correct typing with proper type assertion
    const typedConnections: Connection[] = (template.connections || []).map((conn: any): Connection => {
      // Get a valid connection type
      const validType = (conn.type === 'main' || 
                          conn.type === 'branch' || 
                          conn.type === 'merge' || 
                          conn.type === 'true' || 
                          conn.type === 'false' || 
                          conn.type === 'parallel') 
                          ? conn.type 
                          : 'main';
      
      // Create a properly typed connection object
      return {
        id: conn.id,
        source: conn.source,
        target: conn.target,
        type: validType as 'main' | 'branch' | 'merge' | 'true' | 'false' | 'parallel',
        branchIndex: conn.branchIndex,
        dataMapping: conn.dataMapping,
        metadata: {
          status: 'valid' as 'valid' | 'invalid' | 'warning',
          statusMessage: conn.metadata?.statusMessage,
          isAnimating: false
        }
      };
    });
    
    // Create a properly typed history entry
    const historyEntry = {
      nodes: typedNodes,
      connections: typedConnections,
      timestamp: new Date().toISOString(),
      version: 0
    };
    
    setEditorState((prev: EditorState): EditorState => ({
      ...prev,
      nodes: typedNodes,
      connections: typedConnections,
      selectedNodeId: null,
      version: prev.version + 1,
      history: [...prev.history, {
        ...historyEntry,
        version: prev.version
      }].slice(-10)
    }));
    
    setShowTemplateSelector(false);
  };
  
  // Add the parallel node function that was missing
  const addParallelNode = (branches: number, position: Position) => {
    addNode(
      'parallel',
      {
        id: `parallel-${Date.now()}`,
        name: `${branches} Parallel Branches`,
        icon: <Layers size={16} />,
        branches
      },
      position
    );
  };

  // Add CSS for connection animations
  useEffect(() => {
    // Add the CSS for data flow animation
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes dataFlowPulse {
        0% {
          opacity: 0.6;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0.6;
        }
      }
      
      .data-flow-pulse {
        animation: dataFlowPulse 1.5s infinite;
      }

      @keyframes dottedLinePulse {
        0% {
          background-position: 0% 0%;
        }
        100% {
          background-position: 100% 0%;
        }
      }
      
      .animated-dotted-line {
        background-image: linear-gradient(to right, currentColor 50%, transparent 50%);
        background-size: 8px 1px;
        background-repeat: repeat-x;
        animation: dottedLinePulse 20s linear infinite;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);
  
  // Fix for handleUpdateMapping to resolve type issues
  const handleUpdateMapping = (connectionId: string, mapping: any) => {
    setEditorState((prev: EditorState): EditorState => {
      const updatedConnections: Connection[] = prev.connections.map(conn => {
        if (conn.id === connectionId) {
          return { 
            ...conn, 
            dataMapping: mapping,
            metadata: {
              ...conn.metadata,
              status: 'valid' as 'valid' | 'invalid' | 'warning'
            }
          };
        }
        return conn;
      });
      
      return {
        ...prev,
        connections: updatedConnections
      };
    });
  };
  
  // Trigger a data flow animation for a specific connection
  const triggerDataFlow = (connectionId: string) => {
    setEditorState(prev => {
      const updatedConnections = prev.connections.map(conn => 
        conn.id === connectionId ? { 
          ...conn, 
          metadata: {
            ...conn.metadata,
            isAnimating: true
          }
        } : conn
      );
      
      return {
        ...prev,
        connections: updatedConnections
      };
    });
    
    // Reset animation after 2 seconds
    setTimeout(() => {
      setEditorState(prev => {
        const updatedConnections = prev.connections.map(conn => 
          conn.id === connectionId ? { 
            ...conn, 
            metadata: {
              ...conn.metadata,
              isAnimating: false
            }
          } : conn
        );
        
        return {
          ...prev,
          connections: updatedConnections
        };
      });
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col overflow-hidden">
      {/* Header - reduced padding, smaller elements */}
      <div className="bg-white text-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack} 
            className="rounded-full h-7 w-7 hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Input 
              className="font-semibold text-base border-none bg-transparent h-7 px-2 focus-visible:ring-0 w-[250px] text-slate-900"
              value={currentWorkflowName}
              onChange={(e) => setCurrentWorkflowName(e.target.value)}
              placeholder="Workflow Name"
            />
            <span className="text-xs text-slate-500">ID: {workflowId}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-full hover:bg-slate-50 border-slate-200 text-slate-700 text-xs h-7 px-3"
          >
            Test
          </Button>
          <div className="flex items-center gap-1 mx-1">
            <span className="text-slate-600 text-xs">Draft</span>
            <div 
              className="w-8 h-4 bg-slate-200 rounded-full flex items-center p-0.5 cursor-pointer"
              onClick={() => setIsActive(!isActive)}
            >
              <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-all ${isActive ? 'translate-x-4 bg-blue-100' : ''}`}></div>
            </div>
            <span className="text-slate-600 text-xs">Publish</span>
          </div>
          <Button 
            size="sm"
            className="rounded-full font-medium bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 px-3"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Tabs - reduced padding */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex justify-center gap-1 mx-auto py-0.5">
          <button 
            className={cn(
              "px-3 py-1 text-xs font-medium border-b-2 transition-colors rounded-t-md",
              activeTab === "builder" 
                ? "border-blue-500 text-blue-600 bg-blue-50" 
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
            onClick={() => setActiveTab("builder")}
          >
            Builder
          </button>
          <button 
            className={cn(
              "px-3 py-1 text-xs font-medium border-b-2 transition-colors rounded-t-md",
              activeTab === "settings"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
          <button 
            className={cn(
              "px-3 py-1 text-xs font-medium border-b-2 transition-colors rounded-t-md",
              activeTab === "enrollment"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
            onClick={() => setActiveTab("enrollment")}
          >
            Enrollment
          </button>
          <button 
            className={cn(
              "px-3 py-1 text-xs font-medium border-b-2 transition-colors rounded-t-md",
              activeTab === "logs"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            )}
            onClick={() => setActiveTab("logs")}
          >
            Logs
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "builder" && (
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
                {/* Render GHL-style workflow layout */}
                {renderEmptyState()}
                {renderAddTriggerButton()} {/* Always render this button at fixed position */}
                {renderConnectorLines()}
                {renderConnections()}
              
                {/* Add the toolbar */}
                {renderToolbar()}

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
                      cursor: 'move',
                      zIndex: editorState.selectedNodeId === node.id ? 30 : 10
                    }}
                  >
                    {node.type === 'trigger' ? (
                      /* Trigger card styled like the reference image */
                      <div 
                        className={cn(
                          "bg-white shadow-sm rounded-lg border w-[250px] p-4",
                          editorState.selectedNodeId === node.id ? "border-blue-500" : "border-slate-200",
                          "transition-all duration-150 hover:shadow-md"
                        )}
                        onClick={() => selectNode(node.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {node.data.icon ? (
                              <div className="h-6 w-6 text-blue-500">
                                {node.data.icon}
                              </div>
                            ) : (
                              <User className="h-6 w-6 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-blue-600 font-medium">Trigger</h3>
                            <p className="text-gray-600 text-sm">
                              {node.data.name}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100 h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNode(node.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Other node types retain their existing styling */
                      <div 
                        className={cn(
                          "bg-white shadow-sm rounded-md border",
                          // Make nodes smaller
                          node.type === 'action' ? "w-[170px]" : "w-[270px]",
                          editorState.selectedNodeId === node.id ? "border-blue-500" : "border-slate-200",
                          "transition-all duration-150 hover:shadow-md"
                        )}
                        onClick={() => selectNode(node.id)}
                      >
                        <div className={cn(
                          "flex items-center",
                          // Add smaller padding for actions
                          node.type === 'action' ? "p-2" : "p-3"
                        )}>
                          <div className={cn(
                            // Make the icon container smaller for actions
                            node.type === 'action' ? "h-9 w-9" : "h-12 w-12",
                            "rounded-md flex items-center justify-center mr-3",
                            node.type === 'action' ? "bg-purple-100 text-purple-500" :
                            node.type === 'condition' ? "bg-yellow-100 text-yellow-500" :
                            node.type === 'parallel' ? "bg-indigo-100 text-indigo-500" :
                            "bg-green-100 text-green-500"
                          )}>
                            <div className={cn(
                              // Make the icons smaller for actions
                              node.type === 'action' ? "h-5 w-5" : "h-6 w-6"
                            )}>
                              {node.data.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className={cn(
                              // Smaller font for action nodes
                              node.type === 'action' ? "text-sm" : "font-medium text-base",
                              node.type === 'action' ? "text-purple-600" :
                              node.type === 'condition' ? "text-yellow-600" :
                              node.type === 'parallel' ? "text-indigo-600" :
                              "text-green-600"
                            )}>
                              {node.type === 'action' ? 'Action' :
                               node.type === 'condition' ? 'Condition' : 
                               node.type === 'parallel' ? 'Parallel' :
                               'Delay'}
                            </h3>
                            <p className={cn(
                              "text-gray-600",
                              // Even smaller text for action node descriptions
                              node.type === 'action' ? "text-xs" : "text-sm"
                            )}>
                              {node.data.name}
                            </p>
                            
                            {/* Show condition details if it's a condition node */}
                            {node.type === 'condition' && node.data.condition && (
                              <div className="mt-1 bg-yellow-50 rounded p-1 text-xs text-yellow-800">
                                {node.data.condition}
                              </div>
                            )}
                            
                            {/* Show branch info for conditional and parallel branches */}
                            {node.branchType && (
                              <div className={cn(
                                "mt-1 rounded px-1.5 py-0.5 text-xs inline-block",
                                node.branchType === 'true' ? "bg-green-100 text-green-800" : 
                                node.branchType === 'false' ? "bg-red-100 text-red-800" :
                                "bg-slate-100 text-slate-800"
                              )}>
                                {node.branchType === 'true' ? 'Yes Path' : 
                                 node.branchType === 'false' ? 'No Path' : 
                                 `Branch ${(node.branchIndex || 0) + 1}`}
                              </div>
                            )}
                          </div>
                          <div className="ml-auto flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100",
                                // Make buttons smaller for actions
                                node.type === 'action' ? "h-6 w-6" : "h-7 w-7"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Open node editor/settings
                                if (node.type === 'condition') {
                                  addBranchPaths(node.id);
                                }
                              }}
                            >
                              <Settings className={cn(
                                // Make icon smaller for action nodes
                                node.type === 'action' ? "h-3 w-3" : "h-3.5 w-3.5"
                              )} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-100",
                                // Make buttons smaller for actions
                                node.type === 'action' ? "h-6 w-6" : "h-7 w-7"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNode(node.id);
                              }}
                            >
                              <Trash2 className={cn(
                                // Make icon smaller for action nodes
                                node.type === 'action' ? "h-3 w-3" : "h-3.5 w-3.5"
                              )} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
                  <>
                    {triggerCategories
                      .map(category => ({
                        ...category,
                        items: category.items.filter(item => 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      }))
                      .filter(category => category.items.length > 0)
                      .map(category => (
                        <div key={category.id} className="mb-6">
                          <h3 className="text-sm font-medium text-slate-400 mb-2">{category.name}</h3>
                          <div className="space-y-1">
                            {category.items.map(item => (
                              <button
                                key={item.id}
                                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-slate-800 text-left"
                                onClick={() => handleAddTrigger(item.id, item.name, item.icon)}
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
                    {triggerCategories
                      .map(category => ({
                        ...category,
                        items: category.items.filter(item => 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      }))
                      .filter(category => category.items.length > 0)
                      .length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                          No matching triggers found
                        </div>
                      )}
                  </>
                ) : (
                  <>
                    {actionCategories
                      .map(category => ({
                        ...category,
                        items: category.items.filter(item => 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      }))
                      .filter(category => category.items.length > 0)
                      .map(category => (
                        <div key={category.id} className="mb-6">
                          <h3 className="text-sm font-medium text-slate-400 mb-2">{category.name}</h3>
                          <div className="space-y-1">
                            {category.items.map(item => (
                              <button
                                key={item.id}
                                className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-slate-800 text-left"
                                onClick={() => handleAddAction(item.id, item.name, item.icon, editorState.selectedNodeId || undefined)}
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
                    {actionCategories
                      .map(category => ({
                        ...category,
                        items: category.items.filter(item => 
                          item.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                      }))
                      .filter(category => category.items.length > 0)
                      .length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                          No matching actions found
                        </div>
                      )}
                  </>
                )}
              </div>

              {/* Add condition editor if a condition node is selected */}
              {selectedNode && selectedNode.type === 'condition' && renderConditionEditor()}
            </div>
          )}
        </div>
      )}
      
      {/* Settings Tab Content */}
      {activeTab === "settings" && (
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Workflow Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name">Workflow Name</Label>
                  <Input 
                    id="workflow-name"
                    value={currentWorkflowName}
                    onChange={(e) => setCurrentWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workflow-description">Description</Label>
                  <Input 
                    id="workflow-description"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    placeholder="Enter workflow description"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Version Control */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Version Control</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Current Version: {editorState.version}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Version</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editorState.history.map((historyItem, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{historyItem.version}</TableCell>
                          <TableCell>
                            {new Date(historyItem.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => revertToVersion(historyItem.version)}
                              className="h-8"
                            >
                              Revert
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {editorState.history.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-slate-500">
                            No version history available yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Testing Tools */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base">Testing Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Test Run Options</Label>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={testWorkflow}
                      className="flex items-center"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Test Workflow
                    </Button>
                    <Button 
                      variant="outline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Test Results
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Run a simulated test of your workflow to verify it works as expected before publishing.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Workflow Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Choose a Template</Label>
                <p className="text-xs text-slate-500 mb-4">
                  Apply a pre-built template as a starting point for your workflow. Warning: This will replace your current workflow.
                </p>
                
                <div className="grid grid-cols-1 gap-4">
                  {workflowTemplates.map(template => (
                    <div 
                      key={template.id}
                      className="border rounded-md p-4 hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        if (confirm("This will replace your current workflow. Continue?")) {
                          applyWorkflowTemplate(template.id);
                          setActiveTab("builder");
                        }
                      }}
                    >
                      <h3 className="font-medium text-sm">{template.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{template.description}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {template.category}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 ml-2">
                          {template.nodes.length} nodes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
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
    {
      id: "wf-1704516461345",
      name: "Lead Scoring Workflow",
      status: "active",
      lastEdited: "2024-01-05",
      triggerCount: 1,
      actionCount: 3
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
      <div className="max-w-6xl mx-auto px-6">
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
