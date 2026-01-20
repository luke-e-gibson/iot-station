"use client";

import * as React from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  MoreHorizontal,
  Check,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

// Mock API keys data
const mockApiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "wsk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    created: "2026-01-15",
    lastUsed: "2 hours ago",
    status: "active",
    permissions: ["read:devices", "write:devices", "read:data"],
    requestCount: 15234,
  },
  {
    id: "2",
    name: "Development API Key",
    key: "wsk_dev_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4",
    created: "2026-01-10",
    lastUsed: "5 min ago",
    status: "active",
    permissions: ["read:devices", "read:data"],
    requestCount: 8921,
  },
  {
    id: "3",
    name: "Testing Key",
    key: "wsk_test_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p",
    created: "2025-12-20",
    lastUsed: "3 days ago",
    status: "active",
    permissions: ["read:devices"],
    requestCount: 2341,
  },
  {
    id: "4",
    name: "Legacy API Key",
    key: "wsk_old_p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1",
    created: "2025-11-01",
    lastUsed: "Never",
    status: "revoked",
    permissions: ["read:devices", "write:devices"],
    requestCount: 0,
  },
];

const availablePermissions = [
  { id: "read:devices", label: "Read Devices", description: "View device information" },
  {
    id: "write:devices",
    label: "Write Devices",
    description: "Create and update devices",
  },
  { id: "delete:devices", label: "Delete Devices", description: "Remove devices" },
  { id: "read:data", label: "Read Data", description: "View sensor data" },
  { id: "write:data", label: "Write Data", description: "Submit sensor readings" },
  { id: "read:alerts", label: "Read Alerts", description: "View system alerts" },
];

export function ApiKeysClient() {
  const [apiKeys, setApiKeys] = React.useState(mockApiKeys);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newKeyName, setNewKeyName] = React.useState("");
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>([]);
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(new Set());
  const [newlyCreatedKey, setNewlyCreatedKey] = React.useState<string | null>(null);

  const activeKeys = apiKeys.filter((k) => k.status === "active").length;
  const totalRequests = apiKeys.reduce((sum, k) => sum + k.requestCount, 0);

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim() || selectedPermissions.length === 0) return;

    const newKey = {
      id: String(apiKeys.length + 1),
      name: newKeyName,
      key: `wsk_new_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active" as const,
      permissions: selectedPermissions,
      requestCount: 0,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewlyCreatedKey(newKey.key);
    setNewKeyName("");
    setSelectedPermissions([]);

    // Auto-hide the newly created key after 30 seconds
    setTimeout(() => {
      setNewlyCreatedKey(null);
    }, 30000);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(
      apiKeys.map((key) =>
        key.id === id ? { ...key, status: "revoked" as const } : key
      )
    );
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const maskKey = (key: string, visible: boolean) => {
    if (visible) return key;
    const prefix = key.split("_")[0] + "_" + key.split("_")[1];
    return `${prefix}_${"•".repeat(32)}`;
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground">
              Manage API keys for programmatic access to your weather station data
            </p>
          </div>
          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create New API Key</SheetTitle>
                <SheetDescription>
                  Generate a new API key with specific permissions
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    A descriptive name to identify this key
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Permissions</Label>
                  <div className="space-y-3">
                    {availablePermissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-start space-x-3 space-y-0"
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <div className="space-y-1 leading-none">
                          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {permission.label}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleCreateKey}
                  disabled={!newKeyName.trim() || selectedPermissions.length === 0}
                >
                  Generate API Key
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeKeys}</div>
              <p className="text-xs text-muted-foreground">
                {apiKeys.length - activeKeys} revoked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all keys</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,000</div>
              <p className="text-xs text-muted-foreground">Requests per hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Newly Created Key Alert */}
        {newlyCreatedKey && (
          <Card className="border-green-600 bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-base text-green-900 dark:text-green-100">
                API Key Created Successfully
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Make sure to copy your API key now. You won't be able to see it again!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-white dark:bg-black p-3 text-sm font-mono border">
                  {newlyCreatedKey}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(newlyCreatedKey);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* API Keys Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              Manage your API keys and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono">
                          {maskKey(apiKey.key, visibleKeys.has(apiKey.id))}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                        >
                          {copiedKey === apiKey.id ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.slice(0, 2).map((perm) => (
                          <Badge key={perm} variant="secondary" className="text-xs">
                            {perm.split(":")[1]}
                          </Badge>
                        ))}
                        {apiKey.permissions.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{apiKey.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {apiKey.created}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {apiKey.lastUsed}
                    </TableCell>
                    <TableCell className="text-sm">
                      {apiKey.requestCount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={apiKey.status === "active" ? "default" : "destructive"}
                      >
                        {apiKey.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Key
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {apiKey.status === "active" && (
                            <DropdownMenuItem
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="text-yellow-600"
                            >
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Revoke Key
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteKey(apiKey.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>Quick reference for using your API keys</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Authentication</h4>
              <code className="block rounded bg-muted p-4 text-xs font-mono">
                curl -H "Authorization: Bearer YOUR_API_KEY" \{"\n"}
                {"  "}https://api.weather-station.com/v1/devices
              </code>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Rate Limits</h4>
              <p className="text-sm text-muted-foreground">
                Each API key is limited to 1,000 requests per hour. Rate limit headers
                are included in every response.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Security Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Never commit API keys to source control</li>
                <li>Use environment variables to store keys</li>
                <li>Rotate keys regularly (every 90 days recommended)</li>
                <li>Use separate keys for development and production</li>
                <li>Grant only the minimum required permissions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
