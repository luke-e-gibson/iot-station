"use client";

import * as React from "react";
import { Activity, AlertCircle, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { columns, DevicesTable } from "./devicesTable";

export function DevicePageClient() {
  // Generate test devices once and memoize to prevent hydration mismatch
  const testDevices = React.useMemo(() => {
    return Array.from({ length: 50 }, (_, index) => {
      const status: "Online" | "Offline" = index % 3 === 0 ? "Offline" : "Online";
      return {
        id: `device-${index + 1}`,
        name: `Device ${index + 1}`,
        status,
        lastSeen: new Date(Date.now() - index * 2 * 60 * 60 * 1000),
      };
    });
  }, []);

  const totalDevices = testDevices.length;
  const onlineDevices = testDevices.filter((d) => d.status === "Online").length;
  const offlineDevices = testDevices.filter((d) => d.status === "Offline").length;

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">

        {/* Stats Cards */}
        <div className="grid gap-4 px-4 py-4 md:grid-cols-3 lg:px-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>Total Devices</CardDescription>
                <Server className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-3xl tabular-nums">
                {totalDevices}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>Online</CardDescription>
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-3xl tabular-nums text-green-600">
                  {onlineDevices}
                </CardTitle>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {Math.round((onlineDevices / totalDevices) * 100)}%
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>Offline</CardDescription>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-3xl tabular-nums text-red-600">
                  {offlineDevices}
                </CardTitle>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {Math.round((offlineDevices / totalDevices) * 100)}%
                </Badge>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Table Section */}
        <div className="flex flex-col gap-4 py-4 md:gap-6">
          <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            <DevicesTable columns={columns} data={testDevices} />
          </div>
        </div>
      </div>
    </div>
  );
}
