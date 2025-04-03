
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

interface RoleSelectionProps {
  onRoleSelected: () => void;
}

export const RoleSelection = ({ onRoleSelected }: RoleSelectionProps) => {
  const [role, setRole] = useState<'instructor' | 'team' | null>(null);
  const [teamName, setTeamName] = useState('');
  const { toast } = useToast();

  const handleRoleSelect = (selectedRole: 'instructor' | 'team') => {
    setRole(selectedRole);
  };

  const handleContinue = () => {
    if (role === 'instructor') {
      localStorage.setItem('isInstructor', 'true');
      localStorage.removeItem('currentTeam');
      toast({
        title: "You are now the instructor",
        description: "You have full control over the game.",
      });
      onRoleSelected();
    } else if (role === 'team' && teamName.trim()) {
      localStorage.setItem('isInstructor', 'false');
      // In a real app, we would create a new team or join an existing one
      // For this demo, we'll just use a mock team ID
      localStorage.setItem('currentTeam', '1');
      toast({
        title: "You've joined as a team",
        description: `Welcome, ${teamName}!`,
      });
      onRoleSelected();
    } else {
      toast({
        title: "Please enter a team name",
        description: "A team name is required to continue.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Check if the user already has a role
    const isInstructor = localStorage.getItem('isInstructor');
    if (isInstructor) {
      onRoleSelected();
    }
  }, [onRoleSelected]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to SEPM Connections</CardTitle>
          <CardDescription className="text-center">
            Select your role to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={role === 'instructor' ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleRoleSelect('instructor')}
            >
              <span className="font-bold">Instructor</span>
              <span className="text-xs mt-1">Control the game</span>
            </Button>
            <Button
              variant={role === 'team' ? "default" : "outline"}
              className="h-20 flex flex-col items-center justify-center"
              onClick={() => handleRoleSelect('team')}
            >
              <span className="font-bold">Team</span>
              <span className="text-xs mt-1">Play the game</span>
            </Button>
          </div>

          {role === 'team' && (
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleContinue} disabled={!role || (role === 'team' && !teamName.trim())}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
