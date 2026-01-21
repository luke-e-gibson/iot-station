"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { CreateTeam } from "@/server/organization";
import { Loader2 } from "lucide-react";

interface CreateTeamPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTeamPopup({ isOpen, onClose }: CreateTeamPopupProps) {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateTeam() {
    setIsLoading(true);
    await CreateTeam(teamName);
    setIsLoading(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input type="text" id="team-name" placeholder="My Awesome Team" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            className="btn btn-secondary"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            className="btn btn-primary"
            onClick={() => {
              handleCreateTeam().catch(console.error);
            }}
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Create Team"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
